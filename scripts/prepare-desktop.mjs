import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = join(root, "desktop-dist");
const standalone = join(root, ".next", "standalone");
const templateSource = join(root, "prisma", "desktop-template.db");
const prismaCli = join(root, "node_modules", "prisma", "build", "index.js");
const tsxCli = join(root, "node_modules", "tsx", "dist", "cli.mjs");

if (!existsSync(standalone)) throw new Error("缺少 .next/standalone，请先运行 npm run build");
rmSync(output, { recursive: true, force: true });
mkdirSync(join(output, "next-app", ".next"), { recursive: true });

cpSync(standalone, join(output, "next-app"), { recursive: true });
renameSync(join(output, "next-app", "node_modules"), join(output, "next-app", "runtime_modules"));
cpSync(join(root, ".next", "static"), join(output, "next-app", ".next", "static"), { recursive: true });
if (existsSync(join(root, "public"))) cpSync(join(root, "public"), join(output, "next-app", "public"), { recursive: true });

rmSync(templateSource, { force: true });
const env = { ...process.env, DATABASE_URL: "file:./desktop-template.db" };
execFileSync(process.execPath, [prismaCli, "db", "push", "--skip-generate"], { cwd: root, env, stdio: "inherit" });
execFileSync(process.execPath, [tsxCli, "prisma/seed.ts"], { cwd: root, env, stdio: "inherit" });
cpSync(templateSource, join(output, "template.db"));
rmSync(templateSource, { force: true });

console.log(`Desktop resources prepared at ${output}`);
