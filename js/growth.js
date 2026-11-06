// Growth analyzer page. Front-end stub. Replace fetchGrowth() with your backend call.
// Expected: { followers, sample: { avgViews, bestMultiplier, viewsPerFollower } } or N/A fields.
(function () {
  var form = document.getElementById('gr-form');
  if (!form) return;
  var out = document.getElementById('gr-result');
  var toggles = document.querySelectorAll('.platform-toggle [data-platform]');
  var platform = 'TikTok';

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      platform = btn.getAttribute('data-platform');
      toggles.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
      document.getElementById('gr-platform').value = platform;
    });
  });

  function fetchGrowth(platformName, username) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ platform: platformName, username: username }); }, 400);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = window.HS.cleanUsername(form.username.value);
    if (!window.HS.validUsername(username)) {
      window.HS.setMsg(out, 'Enter a valid public username (letters, numbers, dots, underscores).', true);
      return;
    }
    var chosen = form.platform.value;
    window.HS.setMsg(out, 'Looking up @' + username + '…');
    fetchGrowth(chosen, username).then(function (r) {
      window.HS.setMsg(out, 'Demo: ' + r.platform + ' growth lookup for @' + r.username + '. Connect your backend here.', false);
    });
  });
})();
