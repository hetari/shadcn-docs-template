#!/usr/bin/env bash
set -eo pipefail

FORCE_VERSION="${INPUT_FORCE_VERSION:-${FORCE_VERSION:-}}"
DRY_RUN="${INPUT_DRY_RUN:-${DRY_RUN:-false}}"

echo "=========================================="
echo " Nuxt Upstream Release Watcher"
echo "=========================================="

# 1. Read current Nuxt version from package.json
CURRENT_RAW=$(jq -r '.dependencies.nuxt // ""' package.json)
CURRENT_VERSION=$(echo "$CURRENT_RAW" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1)

if [ -z "$CURRENT_VERSION" ]; then
  echo "❌ Error: Could not determine current 'nuxt' version in package.json"
  exit 1
fi

echo "📦 Current Nuxt version: v${CURRENT_VERSION}"

# 2. Determine target version from the npm registry (matches what bun install resolves)
if [ -n "$FORCE_VERSION" ]; then
  TARGET_VERSION="$FORCE_VERSION"
  echo "🎯 Manual version specified: v${TARGET_VERSION}"
else
  TARGET_VERSION=$(npm view nuxt version)
  echo "🌐 Latest nuxt on npm: v${TARGET_VERSION}"
fi

echo "🎯 Target Nuxt version: v${TARGET_VERSION}"

# 3. Compare current vs target version
if ! [[ "$TARGET_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "❌ Error: Invalid target version '${TARGET_VERSION}'"
  exit 1
fi
if [ -z "$FORCE_VERSION" ]; then
  IS_NEWER=$(CUR="$CURRENT_VERSION" TGT="$TARGET_VERSION" bun -e '
    const c = process.env.CUR.split(".").map(Number);
    const t = process.env.TGT.split(".").map(Number);
    for (let i = 0; i < Math.max(c.length, t.length); i++) {
      const cv = c[i] || 0;
      const tv = t[i] || 0;
      if (tv > cv) { console.log("true"); process.exit(0); }
      if (tv < cv) { console.log("false"); process.exit(0); }
    }
    console.log("false");
  ')

  if [ "$IS_NEWER" != "true" ]; then
    echo "✅ Up-to-date! Current version (v${CURRENT_VERSION}) is >= npm latest (v${TARGET_VERSION}). No PR needed."
    exit 0
  fi
fi

echo "🚀 Found newer version: v${TARGET_VERSION} (current is v${CURRENT_VERSION})"

BRANCH_NAME="nuxt-update/v${TARGET_VERSION}"
RELEASE_URL="https://github.com/nuxt/nuxt/releases/tag/v${TARGET_VERSION}"
DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null || echo "main")
REPO_OWNER=$(gh repo view --json owner --jq .owner.login 2>/dev/null || echo "")
HEAD_REF="${BRANCH_NAME}"
if [ -n "$REPO_OWNER" ]; then
  HEAD_REF="${REPO_OWNER}:${BRANCH_NAME}"
fi

# 4. If an open PR already exists for this update, nothing to do
EXISTING_PR=$(gh pr list --state open --head "${HEAD_REF}" --json number --jq '.[0].number' 2>/dev/null || true)
if [ -z "$EXISTING_PR" ] && [ "$HEAD_REF" != "${BRANCH_NAME}" ]; then
  EXISTING_PR=$(gh pr list --state open --head "${BRANCH_NAME}" --json number --jq '.[0].number' 2>/dev/null || true)
fi
if [ -n "$EXISTING_PR" ]; then
  echo "✅ Open PR #${EXISTING_PR} already exists for '${BRANCH_NAME}'. Nothing to do."
  exit 0
fi

REMOTE_BRANCH_EXISTS=false
if git ls-remote --exit-code --heads origin "refs/heads/${BRANCH_NAME}" > /dev/null 2>&1; then
  REMOTE_BRANCH_EXISTS=true
fi

write_pr_body() {
  local body_file
  body_file=$(mktemp)
  cat << EOF > "$body_file"
## 🚀 Nuxt Update: v${TARGET_VERSION}

A new **nuxt** release is on npm: [v${TARGET_VERSION}](https://www.npmjs.com/package/nuxt/v/${TARGET_VERSION}) ([nuxt/nuxt release notes](${RELEASE_URL})).

This automated Pull Request bumps \`nuxt\` in \`package.json\` and regenerates \`bun.lock\`.

---

### 📦 Updated Dependencies
- \`nuxt\`: \`^${CURRENT_VERSION}\` ➔ \`^${TARGET_VERSION}\`

---

### 🛠️ Next Steps (Finishing the update locally)

Fetch this branch, test your documentation template, resolve any migrations or module updates, and push your changes:

\`\`\`bash
# 1. Fetch and checkout the update branch
git fetch origin
git checkout ${BRANCH_NAME}
git pull origin ${BRANCH_NAME}

# 2. Install dependencies & verify local dev server
bun install
bun dev

# 3. Run linting & build verification
bun lint:fix
bun run build

# 4. Commit and push your migration changes
git add .
git commit -m "chore: complete migration for Nuxt v${TARGET_VERSION}"
git push origin ${BRANCH_NAME}
\`\`\`

---

### 📋 Checklist
- [ ] Reviewed [Nuxt v${TARGET_VERSION} Release Notes](${RELEASE_URL})
- [ ] Dev server starts and runs without errors (\`bun dev\`)
- [ ] Documentation and search work as expected
- [ ] Linting passes (\`bun lint\`)
- [ ] Production build succeeds (\`bun run build\`)
EOF
  echo "$body_file"
}

open_pull_request() {
  local pr_body_file
  pr_body_file=$(write_pr_body)
  echo "📬 Creating Pull Request against base branch '${DEFAULT_BRANCH}'..."
  gh pr create \
    --base "${DEFAULT_BRANCH}" \
    --head "${BRANCH_NAME}" \
    --title "chore(deps): bump Nuxt to v${TARGET_VERSION}" \
    --body-file "$pr_body_file"
  rm -f "$pr_body_file"
  echo "🎉 Done! Pull Request for Nuxt v${TARGET_VERSION} opened successfully."
}

# 5. Remote branch exists but no open PR (e.g. push succeeded, pr create failed earlier)
if [ "$REMOTE_BRANCH_EXISTS" = true ]; then
  echo "🔄 Remote branch '${BRANCH_NAME}' exists without an open PR — opening PR from existing branch..."
  if [ "$DRY_RUN" = "true" ]; then
    echo "🔍 DRY RUN: Would open a PR for existing branch '${BRANCH_NAME}'."
    exit 0
  fi
  open_pull_request
  exit 0
fi

# 6. Dry run check (new branch path)
if [ "$DRY_RUN" = "true" ]; then
  echo "🔍 DRY RUN: Would create branch '${BRANCH_NAME}', update Nuxt to v${TARGET_VERSION}, and open a Pull Request."
  exit 0
fi

# 7. Create local branch
echo "🌿 Creating branch ${BRANCH_NAME}..."
git checkout -b "${BRANCH_NAME}"

# 8. Update Nuxt in package.json and bun.lock
echo "📥 Updating Nuxt to ^${TARGET_VERSION}..."
bun add "nuxt@^${TARGET_VERSION}"

# 9. Verify modifications
if git diff --quiet package.json bun.lock; then
  echo "⚠️ No changes detected in package.json or bun.lock after update. Skipping commit..."
  exit 0
fi

# 10. Configure git author and commit
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add package.json bun.lock
HUSKY=0 git commit -m "chore(deps): bump nuxt to v${TARGET_VERSION}"

# 11. Push branch to origin
echo "📤 Pushing branch '${BRANCH_NAME}' to remote origin..."
git push origin "${BRANCH_NAME}"

# 12. Create Pull Request
open_pull_request
