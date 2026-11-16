// EmailJS public browser identifiers. The recipient stays fixed in the EmailJS template.
// Never put the EmailJS private key or mail-provider credentials in this file.
export const emailjsConfig = Object.freeze({
  service_id: 'service_st7w3lj',
  template_id: 'template_wuyaxsj',
  user_id: '5ZJnS_bUZBcFvG7Yv',
});

export function buildProjectBrief(details) {
  return [
    details.demo ? 'JUVERTECH — Zoho demo request' : 'JUVERTECH — Project inquiry',
    '',
    `Name: ${details.name}`,
    `Work email: ${details.email}`,
    `Company: ${details.company}`,
    `Service: ${details.service}`,
    `Timeline: ${details.timeline || 'To be discussed'}`,
    '',
    'Project / business problem:',
    details.message,
  ].join('\n');
}

export async function sendProjectInquiry(details, { request = fetch, signal } = {}) {
  const response = await request('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      ...emailjsConfig,
      template_params: {
        title: details.demo ? 'JUVERTECH Zoho demo request' : `JUVERTECH project inquiry — ${details.service}`,
        name: details.name,
        from_name: `${details.name} via JUVERTECH`,
        reply_to: details.email,
        time: new Intl.DateTimeFormat('en-PH', {
          dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila',
        }).format(new Date()) + ' (Philippines)',
        message: buildProjectBrief(details),
      },
    }),
  });
  if (!response.ok) {
    const error = new Error('EmailJS could not accept the inquiry.');
    error.status = response.status;
    throw error;
  }
}
