(function(){
  // Atualizar ano do copyright dinamicamente
  var copyrightSpan = document.getElementById('copyrightYear');
  if (copyrightSpan) {
    var currentYear = new Date().getFullYear();
    copyrightSpan.innerHTML = '© 2021 - ' + currentYear + ' DJ Morppheus';
  }

  // Navbar scroll effect
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){ nav.classList.toggle('scrolled', window.scrollY > 50); }, {passive:true});

  // Hamburger menu
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');
  var body = document.body;
  hamburger.addEventListener('click', function(){
    var open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    body.style.overflow = open ? 'hidden' : '';
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      body.style.overflow = '';
    });
  });

  // Parallax
  var pEls = [
    {el: document.getElementById('hp'),  speed: 0.32},
    {el: document.getElementById('ap'),  speed: 0.22},
    {el: document.getElementById('pb1'), speed: 0.28},
    {el: document.getElementById('pb2'), speed: 0.28},
  ];
  var tick = false;
  function runParallax(){
    var vh = window.innerHeight;
    pEls.forEach(function(p){
      if(!p.el) return;
      var r = p.el.parentElement.getBoundingClientRect();
      if(r.bottom < -100 || r.top > vh + 100) return;
      var off = (r.top + r.height / 2 - vh / 2) * p.speed;
      p.el.style.transform = 'translate3d(0,' + off + 'px,0)';
    });
    tick = false;
  }
  window.addEventListener('scroll', function(){ if(!tick){ requestAnimationFrame(runParallax); tick = true; } }, {passive:true});
  runParallax();
  window.addEventListener('resize', function(){ runParallax(); });

  // Hero scroll fade
  var heroScroll = document.getElementById('heroScroll');
  var lastScrollTop = 0;
  window.addEventListener('scroll', function(){
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop && st > 50) heroScroll.classList.add('hide');
    else if (st < lastScrollTop) heroScroll.classList.remove('hide');
    lastScrollTop = st <= 0 ? 0 : st;
  }, {passive:true});

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:0.1});
  reveals.forEach(function(el){ io.observe(el); });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var targetId = a.getAttribute('href');
      if(targetId === "#" || targetId === "") return;
      var t = document.querySelector(targetId);
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // ========== STRIP AUTO SCROLL + MANUAL SCROLL ==========
  var stripWrapper = document.querySelector('#strip .strip-wrapper');
  if (stripWrapper) {
    var scrollInterval = null;
    var autoScrollActive = true;
    var scrollSpeed = 1;
    var inactivityTimer = null;
    var userInteracted = false;

    function startAutoScroll() {
      if (scrollInterval) clearInterval(scrollInterval);
      scrollInterval = setInterval(function() {
        if (autoScrollActive && stripWrapper) {
          stripWrapper.scrollLeft += scrollSpeed;
          if (stripWrapper.scrollLeft + stripWrapper.clientWidth >= stripWrapper.scrollWidth) {
            stripWrapper.scrollLeft = 0;
          }
        }
      }, 16);
    }

    function resetInactivityTimer() {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      if (userInteracted) {
        autoScrollActive = false;
        inactivityTimer = setTimeout(function() {
          autoScrollActive = true;
          userInteracted = false;
        }, 3000);
      }
    }

    stripWrapper.addEventListener('scroll', function() { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('mousedown', function() { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('wheel', function() { userInteracted = true; resetInactivityTimer(); });
    stripWrapper.addEventListener('touchstart', function() { userInteracted = true; resetInactivityTimer(); });

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
    stripWrapper.style.cursor = 'grab';
  }

  // Lightbox e download
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbDl = document.getElementById('lb-dl');
  var lbClose = document.getElementById('lb-close');
  document.addEventListener('click', function(e){
    if(e.target.classList.contains('dl-btn')) {
      e.preventDefault(); e.stopPropagation();
      var src = e.target.getAttribute('data-src') || e.target.getAttribute('href');
      if(!src) return;
      var a = document.createElement('a'); a.href = src; a.download = src.split('/').pop(); document.body.appendChild(a); a.click(); document.body.removeChild(a);
      return;
    }
    var item = e.target.closest('.strip-item');
    if(item && !e.target.classList.contains('dl-btn')) {
      var img = item.querySelector('img'); if(!img) return;
      var src = img.getAttribute('src');
      lbImg.setAttribute('src', src);
      lbDl.setAttribute('href', src); lbDl.setAttribute('download', src.split('/').pop());
      lightbox.classList.add('active'); document.body.style.overflow = 'hidden';
    }
  });
  lbClose.addEventListener('click', function(){ lightbox.classList.remove('active'); document.body.style.overflow = ''; });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox){ lightbox.classList.remove('active'); document.body.style.overflow = ''; } });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && lightbox.classList.contains('active')){ lightbox.classList.remove('active'); document.body.style.overflow = ''; } });
  lbDl.addEventListener('click', function(e){ e.preventDefault(); var a = document.createElement('a'); a.href = lbDl.getAttribute('href'); a.download = lbDl.getAttribute('download'); document.body.appendChild(a); a.click(); document.body.removeChild(a); });

  // ========== BOTÃO FLUTUANTE "VOLTAR AO TOPO" ==========
  var backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();