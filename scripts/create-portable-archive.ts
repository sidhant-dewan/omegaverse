import { execFile } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectRoot = process.cwd();
const projectName = basename(projectRoot);
const archiveDirectory = resolve(dirname(projectRoot), "shakchiverse-portable");
const archivePath = resolve(archiveDirectory, `${projectName}-source.zip`);
const excludedPaths = [
  `${projectName}/node_modules/*`,
  `${projectName}/.next/*`,
  `${projectName}/.git/*`,
  `${projectName}/.vercel/*`,
  `${projectName}/out/*`,
  `${projectName}/build/*`,
  `${projectName}/.env*`,
  `${projectName}/*.tsbuildinfo`,
  "*/.DS_Store",
  `${projectName}/npm-debug.log*`,
];

async function main() {
  if (process.platform === "win32") {
    throw new Error("Archive creation requires the zip command. Run this script on macOS or Linux.");
  }

  await mkdir(archiveDirectory, { recursive: true });
  await rm(archivePath, { force: true });
  await execFileAsync("zip", ["-rq", archivePath, projectName, ...excludedPaths.flatMap((path) => ["-x", path])], {
    cwd: dirname(projectRoot),
  });
  await execFileAsync("zip", ["-q", archivePath, `${projectName}/.env.example`], { cwd: dirname(projectRoot) });
  const { stdout } = await execFileAsync("du", ["-h", archivePath]);
  console.log(`Portable archive created: ${archivePath}`);
  console.log(`Archive size: ${stdout.trim().split("\t")[0]}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});