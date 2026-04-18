/**
 * İslami Rehber – app.js
 * Ebced (Arapça) | Gematria (İbranice) | Isopsephy (Yunanca)
 * Ekran Klavyesi + 4 Değer Aynı Anda + Muhyiddin-i Arabi Modu
 *
 * Her harf için 8 değer saklanır:
 *   Normal sistem  → [normal, enKucuk, buyuk, enBuyuk]
 *   M.Arabi sistemi→ [a_normal, a_enKucuk, a_buyuk, a_enBuyuk]
 */

(function () {
  'use strict';

  /* =========================================================
     1. SAYFA YÖNETİMİ
  ========================================================= */
  const PAGES = ['home', 'quran', 'prophets', 'ebced', 'calendar', 'mushaf', 'dualar', 'vakitler'];

  function showPage(pageId) {
    if (!PAGES.includes(pageId)) return;
    PAGES.forEach(function (id) {
      const s = document.getElementById('page-' + id);
      if (s) s.classList.toggle('active', id === pageId);
    });
    updateNavLinks(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateNavLinks(active) {
    document.querySelectorAll('[data-page]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-page') === active);
    });
  }

  function bindNavigation() {
    document.querySelectorAll('[data-page]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showPage(this.getAttribute('data-page'));
        closeMobileMenu();
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showPage(this.getAttribute('data-page'));
          closeMobileMenu();
        }
      });
    });
  }

  /* =========================================================
     2. MOBİL MENÜ
  ========================================================= */
  function bindMobileMenu() {
    const btn  = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !menu.contains(e.target)) closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    const btn  = document.getElementById('hamburger-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  /* =========================================================
     3. ARAPÇA HARF VERİTABANI
     Her satır: { n, t, ord, normal:[v,enKucuk,buyuk,enBuyuk], arabi:[...] }
     normal / arabi aynı 4 değer sırasını paylaşır:
       [0] = Normal (Kebir, standart 1-1000)
       [1] = En Küçük (harf başına küçük değer)
       [2] = Büyük   (isim / harf adı toplamı)
       [3] = En Büyük(özel üst sistem değeri)
  ========================================================= */

  /**
   * Yardımcı: 8 sayısal parametre → { normal:[4], arabi:[4] }
   */
  function L(n, t, ord, v1, v2, v3, v4, a1, a2, a3, a4) {
    return { n: n, t: t, ord: ord, normal: [v1, v2, v3, v4], arabi: [a1, a2, a3, a4] };
  }

  const ARABIC_DATA = {
    // ---- ELİF VE VARYANTLARI ----
    'ا': L('Elif',       'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'أ': L('Elif+Hemze', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'إ': L('Elif+Hemze', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'آ': L('Elif+Madde', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'ء': L('Hemze',      'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'ٱ': L('Elif Vasla', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'ﭐ': L('Elif+Hemze', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    'ﭑ': L('Elif+Hemze', 'kamari',  1,    1,   1, 111,   13,    1,   1, 111,   19),
    // ---- TEMEL HARFLER ----
    'ب': L('Be',         'kamari',  2,    2,   2,   3,  611,    2,   2,   3, 1002),
    'ج': L('Cim',        'kamari',  3,    3,   3,  53, 1035,    3,   3,  53, 1331),
    'د': L('Dal',        'shamsi',  4,    4,   4,  35,  278,    4,   4,  35,  673),
    'ه': L('He',         'kamari',  5,    5,   5,   6,  705,    5,   5,   6,  508),
    'ة': L('Te Merbuta', 'kamari', 22,  400,   5,   6,  705,  400,   5,   6,  508),
    'و': L('Vav',        'kamari',  6,    6,   6,  13,  465,    6,   6,  13,  860),
    'ؤ': L('Vav+Hemze',  'kamari',  6,    6,   6,  13,  860,    6,   6,  13,  860),
    'ز': L('Ze',         'shamsi',  7,    7,   7,   8,  137,    7,   7,   8,  532),
    'ح': L('Ha',         'kamari',  8,    8,   8,   9,  606,    8,   8,   9, 1001),
    'ط': L('Tı',         'shamsi',  9,    9,   9,  10,  535,    9,   9,  10,  930),
    'ي': L('Ye',         'kamari', 10,   10,  10,  11,  575,   10,  10,  11,  970),
    'ى': L('Elif Maksure','kamari', 10,   10,  10,  11,  575,   10,  10,  11,  970),
    'ئ': L('Ye+Hemze',   'kamari', 10,   10,  10,  11,  575,   10,  10,  11,  970),
    'ك': L('Kef',        'kamari', 11,   20,   8, 101,  630,   20,   8, 101,  626),
    'ک': L('Kef (Fa.)',  'kamari', 11,   20,   8, 101,  630,   20,   8, 101,  626),
    'ل': L('Lam',        'shamsi', 12,   30,   6,  71, 1090,   30,   6,  71, 1087),
    'م': L('Mim',        'kamari', 13,   40,   4,  90,  333,   40,   4,  90,  329),
    'ن': L('Nun',        'shamsi', 14,   50,   2, 106,  760,   50,   2, 106,  756),
    'س': L('Sin',        'shamsi', 15,   60,   0, 120,  520,   60,   0, 120,  516),
    'ع': L('Ayn',        'kamari', 16,   70,  10, 130,  192,   70,  10, 130,  188),
    'ف': L('Fe',         'kamari', 17,   80,   8,  81,  651,   80,   8,  81,  647),
    'ص': L('Sad',        'shamsi', 18,   90,   6,  95,  590,   90,   6,  95,  586),
    'ق': L('Kaf',        'kamari', 19,  100,  10, 181,   47,  100,   4, 181,  441),
    'ر': L('Ra',         'shamsi', 20,  200,   8, 201,  502,  200,   8, 201,  491),
    'ش': L('Şın',        'shamsi', 21,  300,   6, 360, 1077,  300,   0, 360, 1872),
    'ت': L('Te',         'shamsi', 22,  400,   4, 401,  320,  400,   4, 401, 1112),
    'ث': L('Se',         'shamsi', 23,  500,   2, 501,  747,  500,   8, 501, 1481),
    'خ': L('Hı',         'kamari', 24,  600,   0, 601,  512,  600,   0, 601, 1301),
    'ذ': L('Zel',        'shamsi', 25,  700,  10, 701,  179,  700,   4, 701,  973),
    'ض': L('Dad',        'shamsi', 26,  800,   8, 805,  653,  800,   8, 801, 1442),
    'ظ': L('Zı',         'shamsi', 27,  900,   6, 901,  577,  900,   0, 901, 1371),
    'غ': L('Gayn',       'kamari', 28, 1000,  10,1060,  111, 1000,   4,1060,  111),
  };

  // Ekran klavyesinde gösterilecek harfler (ilk 28 = ana, sonrası ek varyantlar)
  const ARABIC_KEYS = [
    'ا','ب','ج','د','ه','و','ز','ح','ط','ي',
    'ك','ل','م','ن','س','ع','ف','ص','ق','ر',
    'ش','ت','ث','خ','ذ','ض','ظ','غ',
    'أ','إ','آ','ى','ة','ء','ؤ','ئ',
  ];

  /* =========================================================
     4. İBRANİCE VERİTABANI (Gematria – Mispar Gadol)
  ========================================================= */
  const HEBREW_DATA = {
    'א': { v:1,   n:'Alef',       t:'-', ord:1  },
    'ב': { v:2,   n:'Bet',        t:'-', ord:2  },
    'ג': { v:3,   n:'Gimel',      t:'-', ord:3  },
    'ד': { v:4,   n:'Dalet',      t:'-', ord:4  },
    'ה': { v:5,   n:'He',         t:'-', ord:5  },
    'ו': { v:6,   n:'Vav',        t:'-', ord:6  },
    'ז': { v:7,   n:'Zayin',      t:'-', ord:7  },
    'ח': { v:8,   n:'Chet',       t:'-', ord:8  },
    'ט': { v:9,   n:'Tet',        t:'-', ord:9  },
    'י': { v:10,  n:'Yod',        t:'-', ord:10 },
    'כ': { v:20,  n:'Kaf',        t:'-', ord:11 },
    'ל': { v:30,  n:'Lamed',      t:'-', ord:12 },
    'מ': { v:40,  n:'Mem',        t:'-', ord:13 },
    'נ': { v:50,  n:'Nun',        t:'-', ord:14 },
    'ס': { v:60,  n:'Samech',     t:'-', ord:15 },
    'ע': { v:70,  n:'Ayin',       t:'-', ord:16 },
    'פ': { v:80,  n:'Pe',         t:'-', ord:17 },
    'צ': { v:90,  n:'Tsadi',      t:'-', ord:18 },
    'ק': { v:100, n:'Qof',        t:'-', ord:19 },
    'ר': { v:200, n:'Resh',       t:'-', ord:20 },
    'ש': { v:300, n:'Shin',       t:'-', ord:21 },
    'ת': { v:400, n:'Tav',        t:'-', ord:22 },
    'ך': { v:500, n:'Kaf Sofit',  t:'-', ord:11 },
    'ם': { v:600, n:'Mem Sofit',  t:'-', ord:13 },
    'ן': { v:700, n:'Nun Sofit',  t:'-', ord:14 },
    'ף': { v:800, n:'Pe Sofit',   t:'-', ord:17 },
    'ץ': { v:900, n:'Tsadi Sofit',t:'-', ord:18 },
  };

  const HEBREW_KEYS = [
    'א','ב','ג','ד','ה','ו','ז','ח','ט','י',
    'כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת',
    'ך','ם','ן','ף','ץ',
  ];

  /* =========================================================
     5. YUNANCA VERİTABANI (Isopsephy)
  ========================================================= */
  const GREEK_DATA = {
    'α': { v:1,   n:'Alpha',   t:'-', ord:1  },
    'β': { v:2,   n:'Beta',    t:'-', ord:2  },
    'γ': { v:3,   n:'Gamma',   t:'-', ord:3  },
    'δ': { v:4,   n:'Delta',   t:'-', ord:4  },
    'ε': { v:5,   n:'Epsilon', t:'-', ord:5  },
    'ϛ': { v:6,   n:'Stigma',  t:'-', ord:6  },
    'ζ': { v:7,   n:'Zeta',    t:'-', ord:7  },
    'η': { v:8,   n:'Eta',     t:'-', ord:8  },
    'θ': { v:9,   n:'Theta',   t:'-', ord:9  },
    'ι': { v:10,  n:'Iota',    t:'-', ord:10 },
    'κ': { v:20,  n:'Kappa',   t:'-', ord:11 },
    'λ': { v:30,  n:'Lambda',  t:'-', ord:12 },
    'μ': { v:40,  n:'Mu',      t:'-', ord:13 },
    'ν': { v:50,  n:'Nu',      t:'-', ord:14 },
    'ξ': { v:60,  n:'Xi',      t:'-', ord:15 },
    'ο': { v:70,  n:'Omicron', t:'-', ord:16 },
    'π': { v:80,  n:'Pi',      t:'-', ord:17 },
    'ϟ': { v:90,  n:'Koppa',   t:'-', ord:18 },
    'ρ': { v:100, n:'Rho',     t:'-', ord:19 },
    'σ': { v:200, n:'Sigma',   t:'-', ord:20 },
    'τ': { v:300, n:'Tau',     t:'-', ord:21 },
    'υ': { v:400, n:'Upsilon', t:'-', ord:22 },
    'φ': { v:500, n:'Phi',     t:'-', ord:23 },
    'χ': { v:600, n:'Chi',     t:'-', ord:24 },
    'ψ': { v:700, n:'Psi',     t:'-', ord:25 },
    'ω': { v:800, n:'Omega',   t:'-', ord:26 },
    'ϡ': { v:900, n:'Sampi',   t:'-', ord:27 },
    'Α': { v:1,   n:'Alpha',   t:'-', ord:1  },
    'Β': { v:2,   n:'Beta',    t:'-', ord:2  },
    'Γ': { v:3,   n:'Gamma',   t:'-', ord:3  },
    'Δ': { v:4,   n:'Delta',   t:'-', ord:4  },
    'Ε': { v:5,   n:'Epsilon', t:'-', ord:5  },
    'Ζ': { v:7,   n:'Zeta',    t:'-', ord:7  },
    'Η': { v:8,   n:'Eta',     t:'-', ord:8  },
    'Θ': { v:9,   n:'Theta',   t:'-', ord:9  },
    'Ι': { v:10,  n:'Iota',    t:'-', ord:10 },
    'Κ': { v:20,  n:'Kappa',   t:'-', ord:11 },
    'Λ': { v:30,  n:'Lambda',  t:'-', ord:12 },
    'Μ': { v:40,  n:'Mu',      t:'-', ord:13 },
    'Ν': { v:50,  n:'Nu',      t:'-', ord:14 },
    'Ξ': { v:60,  n:'Xi',      t:'-', ord:15 },
    'Ο': { v:70,  n:'Omicron', t:'-', ord:16 },
    'Π': { v:80,  n:'Pi',      t:'-', ord:17 },
    'Ρ': { v:100, n:'Rho',     t:'-', ord:19 },
    'Σ': { v:200, n:'Sigma',   t:'-', ord:20 },
    'Τ': { v:300, n:'Tau',     t:'-', ord:21 },
    'Υ': { v:400, n:'Upsilon', t:'-', ord:22 },
    'Φ': { v:500, n:'Phi',     t:'-', ord:23 },
    'Χ': { v:600, n:'Chi',     t:'-', ord:24 },
    'Ψ': { v:700, n:'Psi',     t:'-', ord:25 },
    'Ω': { v:800, n:'Omega',   t:'-', ord:26 },
    'ς': { v:200, n:'Sigma',   t:'-', ord:20 },
  };

  const GREEK_KEYS = [
    'α','β','γ','δ','ε','ζ','η','θ','ι','κ',
    'λ','μ','ν','ξ','ο','π','ρ','σ','ς','τ',
    'υ','φ','χ','ψ','ω','ϛ','ϟ','ϡ',
  ];

  /* =========================================================
     6. AKTIF ALFABE & MOD
  ========================================================= */
  let activeAlpha = 'arabic';  // 'arabic' | 'hebrew' | 'greek'
  let arabicMode  = 'normal';  // 'normal' | 'arabi'  (sadece Arapça'da geçerli)

  function getDB() {
    if (activeAlpha === 'hebrew') return HEBREW_DATA;
    if (activeAlpha === 'greek')  return GREEK_DATA;
    return ARABIC_DATA;
  }

  function getKeys() {
    if (activeAlpha === 'hebrew') return HEBREW_KEYS;
    if (activeAlpha === 'greek')  return GREEK_KEYS;
    return ARABIC_KEYS;
  }

  function getDir() {
    return (activeAlpha === 'greek') ? 'ltr' : 'rtl';
  }

  function getAlphaLabel() {
    if (activeAlpha === 'hebrew') return 'Gematria (İbranice)';
    if (activeAlpha === 'greek')  return 'Isopsephy (Yunanca)';
    return arabicMode === 'arabi' ? 'Ebced – Muhyiddin-i Arabi' : 'Ebced (Arapça)';
  }

  /* =========================================================
     7. HESAPLAMA MOTORU
  ========================================================= */

  function digitalRoot(n) {
    if (n === 0) return 0;
    while (n >= 10) {
      let t = 0;
      while (n > 0) { t += n % 10; n = Math.floor(n / 10); }
      n = t;
    }
    return n;
  }

  function removeArabicDiacritics(metin) {
    let result = '';
    for (const ch of metin) {
      const code = ch.charCodeAt(0);
      if (code >= 0x0610 && code <= 0x061A) continue;
      if (code >= 0x064B && code <= 0x065F) continue;
      if (
        code === 0x0640 || 
        code === 0x0656 || 
        code === 0x0654 || 
        code === 0x0670 || 
        code === 0x06DA || 
        code === 0x06DC || 
        code === 0x06EB
      ) continue;
      result += ch;
    }
    return result;
  }

  /**
   * Arapça hesaplama – 4 değerin tümü harf tablosundan okunur.
   * arabicMode: 'normal' | 'arabi'
   */
  function expandHamzaComposite(metin) {
    let expanded = '';
    for (const ch of metin) {
      switch (ch) {
        case 'أ': case 'إ': case 'آ': case 'ٱ': case 'ﭐ': case 'ﭑ':
          expanded += 'اء';
          break;
        case 'ؤ': case '\uFE85': case '\uFE86':
          expanded += 'وء';
          break;
        case 'ئ': case '\uFE89': case '\uFE8A': case '\uFE8B': case '\uFE8C':
          expanded += 'يء';
          break;
        default:
          expanded += ch;
          break;
      }
    }
    return expanded;
  }

  function hesaplaArabic(originalMetin) {
    let temizMetin = removeArabicDiacritics(originalMetin);
    const metin = expandHamzaComposite(temizMetin);
    const chars = [];
    let totalNormal  = 0; // [0] – En Büyük
    let totalEnKucuk = 0; // [1] – En Küçük
    let totalBuyuk   = 0; // [2] – Büyük
    let totalEnBuyuk = 0; // [3] – En Büyük (üst sistem)

    let shamsiK = 0, kamariK = 0;
    const shamsiChars = [], kamariChars = [];

    for (const ch of metin) {
      const letter = ARABIC_DATA[ch];
      if (!letter) continue;

      const vals = arabicMode === 'arabi' ? letter.arabi : letter.normal;
      const [vNormal, vEnKucuk, vBuyuk, vEnBuyuk] = vals;

      totalNormal  += vNormal;
      totalEnKucuk += vEnKucuk;
      totalBuyuk   += vBuyuk;
      totalEnBuyuk += vEnBuyuk;

      chars.push({
        char:    ch,
        name:    letter.n,
        tur:     letter.t,
        vNormal, vEnKucuk, vBuyuk, vEnBuyuk,
      });

      if (letter.t === 'shamsi') {
        shamsiK += vNormal;
        shamsiChars.push({ char: ch, kebir: vNormal });
      } else {
        kamariK += vNormal;
        kamariChars.push({ char: ch, kebir: vNormal });
      }
    }

    if (chars.length === 0) return null;

    return {
      chars,
      enBuyuk:   totalNormal,   // "En Büyük" – standart Kebir değerleri
      enKucuk:   totalEnKucuk,  // "En Küçük"
      buyuk:     totalBuyuk,    // "Büyük" – isim/üst değer
      sBuyuk:    totalEnBuyuk,  // "Süper Büyük (En Büyük sistem)"
      charCount: chars.length,
      shamsiK, kamariK, shamsiChars, kamariChars,
    };
  }

  /**
   * İbranice / Yunanca hesaplama (basit 4 türev)
   */
  function hesaplaOther(metin) {
    const db = getDB();
    const chars = [];
    let total = 0, ordTotal = 0, count = 0;

    for (const ch of metin) {
      const data = db[ch];
      if (!data) continue;
      total    += data.v;
      ordTotal += data.ord;
      count++;
      chars.push({ char: ch, name: data.n, tur: '-', v: data.v, ord: data.ord });
    }

    if (chars.length === 0) return null;

    return {
      chars,
      enBuyuk:   total,
      enKucuk:   ordTotal,
      buyuk:     total + count,  // Kolel
      sBuyuk:    digitalRoot(total),
      charCount: count,
      shamsiK: 0, kamariK: 0, shamsiChars: [], kamariChars: [],
    };
  }

  function hesapla(metin) {
    return activeAlpha === 'arabic' ? hesaplaArabic(metin) : hesaplaOther(metin);
  }

  /* =========================================================
     8. LABEL / AÇIKLAMA SİSTEMİ
  ========================================================= */

  const LABELS = {
    arabic_normal: {
      enBuyuk: 'Küçük',
      enKucuk: 'En Küçük',
      buyuk:   'Büyük',
      sBuyuk:  'En Büyük',
      desc: [
        '1–1000 arası standart Ebced-i Kebir değerleri',
        'Harf başına küçük değer toplamı',
        'Harf isim değerleri toplamı (İsm-i Azam)',
        'Özel üst sistem değeri',
      ],
    },
    arabic_arabi: {
      enBuyuk: 'Küçük (M.Arabi)',
      enKucuk: 'En Küçük (M.Arabi)',
      buyuk:   'Büyük (M.Arabi)',
      sBuyuk:  'En Büyük (M.Arabi)',
      desc: [
        'Muhyiddin-i Arabi – standart değer',
        'Muhyiddin-i Arabi – en küçük değer',
        'Muhyiddin-i Arabi – büyük değer (isim)',
        'Muhyiddin-i Arabi – üst sistem değeri',
      ],
    },
    hebrew: {
      enBuyuk: 'Mispar Gadol (1–900)',
      enKucuk: 'Mispar Siduri (Ordinal)',
      buyuk:   'Mispar Kolel (+1)',
      sBuyuk:  'Mispar Katan (Dijital Kök)',
      desc: [
        'Standart Gematria (Sofit dahil 900\'a kadar)',
        'Ordinal değer (harf sıra numarası)',
        'Kolel: toplam + harf sayısı',
        'Dijital kök (tek basamak)',
      ],
    },
    greek: {
      enBuyuk: 'Tam Değer (1–900)',
      enKucuk: 'Ordinal (1–27)',
      buyuk:   'Kolel (Toplam+Sayı)',
      sBuyuk:  'Dijital Kök',
      desc: [
        'Klasik Yunan sayı değerleri',
        'Alfabe sıra numarası',
        'Toplam + harf sayısı',
        'Dijital kök (tek basamak)',
      ],
    },
  };

  function getLabelSet() {
    if (activeAlpha === 'hebrew') return LABELS.hebrew;
    if (activeAlpha === 'greek')  return LABELS.greek;
    return arabicMode === 'arabi' ? LABELS.arabic_arabi : LABELS.arabic_normal;
  }

  /* =========================================================
     9. UI RENDER
  ========================================================= */

  const CARD_COLORS = ['card-green', 'card-teal', 'card-olive', 'card-sage'];
  let currentEbcedMode = 'enBuyuk'; // varsayılan

  function getCharValueForMode(c, mode) {
    if (activeAlpha === 'arabic') {
      if (mode === 'enBuyuk') return c.vNormal;
      if (mode === 'enKucuk') return c.vEnKucuk;
      if (mode === 'buyuk')   return c.vBuyuk;
      if (mode === 'sBuyuk')  return c.vEnBuyuk;
    } else {
      if (mode === 'enBuyuk') return c.v;
      if (mode === 'enKucuk') return c.ord;
      if (mode === 'buyuk')   return c.v;
      if (mode === 'sBuyuk')  return digitalRoot(c.v);
    }
    return 0;
  }

  function renderSummaryGrid(sonuc) {
    const grid = document.getElementById('ebced-summary-grid');
    if (!grid) return;

    const lbls = getLabelSet();
    const keys  = ['enBuyuk', 'enKucuk', 'buyuk', 'sBuyuk'];

    grid.innerHTML = keys.map(function (k, i) {
      const activeCls = k === currentEbcedMode ? 'active-mode' : '';
      return '<div class="result-card ' + CARD_COLORS[i] + ' ' + activeCls + '" data-mode="' + k + '">' +
               '<p class="rc-label">' + lbls[k] + '</p>' +
               '<p class="rc-value">' + sonuc[k] + '</p>' +
               '<p class="rc-desc">' + lbls.desc[i] + '</p>' +
             '</div>';
    }).join('');

    const lbl = document.getElementById('result-alphabet-label');
    if (lbl) lbl.textContent = getAlphaLabel();

    const cards = grid.querySelectorAll('.result-card');
    cards.forEach(card => {
       card.addEventListener('click', function() {
          const m = this.getAttribute('data-mode');
          if (currentEbcedMode === m) return;
          currentEbcedMode = m;
          
          cards.forEach(c => c.classList.remove('active-mode'));
          this.classList.add('active-mode');

          renderLetterTable(sonuc.chars, m);
          renderCharSummary(sonuc.chars, m);
       });
    });
  }

  function renderLetterTable(chars, mode) {
    const tbody = document.getElementById('ebced-letter-tbody');
    const tableEl = document.getElementById('ebced-letter-table');
    if (!tbody || !tableEl) return;

    const theadRow = tableEl.querySelector('thead tr');
    if (theadRow) {
      theadRow.innerHTML = '<th>Harf</th><th>Okunuş</th><th>Tür</th><th>Değer</th>';
    }

    tbody.innerHTML = chars.map(function (c) {
      let turCell = '–';
      if (activeAlpha === 'arabic') {
        turCell = c.tur === 'shamsi'
          ? '<span class="tag-shamsi">☀️ Şemsi</span>'
          : '<span class="tag-kameri">🌙 Kameri</span>';
      }

      const val = getCharValueForMode(c, mode);
      const displayVal = (val === 0 && mode === 'enKucuk' && activeAlpha === 'arabic') ? '–' : val;

      return '<tr>' +
        '<td class="ar-cell">' + c.char + '</td>' +
        '<td>' + c.name + '</td>' +
        '<td>' + turCell + '</td>' +
        '<td><strong>' + displayVal + '</strong></td>' +
        '</tr>';
    }).join('');
  }

  function renderCharSummary(chars, mode) {
    const el = document.getElementById('ebced-char-summary');
    if (!el) return;
    const map = {};
    chars.forEach(function (c) {
      if (!map[c.char]) map[c.char] = { ...c, adet: 0 };
      map[c.char].adet++;
    });
    el.innerHTML = Object.values(map).map(function (c) {
      const val = getCharValueForMode(c, mode);
      const totalStr = (val * c.adet);
      const displayVal = (val === 0 && mode === 'enKucuk' && activeAlpha === 'arabic') ? '–' : totalStr;

      return '<div class="char-summary-item">' +
               '<span class="cs-harf">' + c.char + '</span>' +
               '<span class="cs-okuyus">' + c.name + '</span>' +
               '<span class="cs-adet">×' + c.adet + '</span>' +
               '<span class="cs-toplam">' + displayVal + '</span>' +
             '</div>';
    }).join('');
  }

  function renderShamsiKamari(sonuc) {
    const section = document.getElementById('shamsi-kamari-section');
    if (!section) return;
    section.style.display = (activeAlpha === 'arabic') ? 'grid' : 'none';
    if (activeAlpha !== 'arabic') return;

    const se = document.getElementById('ebced-shamsi-chars');
    const ke = document.getElementById('ebced-kamari-chars');
    const st = document.getElementById('ebced-shamsi-total');
    const kt = document.getElementById('ebced-kamari-total');

    if (se) se.innerHTML = sonuc.shamsiChars.length
      ? sonuc.shamsiChars.map(c => '<span class="sk-chip shamsi">' + c.char + '<small>' + c.kebir + '</small></span>').join('')
      : '<span class="sk-empty">Şemsi harf yok</span>';

    if (ke) ke.innerHTML = sonuc.kamariChars.length
      ? sonuc.kamariChars.map(c => '<span class="sk-chip kamari">' + c.char + '<small>' + c.kebir + '</small></span>').join('')
      : '<span class="sk-empty">Kameri harf yok</span>';

    if (st) st.textContent = sonuc.shamsiK;
    if (kt) kt.textContent = sonuc.kamariK;
  }

  // ---- Muhyiddin Arabi mode toggle render ----
  function renderArabiToggle() {
    const wrap = document.getElementById('arabi-mode-wrap');
    if (!wrap) return;
    wrap.style.display = (activeAlpha === 'arabic') ? 'flex' : 'none';
  }

  // ---- Referans tablo ----
  function renderRefTable() {
    const head  = document.getElementById('ref-table-head');
    const body  = document.getElementById('ref-table-body');
    const title = document.getElementById('ref-table-title');
    if (!head || !body) return;

    if (activeAlpha === 'arabic') {
      const sys = arabicMode === 'arabi' ? 'Muhyiddin-i Arabi' : 'Normal';
      if (title) title.textContent = '📿 Arapça Harf Değerleri – ' + sys + ' Sistem';
      head.innerHTML = '<tr><th>Harf</th><th>Ad</th><th>En Büyük</th><th>En Küçük</th><th>Büyük</th><th>Üst Değer</th><th>Tür</th></tr>';

      // İlk 28 temel harf (varyantlar hariç)
      const ANA_HARFLER = ['ا','ب','ج','د','ه','و','ز','ح','ط','ي','ك','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];
      body.innerHTML = ANA_HARFLER.map(function (ch) {
        const letter = ARABIC_DATA[ch];
        if (!letter) return '';
        const vals = arabicMode === 'arabi' ? letter.arabi : letter.normal;
        const tur = letter.t === 'shamsi' ? '<span class="tag-shamsi">☀️</span>' : '<span class="tag-kameri">🌙</span>';
        // En Küçük 0 ise '–' göster (değer yok anlamında)
        const enKucukCell = vals[1] === 0 ? '–' : vals[1];
        return '<tr>' +
          '<td class="ar-cell">' + ch + '</td>' +
          '<td>' + letter.n + '</td>' +
          '<td><strong>' + vals[0] + '</strong></td>' +
          '<td>' + enKucukCell + '</td>' +
          '<td>' + vals[2] + '</td>' +
          '<td>' + vals[3] + '</td>' +
          '<td>' + tur + '</td>' +
          '</tr>';
      }).join('');

    } else if (activeAlpha === 'hebrew') {
      if (title) title.textContent = '✡️ İbranice Harf Değerleri (Gematria)';
      head.innerHTML = '<tr><th>Harf</th><th>Ad</th><th>Mispar Gadol</th><th>Ordinal</th></tr>';
      body.innerHTML = HEBREW_KEYS.map(k => {
        const d = HEBREW_DATA[k];
        return d ? '<tr><td class="ar-cell">' + k + '</td><td>' + d.n + '</td><td>' + d.v + '</td><td>' + d.ord + '</td></tr>' : '';
      }).join('');

    } else {
      if (title) title.textContent = '🏛️ Yunanca Harf Değerleri (Isopsephy)';
      head.innerHTML = '<tr><th>Harf</th><th>Ad</th><th>Tam Değer</th><th>Ordinal</th></tr>';
      body.innerHTML = GREEK_KEYS.map(k => {
        const d = GREEK_DATA[k];
        return d ? '<tr><td class="ar-cell">' + k + '</td><td>' + d.n + '</td><td>' + d.v + '</td><td>' + d.ord + '</td></tr>' : '';
      }).join('');
    }
  }

  /* =========================================================
     10. EKRAN KLAVYESİ
  ========================================================= */

  function buildKeyboard() {
    const container = document.getElementById('virtual-keyboard');
    const label     = document.getElementById('vkeyboard-label');
    if (!container) return;

    const keys       = getKeys();
    const alphaName  = activeAlpha === 'arabic' ? 'Arapça' : activeAlpha === 'hebrew' ? 'İbranice' : 'Yunanca';
    if (label) label.textContent = '⌨️ Ekran Klavyesi (' + alphaName + ')';

    container.innerHTML = '';
    container.setAttribute('dir', getDir());

    keys.forEach(function (ch) {
      const data = getDB()[ch];
      const displayVal = activeAlpha === 'arabic'
        ? (data ? (arabicMode === 'arabi' ? data.arabi[0] : data.normal[0]) : '')
        : (data ? data.v : '');

      const btn = document.createElement('button');
      btn.className   = 'vkey';
      btn.type        = 'button';
      btn.title       = data ? (data.n + ' = ' + displayVal) : ch;
      btn.setAttribute('aria-label', (data ? data.n : ch) + ' harfini ekle');
      btn.innerHTML   = '<span class="vkey-char">' + ch + '</span><span class="vkey-val">' + displayVal + '</span>';
      btn.addEventListener('click', function () { insertChar(ch); });
      container.appendChild(btn);
    });
  }

  function insertChar(ch) {
    const input = document.getElementById('ebced-input');
    if (!input) return;
    const s = input.selectionStart;
    const e = input.selectionEnd;
    input.value = input.value.slice(0, s) + ch + input.value.slice(e);
    const pos = s + ch.length;
    input.setSelectionRange(pos, pos);
    input.focus();
  }

  /* =========================================================
     11. ALFABE SEKMELERİ & MOD
  ========================================================= */

  function bindAlphaTabs() {
    document.querySelectorAll('.alpha-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const alpha = this.getAttribute('data-alpha');
        if (alpha === activeAlpha) return;

        activeAlpha = alpha;
        arabicMode  = 'normal'; // tab değişiminde modu sıfırla

        // Tab aktifliği
        document.querySelectorAll('.alpha-tab').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-alpha') === alpha);
          b.setAttribute('aria-selected', String(b.getAttribute('data-alpha') === alpha));
        });

        // Arabi mod toggle görünürlüğü
        renderArabiToggle();
        updateArabiToggleUI();

        // Input ayarları
        const input = document.getElementById('ebced-input');
        const lbl   = document.getElementById('ebced-input-label');
        if (input) {
          input.value = '';
          if (alpha === 'arabic') {
            input.setAttribute('dir', 'rtl'); input.setAttribute('lang', 'ar');
            input.setAttribute('placeholder', 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ');
          } else if (alpha === 'hebrew') {
            input.setAttribute('dir', 'rtl'); input.setAttribute('lang', 'he');
            input.setAttribute('placeholder', 'שָׁלוֹם');
          } else {
            input.setAttribute('dir', 'ltr'); input.setAttribute('lang', 'el');
            input.setAttribute('placeholder', 'αβγδεζ');
          }
        }
        if (lbl) lbl.textContent = alpha === 'arabic' ? 'Arapça Metin' : alpha === 'hebrew' ? 'İbranice Metin' : 'Yunanca Metin';

        buildKeyboard();
        renderRefTable();
        const panel = document.getElementById('ebced-results-panel');
        if (panel) panel.style.display = 'none';
      });
    });
  }

  function bindArabiToggle() {
    const togBtn = document.getElementById('arabi-mode-btn');
    const lbl    = document.getElementById('arabi-mode-label');
    if (!togBtn) return;

    togBtn.addEventListener('click', function () {
      arabicMode = (arabicMode === 'normal') ? 'arabi' : 'normal';
      updateArabiToggleUI();
      buildKeyboard();
      renderRefTable();
      // Eğer sonuç paneli açıksa, yeniden hesapla
      const panel = document.getElementById('ebced-results-panel');
      if (panel && panel.style.display !== 'none') {
        const input = document.getElementById('ebced-input');
        if (input && input.value.trim()) {
          const sonuc = hesapla(input.value.trim());
          if (sonuc) {
            currentEbcedMode = 'enBuyuk'; // Reset view to normal when toggle is clicked
            renderSummaryGrid(sonuc);
            renderLetterTable(sonuc.chars, currentEbcedMode);
            renderCharSummary(sonuc.chars, currentEbcedMode);
            renderShamsiKamari(sonuc);
          }
        }
      }
    });
  }

  function updateArabiToggleUI() {
    const togBtn  = document.getElementById('arabi-mode-btn');
    const togText = document.getElementById('arabi-mode-text');
    if (!togBtn) return;
    const isArabi = arabicMode === 'arabi';
    togBtn.classList.toggle('toggled', isArabi);
    if (togText) togText.textContent = isArabi ? '✔ Muhyiddin-i Arabi aktif' : 'Muhyiddin-i Arabi';
  }

  /* =========================================================
     12. HESAPLA BUTONU
  ========================================================= */

  function bindEbced() {
    const btn    = document.getElementById('ebced-calculate-btn');
    const input  = document.getElementById('ebced-input');
    const panel  = document.getElementById('ebced-results-panel');
    const clrBtn = document.getElementById('ebced-clear-btn');

    if (!btn) return;

    const btnCopyAnalysis = document.getElementById('btn-copy-analysis');
    if (btnCopyAnalysis) {
      btnCopyAnalysis.addEventListener('click', function() {
        const table = document.getElementById('ebced-letter-table');
        if (!table) return;

        let resultHtml = `<table dir="rtl" cellpadding="12" cellspacing="6" style="border-collapse: separate; font-family: Arial, sans-serif; text-align: center;"><tr>`;
        let resultText = "";
        
        const trs = table.querySelectorAll('tbody tr');
        trs.forEach((tr, index) => {
          if (index > 0 && index % 8 === 0) {
            resultHtml += `</tr><tr>`;
            resultText += `\n`;
          }

          const tds = tr.querySelectorAll('td');
          const char = tds[0].innerText.trim();
          const val = tds[3].innerText.trim();
          const order = index + 1; // kaçıncı harf

          // Kara kutu, üstte sıra, ortada harf, altta değer
          resultHtml += `
            <td style="background-color: #1a1a1a; color: #ffffff; min-width: 60px; max-width: 80px; border-radius: 8px;">
              <div style="font-size: 11px; color: #abaaaa; margin-bottom: 8px;">${order}</div>
              <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px; font-family: 'Amiri', serif;">${char}</div>
              <div style="font-size: 16px; color: #facc15; font-weight: bold;">${val}</div>
            </td>
          `;
          
          resultText += `[${order}. Harf: ${char} = ${val}] \t`;
        });
        
        resultHtml += `</tr></table>`;

        // ClipboardItem API ile HTML kopyalama
        try {
           const blobHtml = new Blob([resultHtml], { type: "text/html" });
           const blobText = new Blob([resultText], { type: "text/plain" });
           const clipboardItem = new ClipboardItem({
             "text/html": blobHtml,
             "text/plain": blobText
           });
           
           navigator.clipboard.write([clipboardItem]).then(() => {
             const orig = btnCopyAnalysis.innerHTML;
             btnCopyAnalysis.innerHTML = '✅ Kopyalandı';
             setTimeout(() => { btnCopyAnalysis.innerHTML = orig; }, 2000);
           });
        } catch(e) {
           // Fallback for older browsers
           navigator.clipboard.writeText(resultText).then(() => {
             const orig = btnCopyAnalysis.innerHTML;
             btnCopyAnalysis.innerHTML = '✅ Kopyalandı (Metin)';
             setTimeout(() => { btnCopyAnalysis.innerHTML = orig; }, 2000);
           });
        }
      });
    }

    if (clrBtn) {
      clrBtn.addEventListener('click', function () {
        if (input) { input.value = ''; input.focus(); }
        if (panel) panel.style.display = 'none';
      });
    }

    const spaceBtn     = document.getElementById('vkb-space-btn');
    const backspaceBtn = document.getElementById('vkb-backspace-btn');

    if (spaceBtn) spaceBtn.addEventListener('click', function () { insertChar(' '); });
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', function () {
        if (!input) return;
        const s = input.selectionStart, e = input.selectionEnd;
        if (s === e && s > 0) {
          input.value = input.value.slice(0, s - 1) + input.value.slice(s);
          input.setSelectionRange(s - 1, s - 1);
        } else if (s !== e) {
          input.value = input.value.slice(0, s) + input.value.slice(e);
          input.setSelectionRange(s, s);
        }
        input.focus();
      });
    }

    function doHesapla() {
      const metin = (input ? input.value : '').trim();
      if (!metin) {
        if (input) {
          input.focus();
          input.style.borderColor = '#ef4444';
          setTimeout(() => { input.style.borderColor = ''; }, 1500);
        }
        return;
      }

      const sonuc = hesapla(metin);
      if (!sonuc) {
        alert('Seçili alfabede tanınan harf bulunamadı. Lütfen klavyeyi kullanın.');
        return;
      }

      currentEbcedMode = 'enBuyuk';
      renderSummaryGrid(sonuc);
      renderLetterTable(sonuc.chars, currentEbcedMode);
      renderCharSummary(sonuc.chars, currentEbcedMode);
      renderShamsiKamari(sonuc);

      if (panel) {
        panel.style.display = 'block';
        setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    }

    btn.addEventListener('click', doHesapla);
    if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doHesapla(); });
  }

  /* =========================================================
     13. TAKVİM ÇEVİRİCİ
  ========================================================= */

  const CALENDAR_LABELS = {
    gregorian: 'Gregoryen (Miladi)',
    julian:    'Jülyen',
    hijri:     'Hicri (İslami)',
    persian:   'Cemşidi (İran)',
    hebrew:    'İbrani (Yahudi)',
    rumi:      'Rumi Takvim'
  };

  const CAL_ICONS = {
    gregorian: '🌍',
    julian:    '🏛️',
    hijri:     '🌙',
    persian:   '☀️',
    hebrew:    '✡️',
    rumi:      '📜'
  };

  function updateMonthSelect() {
    const from = document.getElementById('calendar-from').value || 'gregorian';
    const sel  = document.getElementById('calendar-month-sel');
    if (!sel) return;
    const months = CalendarConverter.getMonths(from);
    sel.innerHTML = months.map((m, idx) => `<option value="${idx+1}">${m}</option>`).join('');
  }

  function renderCalendarResults(results, jd) {
    const panel = document.getElementById('calendar-results-panel');
    const grid  = document.getElementById('cal-results-grid');
    const jdLbl = document.getElementById('cal-jd-label');

    if (!panel || !grid) return;

    const cards = Object.keys(results).map(cal => {
      const res = results[cal];
      const isLeap = res.leapYear ? ' (Artık Yıl)' : '';
      return `
        <div class="cal-result-card">
          <h4>${CAL_ICONS[cal]} ${CALENDAR_LABELS[cal]}</h4>
          <p class="cal-res-date">${res.day} ${res.monthName} ${res.year}</p>
          <p class="cal-res-day">${res.weekday}${isLeap}</p>
        </div>
      `;
    }).join('');

    grid.innerHTML = cards;
    if (jdLbl) jdLbl.textContent = 'Jülyen Günü: ' + jd;
    panel.style.display = 'block';
  }

  function bindCalendar() {
    const btn       = document.getElementById('calendar-convert-btn');
    const todayBtn  = document.getElementById('calendar-today-btn');
    const fromSel   = document.getElementById('calendar-from');
    
    if (!btn || !fromSel) return;

    fromSel.addEventListener('change', updateMonthSelect);
    updateMonthSelect();

    function doConvert(y, m, d, from) {
      if (isNaN(y) || isNaN(m) || isNaN(d)) {
        ['calendar-day','calendar-month-sel','calendar-year'].forEach(id => {
          const el = document.getElementById(id);
          if (el && !el.value) {
            el.style.borderColor = '#ef4444';
            setTimeout(() => { el.style.borderColor = ''; }, 1500);
          }
        });
        return;
      }

      const jd = CalendarConverter.toJD(from, y, m, d);
      const results = {};
      Object.keys(CALENDAR_LABELS).forEach(cal => {
        results[cal] = CalendarConverter.convert(from, y, m, d, cal);
      });
      
      renderCalendarResults(results, jd);
    }

    btn.addEventListener('click', function () {
      const d = parseInt(document.getElementById('calendar-day').value);
      const m = parseInt(document.getElementById('calendar-month-sel').value);
      const y = parseInt(document.getElementById('calendar-year').value);
      const from = document.getElementById('calendar-from').value;
      doConvert(y, m, d, from);
    });

    if (todayBtn) {
      todayBtn.addEventListener('click', function() {
        // Bugünü Miladi olarak form set et
        const now = new Date();
        document.getElementById('calendar-from').value = 'gregorian';
        updateMonthSelect();
        
        document.getElementById('calendar-day').value = now.getDate();
        document.getElementById('calendar-month-sel').value = now.getMonth() + 1;
        document.getElementById('calendar-year').value = now.getFullYear();

        const results = CalendarConverter.today();
        const jd = CalendarConverter.toJD('gregorian', now.getFullYear(), now.getMonth() + 1, now.getDate());
        renderCalendarResults(results, jd);
      });
    }
  }

  /* =========================================================
     14. MUSHAF OKUMA (CÜZ 1)
  ========================================================= */
  let currentMushafPage = 1;
  const MUSHAF_TOTAL_PAGES = 604;
  const JUZ_PAGES = [
    1, 22, 42, 62, 82, 102, 122, 142, 162, 182,
    202, 222, 242, 262, 282, 302, 322, 342, 362, 382,
    402, 422, 442, 462, 482, 502, 522, 542, 562, 582
  ];

  function getJuzFromPage(pageNum) {
    for (let i = 29; i >= 0; i--) {
      if (pageNum >= JUZ_PAGES[i]) return i + 1;
    }
    return 1;
  }

  function bindMushaf() {
    const jSelect = document.getElementById('mushaf-juz-select');
    const pSelect = document.getElementById('mushaf-page-select');
    const pPrev = document.getElementById('mushaf-prev-btn');
    const pNext = document.getElementById('mushaf-next-btn');

    if (!pSelect) return;

    if (jSelect) {
        for (let i = 1; i <= 30; i++) {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${i}. Cüz`;
            jSelect.appendChild(opt);
        }
        jSelect.addEventListener('change', function(e) {
            const juzNum = parseInt(e.target.value);
            loadMushafPage(JUZ_PAGES[juzNum - 1]);
        });
    }

    for (let i = 1; i <= MUSHAF_TOTAL_PAGES; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Sayfa ${i}`;
        pSelect.appendChild(opt);
    }

    pSelect.addEventListener('change', function(e) {
        loadMushafPage(parseInt(e.target.value));
    });

    if (pPrev) pPrev.addEventListener('click', () => { if (currentMushafPage > 1) loadMushafPage(currentMushafPage - 1); });
    if (pNext) pNext.addEventListener('click', () => { if (currentMushafPage < MUSHAF_TOTAL_PAGES) loadMushafPage(currentMushafPage + 1); });

    document.addEventListener('selectionchange', handleGlobalSelection);

    const btnCalc = document.getElementById('btn-calc-selection');
    if (btnCalc) {
        btnCalc.addEventListener('click', function() {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) return;
            const text = sel.toString().trim();
            if (text) {
                // Seçilen metni Ebced ekranına yolla
                const input = document.getElementById('ebced-input');
                if (input) input.value = text;
                showPage('ebced');
                
                // Arapça tabını aktif yap
                activeAlpha = 'arabic';
                arabicMode = 'normal';
                document.querySelectorAll('.alpha-tab').forEach(function (b) {
                  b.classList.toggle('active', b.getAttribute('data-alpha') === 'arabic');
                });
                
                // Tooltip'i gizle
                const tooltip = document.getElementById('selection-tooltip');
                if (tooltip) tooltip.style.display = 'none';
                
                // Hesaplama butonunu tetikle
                const clcBtn = document.getElementById('ebced-calculate-btn');
                setTimeout(() => { if (clcBtn) clcBtn.click(); }, 100);
            }
        });
    }

    // İlk sayfa yükle
    loadMushafPage(1);
  }

  function handleGlobalSelection() {
    const tooltip = document.getElementById('selection-tooltip');
    if (!tooltip) return;

    const sel = window.getSelection();
    if (sel.isCollapsed) {
        tooltip.style.display = 'none';
        return;
    }

    const inMushaf = document.getElementById('mushaf-content')?.contains(sel.anchorNode);
    const inDua = document.getElementById('dua-arabic')?.contains(sel.anchorNode);
    const inSurah = document.getElementById('surah-reading-content')?.contains(sel.anchorNode);

    if (!inMushaf && !inDua && !inSurah) {
        tooltip.style.display = 'none';
        return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    tooltip.style.display = 'block';
    // Mouse pozisyonuna getirmek için ortalayalım
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top + window.scrollY) + 'px';
  }

  function loadMushafPage(pageNum) {
    if (pageNum < 1 || pageNum > MUSHAF_TOTAL_PAGES) return;
    currentMushafPage = pageNum;
    
    document.getElementById('mushaf-page-select').value = pageNum;
    const jSelect = document.getElementById('mushaf-juz-select');
    if (jSelect) jSelect.value = getJuzFromPage(pageNum);
    const content = document.getElementById('mushaf-content');
    if (!content) return;

    content.innerHTML = '<div class="mushaf-loading" style="text-align: center; padding: 2rem;">Yükleniyor...</div>';
    document.getElementById('mushaf-prev-btn').disabled = (pageNum === 1);
    document.getElementById('mushaf-next-btn').disabled = (pageNum === MUSHAF_TOTAL_PAGES);

    fetch(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`)
      .then(res => res.json())
      .then(data => {
         if (data.code === 200) {
             let html = '';
             let currentSurah = '';
             data.data.ayahs.forEach(a => {
                 if (a.surah.name !== currentSurah && a.numberInSurah === 1) {
                     html += `<div class="surah-title-banner">${a.surah.name}</div>`;
                     currentSurah = a.surah.name;
                 } else if (!currentSurah) {
                     // Sayfa ortasında başlayan ve surenin ilk ayeti olmayan durumlarda da sayfa başında sure ismini not düşebiliriz (şart değil)
                     currentSurah = a.surah.name;
                 }
                 
                 // Ayet 1 için Bismillah'ı ayıklayıp başlık olarak basıyoruz (Fatiha Suresi hariç - çünkü orada asıl ayet 1).
                 let text = a.text;
                 const bismillahStr = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
                 
                 if (a.numberInSurah === 1 && a.surah.number !== 1 && text.startsWith(bismillahStr) && text.length > bismillahStr.length) {
                     text = text.substring(bismillahStr.length).trim();
                     html += `<div style="text-align:center; font-size:1.4rem; margin-bottom:1rem; color:var(--clr-green-800);">${bismillahStr}</div>`;
                 }
                 
                 // Ayet sonuna arapça rakam ayet numarası ekliyoruz
                 html += `${text} <span class="ayah-marker">۝${toArabicNumbers(a.numberInSurah)}</span> `;
             });
             content.innerHTML = html;
         } else {
             content.innerHTML = '<div style="color:red; text-align:center;">Sayfa yüklenemedi.</div>';
         }
      })
      .catch(err => {
         content.innerHTML = '<div style="color:red; text-align:center;">Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.</div>';
      });
  }

  function toArabicNumbers(num) {
    const arStr = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return num.toString().split('').map(c => arStr[c] || c).join('');
  }

  /* =========================================================
     15. KURAN SAYFASI SURE OKUMA (MEALLİ)
  ========================================================= */
  function bindQuranSurahs() {
    const rows = document.querySelectorAll('.clickable-surah');
    const readingCard = document.getElementById('surah-reading-card');
    const readingTitle = document.getElementById('surah-reading-title');
    const readingContent = document.getElementById('surah-reading-content');
    const closeBtn = document.getElementById('close-surah-btn');

    if (closeBtn) {
       closeBtn.addEventListener('click', () => { readingCard.style.display = 'none'; });
    }

    rows.forEach(row => {
       row.style.cursor = 'pointer';
       row.title = "Sureyi mealiyle okumak için tıklayın";
       row.addEventListener('click', function() {
          const surahId = this.getAttribute('data-surah');
          const surahName = this.cells[1].innerText;
          if (!surahId) return;

          readingCard.style.display = 'block';
          readingTitle.innerText = surahName + ' Suresi Yükleniyor...';
          readingContent.innerHTML = '<div class="mushaf-loading" style="text-align:center; padding: 2rem;">Yükleniyor...</div>';
          
          readingCard.scrollIntoView({behavior: 'smooth', block: 'start'});

          Promise.all([
             fetch(`https://api.alquran.cloud/v1/surah/${surahId}/quran-uthmani`).then(r => r.json()),
             fetch(`https://api.alquran.cloud/v1/surah/${surahId}/tr.diyanet`).then(r => r.json())
          ]).then(([arRes, trRes]) => {
             if (arRes.code === 200 && trRes.code === 200) {
                 readingTitle.innerText = arRes.data.name + ' (' + surahName + ')';
                 let html = '<div class="surah-ayahs-wrap" style="display:flex; flex-direction:column; gap:2rem; margin-top: 1rem;">';
                 const arAyahs = arRes.data.ayahs;
                 const trAyahs = trRes.data.ayahs;
                 
                 for (let i = 0; i < arAyahs.length; i++) {
                     let arText = arAyahs[i].text;
                     let trText = trAyahs[i].text;
                     let num = arAyahs[i].numberInSurah;
                     
                     const bismillah = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
                     if (num === 1 && surahId !== "1" && arText.startsWith(bismillah) && arText.length > bismillah.length) {
                         arText = arText.substring(bismillah.length).trim();
                         if (i === 0) {
                             html += `<div style="text-align:center; font-family:'Amiri', serif; font-size:1.8rem; margin-bottom:1rem; color:var(--clr-green-800);">${bismillah}</div>`;
                         }
                     }

                     html += `
                        <div style="background:#fcfcfc; padding:1.5rem; border-radius:16px; border:1px solid var(--clr-green-100); position: relative; box-shadow: var(--shadow-sm);">
                           <span style="position: absolute; top: -12px; left: 20px; background: var(--clr-green-600); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; border: 2px solid white;">Ayet ${num}</span>
                           <div style="font-family:'Amiri', serif; font-size: 2.2rem; text-align: right; direction: rtl; margin-bottom: 1.5rem; line-height: 2.4; color: #111827;">${arText} <span class="ayah-marker" style="color:var(--clr-green-700); font-size:1.4rem;">۝${toArabicNumbers(num)}</span></div>
                           <div style="font-size: 1.05rem; line-height: 1.7; color: #374151; padding-top: 1.2rem; border-top: 1px dashed var(--clr-gray-200);">${trText}</div>
                        </div>
                     `;
                 }
                 html += '</div>';
                 readingContent.innerHTML = html;
             } else {
                 readingContent.innerHTML = '<div style="color:red; text-align:center;">Sure yüklenemedi.</div>';
             }
          }).catch(err => {
             readingContent.innerHTML = '<div style="color:red; text-align:center;">Bağlantı hatası oluştu.</div>';
          });
       });
    });
  }

  /* =========================================================
     16. DUALAR SAYFASI
  ========================================================= */
  const DUALAR = [
    {
      id: "fatiha",
      name: "Fatiha Suresi",
      ar: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      tr: "Bismillâhirrahmânirrahîm. Elhamdü lillâhi rabbil'alemin. Errahmânir'rahim. Mâliki yevmiddin. İyyâka na'budü ve iyyâka neste'în. İhdinessırâtel müstakîm. Sırâtellezine en'amte aleyhim, ğayrilmağdûbi aleyhim ve leddâllîn.",
      meal: "Rahmân ve Rahîm olan Allah'ın adıyla. Hamd, âlemlerin Rabbi, Rahmân, Rahîm ve din gününün sahibi olan Allah'a mahsustur. (Allahım!) Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz. Bizi doğru yola, kendilerine nimet verdiklerinin yoluna ilet; gazaba uğrayanlarınkine ve sapıklarınkine değil."
    },
    {
      id: "ayetelkursi",
      name: "Âyet-el Kürsî",
      ar: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
      tr: "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm, lâ te'huzühu sinetün velâ nevm, lehu mâ fissemâvâti ve ma fil'ard, men zellezi yeşfeu indehu illâ bi'iznih, ya'lemü mâ beyne eydiyhim vemâ halfehüm, velâ yühîtûne bi'şey'im min ilmihî illâ bima şâe vesia kürsiyyühüssemâvâti vel'ard, velâ yeûdühû hıfzuhümâ ve hüvel aliyyül azim.",
      meal: "Allah kendisinden başka hiçbir ilah olmayandır. Diridir, kayyumdur. Onu ne bir uyuklama tutabilir, ne de bir uyku. Göklerdeki her şey, yerdeki her şey onundur. İzni olmaksızın onun katında şefaatte bulunacak kimdir? O, kulların önlerindekileri ve arkalarındakileri bilir. Onlar onun ilminden, kendisinin dilediği kadarından başka bir şey kavrayamazlar. Onun kürsüsü gökleri ve yeri kaplamıştır. Onları korumak ona güç gelmez. O, yücedir, büyüktür."
    },
    {
      id: "subhaneke",
      name: "Sübhâneke Duası",
      ar: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَهَ غَيْرُكَ",
      tr: "Sübhânekellâhümme ve bi hamdik ve tebârakesmük ve teâlâ ceddük ve lâ ilâhe ğayrük.",
      meal: "Allah'ım! Sen eksik sıfatlardan pak ve uzaksın. Seni daima böyle tenzih eder ve överim. Senin adın mübarektir. Varlığın her şeyden üstündür. Senden başka ilah yoktur."
    },
    {
      id: "ihlas",
      name: "İhlas Suresi",
      ar: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
      tr: "Kul hüvellâhü ehad. Allâhüssamed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad.",
      meal: "De ki: O, Allah birdir. Allah sameddir. O, doğurmamış ve doğmamıştır. Onun hiçbir dengi yoktur."
    },
    {
      id: "felak",
      name: "Felâk Suresi",
      ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      tr: "Kul e'ûzü birabbil felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrinneffâsâti fil'ukad. Ve min şerri hâsidin izâ hased.",
      meal: "De ki: Yarattığı şeylerin kötülüğünden, karanlığı çöktüğü zaman gecenin kötülüğünden, düğümlere üfleyenlerin kötülüğünden, haset ettiği zaman hasetçinin kötülüğünden, sabah aydınlığının Rabbine sığınırım."
    },
    {
      id: "nas",
      name: "Nâs Suresi",
      ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ ۝ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
      tr: "Kul e'ûzü birabbin nâs. Melikin nâs. İlâhin nâs. Min şerril vesvâsil hannâs. Ellezî yüvesvisü fî sudûrin nâs. Minel cinneti ven nâs.",
      meal: "De ki: Cinlerden ve insanlardan; insanların kalplerine vesvese veren sinsi vesvesecinin kötülüğünden, insanların Rabbine, insanların Melik'ine, insanların İlah'ına sığınırım."
    },
    {
      id: "asr",
      name: "Asr Suresi",
      ar: "وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
      tr: "Vel asr. İnnel insane le fi husr. İllellezîne âmenû ve amilûs sâlihâti ve tevâsav bil hakkı ve tevâsav bis sabr.",
      meal: "Asra yemin olsun ki, insan mutlaka ziyandadır. Ancak iman edenler, salih amel işleyenler, birbirlerine hakkı tavsiye edenler ve sabrı tavsiye edenler bunun dışındadır."
    },
    {
      id: "kevser",
      name: "Kevser Suresi",
      ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
      tr: "İnnâ a'taynâkel kevser. Fesalli lirabbike venhar. İnne şâni'eke hüvel'ebter.",
      meal: "Şüphesiz biz sana Kevser'i verdik. O halde, Rabbin için namaz kıl, kurban kes. Doğrusu sana kin besleyendir, asıl soyu kesik olan."
    },
    {
      id: "kafirun",
      name: "Kâfirûn Suresi",
      ar: "قُلْ يَا أَيُّهَا الْكَافِرُونَ ۝ لَا أَعْبُدُ مَا تَعْبُدُونَ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ ۝ وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ ۝ لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
      tr: "Kul yâ eyyühel kâfirûn. Lâ a'büdü mâ ta'büdûn. Ve lâ entüm âbidûne mâ a'büd. Ve lâ ene âbidün mâ abedtüm. Ve lâ entüm âbidûne mâ a'büd. Leküm dînüküm veliye dîn.",
      meal: "De ki: Ey kafirler! Ben sizin tapmakta olduklarınıza tapmam. Siz de benim taptığıma tapmıyorsunuz. Ben de sizin taptıklarınıza asla tapacak değilim. Evet, siz de benim taptığıma tapıyor değilsiniz. Sizin dininiz size, benim dinim banadır."
    },
    {
      id: "nasr",
      name: "Nasr Suresi",
      ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ ۝ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ۝ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا",
      tr: "İzâ câe nasrullahi velfeth. Ve raeytennâse yedhulûne fî dînillâhi efvâcâ. Fesebbih bihamdi rabbike vestağfirh, İnnehû kâne tevvâbâ.",
      meal: "Allah'ın yardımı ve fetih geldiğinde, insanların dalga dalga Allah'ın dinine girdiklerini gördüğünde, Rabbini överek tespih et ve Ondan bağışlama dile. Çünkü O, tövbeleri çok kabul edendir."
    },
    {
      id: "tebbet",
      name: "Tebbet Suresi",
      ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ۝ مَا أَغْنَى عَنْهُ مَالُهُ وَمَا كَسَبَ ۝ سَيَصْلَى نَارًا ذَاتَ لَهَبٍ ۝ وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ ۝ فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ",
      tr: "Tebbet yedâ ebî lehebin ve tebb. Mâ ağnâ anhü mâlühû ve mâ keseb. Seyaslâ nâren zâte leheb. Vemraetühû hammâletelhatab. Fî cîdihâ hablün min mesed.",
      meal: "Ebu Leheb'in iki eli kurusun! Kurudu da. Malı ve kazandıkları ona fayda vermedi. O, alevli bir ateşe girecektir. Boynunda bükülmüş hurma liflerinden bir ip olduğu halde sırtında odun taşıyarak karısı da o ateşe girecektir."
    },
    {
      id: "fil",
      name: "Fil Suresi",
      ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ۝ أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ ۝ وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ۝ تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ ۝ فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ",
      tr: "Elem tera keyfe fe'ale rabbüke biashâbilfîl. Elem yec'al keydehüm fî tadlîl. Ve ersele aleyhim tayran ebâbîl. Termîhim bihicâratin min siccîl. Fece'alehüm ke'asfin me'kûl.",
      meal: "Rabbinin fil sahiplerine ne yaptığını görmedin mi? Onların tuzaklarını boşa çıkarmadı mı? Üzerlerine sürü sürü kuşlar gönderdi. Onlara çamurdan sertleşmiş taşlar atıyorlardı. Nihayet onları yenilmiş ekin yaprakları haline getirdi."
    },
    {
      id: "kureys",
      name: "Kureyş Suresi",
      ar: "لِإِيلَافِ قُرَيْشٍ ۝ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ ۝ فَلْيَعْبُدُوا رَبَّ هَذَا الْبَيْتِ ۝ الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ",
      tr: "Li'îlâfi Kurayş. Îlâfihim rihleteşşitâi vessayf. Felya'büdû rabbe hâzelbeyt. Ellezî et'amehüm min cû'in ve âmenehüm min havf.",
      meal: "Kureyş'i ısındırıp alıştırdığı; onları kışın ve yazın yaptıkları yolculuğa ısındırıp anlaştırdığı için, Kureyş de kendilerini besleyip açlıklarını gideren ve onları korkudan emin kılan bu evin (Kâbe'nin) Rabbine kulluk etsinler."
    },
    {
      id: "maun",
      name: "Maun Suresi",
      ar: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ ۝ فَوَيْلٌ لِلْمُصَلِّينَ ۝ الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ ۝ الَّذِينَ هُمْ يُرَاءُونَ ۝ وَيَمْنَعُونَ الْمَاعُونَ",
      tr: "Era'eytellezî yükezzibü biddîn. Fezâlikellezî yedu'ulyetîm. Velâ yehuddu alâ ta'âmilmiskîn. Feveylün lilmusallîn. Ellezîne hüm an salâtihim sâhûn. Ellezîne hüm yürâûn. Veyemne'ûnelmâ'ûn.",
      meal: "Dini (hesap gününü) yalanlayanı gördün mü? İşte o, yetimi itip kakan, yoksulu doyurmaya teşvik etmeyen kimsedir. Yazıklar olsun o namaz kılanlara ki, onlar namazlarını ciddiye almazlar. Onlar gösteriş yaparlar. Ufacık bir yardıma bile engel olurlar."
    }
  ];

  function bindDualar() {
    const dSelect = document.getElementById('dua-select');
    const dTitle = document.getElementById('dua-title');
    const dArabic = document.getElementById('dua-arabic');
    const dTurkce = document.getElementById('dua-turkce');
    const dMeal = document.getElementById('dua-meal');

    if (!dSelect || !dTitle) return;

    DUALAR.forEach((dua, index) => {
      const opt = document.createElement('option');
      opt.value = index;
      opt.textContent = dua.name;
      dSelect.appendChild(opt);
    });

    function loadDua(index) {
      const dua = DUALAR[index];
      if (!dua) return;
      dTitle.textContent = dua.name;
      dArabic.textContent = dua.ar;
      dTurkce.textContent = dua.tr;
      dMeal.textContent = dua.meal;
    }

    dSelect.addEventListener('change', function(e) {
      loadDua(parseInt(e.target.value));
    });

    loadDua(0);
  }

  /* =========================================================
     18. NAMAZ VAKİTLERİ SAYFASI
  ========================================================= */
  let vakitInterval = null;

  function bindVakitler() {
    const citySelect = document.getElementById('vakit-city');
    if (!citySelect) return;

    citySelect.addEventListener('change', fetchVakitler);
    
    // Yalnızca sayfa ilk kez gösterildiğinde vakitleri çekmek için de bir kontrol eklenebilir, 
    // ancak şehir listesi hazır olduğundan direkt çekebiliriz.
    fetchVakitler();
  }

  function fetchVakitler() {
    const citySelect = document.getElementById('vakit-city');
    if (!citySelect) return;
    
    const city = citySelect.value;
    const loading = document.getElementById('vakit-loading');
    const error = document.getElementById('vakit-error');
    const content = document.getElementById('vakit-content');

    loading.style.display = 'block';
    error.style.display = 'none';
    content.style.display = 'none';

    if (vakitInterval) {
        clearInterval(vakitInterval);
    }

    // Aladhan API, method=13 (Diyanet)
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Turkey&method=13`)
        .then(res => res.json())
        .then(data => {
            loading.style.display = 'none';
            if (data && data.code === 200) {
                content.style.display = 'block';
                const timings = data.data.timings;
                
                document.getElementById('time-imsak').innerText = timings.Imsak;
                document.getElementById('time-gunes').innerText = timings.Sunrise;
                document.getElementById('time-ogle').innerText = timings.Dhuhr;
                document.getElementById('time-ikindi').innerText = timings.Asr;
                document.getElementById('time-aksam').innerText = timings.Maghrib;
                document.getElementById('time-yatsi').innerText = timings.Isha;

                startVakitCountdown(timings);
            } else {
                error.style.display = 'block';
            }
        })
        .catch(err => {
            loading.style.display = 'none';
            error.style.display = 'block';
        });
  }

  function startVakitCountdown(timings) {
     const vNames = [
        { id: 'Imsak', tr: 'İmsak', card: 'card-imsak' },
        { id: 'Sunrise', tr: 'Güneş', card: 'card-gunes' },
        { id: 'Dhuhr', tr: 'Öğle', card: 'card-ogle' },
        { id: 'Asr', tr: 'İkindi', card: 'card-ikindi' },
        { id: 'Maghrib', tr: 'Akşam', card: 'card-aksam' },
        { id: 'Isha', tr: 'Yatsı', card: 'card-yatsi' }
     ];

     function update() {
         const now = new Date();
         const h = now.getHours();
         const m = now.getMinutes();
         const s = now.getSeconds();
         const msSinceMidnight = (h * 3600 + m * 60 + s) * 1000;

         let nextVakit = null;
         let nextMs = 0;
         let currentCardId = null;

         // Find next vakit
         for (let i = 0; i < vNames.length; i++) {
             const tData = timings[vNames[i].id].split(':'); 
             const vMs = (parseInt(tData[0]) * 3600 + parseInt(tData[1]) * 60) * 1000;
             if (vMs > msSinceMidnight) {
                 nextVakit = vNames[i];
                 nextMs = vMs;
                 currentCardId = i === 0 ? vNames[vNames.length-1].card : vNames[i-1].card;
                 break;
             }
         }

         // If all passed, next is tomorrow's Imsak
         if (!nextVakit) {
             nextVakit = vNames[0];
             const tData = timings[vNames[0].id].split(':'); 
             nextMs = ((parseInt(tData[0]) + 24) * 3600 + parseInt(tData[1]) * 60) * 1000;
             currentCardId = vNames[vNames.length-1].card;
         }

         // Highlight current vakit card
         vNames.forEach(v => {
            const card = document.getElementById(v.card);
            if (card) {
                card.style.borderColor = 'var(--clr-green-200)';
                card.style.background = 'var(--clr-surface)';
                card.style.borderWidth = '1px';
            }
         });
         const curr = document.getElementById(currentCardId);
         if (curr) {
            curr.style.borderColor = 'var(--clr-green-600)';
            curr.style.background = '#f0fdf4'; // Light green
            curr.style.borderWidth = '2px';
         }

         document.getElementById('vakit-next-label').innerText = nextVakit.tr + ' Vaktine Kalan Süre';

         let diff = Math.floor((nextMs - msSinceMidnight) / 1000);
         const dh = Math.floor(diff / 3600);
         diff -= dh * 3600;
         const dm = Math.floor(diff / 60);
         const ds = diff % 60;

         document.getElementById('vakit-countdown').innerText = 
             String(dh).padStart(2, '0') + ':' + 
             String(dm).padStart(2, '0') + ':' + 
             String(ds).padStart(2, '0');
     }

     update();
     vakitInterval = setInterval(update, 1000);
  }

  /* =========================================================
     19. BAŞLATMA
  ========================================================= */

  function init() {
    bindNavigation();
    bindMobileMenu();
    bindAlphaTabs();
    bindArabiToggle();
    renderArabiToggle();
    buildKeyboard();
    renderRefTable();
    bindEbced();
    bindCalendar();
    bindMushaf();
    bindQuranSurahs();
    bindDualar();
    bindVakitler();
    showPage('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
