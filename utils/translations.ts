export type LanguageType = 'uz' | 'uz_cyr' | 'kaa' | 'kaa_cyr';

export const languages = [
  { code: 'uz', name: "O‘zbekcha", script: "Lotin" },
  { code: 'uz_cyr', name: "Ўзбекча", script: "Кирилл" },
  { code: 'kaa', name: "Qaraqalpaqsha", script: "Latin" },
  { code: 'kaa_cyr', name: "Қарақалпақша", script: "Кирилл" },
];

export const dictionary: Record<string, Record<LanguageType, string>> = {
  // Navigation & General
  "nav.documents": {
    uz: "Hujjatlar",
    uz_cyr: "Ҳужжатлар",
    kaa: "Hújjeter",
    kaa_cyr: "Ҳүжжетлер"
  },
  "nav.about": {
    uz: "Loyiha haqida",
    uz_cyr: "Лойиҳа ҳақида",
    kaa: "Joybar haqqında",
    kaa_cyr: "Жойбар ҳаққында"
  },
  "nav.help": {
    uz: "Yordam",
    uz_cyr: "Ёрдам",
    kaa: "Järdem",
    kaa_cyr: "Жәрдем"
  },
  "nav.admin": {
    uz: "Admin",
    uz_cyr: "Админ",
    kaa: "Admin",
    kaa_cyr: "Админ"
  },
  "nav.cabinet": {
    uz: "Kabinet",
    uz_cyr: "Кабинет",
    kaa: "Kabinet",
    kaa_cyr: "Кабинет"
  },
  "footer.rights": {
    uz: "Barcha huquqlar himoyalangan.",
    uz_cyr: "Барча ҳуқуқлар ҳимояланган.",
    kaa: "Barlıq huqıqlar qorg'alg'an.",
    kaa_cyr: "Барлық ҳуқықлар қорғалған."
  },
  
  // Home Page
  "hero.title.1": {
    uz: "Davlat tilida ish yuritish",
    uz_cyr: "Давлат тилида иш юритиш",
    kaa: "Mámleketlik tilde is júrgiziw",
    kaa_cyr: "Мәмлекетлик тилде ис жүргизиў"
  },
  "hero.title.2": {
    uz: "oson va qulay",
    uz_cyr: "осон ва қулай",
    kaa: "ańsat hám qolaylı",
    kaa_cyr: "аңсат ҳәм қолайлы"
  },
  "hero.desc": {
    uz: "Barcha turdagi rasmiy hujjatlar, arizalar va shartnomalarni bir necha daqiqada yarating. Xatolarsiz, qonuniy va tezkor.",
    uz_cyr: "Барча турдаги расмий ҳужжатлар, аризалар ва шартномаларни бир неча дақиқада яратинг. Хатоларсиз, қонуний ва тезкор.",
    kaa: "Barlıq túrdegi rásmiy hújjetler, arzalardı hám shártnamalardı bir neshe minutta jaratıń. Qátesiz, nızamlı hám tez.",
    kaa_cyr: "Барлық түрдеги рәсмий ҳүжжетлер, арзаларды ҳәм шәртнамаларды бир неше минутта жаратың. Қәтесиз, нызамлы ҳәм тез."
  },
  "hero.btn.create": {
    uz: "Hujjat yaratish",
    uz_cyr: "Ҳужжат яратиш",
    kaa: "Hújjet jaratıw",
    kaa_cyr: "Ҳүжжет жаратыў"
  },
  "hero.btn.more": {
    uz: "Batafsil",
    uz_cyr: "Батафсил",
    kaa: "Tolıq maǵlıwmat",
    kaa_cyr: "Толық мағлыўмат"
  },
  "features.title": {
    uz: "Qanday ishlaydi?",
    uz_cyr: "Қандай ишлайди?",
    kaa: "Qalay isleydi?",
    kaa_cyr: "Қалай ислейди?"
  },
  "features.subtitle": {
    uz: "Hujjat tayyorlashning 3 oddiy qadami",
    uz_cyr: "Ҳужжат тайёрлашнинг 3 оддий қадами",
    kaa: "Hújjet tayarlawdıń 3 ápiwayı qádemi",
    kaa_cyr: "Ҳүжжет таярлаўдың 3 әпиўайы қәдеми"
  },
  "popular.title": {
    uz: "Ommabop hujjatlar",
    uz_cyr: "Оммабоп ҳужжатлар",
    kaa: "Keń tarqalǵan hújjetler",
    kaa_cyr: "Кең тарқалған ҳүжжетлер"
  },
  "popular.view_all": {
    uz: "Barchasini ko‘rish",
    uz_cyr: "Барчасини кўриш",
    kaa: "Bárinsin kóriw",
    kaa_cyr: "Бәринсин көриў"
  },
  "doc.create_btn": {
    uz: "Yaratish",
    uz_cyr: "Яратиш",
    kaa: "Jaratıw",
    kaa_cyr: "Жаратыў"
  },
  "doc.price.free": {
    uz: "Bepul",
    uz_cyr: "Бепул",
    kaa: "Biykar",
    kaa_cyr: "Бийкар"
  },
  "doc.price.paid": {
    uz: "Pullik",
    uz_cyr: "Пуллик",
    kaa: "Aqılı",
    kaa_cyr: "Ақылы"
  },

  // Catalog
  "catalog.title": {
    uz: "Hujjatlar kutubxonasi",
    uz_cyr: "Ҳужжатлар кутубхонаси",
    kaa: "Hújjetler kitapxanası",
    kaa_cyr: "Ҳүжжетлер китапханасы"
  },
  "catalog.subtitle": {
    uz: "Kerakli hujjatni toping va tahrirlang",
    uz_cyr: "Керакли ҳужжатни топинг ва таҳрирланг",
    kaa: "Kerekli hújjetni tabıń hám ońlań",
    kaa_cyr: "Керекли ҳүжжетни табың ҳәм оңлаң"
  },
  "search.label": {
    uz: "QIDIRUV",
    uz_cyr: "ҚИДИРУВ",
    kaa: "IZLEW",
    kaa_cyr: "ИЗЛЕЎ"
  },
  "search.placeholder": {
    uz: "Izlash...",
    uz_cyr: "Излаш...",
    kaa: "Izlew...",
    kaa_cyr: "Излеў..."
  },
  "categories.title": {
    uz: "Kategoriyalar",
    uz_cyr: "Категориялар",
    kaa: "Kategoriyalar",
    kaa_cyr: "Категориялар"
  },
  "categories.all": {
    uz: "Barchasi",
    uz_cyr: "Барчаси",
    kaa: "Bárinshe",
    kaa_cyr: "Бәринше"
  },
  "doc.not_found": {
    uz: "Hujjatlar topilmadi",
    uz_cyr: "Ҳужжатлар топилмади",
    kaa: "Hújjetler tabılmadı",
    kaa_cyr: "Ҳүжжетлер табылмады"
  },
  "doc.not_found_desc": {
    uz: "Boshqa so‘rov bilan urinib ko‘ring yoki kategoriyani o‘zgartiring.",
    uz_cyr: "Бошқа сўров билан уриниб кўринг ёки категорияни ўзгартиринг.",
    kaa: "Basqa soraw menen háreket qılıń yamasa kategoriyanı ózgertiń.",
    kaa_cyr: "Басқа сораў менен ҳәрекет қылың ямаса категорияны өзгертиң."
  },
  "btn.clear": {
    uz: "Tozalash",
    uz_cyr: "Тозалаш",
    kaa: "Tazalaw",
    kaa_cyr: "Тазалаў"
  },
  "btn.select": {
    uz: "Tanlash",
    uz_cyr: "Танлаш",
    kaa: "Tańlaw",
    kaa_cyr: "Таңлаў"
  },

  // Admin
  "admin.panel": {
    uz: "ADMIN PANEL",
    uz_cyr: "АДМИН ПАНЕЛ",
    kaa: "ADMIN PANEL",
    kaa_cyr: "АДМИН ПАНЕЛ"
  },
  "admin.menu.dashboard": {
    uz: "Umumiy ko‘rsatkichlar",
    uz_cyr: "Умумий кўрсаткичлар",
    kaa: "Ulıwma kórsetkishler",
    kaa_cyr: "Улыўма көрсеткишлер"
  },
  "admin.menu.docs": {
    uz: "Hujjatlar",
    uz_cyr: "Ҳужжатлар",
    kaa: "Hújjetler",
    kaa_cyr: "Ҳүжжетлер"
  },
  "admin.menu.users": {
    uz: "Foydalanuvchilar",
    uz_cyr: "Фойдаланувчилар",
    kaa: "Paydalanıwshılar",
    kaa_cyr: "Пайдаланыўшылар"
  },
  "admin.menu.finance": {
    uz: "Moliya",
    uz_cyr: "Молия",
    kaa: "Finans",
    kaa_cyr: "Финанс"
  },
  "admin.menu.settings": {
    uz: "Sozlamalar",
    uz_cyr: "Созламалар",
    kaa: "Sazlamalar",
    kaa_cyr: "Сазламалар"
  }
};

// Helper for dynamic content transliteration (Simple Mapping for Demo)
// This is a basic transliteration for demo purposes to visually change dynamic data
export const transliterate = (text: string, lang: LanguageType): string => {
  if (lang === 'uz') return text;

  // Simple Uzbek Latin to Cyrillic map
  const latToCyr: Record<string, string> = {
    "Ch": "Ч", "ch": "ч", "Sh": "Ш", "sh": "ш", "Yo": "Ё", "yo": "ё",
    "Yu": "Ю", "yu": "ю", "Ya": "Я", "ya": "я", "O‘": "Ў", "o‘": "ў",
    "G‘": "Ғ", "g‘": "ғ", "A": "А", "a": "а", "B": "Б", "b": "б",
    "D": "Д", "d": "д", "E": "Э", "e": "э", "F": "Ф", "f": "ф",
    "G": "Г", "g": "г", "H": "Ҳ", "h": "ҳ", "I": "И", "i": "и",
    "J": "Ж", "j": "ж", "K": "К", "k": "к", "L": "Л", "l": "л",
    "M": "М", "m": "м", "N": "Н", "n": "н", "O": "О", "o": "о",
    "P": "П", "p": "п", "Q": "Қ", "q": "қ", "R": "Р", "r": "р",
    "S": "С", "s": "с", "T": "Т", "t": "т", "U": "У", "u": "у",
    "V": "В", "v": "в", "X": "Х", "x": "х", "Y": "Й", "y": "й",
    "Z": "З", "z": "з", "'": "ъ"
  };

  if (lang === 'uz_cyr') {
    let res = text;
    // Replace multi-char first
    res = res.replace(/Ch|ch|Sh|sh|Yo|yo|Yu|yu|Ya|ya|O‘|o‘|G‘|g‘/g, (m) => latToCyr[m] || m);
    // Replace single char
    res = res.split('').map(c => latToCyr[c] || c).join('');
    return res;
  }

  // Very basic approximation for Karakalpak (Just for visual difference in demo)
  if (lang === 'kaa') {
    return text
      .replace(/o‘/g, "ó").replace(/O‘/g, "Ó")
      .replace(/g‘/g, "ǵ").replace(/G‘/g, "Ǵ")
      .replace(/sh/g, "sh").replace(/ch/g, "sh") // Approximation
      .replace(/v/g, "w"); 
  }

  if (lang === 'kaa_cyr') {
    // Basic approximation: Convert to Cyrillic then adjust for KAA specific chars
    let res = transliterate(text, 'uz_cyr');
    return res.replace(/ў/g, "ө").replace(/Ў/g, "Ө").replace(/ғ/g, "ғ").replace(/ҳ/g, "ҳ");
  }

  return text;
};