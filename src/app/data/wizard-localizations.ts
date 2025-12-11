/**
 * @file Localization maps for wizard entities, extracted from wizard.ts.
 */

import type { EntityLocalizations } from "../domain/entities/localization";
import { fillLocalizations, localizeAcrossLocales } from "./fixture-localization";

// =============================================================================
// Summary Highlights Localizations
// =============================================================================

export const lightingLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": { name: "Well-lit paths", description: "Safe evening sections with smart lighting" },
    "en-US": { name: "Well-lit paths", description: "Safe evening sections with smart lighting" },
    ar: { name: "مسارات مضاءة جيدًا", description: "مقاطع مسائية آمنة بإضاءة ذكية" },
    cy: { name: "Llwybrau goleuol", description: "Adrannau hwyr diogel gyda goleuadau deallus" },
    da: {
      name: "Velbelyste stier",
      description: "Sikre aftenstrækninger med intelligent belysning",
    },
    de: {
      name: "Gut beleuchtete Wege",
      description: "Sichere Abendabschnitte mit intelligenter Beleuchtung",
    },
    el: {
      name: "Καλά φωτισμένα μονοπάτια",
      description: "Ασφαλή βραδινά τμήματα με έξυπνο φωτισμό",
    },
    es: {
      name: "Caminos bien iluminados",
      description: "Tramos nocturnos seguros con iluminación inteligente",
    },
    fi: {
      name: "Hyvin valaistut polut",
      description: "Turvallisia iltaosuuksia älykkäällä valaistuksella",
    },
    fr: {
      name: "Chemins bien éclairés",
      description: "Segments nocturnes sécurisés avec éclairage intelligent",
    },
    gd: {
      name: "Slighean soilleir",
      description: "Earrannan oidhche sàbhailte le solais tuigseach",
    },
    he: { name: "שבילים מוארים היטב", description: "קטעי ערב בטוחים עם תאורה חכמה" },
    hi: { name: "अच्छी तरह से रोशन पथ", description: "स्मार्ट लाइटिंग वाले सुरक्षित शाम के खंड" },
    it: {
      name: "Percorsi ben illuminati",
      description: "Tratti serali sicuri con illuminazione intelligente",
    },
    ja: { name: "明るく照らされた道", description: "スマート照明で夜も安心" },
    ko: { name: "조명이 밝은 경로", description: "스마트 조명이 비추는 안전한 야간 구간" },
    nb: { name: "Godt opplyste stier", description: "Trygge kveldspartier med smart belysning" },
    nl: {
      name: "Goed verlichte paden",
      description: "Veilige avondsegmenten met slimme verlichting",
    },
    pl: {
      name: "Dobrze oświetlone ścieżki",
      description: "Bezpieczne wieczorne odcinki ze sprytnym oświetleniem",
    },
    pt: {
      name: "Caminhos bem iluminados",
      description: "Trechos nocturnos seguros com iluminação inteligente",
    },
    ru: {
      name: "Хорошо освещённые пути",
      description: "Безопасные вечерние отрезки с умным освещением",
    },
    sv: { name: "Välbelysta stigar", description: "Trygga kvällspartier med smart belysning" },
    ta: {
      name: "நன்கு ஒளியூட்டப்பட்ட பாதைகள்",
      description: "ஸ்மார்ட் விளக்குகளுடன் பாதுகாப்பான மாலை பகுதிகள்",
    },
    th: { name: "ทางเดินที่มีแสงสว่างดี", description: "ช่วงค่ำปลอดภัยด้วยไฟอัจฉริยะ" },
    tr: {
      name: "İyi aydınlatılmış yollar",
      description: "Akıllı aydınlatmalı güvenli akşam bölümleri",
    },
    vi: {
      name: "Đường đi sáng sủa",
      description: "Đoạn đường buổi tối an toàn với hệ thống chiếu sáng thông minh",
    },
    "zh-CN": { name: "照明良好的路径", description: "智能照明守护的安全夜间路段" },
    "zh-TW": { name: "照明良好的路徑", description: "具智慧照明的安全夜間路段" },
  },
  "en-GB",
  "highlight: lighting",
);

export const hiddenGemsLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": {
      name: "Hidden gems focus",
      description: "Expect quiet street art laneways and indie cafés",
    },
    "en-US": {
      name: "Hidden gems focus",
      description: "Expect quiet street art laneways and indie cafés",
    },
    ar: {
      name: "تركيز على الجواهر المخفية",
      description: "توقّع أزقة هادئة لفن الشارع ومقاهي مستقلة",
    },
    cy: {
      name: "Ffocws ar drysorau cudd",
      description: "Disgwyl lonydd celf stryd tawel a chaffis indie",
    },
    da: {
      name: "Fokus på skjulte perler",
      description: "Forvent stille gyder med gadekunst og indie-caféer",
    },
    de: {
      name: "Fokus auf verborgene Schätze",
      description: "Erwarte ruhige Street-Art-Gassen und unabhängige Cafés",
    },
    el: {
      name: "Εστίαση σε κρυμμένους θησαυρούς",
      description: "Περιμένεις ήσυχα σοκάκια τέχνης δρόμου και ανεξάρτητα καφέ",
    },
    es: {
      name: "Enfoque en joyas ocultas",
      description: "Espera callejones con arte urbano y cafeterías independientes tranquilas.",
    },
    fi: {
      name: "Painotus kätkettyihin helmiin",
      description: "Odota rauhallisia street art -kujia ja indie-kahviloita",
    },
    fr: {
      name: "Focus sur les trésors cachés",
      description: "Attendez-vous à des ruelles calmes et des cafés indépendants",
    },
    gd: {
      name: "Fòcas air ulaidhean falaichte",
      description: "An dùil ri caol-shràidean ciùin agus càbaidean indie",
    },
    he: { name: "מוקד על אוצרות נסתרים", description: "צפו בסמטאות שקטות ובבתי קפה אינדיים" },
    hi: { name: "छिपे रत्नों पर फोकस", description: "शांत कला गलियों और इंडी कैफ़े की उम्मीद करें" },
    it: {
      name: "Focus sui tesori nascosti",
      description: "Aspettati vicoli tranquilli e caffè indipendenti",
    },
    ja: {
      name: "隠れた名所重視",
      description: "静かなストリートアートの路地やインディ系カフェを期待してください",
    },
    ko: {
      name: "숨겨진 보석 집중",
      description: "조용한 스트리트 아트 골목과 인디 카페를 만나보세요",
    },
    nb: {
      name: "Fokus på skjulte perler",
      description: "Forvent stille kunstgater og indie-kafeer",
    },
    nl: {
      name: "Focus op verborgen parels",
      description: "Reken op stille street-artsteegjes en indie-cafés",
    },
    pl: {
      name: "Fokus na ukryte perły",
      description: "Czekaj na ciche alejki ze street artem i niezależne kawiarnie",
    },
    pt: {
      name: "Foco em joias escondidas",
      description: "Conte com ruelas calmas e cafés independentes",
    },
    ru: {
      name: "Акцент на скрытых жемчужинах",
      description: "Ожидайте тихих аллей со стрит-артом и уютных кафе",
    },
    sv: {
      name: "Fokus på dolda pärlor",
      description: "Förvänta dig lugna gatukonstgränder och indie-kaféer",
    },
    ta: {
      name: "மறைக்கப்பட்ட நகைகள் கவனம்",
      description: "அமைதியான தெரு கலை வழித்தடங்களும் இன்டி கஃபேக்களும் அமையும்",
    },
    th: { name: "โฟกัสอัญมณีที่ซ่อนอยู่", description: "เตรียมพบตรอกศิลปะเงียบสงบและคาเฟ่อินดี้" },
    tr: {
      name: "Gizli mücevher odaklı",
      description: "Sakin sokak sanatı geçitleri ve indie kafeler seni bekliyor",
    },
    vi: {
      name: "Tập trung vào viên ngọc ẩn",
      description: "Sẵn sàng cho những hẻm nghệ thuật yên tĩnh và quán cà phê indie",
    },
    "zh-CN": { name: "隐藏宝藏焦点", description: "可遇安静的街头艺术小巷与独立咖啡店" },
    "zh-TW": { name: "隱藏寶藏焦點", description: "享受安靜的街頭藝術巷弄與獨立咖啡館" },
  },
  "en-GB",
  "highlight: hidden-gems",
);

export const loopRouteLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": { name: "Loop route", description: "Starts and ends near your current location" },
    "en-US": { name: "Loop route", description: "Starts and ends near your current location" },
    ar: { name: "مسار دائري", description: "يبدأ وينتهي بالقرب من موقعك الحالي" },
    cy: {
      name: "Llwybr cylchol",
      description: "Yn dechrau ac yn gorffen ger eich lleoliad presennol",
    },
    da: { name: "Løkkerute", description: "Starter og slutter tæt på din nuværende placering" },
    de: { name: "Rundroute", description: "Beginnt und endet nahe deinem aktuellen Standort" },
    el: {
      name: "Κυκλική διαδρομή",
      description: "Ξεκινά και τελειώνει κοντά στην τρέχουσα τοποθεσία σου",
    },
    es: { name: "Ruta circular", description: "Empieza y termina cerca de tu ubicación actual." },
    fi: { name: "Lenkkireitti", description: "Alkaa ja päättyy lähellä nykyistä sijaintiasi" },
    fr: {
      name: "Parcours en boucle",
      description: "Départ et arrivée près de votre position actuelle",
    },
    gd: {
      name: "Slighe lùbach",
      description: "A' tòiseachadh agus a' crìochnachadh faisg air an ionad agad",
    },
    he: { name: "מסלול מעגלי", description: "מתחיל ומסתיים ליד המיקום הנוכחי שלך" },
    hi: { name: "लूप रूट", description: "आपके वर्तमान स्थान के पास शुरू और समाप्त होता है" },
    it: {
      name: "Percorso ad anello",
      description: "Inizia e termina vicino alla tua posizione attuale",
    },
    ja: { name: "周回ルート", description: "現在地の近くから発着します" },
    ko: { name: "순환 경로", description: "현재 위치 근처에서 시작하고 끝납니다" },
    nb: { name: "Sløyferute", description: "Starter og slutter nær din nåværende posisjon" },
    nl: { name: "Rondwandeling", description: "Begint en eindigt dichtbij je huidige locatie" },
    pl: { name: "Trasa pętlowa", description: "Zaczyna i kończy się blisko Twojej lokalizacji" },
    pt: { name: "Rota circular", description: "Começa e termina perto da sua localização atual" },
    ru: {
      name: "Круговой маршрут",
      description: "Начинается и заканчивается вблизи вашего текущего местоположения",
    },
    sv: { name: "Slingruta", description: "Börjar och slutar nära din nuvarande plats" },
    ta: { name: "வளைய பாதை", description: "உங்கள் தற்போதைய இடத்திலிருந்து தொடங்கி முடிகிறது" },
    th: { name: "เส้นทางวนกลับ", description: "เริ่มและสิ้นสุดใกล้กับตำแหน่งปัจจุบันของคุณ" },
    tr: { name: "Döngü rota", description: "Mevcut konumuna yakın başlar ve biter" },
    vi: { name: "Lộ trình vòng", description: "Bắt đầu và kết thúc gần vị trí hiện tại của bạn" },
    "zh-CN": { name: "环线路线", description: "起点和终点都在您当前位置附近" },
    "zh-TW": { name: "環線路線", description: "起點與終點皆靠近您目前位置" },
  },
  "en-GB",
  "highlight: loop",
);

export const easyDifficultyLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": {
      name: "Easy difficulty",
      description: "Gradual inclines suitable for relaxed pacing",
    },
    "en-US": {
      name: "Easy difficulty",
      description: "Gradual inclines suitable for relaxed pacing",
    },
    ar: { name: "صعوبة منخفضة", description: "منحدرات تدريجية تناسب الإيقاع المريح" },
    cy: { name: "Lefel hawdd", description: "Graddiant graddol addas ar gyfer camu hamddenol" },
    da: {
      name: "Let sværhedsgrad",
      description: "Blide stigninger, der passer til et afslappet tempo",
    },
    de: {
      name: "Niedrige Schwierigkeit",
      description: "Sanfte Steigungen für ein entspanntes Tempo",
    },
    el: { name: "Χαμηλή δυσκολία", description: "Ήπιες κλίσεις για χαλαρό ρυθμό" },
    es: {
      name: "Dificultad sencilla",
      description: "Pendientes suaves ideales para un ritmo relajado.",
    },
    fi: { name: "Helppo vaikeustaso", description: "Loivat nousut sopivat rennolle tahdille" },
    fr: { name: "Difficulté facile", description: "Pentes douces adaptées à un rythme tranquille" },
    gd: {
      name: "Ìre dhoirbh furasta",
      description: "Claonaidhean socair a fhreagras air ruitheam fois",
    },
    he: { name: "רמת קושי קלה", description: "עליות מתונות בקצב רגוע" },
    hi: { name: "आसान कठिनाई", description: "आरामदायक गति के लिए हल्की चढ़ाइयाँ" },
    it: { name: "Difficoltà facile", description: "Pendenze graduali adatte a un ritmo rilassato" },
    ja: { name: "やさしい難易度", description: "ゆるやかな傾斜でリラックスしたペースに最適" },
    ko: { name: "쉬운 난이도", description: "완만한 경사로 여유로운 속도 유지" },
    nb: {
      name: "Lett vanskelighetsgrad",
      description: "Myke stigninger som passer et rolig tempo",
    },
    nl: { name: "Lage moeilijkheid", description: "Geleidelijke hellingen voor een relaxed tempo" },
    pl: { name: "Niska trudność", description: "Łagodne wzniesienia sprzyjające spokojnemu tempu" },
    pt: { name: "Dificuldade fácil", description: "Inclinações suaves para um ritmo relaxado" },
    ru: { name: "Низкая сложность", description: "Постепенные подъёмы для комфортного темпа" },
    sv: {
      name: "Låg svårighetsgrad",
      description: "Mjuka lutningar som passar ett avslappnat tempo",
    },
    ta: { name: "எளிய சிரம நிலை", description: "மெதுவான சரிவுகள், தளர்வான நடைவேகத்திற்கு ஏற்றவை" },
    th: { name: "ระดับง่าย", description: "ทางลาดชันเล็กน้อยเหมาะกับจังหวะสบาย ๆ" },
    tr: { name: "Kolay seviye", description: "Rahat tempoya uygun kademeli eğimler" },
    vi: { name: "Độ khó dễ", description: "Độ dốc nhẹ phù hợp nhịp độ thư thả" },
    "zh-CN": { name: "轻松难度", description: "缓缓上升的坡度，适合悠闲步伐" },
    "zh-TW": { name: "容易難度", description: "緩坡設計，適合悠閒步調" },
  },
  "en-GB",
  "highlight: easy",
);

// =============================================================================
// Weather Localizations
// =============================================================================

export const weatherTitleLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": { name: "Perfect walking weather", description: "Pack light layers just in case." },
    "en-US": { name: "Perfect walking weather", description: "Pack light layers just in case." },
    ar: { name: "طقس مثالي للمشي", description: "احمل طبقات خفيفة تحسبًا للتقلبات." },
    cy: {
      name: "Tywydd perffaith ar gyfer cerdded",
      description: "Paciwch haenau ysgafn rhag ofn.",
    },
    da: { name: "Perfekt gåvejr", description: "Pak lette lag for en sikkerheds skyld." },
    de: {
      name: "Perfektes Spazierwetter",
      description: "Nimm zur Sicherheit leichte Schichten mit.",
    },
    el: {
      name: "Ιδανικός καιρός για περπάτημα",
      description: "Πάρε μαζί σου ελαφριές στρώσεις για σιγουριά.",
    },
    es: { name: "Clima perfecto para caminar", description: "Lleva capas ligeras por si acaso." },
    fi: {
      name: "Täydellinen kävelysää",
      description: "Ota varmuuden vuoksi kevyitä kerroksia mukaan.",
    },
    fr: {
      name: "Temps idéal pour marcher",
      description: "Prévoyez des couches légères par précaution.",
    },
    gd: {
      name: "Sìde foirfe airson coiseachd",
      description: "Thoir leat sreathan aotrom airson gach suidheachadh.",
    },
    he: { name: "מזג אוויר מושלם להליכה", description: "ארזו שכבות קלות למקרה הצורך." },
    hi: { name: "चलने के लिए आदर्श मौसम", description: "एहतियात के तौर पर हल्की परतें रखें।" },
    it: {
      name: "Meteo perfetto per camminare",
      description: "Porta con te qualche strato leggero per sicurezza.",
    },
    ja: { name: "ウォーキング日和", description: "念のため軽めの上着を持っていきましょう。" },
    ko: { name: "걷기 좋은 날씨", description: "만일을 대비해 가벼운 겉옷을 챙겨두세요." },
    nb: { name: "Perfekt turvær", description: "Ta med lette lag for sikkerhets skyld." },
    nl: { name: "Perfect wandelweer", description: "Neem voor de zekerheid een licht laagje mee." },
    pl: {
      name: "Idealna pogoda na spacer",
      description: "Na wszelki wypadek zabierz lekkie warstwy.",
    },
    pt: { name: "Clima perfeito para caminhar", description: "Leve camadas leves por precaução." },
    ru: {
      name: "Идеальная погода для прогулки",
      description: "Возьмите лёгкую накидку на всякий случай.",
    },
    sv: {
      name: "Perfekt promenadväder",
      description: "Ta med en lätt extra tröja för säkerhets skull.",
    },
    ta: {
      name: "சிறந்த நடைபயண வானிலை",
      description: "ஏதாவது தேவைப்பட்டால் இலகு படுகைகளை எடுத்துச் செல்லுங்கள்.",
    },
    th: { name: "อากาศเหมาะกับการเดิน", description: "พกเสื้อผ้าบาง ๆ เผื่อไว้" },
    tr: { name: "Yürüyüş için mükemmel hava", description: "Her ihtimale karşı hafif katlar al." },
    vi: {
      name: "Thời tiết lý tưởng để dạo bộ",
      description: "Mang theo vài lớp áo mỏng phòng khi cần.",
    },
    "zh-CN": { name: "适合漫步的天气", description: "以防万一，带上轻薄外套。" },
    "zh-TW": { name: "適合步行的天氣", description: "以備不時之需，帶上輕薄外層。" },
  },
  "en-GB",
  "weather: title",
);

export const weatherWindLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "light breeze" },
    {
      ar: { name: "نسيم خفيف" },
      cy: { name: "awel ysgafn" },
      da: { name: "let brise" },
      de: { name: "leichte Brise" },
      el: { name: "ελαφρύ αεράκι" },
      es: { name: "brisa ligera" },
      fi: { name: "kevyt tuulenvire" },
      fr: { name: "légère brise" },
      gd: { name: "gaoth bheag" },
      he: { name: "בריזה קלה" },
      hi: { name: "हल्की हवा" },
      it: { name: "brezza leggera" },
      ja: { name: "そよ風" },
      ko: { name: "산들바람" },
      nb: { name: "lett bris" },
      nl: { name: "lichte bries" },
      pl: { name: "lekka bryza" },
      pt: { name: "brisa leve" },
      ru: { name: "лёгкий бриз" },
      sv: { name: "lätt bris" },
      ta: { name: "மெது தென்றல்" },
      th: { name: "ลมอ่อน" },
      tr: { name: "hafif esinti" },
      vi: { name: "gió nhẹ" },
      "zh-CN": { name: "微风拂面" },
      "zh-TW": { name: "微風" },
    },
  ),
  "en-GB",
  "weather: wind",
);

export const weatherSkyLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "clear skies" },
    {
      ar: { name: "سماء صافية" },
      cy: { name: "awyr glir" },
      da: { name: "skyfri himmel" },
      de: { name: "klarer Himmel" },
      el: { name: "καθαρός ουρανός" },
      es: { name: "cielo despejado" },
      fi: { name: "kirkas taivas" },
      fr: { name: "ciel dégagé" },
      gd: { name: "speuran soilleir" },
      he: { name: "שמיים בהירים" },
      hi: { name: "साफ आसमान" },
      it: { name: "cielo sereno" },
      ja: { name: "快晴" },
      ko: { name: "맑은 하늘" },
      nb: { name: "klar himmel" },
      nl: { name: "heldere lucht" },
      pl: { name: "bezchmurne niebo" },
      pt: { name: "céu limpo" },
      ru: { name: "ясное небо" },
      sv: { name: "klar himmel" },
      ta: { name: "தெளிந்த வானம்" },
      th: { name: "ท้องฟ้าโปร่ง" },
      tr: { name: "açık gökyüzü" },
      vi: { name: "trời trong" },
      "zh-CN": { name: "晴空万里" },
      "zh-TW": { name: "晴朗天空" },
    },
  ),
  "en-GB",
  "weather: sky",
);

export const weatherSentimentLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Ideal" },
    {
      ar: { name: "مثالي" },
      cy: { name: "Delfrydol" },
      da: { name: "Ideelt" },
      el: { name: "Ιδανικό" },
      fi: { name: "Ihanteellinen" },
      fr: { name: "Idéal" },
      gd: { name: "Fìor mhath" },
      he: { name: "אידאלי" },
      hi: { name: "आदर्श" },
      it: { name: "Ideale" },
      ja: { name: "理想的" },
      ko: { name: "이상적" },
      nb: { name: "Ideelt" },
      nl: { name: "Ideaal" },
      pl: { name: "Idealnie" },
      pt: { name: "Ideal" },
      ru: { name: "Идеально" },
      sv: { name: "Idealiskt" },
      ta: { name: "சிறந்தது" },
      th: { name: "ยอดเยี่ยม" },
      tr: { name: "İdeal" },
      vi: { name: "Tuyệt vời" },
      "zh-CN": { name: "理想" },
      "zh-TW": { name: "理想" },
    },
  ),
  "en-GB",
  "weather: sentiment",
);

// =============================================================================
// Route Summary Localizations
// =============================================================================

export const routeTitleLocalizations: EntityLocalizations = fillLocalizations(
  {
    "en-GB": {
      name: "Hidden Gems Loop",
      description:
        "A personalised walk blending street-art alleyways, independent cafés, and serene waterfront views.",
    },
    "en-US": {
      name: "Hidden Gems Loop",
      description:
        "A personalised walk blending street-art alleyways, independent cafés, and serene waterfront views.",
    },
    ar: {
      name: "جولة الجواهر المخفية",
      description:
        "نزهة مخصصة تمزج أزقة فن الشارع والمقاهي المستقلة وإطلالات الواجهة البحرية الهادئة.",
    },
    cy: {
      name: "Llwybr Trysorau Cudd",
      description:
        "Taith bersonol sy'n cyfuno strydoedd celf, caffis annibynnol, a golygfeydd tawel o'r lan.",
    },
    da: {
      name: "Skjulte Perler-sløjfen",
      description:
        "En personlig gåtur, der blander street art-gyder, uafhængige caféer og rolige udsigter ved havnefronten.",
    },
    de: {
      name: "Verborgene Schätze Runde",
      description:
        "Ein personalisierter Spaziergang, der Street-Art-Gassen, unabhängige Cafés und ruhige Aussichtspunkte am Wasser verbindet.",
    },
    el: {
      name: "Κύκλος Κρυμμένων Θησαυρών",
      description:
        "Μια εξατομικευμένη βόλτα που συνδυάζει σοκάκια street art, ανεξάρτητα καφέ και ήρεμες θέες στο νερό.",
    },
    es: {
      name: "Circuito de Joyas Ocultas",
      description:
        "Una caminata personalizada que mezcla callejones de arte urbano, cafeterías independientes y miradores tranquilos junto al agua.",
    },
    fi: {
      name: "Kätkettyjen helmien kierros",
      description:
        "Räätälöity kävely, jossa yhdistyvät street art -kujat, itsenäiset kahvilat ja rauhalliset rantamaisemat.",
    },
    fr: {
      name: "Boucle des Trésors Cachés",
      description:
        "Une balade personnalisée mêlant ruelles street art, cafés indépendants et points de vue paisibles sur le front de mer.",
    },
    gd: {
      name: "Cuairt nan Ulaidhean Falaichte",
      description:
        "Cuairt phearsanta a tha a' cothlamadh sràidean ealain, càbaidean neo-eisimeileach agus seallaidhean sàmhach air an oirthir.",
    },
    he: {
      name: "לולאת האוצרות הנסתרים",
      description:
        "מסלול מותאם אישי המשולב בסמטאות אמנות רחוב, בתי קפה עצמאיים ונקודות תצפית שקטות על קו החוף.",
    },
    hi: {
      name: "छिपे रत्नों की लूप",
      description: "स्ट्रीट आर्ट की गलियों, स्वतंत्र कैफ़े और शांत जल-किनारे दृश्यों का मेल करती एक निजी वॉक।",
    },
    it: {
      name: "Circuito dei Tesori Nascosti",
      description:
        "Passeggiata personalizzata che abbina vicoli di street art, caffetterie indipendenti e viste serene sul lungomare.",
    },
    ja: {
      name: "隠れた名所ループ",
      description:
        "ストリートアートの路地、個人経営のカフェ、静かなウォーターフロントを組み合わせたカスタムウォークです。",
    },
    ko: {
      name: "숨겨진 보석 루프",
      description:
        "스트리트 아트 골목, 독립 카페, 잔잔한 워터프런트 전망을 조합한 맞춤 워크입니다.",
    },
    nb: {
      name: "Skjulte perler-sløyfen",
      description:
        "En personlig gåtur som kombinerer street art-gater, uavhengige kafeer og rolige utsiktspunkter ved vannet.",
    },
    nl: {
      name: "Verborgen Parels-lus",
      description:
        "Een persoonlijke wandeling die street-artsteegjes, onafhankelijke cafés en rustige uitzichten langs het water combineert.",
    },
    pl: {
      name: "Pętla Ukrytych Pereł",
      description:
        "Personalizowany spacer łączący uliczne murale, niezależne kawiarnie i spokojne widoki nad wodą.",
    },
    pt: {
      name: "Rota Joias Escondidas",
      description:
        "Uma caminhada personalizada que mistura ruelas de arte urbana, cafés independentes e vistas tranquilas junto à água.",
    },
    ru: {
      name: "Цикл Скрытых Жемчужин",
      description:
        "Персональная прогулка, сочетающая переулки со стрит-артом, независимые кафе и тихие виды на набережную.",
    },
    sv: {
      name: "Slingan Dolda Pärlor",
      description:
        "En personlig promenad som blandar street‑artgränder, fristående kaféer och lugna utsikter vid vattnet.",
    },
    ta: {
      name: "மறைக்கப்பட்ட நகைகள் வளையம்",
      description:
        "தெரு கலை பாதைகள், சுயாதீனக் கஃபேக்கள், அமைதியான நீர்கரை காட்சிகள் கலந்து உருவான தனிப்பயன் நடைபாதை.",
    },
    th: {
      name: "ลูปอัญมณีที่ซ่อนอยู่",
      description: "เส้นทางแบบเฉพาะตัวที่ผสมตรอกศิลปะข้างถนน คาเฟ่อิสระ และจุดชมวิวริมน้ำอันเงียบสงบ",
    },
    tr: {
      name: "Gizli Mücevherler Döngüsü",
      description:
        "Sokak sanatı ara sokakları, bağımsız kafeler ve sakin sahil manzaralarını harmanlayan kişiselleştirilmiş bir yürüyüş.",
    },
    vi: {
      name: "Vòng Viên Ngọc Ẩn",
      description:
        "Hành trình cá nhân hóa kết hợp các con hẻm nghệ thuật đường phố, quán cà phê độc lập và điểm ngắm ven sông yên tĩnh.",
    },
    "zh-CN": {
      name: "隐藏宝藏环线",
      description: "个性化步行体验，融合街头艺术小巷、独立咖啡店与静谧水岸观景点。",
    },
    "zh-TW": {
      name: "隱藏寶藏環線",
      description: "將街頭藝術巷弄、獨立咖啡館與寧靜水岸景點融合的個人化路線。",
    },
  },
  "en-GB",
  "route: title",
);

export const routeBadgeLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Custom" },
    {
      ar: { name: "مخصص" },
      cy: { name: "Personol" },
      da: { name: "Tilpasset" },
      de: { name: "Individuell" },
      el: { name: "Προσαρμοσμένη" },
      es: { name: "Personalizada" },
      fi: { name: "Mukautettu" },
      fr: { name: "Personnalisée" },
      gd: { name: "Gnàthaichte" },
      he: { name: "מותאם אישית" },
      hi: { name: "व्यक्तिगत" },
      it: { name: "Personalizzato" },
      ja: { name: "カスタム" },
      ko: { name: "맞춤형" },
      nb: { name: "Tilpasset" },
      nl: { name: "Aangepast" },
      pl: { name: "Indywidualny" },
      pt: { name: "Personalizada" },
      ru: { name: "Индивидуальный" },
      sv: { name: "Anpassad" },
      ta: { name: "தனிப்பயன்" },
      th: { name: "ปรับแต่ง" },
      tr: { name: "Özel" },
      vi: { name: "Tùy chỉnh" },
      "zh-CN": { name: "自定义" },
      "zh-TW": { name: "自訂" },
    },
  ),
  "en-GB",
  "route: badge",
);

// =============================================================================
// Stop Localizations
// =============================================================================

export const cafeStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Midtown Roastery", description: "Small-batch espresso with window seating" },
    {
      ar: {
        name: "Midtown Roastery",
        description: "قهوة إسبرسو محمصة بكميات صغيرة مع مقاعد نافذة",
      },
      cy: {
        name: "Midtown Roastery",
        description: "Espresso swp bychan gyda seddi wrth y ffenestr",
      },
      da: {
        name: "Midtown Roastery",
        description: "Espresso i små partier med pladser ved vinduet",
      },
      de: {
        name: "Midtown Roastery",
        description: "Espresso in Kleinchargen mit Sitzplätzen am Fenster",
      },
      el: {
        name: "Midtown Roastery",
        description: "Εσπρέσο μικρής παρτίδας με καθίσματα στο παράθυρο",
      },
      es: {
        name: "Midtown Roastery",
        description: "Espresso de pequeños lotes con asientos junto a la ventana",
      },
      fi: { name: "Midtown Roastery", description: "Pienen erän espressoa ikkunapaikoilla" },
      fr: {
        name: "Midtown Roastery",
        description: "Espresso en petite torréfaction avec places en vitrine",
      },
      gd: {
        name: "Midtown Roastery",
        description: "Espresso baidse-beag le suidheachain ri uinneag",
      },
      he: { name: "Midtown Roastery", description: "אספרסו בבאצ'ים קטנים עם מושבים בחלון" },
      hi: { name: "Midtown Roastery", description: "खिड़की के पास बैठने वाले छोटे बैच का एस्प्रेसो" },
      it: {
        name: "Midtown Roastery",
        description: "Espresso a piccoli lotti con posti alla finestra",
      },
      ja: { name: "Midtown Roastery", description: "窓際席で味わう少量焙煎のエスプレッソ" },
      ko: { name: "Midtown Roastery", description: "창가 좌석이 있는 소량 배치 에스프레소" },
      nb: { name: "Midtown Roastery", description: "Espresso i små batcher med vindusplasser" },
      nl: {
        name: "Midtown Roastery",
        description: "Kleinbatch-espresso met zitplaatsen aan het raam",
      },
      pl: {
        name: "Midtown Roastery",
        description: "Espresso z małych partii z miejscami przy oknie",
      },
      pt: {
        name: "Midtown Roastery",
        description: "Espresso em pequenos lotes com lugares à janela",
      },
      ru: { name: "Midtown Roastery", description: "Эспрессо малыми партиями с местами у окна" },
      sv: {
        name: "Midtown Roastery",
        description: "Espresso i små satser med platser vid fönstret",
      },
      ta: { name: "மிட்டௌன் ரோஸ்டரி", description: "சிறிய தொகுதி எஸ்ப்ரெஸ்ஸோ, ஜன்னல் இருக்கைகளுடன்" },
      th: { name: "Midtown Roastery", description: "เอสเปรสโซคั่วจำนวนน้อยพร้อมที่นั่งริมหน้าต่าง" },
      tr: {
        name: "Midtown Roastery",
        description: "Pencere kenarlı oturma alanlı küçük parti espresso",
      },
      vi: {
        name: "Midtown Roastery",
        description: "Espresso rang mẻ nhỏ với chỗ ngồi cạnh cửa sổ",
      },
      "zh-CN": { name: "Midtown Roastery", description: "小批次手冲浓缩咖啡，配备窗边座位" },
      "zh-TW": { name: "Midtown Roastery", description: "小批次濃縮咖啡，提供窗邊座位" },
    },
  ),
  "en-GB",
  "stop: café",
);

export const cafeStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Friendly baristas, ideal for takeaway" },
    {
      ar: { name: "باريستا ودودون، مثالي للطلبات السريعة" },
      cy: { name: "Baristiaid cyfeillgar, delfrydol i fynd â fo" },
      da: { name: "Venlige baristaer, perfekt til takeaway" },
      de: { name: "Freundliche Baristas, ideal zum Mitnehmen" },
      el: { name: "Φιλικοί barista, ιδανικό για takeaway" },
      es: { name: "Baristas amables, ideal para llevar" },
      fi: { name: "Ystävälliset baristat, täydellinen mukaan otettavaksi" },
      fr: { name: "Baristas chaleureux, idéal à emporter" },
      gd: { name: "Barista càirdeil, air leth math ri thoirt leat" },
      he: { name: "בריסטות ידידותיים, מושלם לטייק־אוויי" },
      hi: { name: "दोस्ताना बरिस्ता, लेकर जाने के लिए बेहतरीन" },
      it: { name: "Baristi cordiali, perfetto da asporto" },
      ja: { name: "フレンドリーなバリスタ、テイクアウトにも最適" },
      ko: { name: "친절한 바리스타, 테이크아웃에 제격" },
      nb: { name: "Hyggelige baristaer, perfekt for take-away" },
      nl: { name: "Vriendelijke barista's, ideaal om mee te nemen" },
      pl: { name: "Przyjaźni bariści, idealne na wynos" },
      pt: { name: "Baristas simpáticos, ideal para levar" },
      ru: { name: "Дружелюбные бариста, идеально на вынос" },
      sv: { name: "Trevliga baristor, perfekt för take-away" },
      ta: { name: "அன்பான பாறிஸ்தாக்கள், எடுத்துச் செல்ல ஏற்றது" },
      th: { name: "บาริสตาเป็นกันเอง เหมาะสำหรับซื้อกลับ" },
      tr: { name: "Güler yüzlü baristalar, paket almak için ideal" },
      vi: { name: "Barista thân thiện, rất tiện mua mang đi" },
      "zh-CN": { name: "咖啡师亲切友好，适合外带" },
      "zh-TW": { name: "咖啡師親切，外帶最方便" },
    },
  ),
  "en-GB",
  "stop-note: café",
);

export const artStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Graffiti Passage", description: "Open-air gallery of rotating murals" },
    {
      ar: { name: "Graffiti Passage", description: "معرض مفتوح يضم جداريات متجددة" },
      cy: { name: "Graffiti Passage", description: "Oriel awyr agored o furluniau cylchdroi" },
      da: { name: "Graffiti Passage", description: "Friluftsgalleri med roterende vægmalerier" },
      de: {
        name: "Graffiti Passage",
        description: "Open-Air-Galerie mit wechselnden Wandgemälden",
      },
      el: {
        name: "Graffiti Passage",
        description: "Υπαίθρια γκαλερί με εναλλασσόμενες τοιχογραφίες",
      },
      es: {
        name: "Graffiti Passage",
        description: "Galería al aire libre con murales en rotación",
      },
      fi: { name: "Graffiti Passage", description: "Ulkoilmagalleria vaihtuvilla muraaleilla" },
      fr: { name: "Graffiti Passage", description: "Galerie en plein air aux fresques tournantes" },
      gd: {
        name: "Graffiti Passage",
        description: "Gailearaidh a-muigh le dealbhan-balla a tha ag atharrachadh",
      },
      he: { name: "Graffiti Passage", description: "גלריית חוץ עם ציורי קיר מתחלפים" },
      hi: { name: "Graffiti Passage", description: "खुला गैलरी जिसमें बदलते भित्ति-चित्र हैं" },
      it: { name: "Graffiti Passage", description: "Galleria all'aperto con murales a rotazione" },
      ja: { name: "Graffiti Passage", description: "さまざまな壁画が入れ替わる屋外ギャラリー" },
      ko: { name: "Graffiti Passage", description: "교대로 바뀌는 벽화를 전시하는 야외 갤러리" },
      nb: { name: "Graffiti Passage", description: "Friluftsgalleri med roterende veggmalerier" },
      nl: {
        name: "Graffiti Passage",
        description: "Openluchtgalerie met wisselende muurschilderingen",
      },
      pl: { name: "Graffiti Passage", description: "Plenerowa galeria z rotującymi muralami" },
      pt: { name: "Graffiti Passage", description: "Galeria ao ar livre com murais rotativos" },
      ru: {
        name: "Graffiti Passage",
        description: "Галерея под открытым небом с меняющимися фресками",
      },
      sv: { name: "Graffiti Passage", description: "Utomhusgalleri med roterande muraler" },
      ta: {
        name: "கிராஃபிட்டி பாஸேஜ்",
        description: "மாறிக் கொண்டிருக்கும் மதில்சித்திரங்களுடன் வெளிப்புற காட்சியகம்",
      },
      th: { name: "Graffiti Passage", description: "แกลเลอรีกลางแจ้งกับจิตรกรรมฝาผนังหมุนเวียน" },
      tr: {
        name: "Graffiti Passage",
        description: "Dönüşümlü duvar resimleriyle açık hava galerisi",
      },
      vi: {
        name: "Graffiti Passage",
        description: "Phòng trưng bày ngoài trời với các bích họa thay phiên",
      },
      "zh-CN": { name: "Graffiti Passage", description: "露天画廊轮换展出多彩壁画" },
      "zh-TW": { name: "Graffiti Passage", description: "露天藝廊，輪播多彩壁畫" },
    },
  ),
  "en-GB",
  "stop: art",
);

export const artStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Photo spot" },
    {
      ar: { name: "نقطة تصوير" },
      cy: { name: "Man tynnu lluniau" },
      da: { name: "Fotosted" },
      de: { name: "Fotospot" },
      el: { name: "Σημείο για φωτογραφίες" },
      es: { name: "Punto fotográfico" },
      fi: { name: "Kuvauspaikka" },
      fr: { name: "Spot photo" },
      gd: { name: "Àite dhealbhan" },
      he: { name: "נקודת צילום" },
      hi: { name: "फोटो स्थान" },
      it: { name: "Punto foto" },
      ja: { name: "撮影スポット" },
      ko: { name: "포토 명소" },
      nb: { name: "Fotosted" },
      nl: { name: "Fotospot" },
      pl: { name: "Punkt foto" },
      pt: { name: "Ponto para fotos" },
      ru: { name: "Точка для фото" },
      sv: { name: "Fotopunkt" },
      ta: { name: "புகைப்பட இடம்" },
      th: { name: "จุดถ่ายรูป" },
      tr: { name: "Fotoğraf noktası" },
      vi: { name: "Điểm chụp ảnh" },
      "zh-CN": { name: "拍照打卡点" },
      "zh-TW": { name: "拍照熱點" },
    },
  ),
  "en-GB",
  "stop-note: art",
);

export const gardenStopLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Whispering Oak Garden", description: "Peaceful pocket park with shaded benches" },
    {
      ar: { name: "Whispering Oak Garden", description: "حديقة جيب هادئة بمقاعد مظللة" },
      cy: { name: "Whispering Oak Garden", description: "Parc poced tawel gyda meinciau cysgodol" },
      da: {
        name: "Whispering Oak Garden",
        description: "Fredelig lommepark med skyggefulde bænke",
      },
      de: {
        name: "Whispering Oak Garden",
        description: "Ruhiger Taschenpark mit schattigen Bänken",
      },
      el: { name: "Whispering Oak Garden", description: "Ήσυχο πάρκο τσέπης με σκιερές θέσεις" },
      es: {
        name: "Whispering Oak Garden",
        description: "Parque íntimo y tranquilo con bancos a la sombra",
      },
      fi: {
        name: "Whispering Oak Garden",
        description: "Rauhallinen taskupuisto varjoisilla penkeillä",
      },
      fr: { name: "Whispering Oak Garden", description: "Mini parc paisible avec bancs ombragés" },
      gd: {
        name: "Gàrradh Whispering Oak",
        description: "Pàirc bheag shàmhach le beingean fo sgàil",
      },
      he: { name: "Whispering Oak Garden", description: "פארק כיס שקט עם ספסלים מוצלים" },
      hi: { name: "Whispering Oak Garden", description: "शांत पॉकेट पार्क जिसमें छायादार बेंच हैं" },
      it: {
        name: "Whispering Oak Garden",
        description: "Pocket park tranquillo con panchine ombreggiate",
      },
      ja: { name: "Whispering Oak Garden", description: "日陰のベンチがある静かなポケットパーク" },
      ko: { name: "Whispering Oak Garden", description: "그늘진 벤치가 있는 아늑한 포켓 공원" },
      nb: { name: "Whispering Oak Garden", description: "Stille lommepark med skyggefulle benker" },
      nl: {
        name: "Whispering Oak Garden",
        description: "Rustig pocketpark met schaduwrijke bankjes",
      },
      pl: {
        name: "Whispering Oak Garden",
        description: "Kameralny park kieszonkowy z zacienionymi ławkami",
      },
      pt: {
        name: "Whispering Oak Garden",
        description: "Parque de bolso tranquilo com bancos à sombra",
      },
      ru: {
        name: "Whispering Oak Garden",
        description: "Тихий парковый карман с тенистыми скамейками",
      },
      sv: { name: "Whispering Oak Garden", description: "Lugnt pocketpark med skuggiga bänkar" },
      ta: { name: "விச்பரிங் ஓக் கார்டன்", description: "நிழல் இருக்கைகளுடன் அமைதியான சிறிய பூங்கா" },
      th: { name: "Whispering Oak Garden", description: "สวนเล็กเงียบสงบพร้อมม้านั่งร่มรื่น" },
      tr: { name: "Whispering Oak Garden", description: "Gölgeli bankları olan huzurlu cep parkı" },
      vi: {
        name: "Whispering Oak Garden",
        description: "Công viên nhỏ yên tĩnh với ghế ngồi rợp bóng",
      },
      "zh-CN": { name: "Whispering Oak Garden", description: "静谧口袋公园，设有树荫长椅" },
      "zh-TW": { name: "Whispering Oak Garden", description: "寧靜的小型公園，設有遮蔭座位" },
    },
  ),
  "en-GB",
  "stop: garden",
);

export const gardenStopNoteLocalizations: EntityLocalizations = fillLocalizations(
  localizeAcrossLocales(
    { name: "Rest area" },
    {
      ar: { name: "منطقة استراحة" },
      cy: { name: "Ardal orffwys" },
      da: { name: "Hvileområde" },
      de: { name: "Ruhebereich" },
      el: { name: "Χώρος ανάπαυσης" },
      es: { name: "Zona de descanso" },
      fi: { name: "Lepoalue" },
      fr: { name: "Zone de repos" },
      gd: { name: "Raon fois" },
      he: { name: "אזור מנוחה" },
      hi: { name: "विश्राम क्षेत्र" },
      it: { name: "Area di sosta" },
      ja: { name: "休憩エリア" },
      ko: { name: "휴식 구역" },
      nb: { name: "Hvileområde" },
      nl: { name: "Rustzone" },
      pl: { name: "Strefa odpoczynku" },
      pt: { name: "Zona de descanso" },
      ru: { name: "Зона отдыха" },
      sv: { name: "Vilozon" },
      ta: { name: "ஓய்வு பகுதி" },
      th: { name: "พื้นที่พัก" },
      tr: { name: "Dinlenme alanı" },
      vi: { name: "Khu nghỉ chân" },
      "zh-CN": { name: "休憩区" },
      "zh-TW": { name: "休息區" },
    },
  ),
  "en-GB",
  "stop-note: garden",
);
