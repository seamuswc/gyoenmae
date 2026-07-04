(function () {
  const FALLBACK_PHOTOS = [
    { filename: '01-living.svg', altKey: 'photo1' },
    { filename: '02-kitchen.svg', altKey: 'photo2' },
    { filename: '03-bedroom.svg', altKey: 'photo3' },
    { filename: '04-view.svg', altKey: 'photo4' },
    { filename: '05-bathroom.svg', altKey: 'photo5' },
    { filename: '06-building.svg', altKey: 'photo6' }
  ];

  const FALLBACK_KEYS = ['photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6'];

  const heroImage = document.getElementById('hero-image');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const counter = document.getElementById('hero-counter');

  if (!heroImage || !prevBtn || !nextBtn) return;

  let photos = [];
  let current = 0;
  let ready = false;

  function photoSrc(entry) {
    return 'photos/' + entry.filename;
  }

  function photoAlt(index) {
    const entry = photos[index];
    if (!entry) return '';
    if (entry.alt && window.towaI18n) {
      const lang = window.towaI18n.getLang ? window.towaI18n.getLang() : 'en';
      return entry.alt[lang] || entry.alt.en || '';
    }
    if (entry.altKey && window.towaI18n) {
      return window.towaI18n.t(entry.altKey);
    }
    if (window.towaI18n && FALLBACK_KEYS[index]) {
      return window.towaI18n.t(FALLBACK_KEYS[index]);
    }
    return 'Photo ' + (index + 1);
  }

  function updateAriaLabels() {
    if (!window.towaI18n) return;
    prevBtn.setAttribute('aria-label', window.towaI18n.t('prevPhoto'));
    nextBtn.setAttribute('aria-label', window.towaI18n.t('nextPhoto'));
  }

  function show(index) {
    if (!photos.length) return;
    current = (index + photos.length) % photos.length;
    heroImage.style.backgroundImage = "url('" + photoSrc(photos[current]) + "')";
    heroImage.setAttribute('aria-label', photoAlt(current));
    if (counter) {
      counter.textContent = (current + 1) + ' / ' + photos.length;
    }
  }

  function bindControls() {
    if (ready) return;
    ready = true;

    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });

    document.addEventListener('languagechange', function () {
      updateAriaLabels();
      show(current);
    });

    updateAriaLabels();
    show(0);
  }

  function normalizeList(data) {
    if (!Array.isArray(data) || !data.length) return null;
    return data.map(function (item) {
      if (typeof item === 'string') return { filename: item };
      if (item && item.filename) return item;
      return null;
    }).filter(Boolean);
  }

  function start(list) {
    photos = list;
    bindControls();
  }

  fetch('/photos.json', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(function (data) {
      const list = normalizeList(data);
      if (list && list.length) {
        start(list);
      } else {
        start(FALLBACK_PHOTOS.slice());
      }
    })
    .catch(function () {
      start(FALLBACK_PHOTOS.slice());
    });
})();
