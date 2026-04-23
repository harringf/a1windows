/* ═══════════════════════════════════════════
   A1 WINDOWS — Main JavaScript
   Handles: mobile menu, scroll effects,
   reveal animations, and quote form.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Initialize Lucide Icons ───
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    initNavbar();
    initMobileMenu();
    initMegaMenu();
    initMobileAccordions();
    initScrollReveal();
    initSmoothScroll();
    initQuoteForm();
    initQuoteModal();
    initWindowDemo();
    initCasementDemo();
    initSliderDemo();
    initAwningDemo();
    initScrollVideo();
  });

  // ─── Navbar Scroll Shadow ───
  function initNavbar() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;

    var scrollThreshold = 20;

    function handleScroll() {
      if (window.scrollY > scrollThreshold) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  // ─── Mobile Menu Toggle ───
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    var isOpen = false;

    function closeMenu() {
      isOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      toggle.classList.remove('menu-open');
      menu.classList.remove('open');
    }

    toggle.addEventListener('click', function () {
      if (isOpen) {
        closeMenu();
      } else {
        isOpen = true;
        toggle.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        toggle.classList.add('menu-open');
        menu.classList.add('open');
      }
    });

    // Close on nav link click
    var mobileLinks = menu.querySelectorAll('a[href^="#"]');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ─── Mega Menu (Desktop) ───
  function initMegaMenu() {
    var triggers = document.querySelectorAll('.mega-trigger');
    var panels = document.querySelectorAll('.mega-panel');
    if (!triggers.length) return;

    var openPanel = null;
    var closeTimer = null;
    var CLOSE_DELAY = 200; // ms grace period for mouse travel between trigger and panel

    function closeAll() {
      clearTimeout(closeTimer);
      panels.forEach(function (p) {
        p.classList.add('hidden');
        p.classList.remove('open');
      });
      triggers.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-expanded', 'false');
      });
      openPanel = null;
    }

    function openPanelFor(trigger) {
      var panelId = trigger.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (!panel) return;
      if (openPanel === panel) return;

      clearTimeout(closeTimer);
      closeAll();
      panel.classList.remove('hidden');
      panel.offsetHeight; // force reflow so the transition plays
      panel.classList.add('open');
      trigger.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      openPanel = panel;
    }

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeAll, CLOSE_DELAY);
    }

    function cancelClose() {
      clearTimeout(closeTimer);
    }

    triggers.forEach(function (trigger) {
      // Click toggles open/closed
      trigger.addEventListener('click', function () {
        var panelId = trigger.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (!panel) return;

        if (openPanel === panel) {
          closeAll();
        } else {
          openPanelFor(trigger);
        }
      });

      // Hover opens (desktop only — touch devices fire click instead)
      trigger.addEventListener('mouseenter', function () {
        openPanelFor(trigger);
      });

      trigger.addEventListener('mouseleave', scheduleClose);
    });

    // Keep panel open while mouse is inside it, close when leaving
    panels.forEach(function (panel) {
      panel.addEventListener('mouseenter', cancelClose);
      panel.addEventListener('mouseleave', scheduleClose);
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!openPanel) return;
      var isInsidePanel = openPanel.contains(e.target);
      var isInsideTrigger = false;
      triggers.forEach(function (t) {
        if (t.contains(e.target)) isInsideTrigger = true;
      });
      if (!isInsidePanel && !isInsideTrigger) {
        closeAll();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && openPanel) {
        closeAll();
      }
    });

    // Re-initialize Lucide icons inside mega panels
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // ─── Mobile Accordions ───
  function initMobileAccordions() {
    var accBtns = document.querySelectorAll('.mobile-acc-btn');
    accBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var body = btn.nextElementSibling;
        var chevron = btn.querySelector('.acc-chevron');
        var isOpen = body.classList.contains('open');

        if (isOpen) {
          body.classList.remove('open');
          chevron.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          body.classList.add('open');
          chevron.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ─── Shared Window Demo Engine ───
  // All window demos share the same autoplay, tab, and label logic.
  // Each demo provides a config with its phase data and an applyPhase callback.
  function createWindowDemo(config) {
    var demo = document.getElementById(config.demoId);
    if (!demo) return;

    var label = document.getElementById(config.labelId);
    var labelNum = document.getElementById(config.labelNumId);
    var labelDesc = document.getElementById(config.labelDescId);
    var tabs = demo.querySelectorAll('.dh-tab');

    var current = 0;
    var timer = null;
    var PHASE_DURATION = 5000;

    function setPhase(index) {
      current = index;
      var phase = config.phases[index];

      config.applyPhase(phase);

      // Label
      labelNum.textContent = phase.num;
      labelDesc.textContent = phase.desc;
      label.classList.remove('dh-visible');
      setTimeout(function () {
        label.classList.add('dh-visible');
      }, 150);

      // Tabs
      tabs.forEach(function (tab, i) {
        var bar = tab.querySelector('.dh-tab-bar');
        if (i === index) {
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          bar.style.animation = 'none';
          bar.offsetHeight; // force reflow
          bar.style.animation = '';
        } else {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
          bar.style.animation = 'none';
          bar.style.width = '0%';
        }
      });
    }

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(function () {
        setPhase((current + 1) % config.phases.length);
      }, PHASE_DURATION);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var phaseIndex = parseInt(tab.getAttribute(config.phaseAttr), 10);
        setPhase(phaseIndex);
        startAutoplay();
      });
    });

    setPhase(0);
    startAutoplay();

    demo.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    demo.addEventListener('mouseleave', function () {
      startAutoplay();
    });
  }

  // ─── Double Hung Window Interactive Demo ───
  function initWindowDemo() {
    var upper = document.getElementById('dh-upper');
    var lower = document.getElementById('dh-lower');
    if (!lower) return;
    var frame = lower.parentElement;
    var tiltShadow = document.getElementById('dh-tilt-shadow');
    var breezeBot = document.getElementById('dh-breeze-bot');
    var breezeTop = document.getElementById('dh-breeze-top');

    createWindowDemo({
      demoId: 'dh-demo',
      labelId: 'dh-label',
      labelNumId: 'dh-label-num',
      labelDescId: 'dh-label-desc',
      phaseAttr: 'data-phase',
      phases: [
        { num: '1', desc: 'Bottom sash opens for fresh air', lower: 'dh-open', upper: '', breezeBot: true, breezeTop: false },
        { num: '2', desc: 'Top sash releases warm air', lower: '', upper: 'dh-open', breezeBot: false, breezeTop: true },
        { num: '3', desc: 'Both open for maximum airflow', lower: 'dh-open', upper: 'dh-open', breezeBot: true, breezeTop: true },
        { num: '4', desc: 'Tilts in for easy cleaning', lower: 'dh-tilt', upper: '', breezeBot: false, breezeTop: false }
      ],
      applyPhase: function (phase) {
        lower.className = 'dh-sash dh-sash-lower';
        upper.className = 'dh-sash dh-sash-upper';
        frame.classList.remove('dh-frame-tilt');
        tiltShadow.classList.remove('dh-visible');

        requestAnimationFrame(function () {
          if (phase.lower) lower.classList.add(phase.lower);
          if (phase.upper) upper.classList.add(phase.upper);
          if (phase.lower === 'dh-tilt') {
            frame.classList.add('dh-frame-tilt');
            tiltShadow.classList.add('dh-visible');
          }
        });

        breezeBot.classList.toggle('dh-visible', phase.breezeBot);
        breezeTop.classList.toggle('dh-visible', phase.breezeTop);
      }
    });
  }

  // ─── Casement Window Interactive Demo ───
  function initCasementDemo() {
    var left = document.getElementById('cm-left');
    var right = document.getElementById('cm-right');
    var breezeLeft = document.getElementById('cm-breeze-left');
    var breezeRight = document.getElementById('cm-breeze-right');

    createWindowDemo({
      demoId: 'cm-demo',
      labelId: 'cm-label',
      labelNumId: 'cm-label-num',
      labelDescId: 'cm-label-desc',
      phaseAttr: 'data-cm-phase',
      phases: [
        { num: '1', desc: 'Window sealed tight', left: false, right: false, breezeL: false, breezeR: false },
        { num: '2', desc: 'Left panel cranks open', left: true, right: false, breezeL: true, breezeR: false },
        { num: '3', desc: 'Right panel cranks open', left: false, right: true, breezeL: false, breezeR: true },
        { num: '4', desc: 'Both panels open for max airflow', left: true, right: true, breezeL: true, breezeR: true }
      ],
      applyPhase: function (phase) {
        left.classList.toggle('cm-open', phase.left);
        right.classList.toggle('cm-open', phase.right);
        breezeLeft.classList.toggle('cm-visible', phase.breezeL);
        breezeRight.classList.toggle('cm-visible', phase.breezeR);
      }
    });
  }

  // ─── Slider Window Interactive Demo ───
  function initSliderDemo() {
    var left = document.getElementById('sl-left');
    var right = document.getElementById('sl-right');
    var breezeLeft = document.getElementById('sl-breeze-left');
    var breezeRight = document.getElementById('sl-breeze-right');

    createWindowDemo({
      demoId: 'sl-demo',
      labelId: 'sl-label',
      labelNumId: 'sl-label-num',
      labelDescId: 'sl-label-desc',
      phaseAttr: 'data-sl-phase',
      phases: [
        { num: '1', desc: 'Window closed', leftClass: '', rightClass: '', breezeL: false, breezeR: false },
        { num: '2', desc: 'Right panel slides left to open', leftClass: '', rightClass: 'sl-open-left', breezeL: false, breezeR: true },
        { num: '3', desc: 'Left panel slides right to open', leftClass: 'sl-open-right', rightClass: '', breezeL: true, breezeR: false },
        { num: '4', desc: 'Both panels slide open for max airflow', leftClass: 'sl-open-right', rightClass: 'sl-open-left', breezeL: true, breezeR: true }
      ],
      applyPhase: function (phase) {
        left.classList.remove('sl-open-right');
        right.classList.remove('sl-open-left');

        requestAnimationFrame(function () {
          if (phase.leftClass) left.classList.add(phase.leftClass);
          if (phase.rightClass) right.classList.add(phase.rightClass);
        });

        breezeLeft.classList.toggle('cm-visible', phase.breezeL);
        breezeRight.classList.toggle('cm-visible', phase.breezeR);
      }
    });
  }

  // ─── Awning Window Interactive Demo ───
  function initAwningDemo() {
    var sash = document.getElementById('aw-sash');
    var breeze = document.getElementById('aw-breeze');
    var rain = document.getElementById('aw-rain');

    createWindowDemo({
      demoId: 'aw-demo',
      labelId: 'aw-label',
      labelNumId: 'aw-label-num',
      labelDescId: 'aw-label-desc',
      phaseAttr: 'data-aw-phase',
      phases: [
        { num: '1', desc: 'Window sealed tight', sashClass: '', breeze: false, rain: false },
        { num: '2', desc: 'Partially open for gentle airflow', sashClass: 'aw-partial', breeze: true, rain: false },
        { num: '3', desc: 'Fully open for maximum ventilation', sashClass: 'aw-full', breeze: true, rain: false },
        { num: '4', desc: 'Stays open in rain — glass deflects water', sashClass: 'aw-full', breeze: true, rain: true }
      ],
      applyPhase: function (phase) {
        sash.classList.remove('aw-partial', 'aw-full');

        requestAnimationFrame(function () {
          if (phase.sashClass) sash.classList.add(phase.sashClass);
        });

        breeze.classList.toggle('aw-visible', phase.breeze);
        rain.classList.toggle('aw-visible', phase.rain);
      }
    });
  }

  // ─── Scroll-Driven Video Scrubbing ───
  function initScrollVideo() {
    var section = document.getElementById('scrub-video-section');
    var video = document.getElementById('scrub-video');
    if (!section || !video) return;

    var progressBar = document.getElementById('scrub-progress-bar');
    var hint = document.getElementById('scrub-hint');
    var slides = section.querySelectorAll('.scrub-slide');
    var isReady = false;
    var ticking = false;
    var lastProgress = -1;

    // Wait for video metadata
    video.addEventListener('loadedmetadata', function () {
      isReady = true;
      video.currentTime = 0;
    });

    // Force load on iOS
    video.load();

    function update() {
      ticking = false;
      if (!isReady) return;

      var rect = section.getBoundingClientRect();
      var sectionHeight = section.offsetHeight;
      var viewportHeight = window.innerHeight;

      var scrolled = -rect.top;
      var scrollRange = sectionHeight - viewportHeight;
      var progress = Math.max(0, Math.min(1, scrolled / scrollRange));

      // Only seek if progress actually changed (avoid redundant seeks)
      var rounded = Math.round(progress * 1000) / 1000;
      if (rounded === lastProgress) return;
      lastProgress = rounded;

      // Map to video time
      var targetTime = progress * video.duration;
      if (isFinite(targetTime)) {
        video.currentTime = targetTime;
      }

      // Progress bar
      if (progressBar) {
        progressBar.style.width = (progress * 100) + '%';
      }

      // Show/hide content slides based on scroll position
      slides.forEach(function (slide) {
        var inAt = parseFloat(slide.getAttribute('data-scrub-in'));
        var outAt = parseFloat(slide.getAttribute('data-scrub-out'));
        if (progress >= inAt && progress <= outAt) {
          slide.classList.add('scrub-active');
        } else {
          slide.classList.remove('scrub-active');
        }
      });

      // Scroll hint
      if (hint) {
        hint.style.opacity = progress < 0.05 ? 1 : 0;
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // ─── Scroll Reveal Animations ───
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal-up');
    if (!elements.length) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── Smooth Scroll for Anchor Links ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navbarHeight = document.getElementById('navbar')
          ? document.getElementById('navbar').offsetHeight
          : 0;

        var targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Update URL without jumping
        history.pushState(null, '', targetId);
      });
    });
  }

  // ─── Shared Quote Form Submission ───
  function submitQuoteForm(form, els) {
    var formData = {
      name: form.querySelector(els.nameId).value.trim(),
      phone: form.querySelector(els.phoneId).value.trim(),
      email: form.querySelector(els.emailId).value.trim(),
      message: form.querySelector(els.messageId).value.trim()
    };

    if (!formData.name || !formData.phone || !formData.email) return;

    els.submitBtn.disabled = true;
    els.submitText.textContent = 'Sending...';
    els.submitIcon.classList.add('hidden');
    els.spinner.classList.remove('hidden');
    els.errorEl.classList.add('hidden');

    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed');
        return response.json();
      })
      .then(function () {
        if (els.onSuccess) {
          els.onSuccess();
        } else {
          form.reset();
          els.successEl.classList.remove('hidden');
          resetSubmitButton(els);
        }
      })
      .catch(function () {
        els.errorEl.classList.remove('hidden');
        resetSubmitButton(els);
      });
  }

  function resetSubmitButton(els) {
    els.submitBtn.disabled = false;
    els.submitText.textContent = 'Get Your Free Quote';
    els.submitIcon.classList.remove('hidden');
    els.spinner.classList.add('hidden');
  }

  // ─── Quote Modal (Drawer / Bottom Sheet) ───
  function initQuoteModal() {
    var backdrop = document.getElementById('quote-backdrop');
    var drawer = document.getElementById('quote-drawer');
    var closeBtn = document.getElementById('quote-close');
    var form = document.getElementById('quote-modal-form');
    var messageField = document.getElementById('qm-message');
    var submitBtn = document.getElementById('qm-submit');
    var submitText = document.getElementById('qm-submit-text');
    var submitIcon = document.getElementById('qm-submit-icon');
    var spinner = document.getElementById('qm-spinner');
    var successEl = document.getElementById('qm-success');
    var errorEl = document.getElementById('qm-error');

    if (!drawer) return;

    var isOpen = false;
    var autoCloseTimer = null;

    function openModal(context) {
      isOpen = true;
      backdrop.classList.add('open');
      drawer.classList.add('open');
      backdrop.setAttribute('aria-hidden', 'false');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('quote-open');

      if (context && messageField && !messageField.value.trim()) {
        messageField.value = 'Interested in: ' + context;
      }

      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      setTimeout(function () {
        var firstInput = form.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 400);
    }

    function closeModal() {
      isOpen = false;
      backdrop.classList.remove('open');
      drawer.classList.remove('open');
      backdrop.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('quote-open');

      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
      }

      setTimeout(function () {
        form.reset();
        form.classList.remove('hidden');
        successEl.classList.add('hidden');
        errorEl.classList.add('hidden');
        resetSubmitButton({ submitBtn: submitBtn, submitText: submitText, submitIcon: submitIcon, spinner: spinner });
      }, 400);
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href="/#quote"], a[href="#quote"], [data-open-quote]');
      if (!link) return;

      e.preventDefault();

      var context = link.getAttribute('data-quote-context') || '';
      if (!context) {
        var h1 = document.querySelector('h1');
        var isProductPage = window.location.pathname.indexOf('/windows/') !== -1 ||
                            window.location.pathname.indexOf('/doors/') !== -1;
        if (isProductPage && h1) {
          context = h1.textContent.replace(/\s+/g, ' ').trim();
        }
      }

      openModal(context);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitQuoteForm(form, {
        nameId: '#qm-name',
        phoneId: '#qm-phone',
        emailId: '#qm-email',
        messageId: '#qm-message',
        submitBtn: submitBtn,
        submitText: submitText,
        submitIcon: submitIcon,
        spinner: spinner,
        successEl: successEl,
        errorEl: errorEl,
        onSuccess: function () {
          form.classList.add('hidden');
          successEl.classList.remove('hidden');

          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }

          autoCloseTimer = setTimeout(closeModal, 4000);
        }
      });
    });

    // Mobile: swipe down to dismiss
    var startY = 0;
    var currentY = 0;
    var isDragging = false;

    drawer.addEventListener('touchstart', function (e) {
      var touch = e.touches[0];
      var rect = drawer.getBoundingClientRect();
      if (touch.clientY - rect.top < 60) {
        isDragging = true;
        startY = touch.clientY;
        currentY = startY;
        drawer.style.transition = 'none';
      }
    }, { passive: true });

    drawer.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      var diff = currentY - startY;
      if (diff > 0) {
        drawer.style.transform = 'translateY(' + diff + 'px)';
      }
    }, { passive: true });

    drawer.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      drawer.style.transition = '';
      var diff = currentY - startY;
      if (diff > 100) {
        closeModal();
      } else {
        drawer.style.transform = '';
        if (isOpen) drawer.classList.add('open');
      }
    });
  }

  // ─── Quote Form Submission (inline form on homepage) ───
  function initQuoteForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var els = {
      nameId: '#quote-name',
      phoneId: '#quote-phone',
      emailId: '#quote-email',
      messageId: '#quote-message',
      submitBtn: document.getElementById('quote-submit'),
      submitText: document.getElementById('submit-text'),
      submitIcon: document.getElementById('submit-icon'),
      spinner: document.getElementById('submit-spinner'),
      successEl: document.getElementById('form-success'),
      errorEl: document.getElementById('form-error')
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      els.successEl.classList.add('hidden');
      submitQuoteForm(form, els);
    });
  }
})();
