// Mobile menu
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => nav.classList.remove('open'))
);

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Gallery lightbox
const box = document.querySelector('.lightbox');
const boxImg = box.querySelector('img');
document.querySelectorAll('.gallery__item').forEach(btn =>
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    box.showModal();
  })
);
box.addEventListener('click', () => box.close());

// Hours: highlight today and show open/closed (restaurant time, Muncie = America/Indiana/Indianapolis)
const HOURS = { 0: [11, 21], 1: [11, 21], 2: null, 3: [11, 21], 4: [11, 21], 5: [11, 22], 6: [11, 22] };
const fmt = h => `${h > 12 ? h - 12 : h} ${h >= 12 ? 'PM' : 'AM'}`;
try {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Indiana/Indianapolis', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(new Date()).map(p => [p.type, p.value])
  );
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const now = Number(parts.hour) + Number(parts.minute) / 60;
  document.querySelector(`.hours tr[data-day="${day}"]`)?.classList.add('today');

  const badge = document.getElementById('open-now');
  const today = HOURS[day];
  if (today && now >= today[0] && now < today[1]) {
    badge.textContent = `Open now · until ${fmt(today[1])}`;
  } else {
    let d = day, label = 'today';
    if (!today || now >= today[1]) {
      for (let i = 1; i <= 7; i++) { d = (day + i) % 7; if (HOURS[d]) break; }
      label = d === (day + 1) % 7 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
    }
    badge.textContent = `Closed now · opens ${label} at ${fmt(HOURS[d][0])}`;
    badge.classList.add('is-closed');
  }
  badge.hidden = false;
} catch (e) { /* hours badge is optional */ }

document.getElementById('year').textContent = new Date().getFullYear();
