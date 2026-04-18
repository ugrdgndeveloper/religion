const ARABIC_DATA = {
  'ا': { vNormal: 1 },
  'أ': { vNormal: 1 },
  'إ': { vNormal: 1 },
  'آ': { vNormal: 1 },
  'ء': { vNormal: 1 },
  'ٱ': { vNormal: 1 },
  'ب': { vNormal: 2 },
  'س': { vNormal: 60 },
  'م': { vNormal: 40 },
  'ل': { vNormal: 30 },
  'ه': { vNormal: 5 },
  'ر': { vNormal: 200 },
  'ح': { vNormal: 8 },
  'ن': { vNormal: 50 },
  'ي': { vNormal: 10 },
  'ط': { vNormal: 9 }
};

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

function calc(m, useExpand = true) {
  let temiz = removeArabicDiacritics(m);
  if (useExpand) temiz = expandHamzaComposite(temiz);
  let sum = 0;
  for (let ch of temiz) {
    if (ARABIC_DATA[ch]) sum += ARABIC_DATA[ch].vNormal;
  }
  return sum;
}

const typed = "بسم الله الرحمن الرحيم"; // Bismillah - manually typed
const mushaf = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

console.log("typed (expanded) =", calc(typed, true));
console.log("mushaf (expanded) =", calc(mushaf, true));
console.log("typed (no-expand) =", calc(typed, false));
console.log("mushaf (no-expand) =", calc(mushaf, false));
