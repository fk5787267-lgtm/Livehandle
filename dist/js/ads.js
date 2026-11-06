(function () {
  var adContainer = document.querySelector('.page-advertisements');
  var adsStarted = false;

  function installPopupAd() {
    var popup = document.createElement('aside');
    popup.className = 'livehandle-popup-ad';
    popup.setAttribute('aria-label', 'Advertisement');
    popup.innerHTML = '<div class="livehandle-popup-image"><img src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=300" alt="Advertisement"></div><div class="livehandle-popup-content"><h3>What Exactly Is a VPN, and What Does It Do?</h3><div class="livehandle-popup-actions"><a href="https://example.com" target="_blank" rel="noopener noreferrer">Learn More</a><button class="livehandle-popup-hide" type="button">Hide</button></div></div>';
    document.body.appendChild(popup);

    var hideButton = popup.querySelector('.livehandle-popup-hide');
    var autoHideTimer;
    var repeatTimer;
    var dismissed = false;

    function showPopup() {
      if (dismissed) return;
      popup.classList.add('is-visible');
      window.clearTimeout(autoHideTimer);
      autoHideTimer = window.setTimeout(closePopup, 8000);
    }

    function closePopup() {
      popup.classList.remove('is-visible');
      window.clearTimeout(autoHideTimer);
      if (!dismissed) {
        window.clearTimeout(repeatTimer);
        repeatTimer = window.setTimeout(showPopup, 20000);
      }
    }

    hideButton.addEventListener('click', function () {
      dismissed = true;
      window.clearTimeout(autoHideTimer);
      window.clearTimeout(repeatTimer);
      popup.classList.remove('is-visible');
    });

    return showPopup;
  }

  var showPopupAd = installPopupAd();
  window.setTimeout(showPopupAd, 3000);

  if (adContainer) {
    adContainer.className = 'global-ad-container';
    adContainer.innerHTML = [
      '<div class="global-ad-slot global-ad-slot-rect" aria-label="Advertisement"></div>',
      '<div class="global-ad-slot global-ad-slot-leaderboard" aria-label="Advertisement"></div>',
      '<div class="global-ad-slot global-ad-slot-mobile" aria-label="Advertisement"></div>',
      '<div class="global-ad-slot global-ad-slot-native" aria-label="Advertisement"><div id="container-05197d834703f8e7377c978bb834f1e7"></div></div>'
    ].join('');
    var bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.after(adContainer);
  }

  function loadAdsense() {
    if (document.querySelector('script[data-adsbygoogle]')) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4312729323322088';
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-adsbygoogle', '1');
    document.head.appendChild(script);
  }

  function startAds() {
    if (adsStarted) return;
    adsStarted = true;
    loadAdsense();

    var slots = [
      { selector: '.global-ad-slot-rect', key: 'd1fae71b0a92bfc5cff7e95e5b5bb56e', height: 250, width: 300 },
      { selector: '.global-ad-slot-leaderboard', key: '521aebeb613fad2a9dcd62b3c237cea6', height: 90, width: 728 },
      { selector: '.global-ad-slot-mobile', key: '4ccb1e389ba0a5bab9123845250e52c0', height: 50, width: 320 }
    ];
    var chain = Promise.resolve();

    slots.forEach(function (slot) {
      chain = chain.then(function () {
        return new Promise(function (resolve) {
          var element = document.querySelector(slot.selector);
          if (!element) return resolve();

          window.atOptions = {
            key: slot.key,
            format: 'iframe',
            height: slot.height,
            width: slot.width,
            params: {}
          };

          var script = document.createElement('script');
          script.src = 'https://www.highrevenueformat.com/' + slot.key + '/invoke.js';
          script.async = true;
          script.onload = script.onerror = resolve;
          element.appendChild(script);
        });
      });
    });

    chain.then(function () {
      var nativeHost = document.querySelector('.global-ad-slot-native');
      if (nativeHost) {
        var nativeScript = document.createElement('script');
        nativeScript.async = true;
        nativeScript.setAttribute('data-cfasync', 'false');
        nativeScript.src = 'https://pl31183305.profitableratecpmnetwork.com/05197d834703f8e7377c978bb834f1e7/invoke.js';
        nativeHost.appendChild(nativeScript);
      }

      var extraScript = document.createElement('script');
      extraScript.async = true;
      extraScript.src = 'https://pl31183304.profitableratecpmnetwork.com/2a/eb/ea/2aebea0fe0e9b7712588c36ee1ba937d.js';
      (nativeHost || document.body).appendChild(extraScript);
    });
  }

  window.addEventListener('load', function () {
    var events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(function (eventName) {
      window.addEventListener(eventName, startAds, { once: true, passive: true });
    });
    window.setTimeout(startAds, 8000);
  });
})();