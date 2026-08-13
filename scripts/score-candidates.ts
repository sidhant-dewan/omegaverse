import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { DiscoveryCandidate } from "../types";
import { scoreCandidate } from "../lib/classification/scoring";
const file = resolve(process.cwd(), "data", "candidates.json");
async function main() { const candidates = JSON.parse(await readFile(file, "utf8")) as DiscoveryCandidate[]; const scored = candidates.map((candidate) => ({ ...candidate, ...scoreCandidate({ title: candidate.title, synopsis: candidate.synopsis }) })); await writeFile(file, `${JSON.stringify(scored, null, 2)}\n`); console.log(`Scored ${scored.length} candidate(s); none were published.`); }
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
