/* ============================
   BRANDN AGENCY – ALL SCRIPTS
   ============================ */

(function () {
  'use strict';

  /* ========== GSAP REGISTER ========== */
  gsap.registerPlugin(ScrollTrigger, TextPlugin, Draggable);

  /* ========== LOADER ========== */
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  const countEl = document.getElementById('loaderCount');
  let count = 0;

  const loaderTimer = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) {
      count = 100;
      clearInterval(loaderTimer);
      progress.style.width = '100%';
      countEl.textContent = '100%';
      setTimeout(hideLoader, 400);
    } else {
      progress.style.width = count + '%';
      countEl.textContent = count + '%';
    }
  }, 50);

  function hideLoader() {
    gsap.to(loader, {
      yPercent: -100, duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        animateHero();
        startStatCounters();
      }
    });
  }

  /* ========== HERO CANVAS – PARTICLE FIELD ========== */
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [], animFrameId;
  let W, H, mouse = { x: -9999, y: -9999 };

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.7 ? '#b5ff4d' : 'rgba(255,255,255,0.5)';
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.8;
        this.vx += (dx / dist) * force * 0.3;
        this.vy += (dy / dist) * force * 0.3;
      }
      this.vx *= 0.98; this.vy *= 0.98;
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.15;
          ctx.strokeStyle = '#b5ff4d';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    const count = Math.min(120, Math.floor((W * H) / 12000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animFrameId = requestAnimationFrame(animateCanvas);
  }

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener('resize', () => { initParticles(); });

  initParticles();
  animateCanvas();

  /* ========== HERO TEXT ANIMATION ========== */
  function animateHero() {
    // 1. Sup Title
    gsap.to('.hero-sup-title', { 
      opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.1 
    });
    
    // 2. Main Title Lines (Staggered)
    gsap.to('.hero-title .line', { 
      opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', 
      stagger: 0.15, delay: 0.3 
    });
    
    // 3. Subtext and Actions (Slightly faster entrance)
    gsap.to('.hero-sub', { 
      opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.6 
    });
    gsap.to('.hero-actions', { 
      opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.75 
    });
  }

  /* ========== STAT COUNTERS ========== */
  function startStatCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const text = el.textContent.trim();
      const target = parseFloat(text.replace(/[^0-9.]/g, '')) || 0;
      const suffix = text.replace(/[0-9.]/g, ''); // Keep %, x, etc.
      
      let current = 0;
      const duration = 1500; // 1.5s
      const steps = 60;
      const step = target / steps;
      const intervalTime = duration / steps;
      
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = Math.floor(current) + suffix;
      }, intervalTime);
    });
  }

  /* ========== NAVBAR SCROLL ========== */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    // Hide/show on scroll direction
    if (currentScroll > lastScroll + 5 && currentScroll > 300) {
      gsap.to(navbar, { yPercent: -100, duration: 0.4, ease: 'power2.out' });
    } else if (currentScroll < lastScroll - 5) {
      gsap.to(navbar, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
    }
    lastScroll = currentScroll;
    updateActiveNavLink();
  });

  /* Update active nav link based on scroll position */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < bottom) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }

  /* ========== HAMBURGER / MOBILE MENU ========== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  function toggleMenu(open) {
    menuOpen = open;
    mobileMenu.classList.toggle('open', open);
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  hamburger.addEventListener('click', () => toggleMenu(!menuOpen));
  document.querySelectorAll('.mob-link, .mob-cta').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* ========== PIXEL TRAIL (CURSOR FOLLOW) ========== */
  const cursorCanvas = document.getElementById('cursorCanvas');
  const cctx = cursorCanvas.getContext('2d');
  let cursorPixels = [];
  let cw, ch;

  function resizeCursorCanvas() {
    cw = cursorCanvas.width = window.innerWidth;
    ch = cursorCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCursorCanvas);
  resizeCursorCanvas();

  class CursorPixel {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 4 + 2;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
      this.color = Math.random() > 0.5 ? '#b5ff4d' : '#888';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw() {
      cctx.fillStyle = this.color;
      cctx.globalAlpha = this.life;
      cctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
  }

  document.addEventListener('mousemove', e => {
    for (let i = 0; i < 2; i++) {
      cursorPixels.push(new CursorPixel(e.clientX, e.clientY));
    }
  });

  function animateCursorPixels() {
    cctx.clearRect(0, 0, cw, ch);
    for (let i = cursorPixels.length - 1; i >= 0; i--) {
      const p = cursorPixels[i];
      p.update();
      if (p.life <= 0) {
        cursorPixels.splice(i, 1);
      } else {
        p.draw();
      }
    }
    requestAnimationFrame(animateCursorPixels);
  }
  animateCursorPixels();

  const hoverEls = document.querySelectorAll('a, button, .service-card, .testi-card, .faq-q, .expertise-grid');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ========== SCROLL REVEAL ========== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => revealObserver.observe(el));

    /* Service cards stagger */
    document.querySelectorAll('.service-card').forEach((card, i) => {
      card.style.transitionDelay = (i * 0.08) + 's';
    });
  }
  initScrollReveal();

  /* ========== FAQ ACCORDION ========== */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ========== SMOOTH SCROLL NAV ========== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ========== CONTACT FORM ========== */
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const span = submitBtn.querySelector('span');
    span.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      span.textContent = '✓ Message Sent!';
      submitBtn.style.background = '#4dff9e';
      setTimeout(() => {
        span.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        form.reset();
      }, 3000);
    }, 1500);
  });

  /* ========== GSAP SCROLL ANIMATIONS (Advanced) ========== */

  /* Parallax on hero removed to prevent content shifting down */


  /* Service cards stagger with GSAP */
  gsap.from('.service-card', {
    opacity: 0, y: 60, scale: 0.95,
    stagger: 0.1, duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 80%',
    }
  });

  /* Testimonial cards */
  gsap.from('.testi-card', {
    opacity: 0, y: 50,
    stagger: 0.15, duration: 0.85,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%',
    }
  });

  /* Process steps */
  gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.from(step, {
      opacity: 0, x: -60,
      duration: 0.85, delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: 'top 82%',
      }
    });
  });

  /* About stat cards */
  gsap.from('.about-stat-card', {
    opacity: 0, scale: 0.85, y: 30,
    stagger: 0.1, duration: 0.7,
    ease: 'back.out(1.4)',
    scrollTrigger: {
      trigger: '.about-card-grid',
      start: 'top 80%',
    }
  });

  /* CTA band text */
  gsap.from('.cta-band-inner h2', {
    opacity: 0, y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta-band',
      start: 'top 75%',
    }
  });

  /* Trusted logos */
  gsap.from('.t-logo', {
    opacity: 0, y: 20,
    stagger: 0.1, duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.trusted-logos',
      start: 'top 85%',
    }
  });

  /* FAQ stagger */
  gsap.from('.faq-item', {
    opacity: 0, y: 30,
    stagger: 0.08, duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.faq-list',
      start: 'top 80%',
    }
  });

  /* Footer reveal */
  gsap.from('.footer-top > *', {
    opacity: 0, y: 40,
    stagger: 0.1, duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.footer-top',
      start: 'top 85%',
    }
  });

  /* ========== MAGNETIC BUTTON EFFECT ========== */
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(this, {
        x: x * 0.25, y: y * 0.25,
        duration: 0.4, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(this, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ========== HORIZONTAL SCROLL HINT ========== */
  function updateScrollProgress() {
    const scrolled = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / docH) * 100;
  }
  window.addEventListener('scroll', updateScrollProgress);

  /* ========== SECTION BACKGROUND SHIFT ========== */
  const sections = document.querySelectorAll('section');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.body.style.setProperty('--current-section', entry.target.id || 'default');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ========== PREMIUM GSAP DRAGGABLE SLIDER (EXPERTISE GRID) ========== */
  const slider = document.querySelector('.expertise-grid');
  if (slider && typeof Draggable !== 'undefined') {
    let oneQuarter;
    
    const updateDimensions = () => {
      oneQuarter = slider.scrollWidth / 4;
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const checkLoop = () => {
      if (slider.scrollLeft >= oneQuarter * 3) {
        slider.scrollLeft = oneQuarter;
      } else if (slider.scrollLeft <= 0) {
        slider.scrollLeft = oneQuarter * 2;
      }
    };

    // Create Draggable
    Draggable.create(slider, {
      type: "scrollLeft",
      edgeResistance: 0.5,
      cursor: "grab",
      activeCursor: "grabbing",
      onDrag: checkLoop,
      onThrowUpdate: checkLoop,
      inertia: true, // Requires InertiaPlugin (but works well even without it for basic drag)
      allowContextMenu: true
    });

    // Auto-scroll logic
    let autoScrollSpeed = 0.6;
    let isPaused = false;

    const autoScroll = () => {
      if (!isPaused && !Draggable.get(slider).isDragging && !Draggable.get(slider).isPressed) {
        slider.scrollLeft += autoScrollSpeed;
        checkLoop();
      }
      requestAnimationFrame(autoScroll);
    };

    slider.addEventListener('mouseenter', () => isPaused = true);
    slider.addEventListener('mouseleave', () => isPaused = false);

    window.addEventListener('load', () => {
      updateDimensions();
      slider.scrollLeft = oneQuarter;
      autoScroll();
    });
  }

  console.log('%cBRANDN AGENCY', 'color: #b5ff4d; font-size: 24px; font-weight: 900;');
  console.log('%cBuilt with 🔥 + JS + GSAP', 'color: #888; font-size: 12px;');

})();

// ---- Scroll To Top Logic ----
document.addEventListener('DOMContentLoaded', () => {
  const scrollTop = document.getElementById('scrollTop');
  const progressPath = document.querySelector('.progress-circle path');
  
  if (scrollTop && progressPath) {
    const pathLength = progressPath.getTotalLength();

    progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    progressPath.style.strokeDashoffset = pathLength;

    const updateProgress = () => {
      const scroll = window.pageYOffset;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pathLength - (scroll * pathLength) / height;
      progressPath.style.strokeDashoffset = progress;
      
      if (scroll > 300) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    };

    window.addEventListener('scroll', updateProgress);

    scrollTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Run once to set initial state
    updateProgress();
  }
});
