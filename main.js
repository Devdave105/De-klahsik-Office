/* =====================================================
   DE KLAHSIK EVENTS — main.js v3
   ===================================================== */
(function () {
  'use strict';

  /* ── HEADER SCROLL ── */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 55);
    toggleBackTop();
    updateActiveNav();
  }, { passive: true });

  /* ── HAMBURGER MENU ── */
  const hamBtn      = document.getElementById('hamBtn');
  const mobMenu     = document.getElementById('mobMenu');
  const mobClose    = document.getElementById('mobClose');
  const mobBackdrop = document.getElementById('mobBackdrop');

  function openMenu() {
    hamBtn.classList.add('open');
    hamBtn.setAttribute('aria-expanded', 'true');
    hamBtn.setAttribute('aria-label', 'Close menu');
    mobMenu.classList.add('open');
    mobMenu.setAttribute('aria-hidden', 'false');
    mobBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamBtn.classList.remove('open');
    hamBtn.setAttribute('aria-expanded', 'false');
    hamBtn.setAttribute('aria-label', 'Open menu');
    mobMenu.classList.remove('open');
    mobMenu.setAttribute('aria-hidden', 'true');
    mobBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamBtn.addEventListener('click', () =>
    hamBtn.classList.contains('open') ? closeMenu() : openMenu()
  );
  if (mobClose) mobClose.addEventListener('click', closeMenu);
  mobBackdrop.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-link, .mob-book').forEach(a =>
    a.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── ACTIVE NAV ── */
  const sections  = [...document.querySelectorAll('section[id]')];
  const dnavLinks = document.querySelectorAll('.dnav-link');

  function updateActiveNav() {
    const mid = window.scrollY + window.innerHeight * 0.4;
    sections.forEach(sec => {
      if (sec.offsetTop <= mid && sec.offsetTop + sec.offsetHeight > mid) {
        dnavLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      window.scrollTo({ top: target.offsetTop - navH + 1, behavior: 'smooth' });
    });
  });

  /* ── BACK TO TOP ── */
  const backTop = document.getElementById('backTop');
  function toggleBackTop() {
    backTop.classList.toggle('show', window.scrollY > 450);
  }
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── SCROLL REVEAL ── */
  const revEls = document.querySelectorAll('.rv, .rv-l, .rv-r');
  const revObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.d || 0);
        setTimeout(() => entry.target.classList.add('in'), delay);
        revObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revEls.forEach(el => revObserver.observe(el));

  /* ── HERO ANIMATIONS ── */
  const heroRevs = document.querySelectorAll('#hero .rv, #hero .rv-l, #hero .rv-r');
  heroRevs.forEach(el => {
    const delay = parseInt(el.dataset.d || 0);
    setTimeout(() => el.classList.add('in'), delay + 200);
  });

  /* ── COUNTERS ── */
  const counters = document.querySelectorAll('.hst-n');
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterObs.observe(c));

  function countUp(el) {
    const target = parseInt(el.dataset.to, 10);
    const duration = 1800;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    })(start);
  }

  /* ── GOLD EM SHIMMER ── */
  const shimmerStyle = document.createElement('style');
  shimmerStyle.textContent = `
    .st.in em {
      background: linear-gradient(120deg, var(--gold-dk) 0%, var(--gold-lt) 45%, var(--gold-dk) 100%);
      background-size: 220% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimText 2.5s ease 0.2s forwards;
    }
    @keyframes shimText {
      0%   { background-position: 100% 50% }
      100% { background-position: 0%   50% }
    }
  `;
  document.head.appendChild(shimmerStyle);

  /* ── BOOKING FORM ── */
  const bkForm  = document.getElementById('bkForm');
  const subBtn  = document.getElementById('subBtn');
  const subText = document.getElementById('subText');
  const subLoad = document.getElementById('subLoad');
  const fSuccess = document.getElementById('fSuccess');

  if (bkForm) {
    bkForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = document.getElementById('bkn').value.trim();
      const phone = document.getElementById('bkp').value.trim();
      const email = document.getElementById('bke').value.trim();
      const date  = document.getElementById('bkd').value;
      const type  = document.getElementById('bkt').value;
      if (!name || !phone || !email || !date || !type) { shakeFields(); return; }
      const svcs = [...bkForm.querySelectorAll('input[name="svc"]:checked')].map(c => c.value).join(', ') || 'Not specified';
      const msg  = document.getElementById('bkm').value.trim();
      subText.classList.add('hidden');
      subLoad.classList.remove('hidden');
      subBtn.disabled = true;
      const wa = `https://wa.me/2348035228096?text=${encodeURIComponent(`Hello De Klahsik Events!\n\n*Booking Request*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nEvent Date: ${date}\nEvent Type: ${type}\nServices: ${svcs}\n\nDetails: ${msg || 'None'}`)}`;
      setTimeout(() => {
        fSuccess.classList.remove('hidden');
        subBtn.style.display = 'none';
        window.open(wa, '_blank');
      }, 1200);
    });
  }

  function shakeFields() {
    ['bkn','bkp','bke','bkd','bkt'].forEach(id => {
      const el = document.getElementById(id);
      if (!el || el.value.trim()) return;
      el.style.borderColor = '#d93025';
      el.style.animation = 'fShake .45s ease';
      el.addEventListener('input', () => { el.style.borderColor = ''; el.style.animation = ''; }, { once: true });
    });
  }

  const shakeKf = document.createElement('style');
  shakeKf.textContent = `@keyframes fShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}`;
  document.head.appendChild(shakeKf);

  /* ── FOOTER YEAR ── */
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

})();