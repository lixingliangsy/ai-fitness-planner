import { useState } from 'react'

interface FormData {
  goal: string
  fitnessLevel: string
  availableDays: string
  equipment: string
  limitations: string
}

interface PlanData {
  plan: string
  tips: string[]
}

const PlanGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    goal: '',
    fitnessLevel: '',
    availableDays: '',
    equipment: '',
    limitations: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setPlan(null)

    try {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan')
      }

      setPlan(data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Generate your personalized fitness plan</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitness goal *
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select goal</option>
                <option value="weight_loss">Fat loss</option>
                <option value="muscle_gain">Muscle gain</option>
                <option value="endurance">Endurance</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
                <option value="general_fitness">General fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fitness level *
              </label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Days available per week *
              </label>
              <select
                name="availableDays"
                value={formData.availableDays}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select days</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
                <option value="7">7 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available equipment
              </label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select equipment</option>
                <option value="none">Bodyweight only</option>
                <option value="dumbbells">Dumbbells</option>
                <option value="barbell">Barbell</option>
                <option value="resistance_bands">Resistance bands</option>
                <option value="pull_up_bar">Pull-up bar</option>
                <option value="full_gym">Full gym</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical limitations or notes
              </label>
              <textarea
                name="limitations"
                value={formData.limitations}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. knee injury, back pain, hypertension (optional)"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate fitness plan'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          {error}
        </div>
      )}

      {plan && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Your personalized fitness plan</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{plan.plan}</pre>
          </div>
          
          {plan.tips && plan.tips.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Important tips</h3>
              <ul className="list-disc pl-5 space-y-2">
                {plan.tips.map((tip, index) => (
                  <li key={index} className="text-gray-700">{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default PlanGenerator
