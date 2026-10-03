/**
 * STORY FUNNEL — page behaviour
 * Header menu, scroll reveal, tabs, capability list, ticker, videos,
 * placeholder detection, audit dialog + Formspree submit.
 */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Mobile menu ------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const setMenu = (open) => {
    mainNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuToggle?.addEventListener('click', () => setMenu(!mainNav.classList.contains('open')));
  mainNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---- Scroll reveal ----------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---- Ticker: duplicate the set once for a seamless loop ---------------
  const track = document.querySelector('.ticker-track');
  if (track && track.children.length === 1) {
    const clone = track.firstElementChild.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }

  // Hide the broken-image icon on ticker thumbnails until real images exist.
  document.querySelectorAll('.tick img').forEach((img) => {
    const hide = () => { img.removeAttribute('src'); };
    img.addEventListener('error', hide);
    if (img.complete && !img.naturalWidth && img.getAttribute('src')) hide();
  });

  // ---- Tabs -------------------------------------------------------------
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (dir) { e.preventDefault(); select(tabs[(i + dir + tabs.length) % tabs.length], true); }
        if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });

  // ---- Capability list swaps the image ----------------------------------
  const workItems = document.querySelectorAll('#work-list li');
  const workImage = document.getElementById('work-image');
  const activateWork = (li) => {
    workItems.forEach((x) => x.classList.toggle('is-active', x === li));
    if (workImage && workImage.getAttribute('src') !== li.dataset.img) {
      workImage.setAttribute('src', li.dataset.img);
    }
  };
  workItems.forEach((li) => {
    li.addEventListener('mouseenter', () => activateWork(li));
    li.addEventListener('focus', () => activateWork(li));
    li.addEventListener('click', () => activateWork(li));
  });

  // ---- Placeholders: show a labelled gradient until real media exists ---
  const markPlaceholder = (el) => el.closest('[data-placeholder]')?.classList.add('is-placeholder');
  const clearPlaceholder = (el) => el.closest('[data-placeholder]')?.classList.remove('is-placeholder');
  document.querySelectorAll('[data-placeholder] img').forEach((img) => {
    img.addEventListener('error', () => markPlaceholder(img));
    img.addEventListener('load', () => clearPlaceholder(img));
    if (img.complete) (img.naturalWidth ? clearPlaceholder(img) : img.getAttribute('src') && markPlaceholder(img));
  });

  // ---- Background videos ------------------------------------------------
  // Autoplay only when it is kind to the visitor: motion allowed, no data saver,
  // and not on small screens. Otherwise the poster image stays.
  const saveData = navigator.connection && navigator.connection.saveData;
  const smallScreen = window.matchMedia('(max-width: 640px)').matches;
  const canAutoplay = !reduceMotion && !saveData && !smallScreen;

  document.querySelectorAll('video').forEach((video) => {
    const holder = video.closest('[data-placeholder]');
    const sources = [...video.querySelectorAll('source')];
    const lastSource = sources[sources.length - 1];
    lastSource?.addEventListener('error', () => holder?.classList.add('is-placeholder'));
    video.addEventListener('loadeddata', () => holder?.classList.remove('is-placeholder'));

    const toggle = holder?.querySelector('.video-toggle');
    const setLabel = () => { if (toggle) toggle.textContent = video.paused ? 'Play' : 'Pause'; };
    video.addEventListener('play', setLabel);
    video.addEventListener('pause', setLabel);
    toggle?.addEventListener('click', () => (video.paused ? video.play() : video.pause()));

    if (!canAutoplay) {
      setLabel();
      return;
    }
    // Play only while on screen.
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          if (video.preload === 'none') video.preload = 'auto';
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });
    vio.observe(video);
  });

  // ---- Current-section highlight in nav --------------------------------
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const targets = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    const nio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${en.target.id}`));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach((t) => nio.observe(t));
  }

  // ---- Audit dialog + Formspree ----------------------------------------
  const dialog = document.getElementById('audit-dialog');
  const form = document.getElementById('audit-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');
  let opener = null;

  document.querySelectorAll('.open-audit').forEach((btn) => {
    btn.addEventListener('click', () => {
      opener = btn;
      setMenu(false);
      status.textContent = '';
      status.className = 'form-status';
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener?.focus());

  const setStatus = (msg, kind) => { status.textContent = msg; status.className = `form-status is-${kind}`; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = [...form.querySelectorAll('[required]')];
    let firstBad = null;
    required.forEach((f) => {
      const bad = !f.value.trim() || (f.type === 'email' && !f.checkValidity());
      f.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) {
      setStatus('Please complete the highlighted fields.', 'error');
      firstBad.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    setStatus('', 'success');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      setStatus('Thank you. Your audit request has been received and we will be in touch shortly.', 'success');
      setTimeout(() => { if (dialog.open) dialog.close(); }, 3500);
    } catch (err) {
      setStatus('Sorry, something went wrong sending your request. Please try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Request my audit';
    }
  });
  form.addEventListener('input', (e) => e.target.removeAttribute?.('aria-invalid'));
});
