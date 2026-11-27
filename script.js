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

// Meal calculator
(() => {
  const PRICES = {
    lunch:  { adult: 12.99, kid36: 5.99, kid79: 7.99 },
    dinner: { adult: 16.99, kid36: 7.99, kid79: 9.99 },
    drink: 2.59,
  };
  const TAX_RATE = 0.08;
  const LABELS = { adult: 'Adult', kid36: 'Kid 3–6', kid79: 'Kid 7–9', drink: 'Drink' };
  const form = document.getElementById('calc');
  if (!form) return;
  const counts = { adult: 2, kid36: 0, kid79: 0, drink: 0 };
  const money = n => '$' + n.toFixed(2);
  const totalEl = document.getElementById('calc-total');
  const linesEl = document.getElementById('calc-lines');

  const priceOf = (key, meal) => key === 'drink' ? PRICES.drink : PRICES[meal][key];

  function render() {
    const meal = form.meal.value;
    const tipPct = Number(form.tip.value);
    let subtotal = 0;
    const lines = [];
    for (const key of Object.keys(counts)) {
      const step = form.querySelector(`.stepper[data-key="${key}"]`);
      step.querySelector('output').textContent = counts[key];
      step.querySelector('[data-step="-1"]').disabled = counts[key] === 0;
      step.querySelector('[data-price]').textContent = money(priceOf(key, meal)) + ' each';
      if (counts[key] > 0) {
        const cost = Math.round(counts[key] * priceOf(key, meal) * 100) / 100;
        subtotal += cost;
        lines.push(`<li><span>${counts[key]} × ${LABELS[key]}${key === 'drink' ? '' : ' ' + meal}</span><span>${money(cost)}</span></li>`);
      }
    }
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    if (subtotal) lines.push(`<li><span>Sales tax (8%)</span><span>${money(tax)}</span></li>`);
    const tip = Math.round(subtotal * tipPct) / 100;
    if (tipPct) lines.push(`<li><span>Tip (${tipPct}%)</span><span>${money(tip)}</span></li>`);
    linesEl.innerHTML = lines.length ? lines.join('') : '<li class="empty">Add guests to see your total.</li>';
    const total = money(subtotal + tax + tip);
    if (totalEl.textContent !== total) {
      totalEl.textContent = total;
      totalEl.classList.remove('bump'); void totalEl.offsetWidth; totalEl.classList.add('bump');
    }
  }

  form.addEventListener('click', e => {
    const btn = e.target.closest('[data-step]');
    if (!btn) return;
    const key = btn.closest('.stepper').dataset.key;
    counts[key] = Math.max(0, Math.min(50, counts[key] + Number(btn.dataset.step)));
    render();
  });
  form.addEventListener('change', render);
  document.getElementById('calc-reset').addEventListener('click', () => {
    Object.assign(counts, { adult: 2, kid36: 0, kid79: 0, drink: 0 });
    form.meal.value = 'lunch';
    form.tip.value = '0';
    render();
  });
  render();
})();
