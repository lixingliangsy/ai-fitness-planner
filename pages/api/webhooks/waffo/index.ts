import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

/**
 * Fail-closed Waffo webhook stub for thin-shell product.
 * Missing/invalid signature → 401. No business side-effects until fully wired.
 */
export const config = { api: { bodyParser: false } }

function readRaw(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function timingSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return crypto.timingSafeEqual(ba, bb)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = process.env.WAFFO_WEBHOOK_SECRET || ''
  const sig = String(req.headers['x-waffo-signature'] || req.headers['x-signature'] || '')
  if (!secret || !sig) {
    return res.status(401).json({ error: 'Missing signature', code: 'UNAUTHORIZED' })
  }

  const raw = await readRaw(req)
  const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  const provided = sig.replace(/^sha256=/, '')
  if (!timingSafeEqual(expected, provided)) {
    return res.status(401).json({ error: 'Invalid signature', code: 'UNAUTHORIZED' })
  }

  // Verified — acknowledge only (thin-shell has no subscription store yet).
  return res.status(200).json({ received: true, verified: true })
}
