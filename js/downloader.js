// Downloader page. Validates the link, then asks YOUR backend to resolve it.
// Expected response from data-api: { "mediaUrl": "https://…", "title": "optional", "thumbnail": "optional" }
// Errors: any non-2xx response, optionally with { "error": "message" }.
(function () {
  var form = document.getElementById('dl-form');
  if (!form) return;

  var api = form.getAttribute('data-api') || '/api/resolve';
  var input = document.getElementById('dl-url');
  var consent = document.getElementById('dl-consent');
  var submit = document.getElementById('dl-submit');
  var status = document.getElementById('dl-status');
  var preview = document.getElementById('dl-preview');
  var video = document.getElementById('dl-video');
  var title = document.getElementById('dl-title');
  var dlLink = document.getElementById('dl-download');

  var HOSTS = [/(^|\.)instagram\.com$/i, /(^|\.)tiktok\.com$/i, /(^|\.)facebook\.com$/i, /(^|\.)fb\.watch$/i];

  function parseLink(raw) {
    var value = (raw || '').trim();
    if (!value) return { error: 'Paste a public video link first.' };
    if (!/^https?:\/\//i.test(value)) value = 'https://' + value;
    var u;
    try { u = new URL(value); } catch (e) { return { error: 'That does not look like a complete link.' }; }
    if (!HOSTS.some(function (re) { return re.test(u.hostname); })) {
      return { error: 'Only public Instagram, TikTok, and Facebook links are supported.' };
    }
    if (u.pathname.length < 2 && !/fb\.watch$/i.test(u.hostname)) {
      return { error: 'Use the full link to a specific video or reel, not a profile or home page.' };
    }
    return { url: u.toString() };
  }

  function resetPreview() {
    preview.hidden = true;
    video.removeAttribute('src');
    video.load();
    dlLink.setAttribute('href', '#');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    resetPreview();

    var parsed = parseLink(input.value);
    if (parsed.error) { window.HS.setMsg(status, parsed.error, true); return; }
    if (!consent.checked) {
      window.HS.setMsg(status, 'Confirm that you own this content or have permission to download it.', true);
      return;
    }

    submit.disabled = true;
    window.HS.setMsg(status, 'Resolving link…');

    fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: parsed.url })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || 'This link could not be resolved. Check that it is public and complete, then retry.');
          return data;
        });
      })
      .then(function (data) {
        if (!data || !/^https?:\/\//i.test(data.mediaUrl || '')) {
          throw new Error('The provider did not return a downloadable file for this link.');
        }
        video.src = data.mediaUrl;
        if (data.thumbnail && /^https?:\/\//i.test(data.thumbnail)) video.poster = data.thumbnail;
        title.textContent = data.title || 'Resolved video';
        dlLink.setAttribute('href', data.mediaUrl);
        dlLink.setAttribute('download', 'video.mp4');
        preview.hidden = false;
        window.HS.setMsg(status, 'Preview ready. Download only what you are allowed to use.');
      })
      .catch(function (err) {
        var offline = err instanceof TypeError;
        window.HS.setMsg(status, offline
          ? 'Could not reach the resolver service (' + api + '). Connect a backend, then try again.'
          : err.message, true);
      })
      .then(function () { submit.disabled = false; });
  });

  input.addEventListener('input', function () {
    if (status.classList.contains('error')) window.HS.setMsg(status, '');
  });
})();
