import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What AI Fitness Planner does",
    keywords: ["AI Fitness Planner", "ai-fitness-planner", "what", "product", "about", "Custom fitness plans powered by AI"],
    body: "Custom fitness plans powered by AI. AI Fitness Planner assembles personalized workout blocks with equipment-aware exercises and optional diet suggestions, following the same ACSM-aligned idea that programs should match goals, experience, and available time — with an explicit non-medical disclaimer.",
    source: "AI Fitness Planner product definition",
    tags: [],
  },
  {
    id: "features",
    title: "AI Fitness Planner features",
    keywords: ["features", "feature", "can", "does", "Personalized workout blocks", "Equipment-aware exercises", "Diet suggestions included", "Adjustable difficulty"],
    body: "AI Fitness Planner includes: Personalized workout blocks; Equipment-aware exercises; Diet suggestions included; Adjustable difficulty. It does not add capabilities that are not listed here.",
    source: "AI Fitness Planner feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "AI Fitness Planner pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for AI Fitness Planner: $29/month and $290/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "AI Fitness Planner pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use AI Fitness Planner",
    keywords: ["how", "start", "use", "tool", "run", "Try ai-fitness-planner"],
    body: "Open AI Fitness Planner and use Try ai-fitness-planner. The form asks for: Goal; Experience; Days per week; Equipment.",
    source: "AI Fitness Planner tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "Workout blocks vs full periodization?",
    keywords: ["Workout", "blocks", "vs", "full", "periodization?"],
    body: "The tool drafts adjustable blocks (sets/structure) for your stated days and level. Advanced periodization still needs a coach or clinician for special populations.",
    source: "AI Fitness Planner FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "Where do diet suggestions fit?",
    keywords: ["Where", "do", "diet", "suggestions", "fit?"],
    body: "Optional, high-level suggestions only. Nutrition needs vary; this is not a registered dietitian consult or medical nutrition therapy.",
    source: "AI Fitness Planner FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "What ACSM themes apply?",
    keywords: ["What", "ACSM", "themes", "apply?"],
    body: "Individualize by habitual activity, function, health status, and goals (ACSM Position Stand PMID 21694556). Resistance frequency and recovery still apply.",
    source: "AI Fitness Planner FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about AI Fitness Planner are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "AI Fitness Planner support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
