(function () {
  const banner = document.getElementById('rented-banner');
  const bannerText = document.getElementById('rented-banner-text');
  if (!banner || !bannerText) return;

  let rentedUntil = null;

  function formatDate(isoDate, lang) {
    const parts = String(isoDate).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!parts) return isoDate;
    const date = new Date(Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3])));
    return new Intl.DateTimeFormat(lang === 'ja' ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  }

  function updateBanner() {
    if (!rentedUntil || !window.towaI18n) return;
    const lang = window.towaI18n.getLang ? window.towaI18n.getLang() : 'en';
    const date = formatDate(rentedUntil, lang);
    const template = window.towaI18n.t('rentedBanner');
    bannerText.textContent = template.replace('{date}', date);
  }

  function applyStatus(data) {
    if (data && data.status === 'rented' && data.rentedUntil) {
      rentedUntil = data.rentedUntil;
      banner.hidden = false;
      updateBanner();
    } else {
      rentedUntil = null;
      banner.hidden = true;
      bannerText.textContent = '';
    }
  }

  document.addEventListener('languagechange', updateBanner);

  fetch('/status.json', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(applyStatus)
    .catch(function () {
      banner.hidden = true;
    });
})();
