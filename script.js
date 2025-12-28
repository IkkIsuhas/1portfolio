// Galaxy Background Animation
(function initGalaxyBackground() {
  const canvas = document.getElementById('galaxyCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  // Star particles
  const stars = [];
  const numStars = 200;
  
  // Shooting stars
  const shootingStars = [];
  
  // Check if dark mode is active
  function isDarkMode() {
    return document.documentElement.classList.contains('dark');
  }
  
  class Star {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random();
      this.twinkleSpeed = Math.random() * 0.02 + 0.01;
      this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Wrap around screen
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
      
      // Twinkling effect
      this.opacity += this.twinkleSpeed * this.twinkleDirection;
      if (this.opacity <= 0.1 || this.opacity >= 1) {
        this.twinkleDirection *= -1;
      }
    }
    
    draw() {
      // Use white stars in dark mode, dark stars in light mode
      const color = isDarkMode() ? '255, 255, 255' : '50, 50, 80';
      ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  class ShootingStar {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height * 0.5; // Top half of screen
      this.length = Math.random() * 80 + 40;
      this.speed = Math.random() * 8 + 6;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = 1;
      this.angle = Math.PI / 4; // 45 degrees
    }
    
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.015;
      
      // Reset when off screen or faded
      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.reset();
      }
    }
    
    draw() {
      // Use white shooting stars in dark mode, dark in light mode
      const color = isDarkMode() ? '255, 255, 255' : '50, 50, 80';
      const gradient = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      gradient.addColorStop(0, `rgba(${color}, ${this.opacity})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.length,
        this.y - Math.sin(this.angle) * this.length
      );
      ctx.stroke();
    }
  }
  
  // Initialize stars
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
  
  // Initialize shooting stars (fewer of them)
  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }
  
  function animate() {
    // Clear canvas completely for transparent background
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // Update and draw shooting stars
    shootingStars.forEach(shootingStar => {
      shootingStar.update();
      shootingStar.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  // Handle resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  animate();
})();

// Theme toggle with localStorage
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  root.classList.add('dark');
}

// Add animations to social icons
(function initSocialIconAnimations() {
  const icons = document.querySelectorAll('.social-icon');
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => icon.classList.add('btn-pulse'));
    icon.addEventListener('mouseleave', () => icon.classList.remove('btn-pulse'));
    icon.addEventListener('focus', () => icon.classList.add('btn-pulse'));
    icon.addEventListener('blur', () => icon.classList.remove('btn-pulse'));
  });
})();


// Initialize AOS (Animate On Scroll)
(function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 600, easing: 'ease-out', once: true, offset: 40 });
  }
})();

// Initialize Typed.js for hero title
(function initTypedTitle() {
  const el = document.getElementById('typedTitle');
  if (!el) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const strings = [
    "Hi, I'm <span class='text-primary-600'>Suhas</span>",
    'ML/AI Developer',
    'Java + Spring Boot Enthusiast'
  ];
  if (reduceMotion || typeof Typed === 'undefined') {
    el.innerHTML = strings[0];
    return;
  }
  // Clear initial content so Typed can render
  el.innerHTML = '';
  /* global Typed */
  // eslint-disable-next-line no-undef
  new Typed('#typedTitle', {
    strings,
    typeSpeed: 55,
    backSpeed: 32,
    backDelay: 900,
    startDelay: 200,
    loop: true,
    smartBackspace: true,
    showCursor: true,
    cursorChar: '|'
  });
})();

// Tilt parallax on hero photo wrapper (composes with inner float)
(function initHeroTilt() {
  const wrap = document.getElementById('heroPhotoWrap');
  if (!wrap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  let raf = 0;
  function onMove(e) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const b = wrap.getBoundingClientRect();
      const nx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
      const ny = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
      const rx = Math.max(-1, Math.min(1, ny)) * 6; // degrees
      const ry = Math.max(-1, Math.min(1, -nx)) * 6;
      wrap.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }
  function reset() { wrap.style.transform = 'none'; }
  wrap.addEventListener('mousemove', onMove);
  wrap.addEventListener('mouseleave', reset);
})();

// Particles background (hero)
(function initParticles() {
  const containerId = 'tsparticles';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const el = document.getElementById(containerId);
  if (!el || typeof tsParticles === 'undefined') return;
  tsParticles.load(containerId, {
    background: { color: { value: 'transparent' } },
    fpsLimit: 48,
    particles: {
      number: { value: 35, density: { enable: true, area: 800 } },
      color: { value: ['#6366f1', '#22c55e', '#38bdf8'] },
      shape: { type: 'circle' },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 3 } },
      links: { enable: true, distance: 130, color: '#64748b', opacity: 0.25, width: 1 },
      move: { enable: true, speed: 0.8, outModes: { default: 'out' } }
    },
    detectRetina: true
  });
})();

// Parallax scrolling for elements with data-parallax (value is multiplier 0..1)
(function initScrollParallax() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const items = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!items.length) return;
  let raf = 0;
  function update() {
    const y = window.scrollY;
    items.forEach(el => {
      const m = parseFloat(el.getAttribute('data-parallax') || '0.1');
      el.style.transform = `translateY(${Math.round(y * m)}px)`;
    });
  }
  function onScroll() {
    if (!raf) raf = requestAnimationFrame(() => { update(); raf = 0; });
  }
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Animate progress bars and donut charts when visible
(function initSkillAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bars = document.querySelectorAll('.progress-bar');
  const rings = document.querySelectorAll('.donut-ring');
  if (!bars.length && !rings.length) return;

  const onEnter = (el) => {
    if (el.classList.contains('progress-bar')) {
      const t = parseInt(el.getAttribute('data-target') || '0', 10);
      if (!reduceMotion) el.style.width = t + '%'; else el.style.width = '100%';
    }
    if (el.classList.contains('donut-ring')) {
      const p = Math.max(0, Math.min(100, parseInt(el.getAttribute('data-percent') || '0', 10)));
      // dashoffset from 100 -> 0
      const offset = 100 - p;
      el.style.strokeDashoffset = String(offset);
    }
  };

  if (!('IntersectionObserver' in window)) {
    bars.forEach(onEnter);
    rings.forEach(onEnter);
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onEnter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(el => io.observe(el));
  rings.forEach(el => io.observe(el));
})();

// Enhance send button with icon float
(function initSendButtonAnim() {
  const btn = document.getElementById('sendBtn');
  if (!btn) return;
  const svg = btn.querySelector('svg');
  if (svg) svg.classList.add('send-icon-float');
})();

// Success animation with checkmark + confetti
function showFormSuccess(anchorEl) {
  try {
    // inline checkmark badge
    const badge = document.createElement('span');
    badge.className = 'inline-flex items-center gap-2 ml-3 text-sm text-green-600';
    badge.innerHTML = '<span class="inline-flex w-5 h-5 rounded-full bg-green-100 items-center justify-center">✔️</span> Sent!';
    (anchorEl?.parentElement || form)?.appendChild(badge);
    setTimeout(() => badge.remove(), 3000);

    // Trigger full-screen confetti animation
    createConfetti();
  } catch {}
}

themeToggle?.addEventListener('click', () => {
  root.classList.toggle('dark');
  const theme = root.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// EmailJS configuration (public key provided by user)
const EMAILJS_PUBLIC_KEY = 'igN5Pdehwo9dS2C8w';
// Replace the following with your actual IDs when you share them
const EMAILJS_SERVICE_ID = 'service_dztgwam';
const EMAILJS_TEMPLATE_ID = 'template_m3yosyb';

// Initialize EmailJS if SDK is present
function initEmailJS() {
  try {
    if (window.emailjs && EMAILJS_PUBLIC_KEY) {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
  } catch {}
}

// Ensure EmailJS SDK is loaded (dynamic loader)
function loadEmailJSSDK() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      try { initEmailJS(); } catch {}
      return resolve();
    }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.async = true;
    s.onload = () => { try { initEmailJS(); } catch {} ; resolve(); };
    s.onerror = () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(s);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
  initEmailJS();
}

// Get in touch form -> EmailJS (preferred) with mailto fallback
const contactEmail = 'suhasm004@gmail.com'; // set by user
const form = document.getElementById('contactForm');
let formStatusEl = null;
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = (document.getElementById('nameInput')?.value || '').trim();
  const fromEmail = (document.getElementById('emailInput')?.value || '').trim();
  const subject = (document.getElementById('subjectInput')?.value || '').trim();
  const message = (document.getElementById('messageInput')?.value || '').trim();
  const sendBtn = document.getElementById('sendBtn');
  if (!formStatusEl) {
    formStatusEl = document.createElement('p');
    formStatusEl.className = 'text-sm text-slate-500 mt-2 h-5';
    form.appendChild(formStatusEl);
  }

  // Basic validation
  if (!fromEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    alert('Please enter a valid email address.');
    return;
  }
  if (!name) {
    alert('Please enter your name.');
    return;
  }
  if (!message) {
    alert('Please enter a message.');
    return;
  }

  const idsConfigured = EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
  try {
    if (idsConfigured) {
      await loadEmailJSSDK();
    }
    const canUseEmailJS = Boolean(window.emailjs && idsConfigured);
    if (canUseEmailJS) {
      const templateParams = {
        from_name: name,
        from_email: fromEmail,
        subject: subject || `Message from ${name}`,
        message,
        to_email: contactEmail,
        time: new Date().toLocaleString()
      };
      // show loading state
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.classList.add('opacity-80');
      }
      formStatusEl.textContent = 'Sending…';

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // success UI
      formStatusEl.textContent = '';
      showFormSuccess(sendBtn);
      form.reset();
    } else {
      // IDs not configured at all: fallback to mailto
      composeMailtoAndOpen(name, fromEmail, subject, message, contactEmail);
    }
  } catch (err) {
    console.error('EmailJS send failed:', err);
    if (formStatusEl) {
      formStatusEl.textContent = 'Sorry, sending failed. Please try again later.';
      formStatusEl.classList.remove('text-slate-500');
      formStatusEl.classList.add('text-red-500');
    }
    // Do NOT auto-open Outlook to avoid confusion
  }
  finally {
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.classList.remove('opacity-80');
    }
  }
});

function composeMailtoAndOpen(name, fromEmail, subject, message, contactEmail) {
  const composedSubject = subject || `Message from ${name} <${fromEmail}>`;
  const bodyLines = [
    `Name: ${name}`,
    `Email: ${fromEmail}`,
    '',
    message
  ];
  const params = new URLSearchParams();
  params.set('subject', composedSubject);
  params.set('body', bodyLines.join('\n'));
  params.set('reply-to', fromEmail);
  const mailto = `mailto:${contactEmail}?${params.toString()}`;
  window.location.href = mailto;
}

// ----- Extract project/certificate links from Resume PDF (client-side) -----
async function extractLinksFromResume() {
  try {
    if (!window['pdfjsLib']) return; // PDF.js not loaded
    if (location.protocol === 'file:') {
      console.warn('Open via a local server (http://) for PDF parsing to work.');
      return;
    }
    // Configure worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const loadingTask = pdfjsLib.getDocument('./Suhas Resume.pdf');
    const pdfDoc = await loadingTask.promise;
    const urls = new Set();
    for (let p = 1; p <= pdfDoc.numPages; p++) {
      const page = await pdfDoc.getPage(p);
      const annots = await page.getAnnotations();
      annots.forEach(a => { if (a?.url) urls.add(a.url); });
    }
    if (urls.size === 0) return;

    // Render detected links as simple project cards
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    urls.forEach(url => {
      try {
        const u = new URL(url, location.href);
        const host = u.hostname.replace('www.', '');
        const isGitHub = host.includes('github.com');
        const card = document.createElement('article');
        card.className = 'group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:shadow-md transition';
        card.innerHTML = `
          <div class="aspect-video rounded-lg bg-slate-100 dark:bg-slate-800 mb-4 flex items-center justify-center text-slate-400">Link</div>
          <h3 class="font-semibold group-hover:text-primary-600">${host}</h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300 break-words">${u.href}</p>
          <div class="mt-4 flex items-center gap-3">
            <a href="${u.href}" target="_blank" class="text-sm text-primary-600 hover:text-primary-700">${isGitHub ? 'Code' : 'Open'}</a>
          </div>
        `;
        grid.appendChild(card);
      } catch {}
    });
  } catch (err) {
    console.warn('PDF link extraction failed:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', extractLinksFromResume);
} else {
  extractLinksFromResume();
}

// Reveal-on-scroll for elements with .reveal (init after DOMContentLoaded)
function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.remove('opacity-0', 'translate-y-3'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-3');
        entry.target.classList.add('transition', 'duration-500');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRevealOnScroll);
} else {
  initRevealOnScroll();
}

// Typed rotating tagline under About
(function initTypedTagline() {
  const el = document.getElementById('typedTagline');
  if (!el) return;
  const phrases = [
    'ML Engineer',
    'Spring Boot Developer',
    'Data Enthusiast'
  ];
  let pi = 0, ci = 0, deleting = false;
  function tick() {
    const current = phrases[pi];
    if (!deleting) {
      el.textContent = current.slice(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        return setTimeout(tick, 1200);
      }
      return setTimeout(tick, 90);
    } else {
      el.textContent = current.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        return setTimeout(tick, 250);
      }
      return setTimeout(tick, 45);
    }
  }
  tick();
})();

// Staggered reveal delays for project and certificate cards
(function initRevealStagger() {
  const applyStagger = (selector, stepMs = 60) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    nodes.forEach((el, i) => {
      el.style.transitionDelay = `${i * stepMs}ms`;
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyStagger('#home .reveal', 80);
      applyStagger('#projectsGrid > article.reveal');
      applyStagger('#certificates .grid > a.reveal');
    });
  } else {
    applyStagger('#home .reveal', 80);
    applyStagger('#projectsGrid > article.reveal');
    applyStagger('#certificates .grid > a.reveal');
  }
})();

// Hero parallax glow
(function initHeroParallax() {
  const glow = document.getElementById('heroGlow');
  const section = document.getElementById('home');
  if (!glow || !section) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const bounds = () => section.getBoundingClientRect();
  let raf = 0;
  function onMove(e) {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const b = bounds();
      const x = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
      const y = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
      const tx = Math.max(-1, Math.min(1, x)) * 12; // px
      const ty = Math.max(-1, Math.min(1, y)) * 12; // px
      glow.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  }
  section.addEventListener('mousemove', onMove);
  section.addEventListener('mouseleave', () => {
    glow.style.transform = 'translate3d(0,0,0)';
  });
})();

// Spinner helpers for future project tabs
window.showProjectsSpinner = function showProjectsSpinner() {
  const sp = document.getElementById('projectsSpinner');
  if (!sp) return;
  sp.classList.remove('hidden');
};
window.hideProjectsSpinner = function hideProjectsSpinner() {
  const sp = document.getElementById('projectsSpinner');
  if (!sp) return;
  sp.classList.add('hidden');
};

// Mobile menu toggle
(function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobileNav');
  if (!btn || !panel) return;
  const open = () => {
    panel.classList.remove('hidden');
    // allow layout to apply before animating
    requestAnimationFrame(() => {
      panel.classList.remove('opacity-0', '-translate-y-2');
    });
    btn.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    panel.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => { panel.classList.add('hidden'); }, 200);
    btn.setAttribute('aria-expanded', 'false');
  };
  const toggle = () => {
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) open(); else close();
  };
  btn.addEventListener('click', toggle);
  panel.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => { if (!panel.classList.contains('hidden')) close(); });
  });
})();

// Animate stat counters when visible
(function initStatCounters() {
  const items = document.querySelectorAll('.stat-number');
  if (!items.length) return;
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = 900; // ms
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.floor(from + (target - from) * p);
      el.textContent = val.toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toString();
    }
    requestAnimationFrame(step);
  };

  if (!('IntersectionObserver' in window)) {
    items.forEach(animate);
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  items.forEach(el => io.observe(el));
})();

// Loading Screen
(function initLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (!loadingScreen) return;
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }, 800);
  });
})();

// Scroll Progress Bar
(function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;
  
  function updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  }
  
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

// Scroll to Top Button
(function initScrollToTop() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  const backToTopBtn = document.getElementById('backToTop');
  if (!scrollBtn) return;
  
  function toggleButton() {
    if (window.scrollY > 300) {
      scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
      scrollBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      scrollBtn.classList.add('opacity-0', 'pointer-events-none');
      scrollBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  
  window.addEventListener('scroll', toggleButton, { passive: true });
  scrollBtn.addEventListener('click', scrollToTop);
  if (backToTopBtn) backToTopBtn.addEventListener('click', scrollToTop);
  toggleButton();
})();

// Button Hover Particle Effect
(function initButtonParticles() {
  const buttons = document.querySelectorAll('a[href="#projects"], #sendBtn');
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function(e) {
      const rect = this.getBoundingClientRect();
      const particles = 8;
      
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = 'rgba(99, 102, 241, 0.6)';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        const angle = (Math.PI * 2 * i) / particles;
        const velocity = 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let x = 0, y = 0, opacity = 1;
        function animate() {
          x += vx;
          y += vy;
          opacity -= 0.02;
          
          particle.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
          particle.style.opacity = opacity;
          
          if (opacity > 0) {
            requestAnimationFrame(animate);
          } else {
            particle.remove();
          }
        }
        animate();
      }
    });
  });
})();

// Animated Skill Progress Bars
(function initSkillProgress() {
  const progressBars = document.querySelectorAll('.skill-progress');
  if (progressBars.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress');
        
        setTimeout(() => {
          bar.style.transition = 'width 1.5s ease-out';
          bar.style.width = progress + '%';
        }, 200);
        
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  progressBars.forEach(bar => observer.observe(bar));
})();

// Ripple Effect on Card Clicks
(function initRippleEffect() {
  const rippleContainers = document.querySelectorAll('.ripple-container, article');
  
  rippleContainers.forEach(container => {
    container.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

// Form Validation with Shake Effect
(function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('shake', 'border-red-500');
      
      setTimeout(() => {
        this.classList.remove('shake');
      }, 500);
      
      setTimeout(() => {
        this.classList.remove('border-red-500');
      }, 2000);
    });
    
    input.addEventListener('input', function() {
      if (this.validity.valid) {
        this.classList.remove('border-red-500');
      }
    });
  });
})();

// Confetti Animation on Form Success
function createConfetti() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = Math.random();
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 3 + 2;
    const xMovement = (Math.random() - 0.5) * 200;
    
    confetti.animate([
      { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
      { transform: `translate(${xMovement}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => confetti.remove();
  }
}

// Typing Effect for Tagline in About Section using Typed.js
(function initTaglineTyping() {
  const taglineElement = document.getElementById('typedTagline');
  if (!taglineElement || typeof Typed === 'undefined') return;
  
  // Wait for page to be fully loaded
  const initTyped = () => {
    try {
      new Typed('#typedTagline', {
        strings: [
          "Building intelligent solutions with code",
          "Transforming data into insights",
          "Creating scalable ML applications",
          "Passionate about AI and innovation"
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        startDelay: 500,
        loop: true,
        showCursor: false
      });
    } catch (e) {
      console.log('Typed.js not loaded yet for tagline');
    }
  };
  
  // Initialize after a delay to ensure Typed.js is loaded
  if (document.readyState === 'complete') {
    setTimeout(initTyped, 1500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(initTyped, 1500);
    });
  }
})();
