import type { NextApiRequest, NextApiResponse } from 'next'
import { PRODUCT } from '../../lib/product'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  let inputs: Record<string, string> = {}
  try {
    const body = (req.body || {}) as {
      inputs?: Record<string, string>
      useMock?: boolean
    }
    inputs = body.inputs || {}
    const useMock = !!body.useMock
    const hasKey = !!process.env.OPENAI_API_KEY

    const mockFn = typeof (PRODUCT as any).mock === 'function' ? (PRODUCT as any).mock : null
    const fallback = () =>
      mockFn
        ? String(mockFn(inputs))
        : `${(PRODUCT as any).name || 'Product'} DEMO\n\n` +
          Object.entries(inputs)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n') +
          '\n\n---\nPreview result. Add OPENAI_API_KEY for live AI.'

    if (useMock || !hasKey) {
      return res.status(200).json({ result: fallback(), mock: true })
    }

    const fields = Array.isArray((PRODUCT as any).inputs) ? (PRODUCT as any).inputs : []
    const inputText = fields.length
      ? fields.map((f: any) => `${f.label}: ${inputs[f.key] || '(not provided)'}`).join('\n')
      : Object.entries(inputs)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')

    const base = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    const system =
      (PRODUCT as any).systemPrompt ||
      `You are the core engine of ${(PRODUCT as any).name}. Produce clear, structured, useful output.`

    const r = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: inputText || 'Generate a helpful demo output.' },
        ],
        temperature: 0.7,
      }),
    })

    if (!r.ok) {
      const t = await r.text()
      throw new Error('AI request failed: ' + t.slice(0, 160))
    }
    const data = await r.json()
    const text = data.choices?.[0]?.message?.content || ''
    if (!text.trim()) throw new Error('Empty AI response')
    return res.status(200).json({ result: text, mock: false })
  } catch (e: any) {
    const mockFn = typeof (PRODUCT as any).mock === 'function' ? (PRODUCT as any).mock : null
    const result = mockFn
      ? String(mockFn(inputs))
      : `${(PRODUCT as any).name || 'Product'} DEMO (degraded)`
    return res.status(200).json({
      result,
      mock: true,
      degraded: true,
      note: 'Real AI call failed (' + (e.message || 'error') + '). Showing demo output.',
    })
  }
}
