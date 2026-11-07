// Vercel Serverless Function — يعمل بمفتاح service_role السري (يُضبط في Environment Variables فقط)
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { t, order, email } = req.query;
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  let q = sb.from('orders')
    .select('status, download_expires_at, products(file_path)')
    .limit(1);
  if (t) q = q.eq('download_token', t);
  else if (order && email) q = q.eq('id', order).eq('customer_email', String(email).trim().toLowerCase());
  else return res.status(400).json({ status: 'bad_request' });

  const { data, error } = await q.maybeSingle();
  if (error || !data) return res.status(404).json({ status: 'not_found' });
  if (data.status !== 'approved') return res.status(200).json({ status: data.status });
  if (data.download_expires_at && new Date(data.download_expires_at) < new Date())
    return res.status(200).json({ status: 'expired' });
  if (!data.products?.file_path) return res.status(404).json({ status: 'no_file' });

  const { data: signed, error: e2 } = await sb.storage
    .from('secure-digital-files')
    .createSignedUrl(data.products.file_path, 60, { download: true });
  if (e2) return res.status(500).json({ status: 'error' });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ status: 'approved', url: signed.signedUrl });
}
