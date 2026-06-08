/* Wolf Klant MVP 3 — gedeelde chrome-logica (sidebar/bottom-nav) */
(function () {
  function init() {
    var naam = sessionStorage.getItem('klant_naam') || 'Juno';
    var mail = sessionStorage.getItem('klant_email') || 'info@juno.nl';
    document.querySelectorAll('.js-naam').forEach(function (e) { e.textContent = naam; });
    document.querySelectorAll('.js-mail').forEach(function (e) { e.textContent = mail; });
    var initials = naam.trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    document.querySelectorAll('.js-avatar').forEach(function (e) { e.textContent = initials; });
  }

  // Routeer "Nieuwe bestelling" naar het juiste leverdag-scherm o.b.v. klanttype
  window.wolfNieuweBestelling = function () {
    var t = sessionStorage.getItem('klant_type') || 'standaard';
    window.location.href = (t === 'uitzondering')
      ? '1-243-348-nieuwe-bestelling-uitzondering.html'
      : '1-243-111-nieuwe-bestelling-standaard.html';
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
