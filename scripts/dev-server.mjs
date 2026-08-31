import { spawn } from "node:child_process";

const forwardedArgs = process.argv.slice(2);
const isAgentPreview = forwardedArgs.includes("--strictPort");
const command = process.execPath;
const args = isAgentPreview
  ? ["node_modules/vite/bin/vite.js", ...forwardedArgs]
  : ["node_modules/tsx/dist/cli.mjs", "server/index.ts", ...forwardedArgs];

const child = spawn(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "development",
  },
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
