/**
 * STORY FUNNEL — Dynamic Motion & Interactive Engine
 * Orchestrates GSAP scroll animations, live stage auto-tour, mouse spotlights, counter animations & modal interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Reading Scroll Progress Bar
  // --------------------------------------------------------------------------
  const progressBar = document.getElementById('scroll-progress-bar');
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // --------------------------------------------------------------------------
  // 2. Sticky Header Blur & Dynamic Scroll State
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer Controller
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileToggle.classList.toggle('open');
      mobileDrawer.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Mouse Spotlight Effect on Bento Cards
  // --------------------------------------------------------------------------
  const spotlightCards = document.querySelectorAll('.spotlight-wrapper');
  spotlightCards.forEach((card) => {
    let glow = card.querySelector('.spotlight-glow');
    if (!glow) {
      glow = document.createElement('div');
      glow.className = 'spotlight-glow';
      card.appendChild(glow);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    });
  });

  // --------------------------------------------------------------------------
  // 5. Active Section Indicator (Intersection Observer)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // --------------------------------------------------------------------------
  // 6. Interactive Story Funnel 8-Stage Pipeline Engine + Auto-Tour
  // --------------------------------------------------------------------------
  const funnelStagesData = {
    '01': {
      title: '01 / Internal Expertise',
      role: 'The Foundation',
      quote: 'The people closest to the business have the deepest, most authentic stories.',
      description: 'We audit and map latent operational, technical, and executive wisdom that already exists inside your organisation.',
      deliverable: 'Knowledge Discovery Map & Subject-Matter Expert Directory',
      metric: '100% Owned IP (Zero Agency Dependency)',
      accent: '#E05D26'
    },
    '02': {
      title: '02 / Strategic Story Development',
      role: 'Editorial Craft',
      quote: 'Transforming technical data into human-centred narratives.',
      description: 'We structure raw operational insights into compelling hooks, narrative arcs, and thought-leadership perspectives that command executive attention.',
      deliverable: 'Core Brand Narrative Architecture & Hook Frameworks',
      metric: '5x Higher Emotional & Intellectual Resonance',
      accent: '#E05D26'
    },
    '03': {
      title: '03 / High-Yield Content Formats',
      role: 'Production Strategy',
      quote: 'Content engineered specifically for modern executive feeds.',
      description: 'Packaging internal expertise into short-form video, long-form editorial analysis, and platform-specific formats that employees can sustain effortlessly.',
      deliverable: 'Repeatable Content Matrix & Low-Friction Video Workflow',
      metric: '3-4x Faster In-House Content Turnaround',
      accent: '#D97706'
    },
    '04': {
      title: '04 / High-Intent Attention',
      role: 'Algorithmic Distribution',
      quote: 'Cutting through superficial marketing noise.',
      description: 'Positioning your team on platforms where key decision-makers consume intelligence, winning organic reach through genuine substance.',
      deliverable: 'Multi-Platform Distribution Blueprint & Retention Blueprints',
      metric: '+340% Higher Feed Retention & Watch-Through',
      accent: '#D97706'
    },
    '05': {
      title: '05 / Thoughtful Engagement',
      role: 'Dialogue Generation',
      quote: 'Moving beyond passive likes to meaningful industry conversations.',
      description: 'Sparking high-level discussions, executive comments, and peer inquiries rather than superficial vanity metrics.',
      deliverable: 'Conversation Prompts & Community Interaction Guide',
      metric: '8.4x More Qualified Industry Inquiries',
      accent: '#0284C7'
    },
    '06': {
      title: '06 / Compounding Trust',
      role: 'Authority Building',
      quote: 'Trust is established when people hear directly from the actual experts.',
      description: 'Creating undeniable credibility over time by consistently demonstrating deep domain problem-solving mastery.',
      deliverable: 'Peer Authority Scorecard & Industry Benchmark Tracker',
      metric: 'Top-of-Mind Recall with Key Accounts',
      accent: '#0284C7'
    },
    '07': {
      title: '07 / Qualified Action',
      role: 'Conversion Bridges',
      quote: 'Guiding warm interest seamlessly into business discussions.',
      description: 'Deploying strategic editorial calls-to-action that invite consultation, partnership discussions, and RFP invitations without aggressive sales friction.',
      deliverable: 'Conversion Pathways & Strategic Call-to-Action Library',
      metric: '42% Higher Inquiry-to-Consultation Rate',
      accent: '#059669'
    },
    '08': {
      title: '08 / Commercial Growth & Sale',
      role: 'Revenue Realization',
      quote: 'Sales that close faster because trust was built upfront.',
      description: 'Closing high-value contracts and retained clients where your team is already recognized as the trusted industry benchmark.',
      deliverable: 'Full Pipeline Integration & Executive ROI Dashboard',
      metric: 'Shorter Sales Cycles + Higher Deal Size',
      accent: '#059669'
    }
  };

  const stageKeys = Object.keys(funnelStagesData);
  let currentStageIndex = 0;
  let autoTourInterval = null;
  let autoTourProgressInterval = null;
  const tourDuration = 4000; // 4 seconds per stage

  const stageCells = document.querySelectorAll('.funnel-stage-interactive');
  const stageTitleEl = document.getElementById('funnel-active-title');
  const stageRoleEl = document.getElementById('funnel-active-role');
  const stageQuoteEl = document.getElementById('funnel-active-quote');
  const stageDescEl = document.getElementById('funnel-active-desc');
  const stageDeliverableEl = document.getElementById('funnel-active-deliverable');
  const stageMetricEl = document.getElementById('funnel-active-metric');
  const autoTourBtn = document.getElementById('funnel-auto-tour-btn');
  const timerBar = document.getElementById('funnel-timer-bar');

  function setFunnelStage(stageId, animated = true) {
    const data = funnelStagesData[stageId];
    if (!data) return;

    stageCells.forEach(cell => {
      if (cell.getAttribute('data-stage') === stageId) {
        cell.classList.add('stage-active');
      } else {
        cell.classList.remove('stage-active');
      }
    });

    if (stageTitleEl) {
      if (animated) {
        stageTitleEl.style.opacity = '0';
        stageTitleEl.style.transform = 'translateY(6px)';
        setTimeout(() => {
          stageTitleEl.textContent = data.title;
          stageTitleEl.style.opacity = '1';
          stageTitleEl.style.transform = 'translateY(0)';
        }, 120);
      } else {
        stageTitleEl.textContent = data.title;
      }
    }

    if (stageRoleEl) stageRoleEl.textContent = data.role;
    if (stageQuoteEl) stageQuoteEl.textContent = `"${data.quote}"`;
    if (stageDescEl) stageDescEl.textContent = data.description;
    if (stageDeliverableEl) stageDeliverableEl.textContent = data.deliverable;
    if (stageMetricEl) stageMetricEl.textContent = data.metric;
  }

  function startAutoTour() {
    if (autoTourInterval) clearInterval(autoTourInterval);
    if (autoTourProgressInterval) clearInterval(autoTourProgressInterval);

    let progress = 0;
    if (timerBar) timerBar.style.width = '0%';

    autoTourProgressInterval = setInterval(() => {
      progress += (50 / tourDuration) * 100;
      if (timerBar) timerBar.style.width = `${Math.min(progress, 100)}%`;
    }, 50);

    autoTourInterval = setInterval(() => {
      currentStageIndex = (currentStageIndex + 1) % stageKeys.length;
      setFunnelStage(stageKeys[currentStageIndex]);
      progress = 0;
      if (timerBar) timerBar.style.width = '0%';
    }, tourDuration);

    if (autoTourBtn) {
      autoTourBtn.innerHTML = `<span>⏸ Pause Tour</span>`;
      autoTourBtn.classList.add('bg-terracotta', 'text-white');
    }
  }

  function stopAutoTour() {
    if (autoTourInterval) clearInterval(autoTourInterval);
    if (autoTourProgressInterval) clearInterval(autoTourProgressInterval);
    autoTourInterval = null;
    autoTourProgressInterval = null;
    if (timerBar) timerBar.style.width = '0%';

    if (autoTourBtn) {
      autoTourBtn.innerHTML = `<span>▶ Start Auto Tour</span>`;
      autoTourBtn.classList.remove('bg-terracotta', 'text-white');
    }
  }

  if (autoTourBtn) {
    autoTourBtn.addEventListener('click', () => {
      if (autoTourInterval) {
        stopAutoTour();
      } else {
        startAutoTour();
      }
    });
  }

  stageCells.forEach((cell, idx) => {
    cell.addEventListener('click', () => {
      stopAutoTour();
      const stage = cell.getAttribute('data-stage');
      currentStageIndex = idx;
      if (stage) setFunnelStage(stage);
    });
  });

  // Default to first stage
  setFunnelStage('01', false);

  // --------------------------------------------------------------------------
  // 7. Scroll-Triggered Reveal Animations (100% Visible & Fail-Safe)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.motion-reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --------------------------------------------------------------------------
  // 8. Animated Metrics Counter
  // --------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.getAttribute('data-counter'));
          const prefix = entry.target.getAttribute('data-prefix') || '';
          const suffix = entry.target.getAttribute('data-suffix') || '';
          const isDecimal = String(target).includes('.');
          
          let current = 0;
          const steps = 30;
          const increment = target / steps;
          const stepTime = 1200 / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`;
          }, stepTime);

          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(c => counterObserver.observe(c));
  }

  // --------------------------------------------------------------------------
  // 9. Client Matrix Filter System
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.client-filter-btn');
  const clientCards = document.querySelectorAll('.client-sector-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#0F172A]', 'text-white');
        b.classList.add('bg-white', 'text-[#334155]');
      });
      btn.classList.add('bg-[#0F172A]', 'text-white');
      btn.classList.remove('bg-white', 'text-[#334155]');

      const filter = btn.getAttribute('data-filter');
      clientCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 10. Consultation Modal Controller & Form Handling
  // --------------------------------------------------------------------------
  const consultationModal = document.getElementById('consultation-modal');
  const openModalBtns = document.querySelectorAll('.open-consultation-modal');
  const closeModalBtns = document.querySelectorAll('.close-consultation-modal');
  const consultationForm = document.getElementById('consultation-form');

  function openModal() {
    consultationModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    consultationModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

  consultationModal?.addEventListener('click', (e) => {
    if (e.target === consultationModal) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 11. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="w-2.5 h-2.5 rounded-full bg-[#E05D26] inline-block animate-ping"></span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Thank you! Your capability consultation inquiry has been received. Our advisory team will reach out within 24 hours.');
      consultationForm.reset();
    });
  }

  // Contact email feedback
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  mailLinks.forEach(link => {
    link.addEventListener('click', () => {
      showToast('Connecting you directly with the Story Funnel advisory desk...');
    });
  });
});
