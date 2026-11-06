// Trends page. Front-end stub. Replace buildReport() with your backend or ranking logic.
(function () {
  var form = document.getElementById('tr-form');
  if (!form) return;
  var input = document.getElementById('tr-niche');
  var out = document.getElementById('tr-result');
  var focusInput = document.getElementById('tr-focus');
  var platformInput = document.getElementById('tr-platform');
  var languageInput = document.getElementById('tr-language');
  var countryInput = document.getElementById('tr-country');

  function buildReport(options) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(options); }, 300);
    });
  }

  function run(niche) {
    var clean = (niche || '').trim();
    if (!clean) {
      window.HS.setMsg(out, 'Enter a niche or topic first.', true);
      return;
    }
    input.value = clean;
    window.HS.setMsg(out, 'Building ideas for “' + clean + '”…');
    buildReport({
      niche: clean,
      focus: focusInput.value.trim(),
      platform: platformInput.value,
      language: languageInput.value,
      country: countryInput.value
    }).then(function (report) {
      var context = [report.platform, report.language, report.country].join(' · ');
      var focus = report.focus ? ' with a focus on “' + report.focus + '”' : '';
      window.HS.setMsg(out, 'Demo: a content-opportunity report for “' + report.niche + '”' + focus + ' (' + context + ') will appear here once connected to your backend.', false);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    run(input.value);
  });

  document.querySelectorAll('[data-niche]').forEach(function (btn) {
    btn.addEventListener('click', function () { run(btn.getAttribute('data-niche')); });
  });
})();
