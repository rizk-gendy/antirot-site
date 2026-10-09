// "Try it" battery
(function () {
  const total = 150; // minutes (2h 30m)
  let minutes = total;
  const fill = document.getElementById('fill');
  const label = document.getElementById('time');
  const state = document.getElementById('state');
  const fmt = (m) => (m <= 0 ? '0m' : Math.floor(m / 60) ? Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm' : m + 'm');
  function render() {
    fill.style.width = Math.max(0, (minutes / total) * 100) + '%';
    fill.classList.toggle('low', minutes <= 30);
    fill.style.minWidth = minutes > 0 ? '14px' : '0';
    label.textContent = fmt(minutes);
    state.textContent = minutes <= 0 ? 'Benny is out of juice' : minutes >= total ? 'Full battery' : minutes <= 30 ? 'Low battery' : 'Charging';
    document.getElementById('benny').src = minutes <= 0 ? 'img/asleep.png' : minutes <= 30 ? 'img/tired.png' : 'img/proud.png';
  }
  document.getElementById('scroll').addEventListener('click', () => { minutes = Math.max(0, minutes - 30); render(); });
  document.getElementById('outside').addEventListener('click', () => { minutes = Math.min(total, minutes + 20); render(); });
  render();
})();

// Waitlist forms
document.querySelectorAll('form.signup').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.msg');
    const email = form.querySelector('input[type=email]').value.trim();
    const endpoint = (window.ANTIROT || {}).waitlistEndpoint;
    if (!email) return;
    if (!endpoint) {
      msg.textContent = 'The waitlist is not open yet. Check back soon.';
      return;
    }
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email }) });
      msg.textContent = res.ok ? 'You are on the list. Benny says thanks!' : 'Something went wrong. Please try again.';
      if (res.ok) form.reset();
    } catch (_) {
      msg.textContent = 'Something went wrong. Please try again.';
    }
  });
});
