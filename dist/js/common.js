// Shared behaviour for every page: dark mode, active nav link, small helpers.
// Loaded before each page's own js/<page>.js file.
(function () {
  var root = document.documentElement;
  var KEY = 'hs-theme';

  function readTheme() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function saveTheme(t) {
    try { localStorage.setItem(KEY, t); } catch (e) { /* storage blocked: keep it for this page only */ }
  }
  function isDark() {
    var explicit = root.getAttribute('data-theme');
    if (explicit) return explicit === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  var saved = readTheme();
  if (saved) root.setAttribute('data-theme', saved);

  var toggle = document.getElementById('theme-toggle');
  var moonIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.2 15.4A8.7 8.7 0 0 1 8.6 3.8 8.8 8.8 0 1 0 20.2 15.4Z"/></svg>';
  var sunIcon = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function paintToggle() {
    if (toggle) {
      toggle.innerHTML = isDark() ? sunIcon : moonIcon;
      toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }
  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      saveTheme(next);
      paintToggle();
    });
  }

  var menuToggle = document.getElementById('menu-toggle');
  var primaryNav = document.getElementById('primary-nav');
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      menuToggle.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    });
    primaryNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        primaryNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
        menuToggle.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      }
    });
  }

  var page = document.body.getAttribute('data-page');
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });

  var footerGroups = document.querySelectorAll('.footer-group');
  if (footerGroups.length) {
    function syncFooterGroups() {
      var desktop = window.matchMedia('(min-width: 1024px)').matches;
      footerGroups.forEach(function (group) { group.open = desktop; });
    }
    syncFooterGroups();
    window.addEventListener('resize', syncFooterGroups);
  }

  window.HS = {
    validUsername: function (u) { return /^[A-Za-z0-9._]{1,30}$/.test(u); },
    cleanUsername: function (u) { return (u || '').trim().replace(/^@/, ''); },
    setMsg: function (el, msg, isError) {
      if (!el) return;
      el.textContent = msg || '';
      el.className = 'result' + (isError ? ' error' : '');
    }
  };
})();
