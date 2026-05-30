(function () {
  'use strict';

  var STORAGE_KEY = 'dusk-theme';
  var html = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var label = btn ? btn.querySelector('.theme-label') : null;

  function getEffectiveTheme() {
    var stored = html.getAttribute('data-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButton(theme);
  }

  function updateButton(theme) {
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (label) label.textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  // Sync button state on load
  updateButton(getEffectiveTheme());

  if (btn) {
    btn.addEventListener('click', function () {
      var current = getEffectiveTheme();
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // Respond to OS-level changes when no manual preference is set
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      updateButton(e.matches ? 'dark' : 'light');
    }
  });
}());
