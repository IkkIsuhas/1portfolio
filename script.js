// Theme toggle with localStorage
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  root.classList.add('dark');
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
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = (document.getElementById('nameInput')?.value || '').trim();
  const fromEmail = (document.getElementById('emailInput')?.value || '').trim();
  const subject = (document.getElementById('subjectInput')?.value || '').trim();
  const message = (document.getElementById('messageInput')?.value || '').trim();

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
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      alert('Thanks! Your message has been sent.');
      form.reset();
    } else {
      // IDs not configured at all: fallback to mailto
      composeMailtoAndOpen(name, fromEmail, subject, message, contactEmail);
    }
  } catch (err) {
    console.error('EmailJS send failed:', err);
    alert('Sorry, sending failed. Please try again later.');
    // Do NOT auto-open Outlook to avoid confusion
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
