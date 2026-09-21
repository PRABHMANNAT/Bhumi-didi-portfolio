import { Resend } from 'resend';

const recipient = 'bhumiikapoorr@gmail.com';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const name = clean(request.body?.name, 100);
  const email = clean(request.body?.email, 150);
  const message = clean(request.body?.message, 4000);

  if (!name || !emailPattern.test(email) || message.length < 10) {
    return response.status(400).json({ error: 'Please provide your name, a valid email, and a message of at least 10 characters.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return response.status(500).json({ error: 'The contact form is not configured yet. Please email Bhumi directly.' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: 'Bhumi Kapoor Portfolio <onboarding@resend.dev>',
      to: [recipient],
      replyTo: email,
      subject: `Portfolio inquiry from ${name.replace(/[\r\n]/g, ' ')}`,
      html: `<h2>New portfolio inquiry</h2><p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`
    });

    if (error) {
      console.error('Resend error:', error);
      return response.status(502).json({ error: 'Unable to deliver your message right now. Please try again shortly.' });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact email failed:', error);
    return response.status(500).json({ error: 'Unable to send your message right now. Please email Bhumi directly.' });
  }
}
