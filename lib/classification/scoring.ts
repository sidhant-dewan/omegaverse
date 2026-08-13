import type { ClassificationScore, ContentCategory } from "@/types";

interface CandidateInput {
  title: string;
  synopsis?: string;
  keywords?: string[];
  productionCompanies?: string[];
}

interface ScoredCandidate {
  scores: ClassificationScore;
  suggestedCategories: ContentCategory[];
  reasons: string[];
}

const signals: Record<ContentCategory, Array<{ pattern: RegExp; weight: number; label: string }>> = {
  bl: [
    { pattern: /boys[' ]?love|\bBL\b/i, weight: 0.55, label: "explicit BL term" },
    { pattern: /male\/male romance|romance between (?:two )?men/i, weight: 0.4, label: "male/male romance description" },
  ],
  gl: [
    { pattern: /girls[' ]?love|\bGL\b/i, weight: 0.55, label: "explicit GL term" },
    { pattern: /sapphic|female\/female romance|romance between (?:two )?women/i, weight: 0.4, label: "sapphic romance description" },
  ],
  omegaverse: [
    { pattern: /omegaverse/i, weight: 0.75, label: "explicit Omegaverse term" },
    { pattern: /alpha[ /-]+beta[ /-]+omega|\bABO setting\b/i, weight: 0.55, label: "explicit ABO setting" },
  ],
};

export function scoreCandidate(input: CandidateInput): ScoredCandidate {
  const text = [input.title, input.synopsis, ...(input.keywords ?? []), ...(input.productionCompanies ?? [])].filter(Boolean).join(" ");
  const scores: ClassificationScore = { bl: 0, gl: 0, omegaverse: 0 };
  const reasons: string[] = [];
  (Object.keys(signals) as ContentCategory[]).forEach((category) => {
    signals[category].forEach((signal) => {
      if (signal.pattern.test(text)) {
        scores[category] = Math.min(1, scores[category] + signal.weight);
        reasons.push(`${category.toUpperCase()}: ${signal.label}`);
      }
    });
  });
  return {
    scores,
    suggestedCategories: (Object.keys(scores) as ContentCategory[]).filter((category) => scores[category] >= 0.5),
    reasons,
  };
}
