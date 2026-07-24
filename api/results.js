import { kv } from '@vercel/kv';

// Single shared record holding the whole app's data (teams, fixtures, results, etc.)
const KEY = 'btc_data';

export default async function handler(req, res) {
    if (req.method === 'GET') {
          const data = await kv.get(KEY);
          res.setHeader('Cache-Control', 'no-store');
          return res.status(200).json(data || null);
    }

  if (req.method === 'POST') {
        const adminKey = req.headers['x-admin-key'];
        if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
                return res.status(401).json({ error: 'Unauthorized' });
        }

      const body = req.body;
        if (!body || typeof body !== 'object') {
                return res.status(400).json({ error: 'Invalid payload' });
        }

      await kv.set(KEY, body);
        return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
}
