import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { DiscoveryCandidate } from "../types";
import { scoreCandidate } from "../lib/classification/scoring";

interface TmdbItem { id: number; name?: string; title?: string; overview?: string; origin_country?: string[]; first_air_date?: string; release_date?: string; }
interface TmdbResponse { results: TmdbItem[]; }
const countryCodes = new Set(["TH","JP","KR","TW","CN","PH","VN"]);
const terms = ["boys love", "girls love", "sapphic romance", "omegaverse", "ABO setting"];
const dataPath = (name: string) => resolve(process.cwd(), "data", name);

async function main() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) { console.log("TMDB_API_KEY is not configured; retaining existing candidate data."); return; }
  const existing = JSON.parse(await readFile(dataPath("candidates.json"), "utf8")) as DiscoveryCandidate[];
  const rejected = new Set(JSON.parse(await readFile(dataPath("rejected.json"), "utf8")) as number[]);
  const byId = new Map(existing.map((candidate) => [candidate.externalId, candidate]));
  for (const term of terms) {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(term)}&include_adult=false`);
    if (!response.ok) throw new Error(`TMDB discovery failed with HTTP ${response.status}`);
    const data = await response.json() as TmdbResponse;
    for (const item of data.results) {
      if (rejected.has(item.id) || byId.has(item.id) || !item.origin_country?.some((code) => countryCodes.has(code))) continue;
      const title = item.name ?? item.title;
      if (!title) continue;
      const classification = scoreCandidate({ title, synopsis: item.overview, keywords: [term] });
      if (!classification.suggestedCategories.length) continue;
      byId.set(item.id, { externalId: item.id, title, country: item.origin_country?.join(", "), year: Number((item.first_air_date ?? item.release_date)?.slice(0,4)) || undefined, synopsis: item.overview, ...classification, status: "pending" });
    }
  }
  await writeFile(dataPath("candidates.json"), `${JSON.stringify([...byId.values()], null, 2)}\n`);
  console.log(`Candidate catalog contains ${byId.size} item(s). Human approval is required.`);
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
