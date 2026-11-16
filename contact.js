import { buildProjectBrief, sendProjectInquiry } from './contact-delivery.js';

const form = document.querySelector('#project-form');
const serviceSelect = form.querySelector('#service');
const submitButton = form.querySelector('[type="submit"]');
const submitLabel = submitButton.querySelector('span');
const errors = document.querySelector('#form-errors');
const status = document.querySelector('#form-status');
const result = document.querySelector('#brief-result');
const resultHeading = document.querySelector('#brief-heading');
const resultNote = document.querySelector('#brief-note');
const anotherButton = document.querySelector('#another-inquiry');
const query = new URLSearchParams(location.search);
const isDemoRequest = query.get('request') === 'demo';
let projectBrief = '';
let sending = false;
let lastSentAt = 0;

function prefill() {
  const requested = isDemoRequest ? 'zoho' : query.get('service');
  if ([...serviceSelect.options].some(option => option.value === requested)) serviceSelect.value = requested;
  if (isDemoRequest) {
    form.querySelector('#message').value = 'I would like a guided demo of Zoho business automation.\n\nThe workflow I want to improve:\n\nOur current applications:';
  }
}

if (isDemoRequest) {
  document.querySelector('.page-hero h1').textContent = 'Request a Zoho automation demo.';
  document.querySelector('.page-hero p').textContent = 'Tell us which workflow you want to explore and the applications your team uses. Send your demo request below.';
  document.querySelector('label[for="message"]').textContent = 'What would you like to see in the demo? *';
  form.querySelector('#message').placeholder = 'For example: lead capture, deal pipelines, task delegation or connected customer and order information. Which tools do you use today?';
  submitLabel.textContent = 'Send demo request';
  document.title = 'Request a Zoho automation demo | JUVERTECH IT SOLUTIONS';
}
prefill();
submitButton.disabled = false;
const idleLabel = submitLabel.textContent;

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  const fields = [...form.querySelectorAll('[required]')];
  const invalid = fields.filter(field => !field.value.trim() || !field.checkValidity());
  fields.forEach(field => field.setAttribute('aria-invalid', String(invalid.includes(field))));
  if (invalid.length) {
    errors.textContent = 'Please complete the required fields and enter a valid email address.';
    invalid[0].focus();
    return;
  }
  if (form.elements.website.value) {
    errors.textContent = 'We could not send this inquiry. Please refresh the page and try again.';
    return;
  }
  if (Date.now() - lastSentAt < 30000) {
    errors.textContent = 'Your previous inquiry was sent. Please wait a moment before sending another.';
    return;
  }
  const data = new FormData(form);
  const details = {
    name: data.get('name').trim(), email: data.get('email').trim(),
    company: data.get('company').trim(), service: serviceSelect.selectedOptions[0].textContent,
    timeline: data.get('timeline'), message: data.get('message').trim(), demo: isDemoRequest,
  };
  projectBrief = buildProjectBrief(details);
  errors.textContent = '';
  result.hidden = true;
  sending = true;
  form.setAttribute('aria-busy', 'true');
  const controls = [...form.querySelectorAll('input, select, textarea, button')];
  controls.forEach(control => { control.disabled = true; });
  submitLabel.textContent = 'Sending…';
  status.textContent = 'Sending your inquiry. Please keep this page open.';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    await sendProjectInquiry(details, { signal: controller.signal });
    lastSentAt = Date.now();
    form.hidden = true;
    resultHeading.textContent = isDemoRequest ? 'Your demo request is sent.' : 'Your inquiry is sent.';
    resultNote.textContent = 'Thank you for getting in touch. We’ll reply to the email address you provided. You can keep a copy of your brief below.';
    anotherButton.hidden = false;
    result.dataset.state = 'success';
  } catch (error) {
    errors.textContent = error.status === 429
      ? 'The email service is busy. Please try again in a few minutes, or chat with us on Messenger.'
      : error.name === 'AbortError'
        ? 'Delivery is taking longer than expected, so we couldn’t confirm it. Your details are saved below for this visit. Please contact us on Messenger before sending again.'
        : 'We couldn’t send your inquiry. Your details are still here. Please try again, or chat with us on Messenger.';
    resultHeading.textContent = 'Keep a copy of your inquiry.';
    resultNote.textContent = 'You can copy or download your details and share them with us on Messenger.';
    anotherButton.hidden = true;
    result.dataset.state = 'error';
  } finally {
    clearTimeout(timeout);
    sending = false;
    form.removeAttribute('aria-busy');
    controls.forEach(control => { control.disabled = false; });
    submitLabel.textContent = idleLabel;
    status.textContent = '';
    document.querySelector('#brief-text').textContent = projectBrief;
    document.querySelector('#copy-status').textContent = '';
    result.hidden = false;
    if (form.hidden) resultHeading.focus();
    else errors.focus();
  }
});

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
});
anotherButton.addEventListener('click', () => {
  form.reset();
  prefill();
  form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
  form.hidden = false;
  result.hidden = true;
  form.querySelector('#name').focus();
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const copyStatus = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(projectBrief);
    copyStatus.textContent = 'Project brief copied.';
  } catch {
    copyStatus.textContent = 'Copy is unavailable in this browser. Select the brief above or download it.';
  }
});
document.querySelector('#download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([projectBrief], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = isDemoRequest ? 'JUVERTECH-demo-request.txt' : 'JUVERTECH-project-brief.txt';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  document.querySelector('#copy-status').textContent = 'Brief downloaded.';
});
