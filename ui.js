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
    // Reason: the categories button opens a menu inside the nav, so it must not close the nav.
    if (btn.id !== 'nav-toggle' && btn.id !== 'categories-btn') {
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

  // Reason: ui.js loads on every page, but closeRecipeModal is defined in
  // recipes.js which only loads on pages that have a recipe modal. Guard
  // every call so unrelated pages don't throw ReferenceError on Escape.
  function safeClose() {
    if (typeof closeRecipeModal !== 'undefined') {
      closeRecipeModal();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', safeClose);
  }

  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) safeClose();
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') safeClose();
  });
})();

// ==================== CATEGORIES MENU (category pages) ====================

(function initCategoriesMenu() {
  var button = document.getElementById('categories-btn');
  var menu   = document.getElementById('categories-menu');
  if (!button || !menu) return;

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }

  button.addEventListener('click', function(e) {
    e.stopPropagation();
    setOpen(menu.hidden);
  });
  document.addEventListener('click', function(e) {
    if (!menu.hidden && !menu.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !menu.hidden) { setOpen(false); button.focus(); }
  });
})();
