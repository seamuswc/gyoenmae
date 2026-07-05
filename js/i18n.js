(function () {
  const STORAGE_KEY = 'towa-lang';
  const MAPS_QUERY = '〒160-0022 東京都新宿区新宿２丁目１ 藤和新宿御苑コープII';
  const MAPS_LAT = 35.68861860338855;
  const MAPS_LNG = 139.70958883013597;
  const MAPS_URL = 'https://www.google.com/maps/place/' + encodeURIComponent(MAPS_QUERY) + '/@' + MAPS_LAT + ',' + MAPS_LNG + ',18z';

  const translations = {
    en: {
      title: '藤和新宿御苑コープII — Towa',
      metaDescription: '45 sqm apartment, 8th floor, 藤和新宿御苑コープII. ¥200,000/month. 〒160-0022 Tokyo, Shinjuku City, Shinjuku, 2-chōme−1. Fixed-term rental — 6 months or 1 year.',
      ogLocale: 'en_US',
      eyebrow: 'Shinjuku Gyoen · Fixed-term rental',
      heroSub: '45 sqm · 8th floor · Back alley view · ¥200,000 / month',
      heroAddress: '〒160-0022 東京都新宿区新宿２丁目１ 藤和新宿御苑コープII ↗',
      property: 'Property',
      building: 'Building',
      rent: 'Rent',
      rentValue: '¥200,000 / month',
      size: 'Size',
      sizeValue: '45 sqm',
      floor: 'Floor',
      floorValue: '8th floor',
      view: 'View',
      viewValue: 'Back alley',
      address: 'Address',
      addressBlock: '〒160-0022<br>東京都新宿区新宿２丁目１<br>藤和新宿御苑コープII<br><a href="' + MAPS_URL + '" class="map-link" target="_blank" rel="noopener noreferrer">View on Google Maps ↗</a>',
      about: 'About the unit',
      location: 'Literally right next to Gyoen-mae Station, with Shinjuku Gyoen park about a 30-second walk away.',
      amenity0: 'No key — electronic keypad entry.',
      amenity1: 'Kitchen is sink only. No stove.',
      amenity2: '1Gbps fiber optic internet included.',
      amenity3: 'Utilities included. Large electricity bills from crypto mining or related high-usage activity will be charged separately.',
      amenity4: 'Bed included.',
      amenity5: 'Fridge included.',
      amenity6: 'No washing machine included. Two nearby laundromats are within walking distance.',
      rentalTerms: 'Rental terms',
      term6: '6 months',
      term6Price: '¥240,000 / month',
      term1y: '1 year',
      term1yPrice: '¥200,000 / month',
      termDeposit: '1 month deposit, no key money',
      fixedTerm: 'Fixed-term lease',
      nonResidents: 'Non-residents',
      upfront: 'Upfront payment',
      upfrontDesc: 'Full contract amount paid in advance at signing.',
      residents: 'Residents',
      monthly: 'Monthly payment',
      monthlyDesc: '¥200,000 per month for Japan residents.',
      footerContact: 'Rent or viewing? Contact us',
      lineQrAlt: 'LINE QR code — scan to contact us',
      lineLink: 'Add us on LINE ↗',
      prevPhoto: 'Previous photo',
      nextPhoto: 'Next photo',
      photo1: 'Living area',
      photo2: 'Kitchen',
      photo3: 'Bedroom',
      photo4: 'Back alley view from window',
      photo5: 'Bathroom',
      photo6: 'Building exterior',
      schemaDescription: '45 sqm fixed-term rental apartment on the 8th floor near Shinjuku Gyoen Station. ¥200,000/month, utilities included, 6-month or 1-year lease.'
    },
    ja: {
      title: '藤和新宿御苑コープII — Towa',
      metaDescription: '45㎡・8階・藤和新宿御苑コープII。月額¥200,000。〒160-0022 東京都新宿区新宿2丁目1。定期借家（6ヶ月・1年）。',
      ogLocale: 'ja_JP',
      eyebrow: '新宿御苑 · 定期借家',
      heroSub: '45㎡ · 8階 · 裏通り向き · 月額¥200,000',
      heroAddress: '〒160-0022 東京都新宿区新宿２丁目１ 藤和新宿御苑コープII ↗',
      property: '物件情報',
      building: '建物名',
      rent: '家賃',
      rentValue: '月額¥200,000',
      size: '面積',
      sizeValue: '45㎡',
      floor: '階数',
      floorValue: '8階',
      view: '眺望',
      viewValue: '裏通り',
      address: '住所',
      addressBlock: '〒160-0022<br>東京都新宿区新宿２丁目１<br>藤和新宿御苑コープII<br><a href="' + MAPS_URL + '" class="map-link" target="_blank" rel="noopener noreferrer">Googleマップで見る ↗</a>',
      about: 'お部屋について',
      location: '新宿御苑前駅のすぐ隣。新宿御苑まで徒歩約30秒です。',
      amenity0: '鍵なし。電子キーパッドで入室。',
      amenity1: 'キッチンはシンクのみ。コンロはありません。',
      amenity2: '1Gbps光ファイバー回線込み。',
      amenity3: '光熱費込み。仮想通貨マイニングなどによる高額電力使用は別途請求します。',
      amenity4: 'ベッド付き。',
      amenity5: '冷蔵庫付き。',
      amenity6: '洗濯機は付きません。徒歩圏内にコインランドリーが2軒あります。',
      rentalTerms: '賃貸条件',
      term6: '6ヶ月',
      term6Price: '月額¥240,000',
      term1y: '1年',
      term1yPrice: '月額¥200,000',
      termDeposit: '敷金1ヶ月、礼金なし',
      fixedTerm: '定期借家契約',
      nonResidents: '非居住者',
      upfront: '一括前払い',
      upfrontDesc: '契約時に契約総額を前払いします。',
      residents: '居住者',
      monthly: '月払い',
      monthlyDesc: '日本の居住者は月額¥200,000です。',
      footerContact: '賃貸・内見のお問い合わせ',
      lineQrAlt: 'LINE QRコード — スキャンしてお問い合わせ',
      lineLink: 'LINEで友だち追加 ↗',
      prevPhoto: '前の写真',
      nextPhoto: '次の写真',
      photo1: 'リビング',
      photo2: 'キッチン',
      photo3: '寝室',
      photo4: '裏通りの眺望',
      photo5: 'バスルーム',
      photo6: '建物外観',
      schemaDescription: '新宿御苑前駅徒歩すぐ、8階・45㎡の定期借家。月額¥200,000、光熱費込み、6ヶ月または1年契約。'
    }
  };

  function getLangFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    return lang === 'ja' || lang === 'en' ? lang : null;
  }

  let currentLang = getLangFromUrl() || localStorage.getItem(STORAGE_KEY) || 'en';

  function t(key) {
    return translations[currentLang][key] || translations.en[key] || '';
  }

  function pageUrl(lang) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    return url.toString();
  }

  function basePageUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    const cleaned = url.toString();
    return cleaned.endsWith('?') ? cleaned.slice(0, -1) : cleaned;
  }

  function updateSeoMeta(lang) {
    const description = translations[lang].metaDescription;
    const title = translations[lang].title;
    const canonical = pageUrl(lang);

    document.querySelector('meta[name="description"]').setAttribute('content', description);

    const canonicalEl = document.getElementById('canonical-url');
    if (canonicalEl) canonicalEl.setAttribute('href', canonical);

    const hreflangEn = document.getElementById('hreflang-en');
    const hreflangJa = document.getElementById('hreflang-ja');
    const hreflangDefault = document.getElementById('hreflang-default');
    if (hreflangEn) hreflangEn.setAttribute('href', pageUrl('en'));
    if (hreflangJa) hreflangJa.setAttribute('href', pageUrl('ja'));
    if (hreflangDefault) hreflangDefault.setAttribute('href', pageUrl('en'));

    const ogTitle = document.getElementById('og-title');
    const ogDescription = document.getElementById('og-description');
    const ogUrl = document.getElementById('og-url');
    const ogLocale = document.getElementById('og-locale');
    if (ogTitle) ogTitle.setAttribute('content', title);
    if (ogDescription) ogDescription.setAttribute('content', description);
    if (ogUrl) ogUrl.setAttribute('content', canonical);
    if (ogLocale) ogLocale.setAttribute('content', translations[lang].ogLocale);

    const twitterTitle = document.getElementById('twitter-title');
    const twitterDescription = document.getElementById('twitter-description');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    if (twitterDescription) twitterDescription.setAttribute('content', description);

    const structuredData = document.getElementById('structured-data');
    if (structuredData) {
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': pageUrl('en') + '#webpage-en',
            url: pageUrl('en'),
            name: translations.en.title,
            description: translations.en.metaDescription,
            inLanguage: 'en',
            isPartOf: { '@id': basePageUrl() + '#website' }
          },
          {
            '@type': 'WebPage',
            '@id': pageUrl('ja') + '#webpage-ja',
            url: pageUrl('ja'),
            name: translations.ja.title,
            description: translations.ja.metaDescription,
            inLanguage: 'ja',
            isPartOf: { '@id': basePageUrl() + '#website' }
          },
          {
            '@type': 'WebSite',
            '@id': basePageUrl() + '#website',
            url: basePageUrl(),
            name: 'Towa',
            inLanguage: ['en', 'ja']
          },
          {
            '@type': 'Apartment',
            name: '藤和新宿御苑コープII',
            alternateName: 'Fujiwa Shinjuku Gyoen Co-op II',
            description: translations[lang].schemaDescription,
            floorSize: {
              '@type': 'QuantitativeValue',
              value: 45,
              unitCode: 'MTK'
            },
            floorLevel: 8,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '新宿２丁目１ 藤和新宿御苑コープII',
              addressLocality: '新宿区',
              addressRegion: '東京都',
              postalCode: '160-0022',
              addressCountry: 'JP'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 35.68861860338855,
              longitude: 139.70958883013597
            },
            offers: {
              '@type': 'Offer',
              price: 200000,
              priceCurrency: 'JPY',
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: 200000,
                priceCurrency: 'JPY',
                unitText: 'MONTH'
              },
              availability: 'https://schema.org/InStock'
            }
          }
        ]
      });
    }
  }

  function applyLanguage(lang, updateUrl) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    if (updateUrl !== false) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }

    document.documentElement.lang = lang;
    document.title = t('title');
    updateSeoMeta(lang);

    document.querySelectorAll('[data-maps-link]').forEach(function (el) {
      el.href = MAPS_URL;
    });

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      const active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLanguage(btn.getAttribute('data-lang'));
    });
  });

  window.towaI18n = { t: t, getLang: function () { return currentLang; } };
  applyLanguage(currentLang, false);
})();
