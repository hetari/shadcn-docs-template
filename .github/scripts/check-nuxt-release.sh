#!/usr/bin/env bash
set -eo pipefail

FORCE_VERSION="${INPUT_FORCE_VERSION:-${FORCE_VERSION:-}}"
DRY_RUN="${INPUT_DRY_RUN:-${DRY_RUN:-false}}"

# One rolling branch / one open PR — new npm releases add commits here instead of new PRs.
DEFAULT_UPDATE_BRANCH="nuxt-update"
ALLOWED_DEFAULT_BRANCHES="main master"

echo "=========================================="
echo " Nuxt Upstream Release Watcher"
echo "=========================================="

semver_gt() {
  CUR="$1" TGT="$2" bun -e '
    const c = process.env.CUR.split(".").map(Number);
    const t = process.env.TGT.split(".").map(Number);
    for (let i = 0; i < Math.max(c.length, t.length); i++) {
      const cv = c[i] || 0;
      const tv = t[i] || 0;
      if (tv > cv) { process.exit(0); }
      if (tv < cv) { process.exit(1); }
    }
    process.exit(1);
  '
}

is_semver() {
  [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
}

is_safe_update_branch() {
  [[ "$1" == "${DEFAULT_UPDATE_BRANCH}" || "$1" =~ ^nuxt-update/v[0-9]+\.[0-9]+\.[0-9]+$ ]]
}

read_nuxt_version_from_json() {
  echo "$1" | jq -r '.dependencies.nuxt // ""' | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -n1
}

if [ "$DRY_RUN" != "true" ] && [ "$DRY_RUN" != "false" ]; then
  echo "❌ Error: Invalid dry_run value (expected true or false)."
  exit 1
fi

if [ -n "$FORCE_VERSION" ] && ! is_semver "$FORCE_VERSION"; then
  echo "❌ Error: force_version must be semver (e.g. 4.6.5), got '${FORCE_VERSION}'."
  exit 1
fi

DEFAULT_BRANCH=$(gh repo view --json defaultBranchRef --jq .defaultBranchRef.name 2>/dev/null || echo "main")
case " ${ALLOWED_DEFAULT_BRANCHES} " in
  *" ${DEFAULT_BRANCH} "*) ;;
  *)
    echo "❌ Error: Unsupported default branch '${DEFAULT_BRANCH}' (allowed: ${ALLOWED_DEFAULT_BRANCHES})."
    exit 1
    ;;
esac

git fetch origin "${DEFAULT_BRANCH}" --prune --quiet

MAIN_PKG=$(git show "origin/${DEFAULT_BRANCH}:package.json")
MAIN_VERSION=$(read_nuxt_version_from_json "$MAIN_PKG")

if [ -z "$MAIN_VERSION" ]; then
  echo "❌ Error: Could not determine 'nuxt' version on origin/${DEFAULT_BRANCH}"
  exit 1
fi

echo "📦 Nuxt on ${DEFAULT_BRANCH}: v${MAIN_VERSION}"

if [ -n "$FORCE_VERSION" ]; then
  TARGET_VERSION="$FORCE_VERSION"
  echo "🎯 Manual version specified: v${TARGET_VERSION}"
else
  TARGET_VERSION=$(npm view nuxt@latest version)
  echo "🌐 Latest nuxt on npm: v${TARGET_VERSION}"
fi

if ! is_semver "$TARGET_VERSION"; then
  echo "❌ Error: Invalid target version '${TARGET_VERSION}'"
  exit 1
fi

if [ -z "$FORCE_VERSION" ] && ! semver_gt "$MAIN_VERSION" "$TARGET_VERSION"; then
  echo "✅ ${DEFAULT_BRANCH} (v${MAIN_VERSION}) is already at or above npm latest (v${TARGET_VERSION}). No PR needed."
  exit 0
fi

echo "🚀 npm target: v${TARGET_VERSION} (${DEFAULT_BRANCH} is v${MAIN_VERSION})"

REPO_OWNER=$(gh repo view --json owner --jq .owner.login 2>/dev/null || echo "")
if [ -z "$REPO_OWNER" ]; then
  echo "❌ Error: Could not determine repository owner."
  exit 1
fi

# Only reuse PRs from this repository (never fork heads named nuxt-update).
OPEN_PR_JSON=$(gh pr list --state open --json number,headRefName,isCrossRepository,headRepositoryOwner \
  --jq '[.[] | select(
    .isCrossRepository == false
    and (.headRepositoryOwner.login == "'"${REPO_OWNER}"'")
    and (.headRefName == "'"${DEFAULT_UPDATE_BRANCH}"'" or (.headRefName | startswith("nuxt-update")))
  )] | .[0]' 2>/dev/null || true)

OPEN_PR_NUMBER=""
BRANCH_NAME="${DEFAULT_UPDATE_BRANCH}"
if [ -n "$OPEN_PR_JSON" ] && [ "$OPEN_PR_JSON" != "null" ]; then
  OPEN_PR_NUMBER=$(echo "$OPEN_PR_JSON" | jq -r '.number')
  BRANCH_NAME=$(echo "$OPEN_PR_JSON" | jq -r '.headRefName')
  if ! is_safe_update_branch "$BRANCH_NAME"; then
    echo "❌ Error: Refusing unsafe PR head branch '${BRANCH_NAME}'."
    exit 1
  fi
  echo "🔗 Reusing open PR #${OPEN_PR_NUMBER} on branch '${BRANCH_NAME}'"
elif git ls-remote --exit-code --heads origin "refs/heads/${DEFAULT_UPDATE_BRANCH}" > /dev/null 2>&1; then
  BRANCH_NAME="${DEFAULT_UPDATE_BRANCH}"
  echo "🌿 Reusing remote branch '${BRANCH_NAME}' (no open PR yet)"
fi

if ! is_safe_update_branch "$BRANCH_NAME"; then
  echo "❌ Error: Refusing unsafe update branch '${BRANCH_NAME}'."
  exit 1
fi

RELEASE_URL="https://github.com/nuxt/nuxt/releases/tag/v${TARGET_VERSION}"

remote_ref() {
  echo "refs/remotes/origin/${1}"
}

if git ls-remote --exit-code --heads origin "refs/heads/${BRANCH_NAME}" > /dev/null 2>&1; then
  BRANCH_PKG=$(git show "$(remote_ref "${BRANCH_NAME}"):package.json" 2>/dev/null || echo "")
  BRANCH_VERSION=$(read_nuxt_version_from_json "$BRANCH_PKG")
  if [ -n "$BRANCH_VERSION" ] && ! semver_gt "$BRANCH_VERSION" "$TARGET_VERSION"; then
    echo "✅ Branch '${BRANCH_NAME}' already targets v${BRANCH_VERSION} (>= v${TARGET_VERSION}). Nothing to do."
    exit 0
  fi
fi

write_pr_body() {
  local body_file
  body_file=$(mktemp)
  cat << EOF > "$body_file"
## 🚀 Nuxt update (rolling PR)

This PR tracks the latest **nuxt** release on npm. It is updated in place on \`${BRANCH_NAME}\` when a newer version is published — you keep **one branch and one PR** until you merge.

**Current target:** [v${TARGET_VERSION}](https://www.npmjs.com/package/nuxt/v/${TARGET_VERSION}) ([release notes](${RELEASE_URL}))

\`${DEFAULT_BRANCH}\` still has \`^${MAIN_VERSION}\`; this branch bumps to \`^${TARGET_VERSION}\` and refreshes \`bun.lock\`.

---

### 🛠️ Local testing

\`\`\`bash
git fetch origin
git checkout ${BRANCH_NAME}
git pull origin ${BRANCH_NAME}
bun install
bun dev
bun lint:fix
bun run build
\`\`\`

---

### 📋 Checklist
- [ ] Reviewed [Nuxt v${TARGET_VERSION} release notes](${RELEASE_URL})
- [ ] Dev server runs (\`bun dev\`)
- [ ] Lint and production build pass
EOF
  echo "$body_file"
}

apply_bump_and_push() {
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"

  echo "📥 Updating Nuxt to ^${TARGET_VERSION}..."
  bun add "nuxt@^${TARGET_VERSION}"

  if git diff --quiet package.json bun.lock; then
    echo "⚠️ No changes in package.json or bun.lock after update."
    return 1
  fi

  git add package.json bun.lock
  HUSKY=0 git commit -m "chore(deps): bump nuxt to v${TARGET_VERSION}"
  echo "📤 Pushing '${BRANCH_NAME}' (force-with-lease after rebase onto ${DEFAULT_BRANCH})..."
  git push --force-with-lease origin "HEAD:${BRANCH_NAME}"
  return 0
}

sync_pr_metadata() {
  local pr_body_file
  pr_body_file=$(write_pr_body)
  if [ -n "$OPEN_PR_NUMBER" ]; then
    echo "📝 Updating PR #${OPEN_PR_NUMBER} title and description..."
    gh pr edit "${OPEN_PR_NUMBER}" \
      --title "chore(deps): bump Nuxt to v${TARGET_VERSION}" \
      --body-file "$pr_body_file"
  else
    echo "📬 Creating Pull Request against '${DEFAULT_BRANCH}'..."
    gh pr create \
      --base "${DEFAULT_BRANCH}" \
      --head "${BRANCH_NAME}" \
      --title "chore(deps): bump Nuxt to v${TARGET_VERSION}" \
      --body-file "$pr_body_file"
  fi
  rm -f "$pr_body_file"
}

if [ "$DRY_RUN" = "true" ]; then
  echo "🔍 DRY RUN: Would recreate '${BRANCH_NAME}' from origin/${DEFAULT_BRANCH}, bump to v${TARGET_VERSION}, and sync one PR."
  exit 0
fi

git fetch origin "${DEFAULT_BRANCH}" --prune --quiet
echo "🔄 Recreating '${BRANCH_NAME}' from latest origin/${DEFAULT_BRANCH} (avoids merge conflicts)..."
git checkout -B "${BRANCH_NAME}" "$(remote_ref "${DEFAULT_BRANCH}")"

if apply_bump_and_push; then
  sync_pr_metadata
  echo "🎉 Done! Single rolling PR now targets Nuxt v${TARGET_VERSION}."
else
  echo "ℹ️  Branch already matches target; PR metadata unchanged."
fi
