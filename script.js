(function() {
  "use strict";

  // Atualizar ano do copyright dinamicamente
  const copyrightSpan = document.getElementById('copyrightYear');
  if (copyrightSpan) {
    const currentYear = new Date().getFullYear();
    copyrightSpan.innerHTML = `© 2021 - ${currentYear} DJ Morppheus`;
  }

  // Navbar scroll effect
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const body = document.body;

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        body.style.overflow = '';
      });
    });
  }

  // Parallax Effect
  const pEls = [
    { el: document.getElementById('hp'), speed: 0.32 },
    { el: document.getElementById('ap'), speed: 0.22 },
    { el: document.getElementById('pb1'), speed: 0.28 },
    { el: document.getElementById('pb2'), speed: 0.28 },
  ];

  let tick = false;
  const runParallax = () => {
    const vh = window.innerHeight;
    pEls.forEach(p => {
      if (!p.el) return;
      const r = p.el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const off = (r.top + r.height / 2 - vh / 2) * p.speed;
      p.el.style.transform = `translate3d(0, ${off}px, 0)`;
    });
    tick = false;
  };

  window.addEventListener('scroll', () => {
    if (!tick) {
      requestAnimationFrame(runParallax);
      tick = true;
    }
  }, { passive: true });

  runParallax();
  window.addEventListener('resize', runParallax);

  // Hero scroll fade
  const heroScroll = document.getElementById('heroScroll');
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    if (!heroScroll) return;
    const st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 50) heroScroll.classList.add('hide');
    else if (st < lastScrollTop) heroScroll.classList.remove('hide');
    lastScrollTop = st <= 0 ? 0 : st;
  }, { passive: true });

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => io.observe(el));

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId === "#" || targetId === "") return;
      const t = document.querySelector(targetId);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ========== STRIP AUTO SCROLL + MANUAL SCROLL ==========
  const stripWrapper = document.querySelector('#strip .strip-wrapper');
  if (stripWrapper) {
    let scrollInterval = null;
    let autoScrollActive = true;
    const scrollSpeed = 1;
    let inactivityTimer = null;
    let userInteracted = false;

    const startAutoScroll = () => {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = setInterval(() => {
        if (autoScrollActive && stripWrapper) {
          stripWrapper.scrollLeft += scrollSpeed;
          if (stripWrapper.scrollLeft + stripWrapper.clientWidth >= stripWrapper.scrollWidth) {
            stripWrapper.scrollLeft = 0;
          }
        }
      }, 16);
    };

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (userInteracted) {
        autoScrollActive = false;
        inactivityTimer = setTimeout(() => {
          autoScrollActive = true;
          userInteracted = false;
        }, 3000);
      }
    };

    stripWrapper.addEventListener('scroll', () => { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('mousedown', () => { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('wheel', () => { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('touchstart', () => { userInteracted = true; resetInactivityTimer(); });

    startAutoScroll();

    let isDragging = false;
    let startX;
    let scrollLeftStart;

    stripWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - stripWrapper.offsetLeft;
      scrollLeftStart = stripWrapper.scrollLeft;
      stripWrapper.style.cursor = 'grabbing';
      e.preventDefault();
    });

    stripWrapper.addEventListener('mouseleave', () => {
      isDragging = false;
      stripWrapper.style.cursor = 'grab';
    });

    stripWrapper.addEventListener('mouseup', () => {
      isDragging = false;
      stripWrapper.style.cursor = 'grab';
    });

    stripWrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - stripWrapper.offsetLeft;
      const walk = (x - startX) * 1.5;
      stripWrapper.scrollLeft = scrollLeftStart - walk;
    });
  }

  // Lightbox e download
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbDl = document.getElementById('lb-dl');
  const lbClose = document.getElementById('lb-close');

  if (lightbox && lbImg && lbDl && lbClose) {
    document.addEventListener('click', (e) => {
      // Download button in strip overlay
      if (e.target.classList.contains('dl-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const src = e.target.getAttribute('data-src') || e.target.getAttribute('href');
        if (!src) return;
        const a = document.createElement('a');
        a.href = src;
        a.download = src.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      // Open Lightbox
      const item = e.target.closest('.strip-item');
      if (item && !e.target.classList.contains('dl-btn')) {
        const img = item.querySelector('img');
        if (!img) return;
        const src = img.getAttribute('src');
        // Usar a versão HD (original) no lightbox
        const hdSrc = src.replace('-thumb.jpg', '.jpg');
        lbImg.setAttribute('src', hdSrc);
        lbDl.setAttribute('href', hdSrc);
        lbDl.setAttribute('download', hdSrc.split('/').pop());
        lightbox.classList.add('active');
        body.style.overflow = 'hidden';
      }
    });

    lbClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        body.style.overflow = '';
      }
    });

    lbDl.addEventListener('click', (e) => {
      e.preventDefault();
      const a = document.createElement('a');
      a.href = lbDl.getAttribute('href');
      a.download = lbDl.getAttribute('download');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  // ========== BOTÃO FLUTUANTE "VOLTAR AO TOPO" ==========
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
