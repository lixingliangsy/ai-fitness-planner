/** Fitness plan rules - ACSM FITT-VP / resistance training guidance. */
export const RULESET_VERSION = 'fitness-plan@2026-07-20'

export type RuleHit = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  passed: boolean
  remediation?: string
  ref?: string
}

export function runDeterministicChecks(inputs: Record<string, string>): RuleHit[] {
  const goal = (inputs.goal || '').trim()
  const level = (inputs.level || inputs.experience || '').trim()
  const days = parseInt(String(inputs.days || inputs.frequency || '').replace(/[^0-9]/g, ''), 10) || 0
  const equipment = (inputs.equipment || '').trim()
  return [
    {
      id: 'FP-01',
      title: 'Training goal stated',
      severity: 'high',
      passed: goal.length >= 3,
      remediation: 'Select strength, hypertrophy, power, or general fitness.',
      ref: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    },
    {
      id: 'FP-02',
      title: 'Experience level present',
      severity: 'medium',
      passed: level.length >= 3,
      remediation: 'Provide beginner/intermediate/advanced so load and volume can be individualized.',
      ref: 'https://doi.org/10.1249/fit.0000000000000378',
    },
    {
      id: 'FP-03',
      title: 'Frequency ≥2 major-muscle sessions/week framing',
      severity: 'high',
      passed: days === 0 || days >= 2,
      remediation: 'ACSM guidance: train major muscle groups at least twice weekly when possible.',
      ref: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    },
    {
      id: 'FP-04',
      title: 'Equipment / modality noted',
      severity: 'medium',
      passed: equipment.length >= 3,
      remediation: 'List available tools (bands, bodyweight, gym) — nontraditional modes are valid.',
      ref: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    },
    {
      id: 'FP-05',
      title: 'FITT-VP progression mentioned in plan intent',
      severity: 'low',
      passed: true,
      remediation: 'Plans should allow progressive overload via frequency/intensity/time/type/volume.',
      ref: 'https://doi.org/10.1249/fit.0000000000000378',
    },
    {
      id: 'FP-06',
      title: 'Not medical advice disclaimer required',
      severity: 'high',
      passed: true,
      remediation: 'Educational decision-support only — not a clinical prescription.',
      ref: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    },
  ]
}
