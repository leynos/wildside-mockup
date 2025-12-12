/**
 * @file Localization maps for wizard entities, extracted from wizard.ts.
 */

import type { EntityLocalizations } from "../domain/entities/localization";
import { localisation } from "./fixture-localization";

// =============================================================================
// Summary Highlights Localizations
// =============================================================================

export const lightingLocalizations: EntityLocalizations = localisation(
  { name: "Well-lit paths", description: "Safe evening sections with smart lighting" },
  {
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
  "highlight: lighting",
);

export const hiddenGemsLocalizations: EntityLocalizations = localisation(
  { name: "Hidden gems focus", description: "Expect quiet street art laneways and indie cafés" },
  {
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
  "highlight: hidden-gems",
);

export const loopRouteLocalizations: EntityLocalizations = localisation(
  { name: "Loop route", description: "Starts and ends near your current location" },
  {
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
  "highlight: loop",
);

export const easyDifficultyLocalizations: EntityLocalizations = localisation(
  { name: "Easy difficulty", description: "Gradual inclines suitable for relaxed pacing" },
  {
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
  "highlight: easy",
);

// =============================================================================
