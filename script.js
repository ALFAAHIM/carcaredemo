/**
 * Car Care – Premium Car Wash & Detailing
 * Main JavaScript – Interactions, Animations, and UI Logic
 */

(function () {
  'use strict';

  /* ================================================
     NAVBAR – Scroll behavior & Mobile Menu
     ================================================ */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll behavior: add .scrolled class
  function onNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onNavbarScroll, { passive: true });
  onNavbarScroll();

  // Mobile hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on nav link click
    allNavLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ================================================
     ACTIVE NAV LINK – Highlight based on scroll
     ================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(function (section) {
      const sectionTop    = section.offsetTop - 100;
      const sectionBottom = sectionTop + section.offsetHeight;
      const id            = section.getAttribute('id');
      const link          = document.querySelector('.nav-link[href="#' + id + '"]');

      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ================================================
     SMOOTH SCROLL – All anchor links
     ================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH   = navbar ? navbar.offsetHeight : 72;
        const top    = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================
     SCROLL REVEAL – Intersection Observer
     ================================================ */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(
      '.service-card, .why-card, .gallery-item, .process-step, .review-card, ' +
      '.about-value, .about-visual, .about-content, .contact-info, .contact-map-panel, ' +
      '.footer-brand, .footer-links-col, .footer-contact-col'
    );

    // Add reveal class
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger delays for grid children
      const parent     = el.parentElement;
      const siblings   = Array.from(parent.children);
      const childIndex = siblings.indexOf(el);
      const delay      = Math.min(childIndex * 0.08, 0.5);
      el.style.transitionDelay = delay + 's';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ================================================
     HERO PARTICLES – Dynamic canvas dots
     ================================================ */
  function createHeroParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const canvas  = document.createElement('canvas');
    const ctx     = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height, particles;
    const PARTICLE_COUNT = 60;
    const COLORS = [
      'rgba(33,150,243,0.4)',
      'rgba(33,150,243,0.2)',
      'rgba(100,181,246,0.3)',
      'rgba(255,255,255,0.1)',
    ];

    function resize() {
      width = canvas.width  = container.offsetWidth  || window.innerWidth;
      height = canvas.height = container.offsetHeight || window.innerHeight;
    }

    function createParticle() {
      return {
        x:    Math.random() * width,
        y:    Math.random() * height,
        r:    Math.random() * 2 + 0.5,
        dx:   (Math.random() - 0.5) * 0.3,
        dy:   -(Math.random() * 0.5 + 0.1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.6 + 0.2,
        life:   Math.random() * 200 + 100,
        age:    0,
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.age = Math.floor(Math.random() * p.life); // stagger start
        particles.push(p);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p, i) {
        p.age++;
        if (p.age > p.life) {
          particles[i] = createParticle();
          return;
        }

        const progress = p.age / p.life;
        const fade     = progress < 0.1
          ? progress / 0.1
          : progress > 0.8
            ? 1 - (progress - 0.8) / 0.2
            : 1;

        ctx.save();
        ctx.globalAlpha = p.opacity * fade;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.dx;
        p.y += p.dy;

        // Wrap
        if (p.x < 0)      p.x = width;
        if (p.x > width)  p.x = 0;
        if (p.y < -10)    p.y = height + 10;
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', function () {
      resize();
      initParticles();
    }, { passive: true });

    resize();
    initParticles();
    draw();
  }

  /* ================================================
     GALLERY – Lazy Loading (IntersectionObserver)
     ================================================ */
  function initLazyGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
    if (!galleryItems.length) return;

    const imgObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el  = entry.target;
            const src = el.getAttribute('data-src');
            if (src) {
              const img    = document.createElement('img');
              img.src      = src;
              img.alt      = el.getAttribute('data-alt') || 'Car Care gallery image';
              img.loading  = 'lazy';
              img.decoding = 'async';
              img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;';
              img.onload = function () {
                const placeholder = el.querySelector('.gallery-placeholder');
                if (placeholder) placeholder.style.display = 'none';
              };
              el.style.position = 'relative';
              el.insertBefore(img, el.firstChild);
            }
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '200px' }
    );

    galleryItems.forEach(function (item) {
      imgObserver.observe(item);
    });
  }

  /* ================================================
     PROCESS – Animated counter / step highlight
     ================================================ */
  function initProcessAnimations() {
    const steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    const stepObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const steps = entry.target.parentElement.querySelectorAll('.process-step');
            steps.forEach(function (step, i) {
              setTimeout(function () {
                step.classList.add('revealed');
                const icon = step.querySelector('.step-icon');
                if (icon) {
                  icon.style.transition = 'border-color 0.4s, background 0.4s, box-shadow 0.4s';
                  icon.style.borderColor = 'var(--color-blue-bright)';
                  icon.style.background = 'var(--color-blue-faint)';
                  icon.style.boxShadow = '0 0 0 4px var(--color-dark), 0 0 30px rgba(33,150,243,0.25)';
                  setTimeout(function () {
                    icon.style.borderColor = '';
                    icon.style.background  = '';
                    icon.style.boxShadow   = '';
                  }, 800);
                }
              }, i * 150);
            });
            stepObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const track = document.querySelector('.process-track');
    if (track) stepObserver.observe(track);
  }

  /* ================================================
     NUMBER COUNTER – Hero stats
     ================================================ */
  function animateCounter(el, target, suffix, duration) {
    const start     = Date.now();
    const isPercent = suffix === '%';

    function update() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const statNums = document.querySelectorAll('.stat-num');
    const data = [
      { target: 500, suffix: '+' },
      { target: 9,   suffix: ''  },
      { target: 100, suffix: '%' },
    ];

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statNums.forEach(function (el, i) {
            if (data[i]) animateCounter(el, data[i].target, data[i].suffix, 1800);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) obs.observe(heroStats);
  }

  /* ================================================
     KEYBOARD ACCESSIBILITY – Card focus/hover
     ================================================ */
  function initKeyboardCards() {
    document.querySelectorAll('.service-card[tabindex], .gallery-item[tabindex]').forEach(function (card) {
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  /* ================================================
     GALLERY IMAGE UPLOAD SUPPORT
     Drop images into gallery slots
     ================================================ */
  function initGalleryUploadHints() {
    const note = document.querySelector('.gallery-note');
    if (note) {
      // Pulse animation hint
      note.style.animation = 'none';
    }
  }

  /* ================================================
     INIT – Run all on DOMContentLoaded
     ================================================ */
  function init() {
    createHeroParticles();
    initScrollReveal();
    initLazyGallery();
    initProcessAnimations();
    initCounters();
    initKeyboardCards();
    initGalleryUploadHints();

    // Add section labels as reveal targets
    document.querySelectorAll('.section-label, .section-title, .section-desc').forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.1) + 's';
    });

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          sectionObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.section-label, .section-title, .section-desc').forEach(function (el) {
      sectionObserver.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ================================================
     PERFORMANCE – Reduced motion support
     ================================================ */
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) {
    document.documentElement.style.setProperty('--transition-base', '0ms');
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
  }

})();
