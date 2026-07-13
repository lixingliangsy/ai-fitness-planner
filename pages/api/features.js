
// pages/api/features.js
// Features API

export default function handler(req, res) {
  res.status(200).json({
    product: 'ai-fitness-planner',
    version: '1.0.0',
    features: [
      {
        id: 'feature_001',
        name: 'AI Plan Generation',
        status: 'implemented',
        description: 'Generate personalized fitness plans using AI (NVIDIA API or OpenAI API). Supports multiple goals, fitness levels, equipment options, and limitations.',
        endpoints: ['/api/plan/generate (POST)']
      },
      {
        id: 'feature_002',
        name: 'Multiple Goal Support',
        status: 'implemented',
        description: 'Support for multiple fitness goals: weight loss, muscle gain, endurance, strength, flexibility, and general fitness.',
        endpoints: ['/api/plan/generate (POST)']
      },
      {
        id: 'feature_003',
        name: 'Equipment Adaptation',
        status: 'implemented',
        description: 'Adapt plans based on available equipment: none (bodyweight), dumbbells, barbell, resistance bands, pull-up bar, or full gym.',
        endpoints: ['/api/plan/generate (POST)']
      },
      {
        id: 'feature_004',
        name: 'Limitation-Aware Planning',
        status: 'implemented',
        description: 'Generate plans that account for physical limitations or injuries, ensuring safe and effective workouts.',
        endpoints: ['/api/plan/generate (POST)']
      },
      {
        id: 'feature_005',
        name: 'Mock Mode',
        status: 'implemented',
        description: 'Generate sample fitness plans without API key for testing and demonstration purposes.',
        endpoints: ['/api/plan/generate (POST)']
      }
    ],
    upcoming: [
      {
        id: 'upcoming_001',
        name: 'Progress Tracking (Progress tracking)',
        status: 'planned',
        expectedRelease: '2024-Q2',
        description: 'Track workout completion and progress over time.'
      },
      {
        id: 'upcoming_002',
        name: 'Exercise Video Library',
        status: 'planned',
        expectedRelease: '2024-Q2',
        description: 'Access video demonstrations for each exercise in the plan.'
      }
    ]
  });
}
