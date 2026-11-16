const chatWidget = document.querySelector('#messenger-widget');
const chatToggle = document.querySelector('#chat-toggle');
const chatPanel = document.querySelector('#chat-panel');
const chatClose = document.querySelector('#chat-close');

function closeChat(restoreFocus = false) {
  chatPanel.hidden = true;
  chatToggle.setAttribute('aria-expanded', 'false');
  chatToggle.setAttribute('aria-label', 'Chat with JUVERTECH on Messenger');
  if (restoreFocus) chatToggle.focus({ preventScroll: true });
}

chatWidget.hidden = false;
chatToggle.addEventListener('click', () => {
  if (!chatPanel.hidden) return closeChat(true);
  chatPanel.hidden = false;
  chatToggle.setAttribute('aria-expanded', 'true');
  chatToggle.setAttribute('aria-label', 'Close Messenger chat panel');
  chatPanel.querySelector('a').focus({ preventScroll: true });
});
chatClose.addEventListener('click', () => closeChat(true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !chatPanel.hidden) closeChat(chatWidget.contains(document.activeElement));
});
document.addEventListener('click', event => {
  if (!chatPanel.hidden && !chatWidget.contains(event.target)) closeChat();
});
document.addEventListener('focusin', event => {
  if (!chatPanel.hidden && !chatWidget.contains(event.target)) closeChat();
});
