(function (root) {
  'use strict';
  function legacyAppUrl(location) {
    const target = new URL('app-legacy.html', location.href);
    target.search = location.search;
    target.hash = location.hash;
    return target.href;
  }
  function shouldBypass(location, continued) {
    // Preserve every routed bookmark, email link, OAuth/OTP callback and push link.
    return Boolean(location.search || location.hash || continued);
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = { legacyAppUrl, shouldBypass };
    return;
  }
  const location = root.location;
  const storageKey = 'band-calendar-legacy-continue';
  let continued = false;
  try { continued = root.sessionStorage.getItem(storageKey) === 'yes'; } catch (_) {}
  if (shouldBypass(location, continued)) {
    location.replace(legacyAppUrl(location));
    return;
  }
  const document = root.document;
  const english = !String(root.navigator.language || 'it').toLowerCase().startsWith('it');
  if (english) {
    document.documentElement.lang = 'en';
    document.title = 'Band Calendar — New address';
    const copy = {
      title: 'Find us at our new address.',
      intro: 'Your band and calendar are waiting for you at <strong>app.bandcalendar.eu</strong>.',
      open: 'Open Band Calendar <span aria-hidden="true">↗</span>',
      account: 'Use your existing account.<br>You may need to sign in again.',
      installTitle: 'Update the web app on your Home screen',
      installBody: 'Open app.bandcalendar.eu in your browser and add the new address to your Home screen.',
      continue: 'Continue on the old site',
    };
    document.querySelectorAll('[data-copy]').forEach(element => {
      element.innerHTML = copy[element.dataset.copy];
    });
  }
  const link = document.getElementById('continue-legacy');
  link.href = legacyAppUrl(location);
  link.addEventListener('click', () => {
    try { root.sessionStorage.setItem(storageKey, 'yes'); } catch (_) {}
  });
})(typeof window !== 'undefined' ? window : globalThis);
