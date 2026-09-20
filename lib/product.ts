export const PRODUCT = {
  toolTitle: "Try ai-fitness-planner",
  ctaLabel: "Generate",
  resultLabel: "Result",
  priceMonthly: 29,
  priceYearly: 290,
  "name": "AI Fitness Planner",
  "slug": "ai-fitness-planner",
  "tagline": "Custom fitness plans powered by AI",
  "description": "Generate personalized workout and nutrition guidance based on your goals, experience, and available time.",
  "features": [
    "Personalized workout blocks",
    "Equipment-aware exercises",
    "Diet suggestions included",
    "Adjustable difficulty"
  ],
  inputs: [
    { key: "goal", label: "Goal", type: "select", options: ["Strength", "Hypertrophy", "General fitness", "Power"] },
    { key: "level", label: "Experience", type: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { key: "days", label: "Days per week", type: "input", placeholder: "e.g. 3" },
    { key: "equipment", label: "Equipment", type: "textarea", placeholder: "e.g. dumbbells, bands, bodyweight" }
  ] as { key: string; label: string; type: string; placeholder?: string; options?: string[] }[],
  definitionLead: "AI Fitness Planner assembles personalized workout blocks with equipment-aware exercises and optional diet suggestions, following the same ACSM-aligned idea that programs should match goals, experience, and available time — with an explicit non-medical disclaimer.",
  geoFaq: [
    { q: "Workout blocks vs full periodization?", a: "The tool drafts adjustable blocks (sets/structure) for your stated days and level. Advanced periodization still needs a coach or clinician for special populations." },
    { q: "Where do diet suggestions fit?", a: "Optional, high-level suggestions only. Nutrition needs vary; this is not a registered dietitian consult or medical nutrition therapy." },
    { q: "What ACSM themes apply?", a: "Individualize by habitual activity, function, health status, and goals (ACSM Position Stand PMID 21694556). Resistance frequency and recovery still apply." },
    { q: "How is this different from AI Fitness Plan Generator?", a: "Planner emphasizes workout blocks + diet suggestions. Generator emphasizes goal-based programming and weekly schedule export." },
    { q: "Is it safe for beginners?", a: "Beginner options exist, but start conservatively and stop if pain (not normal training discomfort) appears. Seek care when unsure." },
    { q: "Any medical claims?", a: "No. Decision-support only — not a device, diagnosis, or treatment plan." },
  ],
  systemPrompt: "You are the AI engine for ai-fitness-planner. AI Fitness Planner assembles personalized workout blocks with equipment-aware exercises and optional diet suggestions, following the same ACSM-aligned idea that programs should match goals, experience, and available time \u2014 with an explicit non-medical disclaimer. Follow the product inputs carefully. Output clear, structured English suitable to paste into the product UI. Do not invent user counts, guarantees, or medical/compliance certifications.",
  mock: (inputs: Record<string, string>): string => {
    const lines = Object.entries(inputs || {}).map(([k, v]) => k + ': ' + v)
    return 'ai-fitness-planner DEMO\n\n' + (lines.join('\n') || 'No inputs') + '\n\n---\nPreview result. Add OPENAI_API_KEY for live AI.'
  },
}
