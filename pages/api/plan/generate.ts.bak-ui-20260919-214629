import type { NextApiRequest, NextApiResponse } from 'next'

interface GenerateRequest {
  goal: string
  fitnessLevel: string
  availableDays: string
  equipment: string
  limitations: string
}

interface GenerateResponse {
  plan: string
  tips: string[]
}

interface ErrorResponse {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { goal, fitnessLevel, availableDays, equipment, limitations } = req.body as GenerateRequest

  // Validate required fields
  if (!goal || !fitnessLevel || !availableDays) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Check API keys (NVIDIA first, then OpenAI)
  const nvidiaApiKey = process.env.NVIDIA_API_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY
  const useNvidia = !!nvidiaApiKey
  
  if (!nvidiaApiKey && !openaiApiKey) {
    // Mock mode: return sample data
    const mockPlan = generateMockPlan(goal, fitnessLevel, availableDays, equipment, limitations)
    return res.status(200).json({
      plan: mockPlan,
      tips: ['Warm up before every session', 'Focus on form to avoid injury', 'Progress gradually; avoid rushing']
    })
  }
  
  try {
    // Build prompt
    const prompt = `As a professional fitness coach, generate a detailed workout plan for the user.

User requirements:
- Fitness goal:${getGoalText(goal)}
- Fitness level:${getFitnessLevelText(fitnessLevel)}
- Days available per week:${availableDays} days
- Available equipment:${getEquipmentText(equipment)}
- Physical limitations:${limitations || 'None'}

Generate a plan that includes:
1. Weekly schedule (which days train what)
2. Session details (exercises, sets, reps)
3. Warm-up and stretching guidance
4. Nutrition guidance
5. Progress tracking methods

Reply in English with clear, structured formatting.`

    let planText: string
    
    if (useNvidia) {
      // Call NVIDIA API
      const nvidiaModel = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'
      const nvidiaBaseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'
      
      console.log('Calling NVIDIA API...', { model: nvidiaModel, baseUrl: nvidiaBaseUrl })
      
      try {
        const response = await fetch(`${nvidiaBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${nvidiaApiKey}`
          },
          body: JSON.stringify({
            model: nvidiaModel,
            messages: [
              {
                role: 'system',
                content: 'You are a professional fitness coach who creates personalized workout plans.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        })
        
        console.log('NVIDIA API response status:', response.status)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('NVIDIA API error:', errorText)
          throw new Error(`NVIDIA API request failed: ${response.status} ${errorText}`)
        }
        
        const data = await response.json()
        planText = data.choices[0].message.content
        console.log('NVIDIA API success, plan length:', planText.length)
      } catch (error) {
        console.error('NVIDIA API call failed:', error)
        throw error
      }
    } else {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional fitness coach who creates personalized workout plans.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'OpenAI API request failed')
      }
      
      const data = await response.json()
      planText = data.choices[0].message.content
    }

    // Note
    const tips = extractTips(planText)

    return res.status(200).json({
      plan: planText,
      tips: tips
    })
  } catch (error: any) {
    console.error('Plan generation error:', error)
    return res.status(500).json({ 
      error: error.message || 'Failed to generate plan' 
    })
  }
}

// Helpers
function getGoalText(goal: string): string {
  const goalMap: Record<string, string> = {
    'weight_loss': 'Fat loss',
    'muscle_gain': 'Muscle gain',
    'endurance': 'Endurance',
    'strength': 'Strength',
    'flexibility': 'Flexibility',
    'general_fitness': 'General fitness'
  }
  return goalMap[goal] || goal
}

function getFitnessLevelText(level: string): string {
  const levelMap: Record<string, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced'
  }
  return levelMap[level] || level
}

function getEquipmentText(equipment: string): string {
  const equipmentMap: Record<string, string> = {
    'none': 'Bodyweight only',
    'dumbbells': 'Dumbbells',
    'barbell': 'Barbell',
    'resistance_bands': 'Resistance bands',
    'pull_up_bar': 'Pull-up bar',
    'full_gym': 'Full gym'
  }
  return equipmentMap[equipment] || 'None'
}

function extractTips(planText: string): string[] {
  // Extract tips from plan text：Find sentences with tip/notice/suggestion keywords
  const tips: string[] = []
  const sentences = planText.split(/[。！？\n]/)
  
  for (const sentence of sentences) {
    if (sentence.includes('提示') || sentence.includes('注意') || sentence.includes('建议') || sentence.includes('重要')) {
      const trimmed = sentence.trim()
      if (trimmed.length > 10 && trimmed.length < 200) {
        tips.push(trimmed)
      }
    }
  }
  
  // Default tips if none extracted
  if (tips.length === 0) {
    tips.push('Warm up before every session', 'Focus on form to avoid injury', 'Progress gradually; avoid rushing', 'Get enough sleep and balanced nutrition')
  }
  
  return tips.slice(0, 5) // Return at most 5 tips
}

// Mock plan generator when no API key
function generateMockPlan(goal: string, fitnessLevel: string, availableDays: string, equipment: string, limitations: string): string {
  const goalText = getGoalText(goal)
  const levelText = getFitnessLevelText(fitnessLevel)
  const equipmentText = getEquipmentText(equipment)
  
  return `# ${goalText} Training Plan

## Training schedule

**Train ${availableDays} days per week**

### Monday: Upper body
- Warm-up: 5-10 min cardio
- Main workout:
  - Push-ups 3 x 10-15
  - Dumbbell bench press 3 x 12
  - Rows 3 x 12
- Cool-down: 5-10 min

### Wednesday: Lower body
- Warm-up: 5-10 min cardio
- Main workout:
  - Squats 3 x 15
  - Lunges 3 x 12 (each leg)
  - Calf raises 3 x 20
- Cool-down: 5-10 min

### Friday: Core
- Warm-up: 5-10 min cardio
- Main workout:
  - Plank 3 x 30-60 sec
  - Crunches 3 x 20
  - Russian twists 3 x 20
- Cool-down: 5-10 min

## Nutrition guidance
- Protein: 1.5-2g/kg body weight
- Carbs: moderate intake around workouts
- Hydration: at least 2L water daily

## Notes
- Progressive overload: increase weight or reps gradually
- Rest: 7-8 hours of sleep nightly
- Log: track workout progress

---
*Sample plan. Configure NVIDIA or OpenAI API for personalized plans.*`
}
