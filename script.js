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
    boxImg.src = btn.dataset.src;
    boxImg.alt = btn.querySelector('img').alt;
    box.showModal();
  })
);
box.addEventListener('click', () => box.close());

document.getElementById('year').textContent = new Date().getFullYear();
