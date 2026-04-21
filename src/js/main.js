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
    initWindowDemo();
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

    toggle.addEventListener('click', function () {
      isOpen = !isOpen;
      toggle.setAttribute('aria-expanded', isOpen);
      menu.setAttribute('aria-hidden', !isOpen);

      if (isOpen) {
        toggle.classList.add('menu-open');
        menu.classList.add('open');
      } else {
        toggle.classList.remove('menu-open');
        menu.classList.remove('open');
      }
    });

    // Close on nav link click
    var mobileLinks = menu.querySelectorAll('a[href^="#"]');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        isOpen = false;
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('menu-open');
        menu.classList.remove('open');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('menu-open');
        menu.classList.remove('open');
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

    function closeAll() {
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

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var panelId = trigger.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (!panel) return;

        if (openPanel === panel) {
          closeAll();
          return;
        }

        closeAll();
        panel.classList.remove('hidden');
        // Force reflow so the transition plays
        panel.offsetHeight;
        panel.classList.add('open');
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        openPanel = panel;
      });
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

  // ─── Double Hung Window Interactive Demo ───
  function initWindowDemo() {
    var demo = document.getElementById('dh-demo');
    if (!demo) return;

    var upper = document.getElementById('dh-upper');
    var lower = document.getElementById('dh-lower');
    var frame = lower.parentElement;
    var tiltShadow = document.getElementById('dh-tilt-shadow');
    var breezeBot = document.getElementById('dh-breeze-bot');
    var breezeTop = document.getElementById('dh-breeze-top');
    var label = document.getElementById('dh-label');
    var labelNum = document.getElementById('dh-label-num');
    var labelDesc = document.getElementById('dh-label-desc');
    var tabs = demo.querySelectorAll('.dh-tab');

    var phases = [
      {
        num: '1',
        desc: 'Bottom sash opens for fresh air',
        lower: 'dh-open',
        upper: '',
        breezeBot: true,
        breezeTop: false
      },
      {
        num: '2',
        desc: 'Top sash releases warm air',
        lower: '',
        upper: 'dh-open',
        breezeBot: false,
        breezeTop: true
      },
      {
        num: '3',
        desc: 'Both open for maximum airflow',
        lower: 'dh-open',
        upper: 'dh-open',
        breezeBot: true,
        breezeTop: true
      },
      {
        num: '4',
        desc: 'Tilts in for easy cleaning',
        lower: 'dh-tilt',
        upper: '',
        breezeBot: false,
        breezeTop: false
      }
    ];

    var current = 0;
    var timer = null;
    var PHASE_DURATION = 5000; // 5 seconds per phase

    function setPhase(index) {
      current = index;
      var phase = phases[index];

      // Reset sash classes
      lower.className = 'dh-sash dh-sash-lower';
      upper.className = 'dh-sash dh-sash-upper';
      frame.classList.remove('dh-frame-tilt');
      tiltShadow.classList.remove('dh-visible');

      // Apply after a frame so transitions fire
      requestAnimationFrame(function () {
        if (phase.lower) lower.classList.add(phase.lower);
        if (phase.upper) upper.classList.add(phase.upper);
        // Enable perspective on frame for tilt phase
        if (phase.lower === 'dh-tilt') {
          frame.classList.add('dh-frame-tilt');
          tiltShadow.classList.add('dh-visible');
        }
      });

      // Breeze
      if (phase.breezeBot) {
        breezeBot.classList.add('dh-visible');
      } else {
        breezeBot.classList.remove('dh-visible');
      }
      if (phase.breezeTop) {
        breezeTop.classList.add('dh-visible');
      } else {
        breezeTop.classList.remove('dh-visible');
      }

      // Label
      labelNum.textContent = phase.num;
      labelDesc.textContent = phase.desc;
      // Quick hide then show for transition
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
          // Reset and restart progress bar animation
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
        setPhase((current + 1) % phases.length);
      }, PHASE_DURATION);
    }

    // Tab click handlers
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var phaseIndex = parseInt(tab.getAttribute('data-phase'), 10);
        setPhase(phaseIndex);
        startAutoplay(); // Reset timer on manual interaction
      });
    });

    // Start
    setPhase(0);
    startAutoplay();

    // Pause on hover for desktop users who want to inspect
    demo.addEventListener('mouseenter', function () {
      clearInterval(timer);
    });
    demo.addEventListener('mouseleave', function () {
      startAutoplay();
    });
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
        history.pushState(null, null, targetId);
      });
    });
  }

  // ─── Quote Form Submission ───
  function initQuoteForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;

    var submitBtn = document.getElementById('quote-submit');
    var submitText = document.getElementById('submit-text');
    var submitIcon = document.getElementById('submit-icon');
    var submitSpinner = document.getElementById('submit-spinner');
    var successMsg = document.getElementById('form-success');
    var errorMsg = document.getElementById('form-error');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Gather form data
      var formData = {
        name: form.querySelector('#quote-name').value.trim(),
        phone: form.querySelector('#quote-phone').value.trim(),
        email: form.querySelector('#quote-email').value.trim(),
        message: form.querySelector('#quote-message').value.trim(),
      };

      // Basic validation
      if (!formData.name || !formData.phone || !formData.email) {
        return;
      }

      // Show loading state
      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';
      submitIcon.classList.add('hidden');
      submitSpinner.classList.remove('hidden');
      successMsg.classList.add('hidden');
      errorMsg.classList.add('hidden');

      // ── API CALL ──
      // Replace this URL with your actual API endpoint
      var API_URL = '/api/quote';

      fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          return response.json();
        })
        .then(function () {
          // Success
          form.reset();
          successMsg.classList.remove('hidden');
          submitBtn.disabled = false;
          submitText.textContent = 'Get Your Free Quote';
          submitIcon.classList.remove('hidden');
          submitSpinner.classList.add('hidden');
        })
        .catch(function () {
          // Error
          errorMsg.classList.remove('hidden');
          submitBtn.disabled = false;
          submitText.textContent = 'Get Your Free Quote';
          submitIcon.classList.remove('hidden');
          submitSpinner.classList.add('hidden');
        });
    });
  }
})();
