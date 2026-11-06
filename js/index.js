// Home page: quick profile check. Front-end stub only.
// Replace lookupProfile() with a call to your own backend that returns public signals.
(function () {
  var form = document.getElementById('quick-form');
  if (!form) return;
  var out = document.getElementById('qc-result');

  function lookupProfile(platform, username) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({ platform: platform, username: username });
      }, 400);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = window.HS.cleanUsername(form.username.value);
    if (!window.HS.validUsername(username)) {
      window.HS.setMsg(out, 'Enter a valid public username (letters, numbers, dots, underscores).', true);
      return;
    }
    window.HS.setMsg(out, 'Looking up @' + username + '…');
    lookupProfile(form.platform.value, username).then(function (r) {
      window.HS.setMsg(out, 'Demo: ' + r.platform + ' lookup for @' + r.username + '. Connect your analytics backend here.', false);
    });
  });
})();
