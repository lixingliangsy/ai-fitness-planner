import type { NextApiRequest, NextApiResponse } from 'next';

const TEST_MODE = !process.env.WAFFO_MERCHANT_ID || !process.env.WAFFO_PRIVATE_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productId, email } = req.body;

    if (TEST_MODE) {
      console.log('⚠️ Waffo env vars not configured, using test mode');
      return res.status(200).json({
        sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?test=true&product=${productId}`
      });
    }

    return res.status(200).json({
      sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
