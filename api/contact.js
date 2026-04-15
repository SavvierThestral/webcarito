export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { from_name, phone, from_email, project_type, other_project } = req.body;

  if (!from_name || !from_email) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const payload = {
    service_id:  process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id:     process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      from_name,
      phone:         phone        || '',
      from_email,
      email:         from_email,
      project_type:  project_type  || '',
      other_project: other_project || '',
    }
  };

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    return res.status(500).json({ error: text });
  }

  return res.status(200).json({ ok: true });
}
