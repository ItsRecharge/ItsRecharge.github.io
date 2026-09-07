/* Shared behaviour for static demo snapshots (the only script kept in crawled pages).
 * - Forms: submit -> toast (or navigate if the form carries data-demo-href)
 * - Elements with data-demo-href navigate (used for SPA tabs / login buttons)
 * - Dead buttons / href="#" -> toast
 */
(function () {
  var toastEl;
  function toast(html) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'nb-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = html;
    toastEl.classList.add('nb-show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('nb-show'); }, 2600);
  }
  var NOTE = '<b>Static demo</b> — no backend, so this action doesn’t run. Explore using the links and navigation.';

  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();
    var href = form.getAttribute('data-demo-href');
    if (href) { window.location.href = href; return; }
    toast(NOTE);
  }, true);

  document.addEventListener('click', function (e) {
    var el = e.target instanceof Element ? e.target.closest('[data-demo-href], a, button') : null;
    if (!el) return;
    var demoHref = el.getAttribute('data-demo-href');
    if (demoHref) { e.preventDefault(); window.location.href = demoHref; return; }
    if (el.tagName === 'A') {
      var h = el.getAttribute('href');
      if (h === null || h === '' || h === '#' || h.indexOf('javascript:') === 0) { e.preventDefault(); toast(NOTE); }
      return;
    }
    if (el.tagName === 'BUTTON' && !el.closest('form') && !el.closest('#nb-demo-banner')) {
      // Client-side buttons (modals, menus) lost their handlers when scripts were stripped.
      toast(NOTE);
    }
  }, true);
})();
