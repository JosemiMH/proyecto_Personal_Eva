import { execFileSync } from "node:child_process";
import fs from "node:fs";

const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .filter((file) => !file.endsWith(".patch"));

const detectors = [
  { name: "OpenAI API key", pattern: /sk-(?:proj-)?[A-Za-z0-9_-]{20,}/g },
  { name: "credentialed PostgreSQL URL", pattern: /postgres(?:ql)?:\/\/(?!(?:USER:PASSWORD|user:password|usuario:contraseña|dummy:dummy)@)[^\s:"']+:[^\s@"']+@[^\s"']+/g },
  { name: "private key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: "hardcoded sensitive fallback", pattern: /process\.env\.(?:OPENAI_API_KEY|DATABASE_URL|EMAIL_PASS|SESSION_SECRET)[^\n]*(?:\|\||\?\?)[^\n]+/g },
];

const findings = [];
for (const file of files) {
  let content;
  try {
    content = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }

  for (const detector of detectors) {
    if (file.endsWith(".map") && detector.name === "hardcoded sensitive fallback") continue;
    detector.pattern.lastIndex = 0;
    for (const match of content.matchAll(detector.pattern)) {
      const line = content.slice(0, match.index).split("\n").length;
      findings.push(`${file}:${line}: ${detector.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential secrets detected. Values are intentionally not printed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Secret scan passed: ${files.length} tracked files checked.`);
