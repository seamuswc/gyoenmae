(function () {
  const photoKeys = ['photo1', 'photo2', 'photo3', 'photo4', 'photo5', 'photo6'];
  const photos = [
    { src: 'photos/01-living.svg' },
    { src: 'photos/02-kitchen.svg' },
    { src: 'photos/03-bedroom.svg' },
    { src: 'photos/04-view.svg' },
    { src: 'photos/05-bathroom.svg' },
    { src: 'photos/06-building.svg' }
  ];

  const heroImage = document.getElementById('hero-image');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  const counter = document.getElementById('hero-counter');

  if (!heroImage || !photos.length) return;

  let current = 0;

  function photoAlt(index) {
    if (window.towaI18n) return window.towaI18n.t(photoKeys[index]);
    return '';
  }

  function updateAriaLabels() {
    if (!window.towaI18n) return;
    prevBtn.setAttribute('aria-label', window.towaI18n.t('prevPhoto'));
    nextBtn.setAttribute('aria-label', window.towaI18n.t('nextPhoto'));
  }

  function show(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    heroImage.style.backgroundImage = "url('" + photo.src + "')";
    heroImage.setAttribute('aria-label', photoAlt(current));
    if (counter) {
      counter.textContent = (current + 1) + ' / ' + photos.length;
    }
  }

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
})();
