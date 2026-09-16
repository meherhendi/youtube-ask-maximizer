/*
 * Adds a "maximize" toggle to YouTube's "Ask about this video" engagement panel
 * so it can span the full width of the browser window, with larger text.
 */
(function () {
  'use strict';

  const PANEL_SELECTOR = 'ytd-engagement-panel-section-list-renderer';
  const BTN_CLASS = 'ytmax-btn';
  const MAX_CLASS = 'ytmax-panel--max';

  const ICON_MAX =
    '<svg viewBox="0 0 24 24"><path d="M3 5h8v2H5v10h14v-4h2v6H3V5zm12-2h6v6h-2V6.41l-7.29 7.3-1.42-1.42L17.59 5H15V3z"/></svg>';
  const ICON_MIN =
    '<svg viewBox="0 0 24 24"><path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm3 2h8v2H8V9z"/></svg>';

  // YouTube mixes light DOM and open shadow roots, so walk both.
  function deepQueryAll(selector, root, out) {
    root = root || document;
    out = out || [];
    root.querySelectorAll(selector).forEach(function (el) {
      out.push(el);
    });
    root.querySelectorAll('*').forEach(function (el) {
      if (el.shadowRoot) deepQueryAll(selector, el.shadowRoot, out);
    });
    return out;
  }

  function isVisible(el) {
    return !!(el.offsetParent || el.getClientRects().length);
  }

  // The panel is positioned under the masthead when maximized.
  function updateTopOffset() {
    const masthead = document.querySelector('#masthead-container, ytd-masthead');
    const top = masthead ? Math.round(masthead.getBoundingClientRect().bottom) : 56;
    document.documentElement.style.setProperty('--ytmax-top', Math.max(top, 0) + 'px');
  }

  function setState(panel, maximized) {
    panel.classList.toggle(MAX_CLASS, maximized);
    document.documentElement.classList.toggle(
      'ytmax-active',
      !!document.querySelector('.' + MAX_CLASS)
    );
    panel.querySelectorAll('.' + BTN_CLASS).forEach(function (btn) {
      btn.innerHTML = maximized ? ICON_MIN : ICON_MAX;
      btn.title = maximized ? 'Restore panel width' : 'Maximize to window width';
      btn.setAttribute('aria-label', btn.title);
      btn.setAttribute('aria-pressed', String(maximized));
    });
    if (maximized) updateTopOffset();
  }

  function makeButton(panel) {
    const btn = document.createElement('button');
    btn.className = BTN_CLASS;
    btn.type = 'button';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      setState(panel, !panel.classList.contains(MAX_CLASS));
    });
    return btn;
  }

  // Try the header first; if its structure is unfamiliar, pin the button to the
  // panel's top-right corner instead so it always shows up.
  function insertButton(panel) {
    const btn = makeButton(panel);
    const close = panel.querySelector(
      '#visibility-button, ytd-engagement-panel-title-header-renderer #visibility-button, ' +
        '[aria-label="Close"], [aria-label*="Close" i], [aria-label*="Fermer" i]'
    );
    if (close && close.parentNode) {
      close.parentNode.insertBefore(btn, close);
      return btn;
    }
    const header = panel.querySelector(
      '#header, ytd-engagement-panel-title-header-renderer, #title-container'
    );
    if (header) {
      header.appendChild(btn);
      return btn;
    }
    btn.classList.add('ytmax-btn--floating');
    panel.appendChild(btn);
    return btn;
  }

  function addButton(panel) {
    if (panel.querySelector('.' + BTN_CLASS)) return;
    if (!isVisible(panel)) return;
    insertButton(panel);
    setState(panel, panel.classList.contains(MAX_CLASS));
  }

  function scan() {
    deepQueryAll(PANEL_SELECTOR).forEach(addButton);
  }

  // Leaving a maximized panel open across navigations would cover the next page.
  function resetAll() {
    deepQueryAll('.' + MAX_CLASS).forEach(function (panel) {
      setState(panel, false);
    });
  }

  let pending = false;
  const observer = new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      scan();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('yt-navigate-finish', function () {
    resetAll();
    scan();
  });
  window.addEventListener('resize', updateTopOffset);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') resetAll();
  });

  updateTopOffset();
  scan();
  setInterval(scan, 2000);
})();
