/* eslint-disable node/no-process-env */
import fs from "node:fs";
import path from "node:path";

const newVersion = process.env.NEW_VERSION || "";
const changelogPath = "CHANGELOG.md";
const outputPath = process.env.RUNNER_TEMP
  ? path.join(process.env.RUNNER_TEMP, "RELEASE_NOTES.md")
  : "RELEASE_NOTES.md";

if (!fs.existsSync(changelogPath)) {
  fs.writeFileSync(outputPath, `Release ${newVersion}`);
  process.exit(0);
}

const content = fs.readFileSync(changelogPath, "utf8");
const escapedVersion = newVersion.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const regex = new RegExp(`## \\b${escapedVersion}\\b[\\s\\S]*?(?=\\n## |$)`);
const match = content.match(regex);
const notes = match
  ? match[0].replace(new RegExp(`^## \\b${escapedVersion}\\b`), "").trim()
  : `Release ${newVersion}`;

fs.writeFileSync(outputPath, notes);
