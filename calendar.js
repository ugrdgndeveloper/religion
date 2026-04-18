/**
 * calendar.js  –  Takvim algoritmaları
 * Kaynak: John Walker – https://fourmilab.ch/documents/calendar/ (Public Domain)
 * Uyarlandı: İslami Rehber projesi
 *
 * Desteklenen takvimler:
 *   gregorian  – Miladi (Gregoryen)
 *   julian     – Jülyen
 *   hijri      – Hicri (İslam Takvimi)
 *   persian    – Cemşidi / İran Takvimi (astronomik)
 *   hebrew     – İbrani Takvimi
 *   rumi       – Rumi Takvimi (Jülyen bazlı Osmanlı)
 */

(function (global) {
  'use strict';

  /* =========================================================
     YARDIMCI FONKSİYONLAR
  ========================================================= */
  function mod(a, b) { return a - (b * Math.floor(a / b)); }
  function amod(a, b) { return mod(a - 1, b) + 1; }

  /* =========================================================
     GREGORİEN
  ========================================================= */
  var GREGORIAN_EPOCH = 1721425.5;

  function leapGregorian(year) {
    return (year % 4 === 0) && !((year % 100 === 0) && (year % 400 !== 0));
  }

  function gregorianToJD(year, month, day) {
    return (GREGORIAN_EPOCH - 1) +
      (365 * (year - 1)) +
      Math.floor((year - 1) / 4) +
      (-Math.floor((year - 1) / 100)) +
      Math.floor((year - 1) / 400) +
      Math.floor((((367 * month) - 362) / 12) +
        (month <= 2 ? 0 : (leapGregorian(year) ? -1 : -2)) + day);
  }

  function jdToGregorian(jd) {
    var wjd = Math.floor(jd - 0.5) + 0.5;
    var depoch = wjd - GREGORIAN_EPOCH;
    var quadricent = Math.floor(depoch / 146097);
    var dqc = mod(depoch, 146097);
    var cent = Math.floor(dqc / 36524);
    var dcent = mod(dqc, 36524);
    var quad = Math.floor(dcent / 1461);
    var dquad = mod(dcent, 1461);
    var yindex = Math.floor(dquad / 365);
    var year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent === 4) || (yindex === 4))) { year++; }
    var yearday = wjd - gregorianToJD(year, 1, 1);
    var leapadj = (wjd < gregorianToJD(year, 3, 1)) ? 0 : (leapGregorian(year) ? 1 : 2);
    var month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    var day = (wjd - gregorianToJD(year, month, 1)) + 1;
    return [year, month, day];
  }

  /* =========================================================
     JÜLİEN
  ========================================================= */
  var JULIAN_EPOCH = 1721423.5;

  function leapJulian(year) { return mod(year, 4) === (year > 0 ? 0 : 3); }

  function julianToJD(year, month, day) {
    if (year < 1) { year++; }
    if (month <= 2) { year--; month += 12; }
    return (Math.floor(365.25 * (year + 4716)) +
            Math.floor(30.6001 * (month + 1)) +
            day) - 1524.5;
  }

  function jdToJulian(td) {
    td += 0.5;
    var z = Math.floor(td);
    var a = z;
    var b = a + 1524;
    var c = Math.floor((b - 122.1) / 365.25);
    var d = Math.floor(365.25 * c);
    var e = Math.floor((b - d) / 30.6001);
    var month = Math.floor(e < 14 ? e - 1 : e - 13);
    var year = Math.floor(month > 2 ? c - 4716 : c - 4715);
    var day = b - d - Math.floor(30.6001 * e);
    if (year < 1) { year--; }
    return [year, month, day];
  }

  /* =========================================================
     HİCRİ (İslam Takvimi)
  ========================================================= */
  var ISLAMIC_EPOCH = 1948439.5;

  function leapIslamic(year) { return ((year * 11) + 14) % 30 < 11; }

  function islamicToJD(year, month, day) {
    return (day +
            Math.ceil(29.5 * (month - 1)) +
            (year - 1) * 354 +
            Math.floor((3 + (11 * year)) / 30) +
            ISLAMIC_EPOCH) - 1;
  }

  function jdToIslamic(jd) {
    jd = Math.floor(jd) + 0.5;
    var year = Math.floor(((30 * (jd - ISLAMIC_EPOCH)) + 10646) / 10631);
    var month = Math.min(12, Math.ceil((jd - (29 + islamicToJD(year, 1, 1))) / 29.5) + 1);
    var day = (jd - islamicToJD(year, month, 1)) + 1;
    return [year, month, day];
  }

  /* =========================================================
     CEMŞİDİ / İRAN TAKVİMİ (Basit algoritmik – astronomik değil)
     Noruz = 21 Mart Gregoryen
     Not: Çok hassas tarihler için astronomik hesap gerekir;
          1800–2100 arası "Nowruz 21 Mart" varsayımı yeterlidir.
  ========================================================= */
  var PERSIAN_EPOCH_JD = 1948319.5; // 22 Mart 622 CE (Gregoryen)

  // Basit döngüsel artık yıl döngüsü (2820 yıllık büyük döngü)
  function leapPersian(year) {
    return ((((year - (year > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682) % 2816 < 682;
  }

  function persianToJD(year, month, day) {
    var epbase = year - (year >= 0 ? 474 : 473);
    var epyear = 474 + mod(epbase, 2820);
    return day +
      (month <= 6 ? (month - 1) * 31 : ((month - 1) * 30) + 6) +
      Math.floor((epyear * 682 - 110) / 2816) +
      (epyear - 1) * 365 +
      Math.floor(epbase / 2820) * 1029983 +
      (PERSIAN_EPOCH_JD - 1);
  }

  function jdToPersian(jd) {
    jd = Math.floor(jd) + 0.5;
    var depoch = jd - persianToJD(475, 1, 1);
    var cycle = Math.floor(depoch / 1029983);
    var cyear = mod(depoch, 1029983);
    var ycycle;
    if (cyear === 1029982) {
      ycycle = 2820;
    } else {
      var aux1 = Math.floor(cyear / 366);
      var aux2 = mod(cyear, 366);
      ycycle = Math.floor(((2134 * aux1) + (2816 * aux2) + 2815) / 1028522) + aux1 + 1;
    }
    var year = ycycle + (2820 * cycle) + 474;
    if (year <= 0) { year--; }
    var yday = (jd - persianToJD(year, 1, 1)) + 1;
    var month = (yday <= 186) ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    var day = jd - persianToJD(year, month, 1) + 1;
    return [year, month, day];
  }

  /* =========================================================
     İBRANİ TAKVİMİ
  ========================================================= */
  var HEBREW_EPOCH = 347995.5;

  function hebrewLeap(year) { return mod((year * 7) + 1, 19) < 7; }
  function hebrewYearMonths(year) { return hebrewLeap(year) ? 13 : 12; }

  function hebrewDelay1(year) {
    var months = Math.floor(((235 * year) - 234) / 19);
    var parts = 12084 + (13753 * months);
    var day = (months * 29) + Math.floor(parts / 25920);
    if (mod((3 * (day + 1)), 7) < 3) { day++; }
    return day;
  }
  function hebrewDelay2(year) {
    var last = hebrewDelay1(year - 1);
    var present = hebrewDelay1(year);
    var next = hebrewDelay1(year + 1);
    return ((next - present) === 356) ? 2 : (((present - last) === 382) ? 1 : 0);
  }
  function hebrewYearDays(year) {
    return hebrewToJD(year + 1, 7, 1) - hebrewToJD(year, 7, 1);
  }
  function hebrewMonthDays(year, month) {
    if (month === 2 || month === 4 || month === 6 || month === 10 || month === 13) return 29;
    if (month === 12 && !hebrewLeap(year)) return 29;
    if (month === 8 && !(mod(hebrewYearDays(year), 10) === 5)) return 29;
    if (month === 9 && (mod(hebrewYearDays(year), 10) === 3)) return 29;
    return 30;
  }
  function hebrewToJD(year, month, day) {
    var jd = HEBREW_EPOCH + hebrewDelay1(year) + hebrewDelay2(year) + day + 1;
    var months = hebrewYearMonths(year);
    if (month < 7) {
      for (var mon = 7; mon <= months; mon++) jd += hebrewMonthDays(year, mon);
      for (var mon = 1; mon < month; mon++) jd += hebrewMonthDays(year, mon);
    } else {
      for (var mon = 7; mon < month; mon++) jd += hebrewMonthDays(year, mon);
    }
    return jd;
  }
  function jdToHebrew(jd) {
    jd = Math.floor(jd) + 0.5;
    var count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    var year = count - 1;
    for (var i = count; jd >= hebrewToJD(i, 7, 1); i++) { year++; }
    var first = (jd < hebrewToJD(year, 1, 1)) ? 7 : 1;
    var month = first;
    for (i = first; jd > hebrewToJD(year, i, hebrewMonthDays(year, i)); i++) { month++; }
    var day = (jd - hebrewToJD(year, month, 1)) + 1;
    return [year, month, day];
  }

  /* =========================================================
     RUMİ TAKVİM (Osmanlı / Jülyen tabanlı, hicri başlangıç farkı)
     Rumi = Jülyen – farkı 584 yıl (1 Mart 45 BC Julian → 1 Muharrem 1 Hicri'ye göre uyarlama)
     Basit yaklaşım: Rumi Yılı = Jülyen Yılı – 584
     (Örnek: Miladi 1900 = Rumi 1315/1316)
  ========================================================= */
  var RUMI_OFFSET = 584;

  function juliannToRumi(jYear, jMonth, jDay) {
    // Rumi yılı = Jülyen yılı - 584 (yaklaşık)
    var rumiYear = jYear - RUMI_OFFSET;
    return [rumiYear, jMonth, jDay];
  }

  function rumiToJulian(rYear, rMonth, rDay) {
    return [rYear + RUMI_OFFSET, rMonth, rDay];
  }

  /* =========================================================
     JULIA GÜN SAYISI ↔ HAFTA GÜNÜ
  ========================================================= */
  function jwday(jd) { return mod(Math.floor(jd + 1.5), 7); }

  /* =========================================================
     AY ADLARI
  ========================================================= */
  var MONTHS = {
    gregorian: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
    julian:    ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
    hijri:     ['Muharrem','Safer','Rebiülevvel','Rebiülahir',
                'Cemaziyelevvel','Cemaziyelahir','Recep','Şaban',
                'Ramazan','Şevval','Zilkade','Zilhicce'],
    persian:   ['Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar',
                'Mehr','Aban','Azar','Dey','Bahman','Esfand'],
    hebrew:    ['Nisan','İyar','Sivan','Tammuz','Av','Elul',
                'Tişri','Heshvan','Kislev','Tevet','Şevat','Adar','Adar II'],
    rumi:      ['Kânûn-i Sânî','Şubat','Mart','Nisan','Mayıs','Haziran',
                'Temmuz','Ağustos','Eylül','Teşrîn-i Evvel','Teşrîn-i Sânî','Kânûn-i Evvel'],
  };

  var WEEKDAYS = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];

  /* =========================================================
     ANA DÖNÜŞTÜRÜCÜ
  ========================================================= */

  /**
   * Herhangi bir takvimden Julian Günü hesapla
   */
  function toJD(cal, year, month, day) {
    switch (cal) {
      case 'gregorian': return gregorianToJD(year, month, day);
      case 'julian':    return julianToJD(year, month, day);
      case 'hijri':     return islamicToJD(year, month, day);
      case 'persian':   return persianToJD(year, month, day);
      case 'hebrew':    return hebrewToJD(year, month, day);
      case 'rumi': {
        var j = rumiToJulian(year, month, day);
        return julianToJD(j[0], j[1], j[2]);
      }
      default: throw new Error('Bilinmeyen takvim: ' + cal);
    }
  }

  /**
   * Julian Günden herhangi bir takvime çevir
   */
  function fromJD(cal, jd) {
    switch (cal) {
      case 'gregorian': return jdToGregorian(jd);
      case 'julian':    return jdToJulian(jd);
      case 'hijri':     return jdToIslamic(jd);
      case 'persian':   return jdToPersian(jd);
      case 'hebrew':    return jdToHebrew(jd);
      case 'rumi': {
        var j = jdToJulian(jd);
        return juliannToRumi(j[0], j[1], j[2]);
      }
      default: throw new Error('Bilinmeyen takvim: ' + cal);
    }
  }

  /**
   * Ana dönüştürme fonksiyonu
   * @returns { year, month, day, monthName, weekday, jd, leapYear }
   */
  function convert(fromCal, year, month, day, toCal) {
    var jd = toJD(fromCal, year, month, day);
    var result = fromJD(toCal, jd);
    var rYear = result[0], rMonth = result[1], rDay = Math.floor(result[2]);

    var monthNames = MONTHS[toCal] || [];
    var monthName = monthNames[rMonth - 1] || String(rMonth);

    var wd = jwday(jd);
    var weekday = WEEKDAYS[wd];

    // Artık yıl bilgisi
    var leap = false;
    if (toCal === 'gregorian') leap = leapGregorian(rYear);
    else if (toCal === 'julian') leap = leapJulian(rYear);
    else if (toCal === 'hijri') leap = leapIslamic(rYear);
    else if (toCal === 'persian') leap = leapPersian(rYear);

    return {
      year: rYear,
      month: rMonth,
      day: rDay,
      monthName: monthName,
      weekday: weekday,
      jd: jd,
      leapYear: leap,
    };
  }

  /**
   * Bugünün tarihini tüm takvimler için döndür
   */
  function today() {
    var now = new Date();
    var jd = gregorianToJD(now.getFullYear(), now.getMonth() + 1, now.getDate());
    var results = {};
    ['gregorian','julian','hijri','persian','hebrew','rumi'].forEach(function (cal) {
      var r = fromJD(cal, jd);
      var mn = (MONTHS[cal] || [])[r[1] - 1] || String(r[1]);
      results[cal] = {
        year: r[0], month: r[1], day: Math.floor(r[2]),
        monthName: mn,
        weekday: WEEKDAYS[jwday(jd)],
        jd: jd,
      };
    });
    return results;
  }

  /**
   * Ay adları listesini döndür
   */
  function getMonths(cal) { return MONTHS[cal] || []; }

  /* =========================================================
     EXPORT
  ========================================================= */
  global.CalendarConverter = {
    convert: convert,
    today: today,
    getMonths: getMonths,
    MONTHS: MONTHS,
    WEEKDAYS: WEEKDAYS,
    toJD: toJD,
    fromJD: fromJD,
  };

})(typeof window !== 'undefined' ? window : this);
