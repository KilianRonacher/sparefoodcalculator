/**
 * SpareFoodCalculator - UI Module
 * ================================
 * Mobile navigation, modal handlers, theme controls.
 */

// ==================== MOBILE NAV TOGGLE ====================

(function initNavToggle() {
  var navToggle = document.getElementById('nav-toggle');
  var mainNav   = document.getElementById('main-nav');
  var navOverlay = document.getElementById('nav-overlay');

  if (!navToggle || !mainNav) return;

  function openNav() {
    mainNav.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.textContent = '✕';
  }

  function closeNav() {
    mainNav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.textContent = '☰';
  }

  navToggle.addEventListener('click', function() {
    if (mainNav.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  var navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  var navBtns = mainNav.querySelectorAll('button');
  navBtns.forEach(function(btn) {
    if (btn.id !== 'nav-toggle') {
      btn.addEventListener('click', closeNav);
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeNav();
    }
  });
})();

// ==================== MODAL CLOSE HANDLERS ====================

(function initModalClose() {
  var closeBtn = document.getElementById('modal-close');
  var modal    = document.getElementById('modal');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeRecipeModal);
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeRecipeModal();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeRecipeModal();
  });
})();
