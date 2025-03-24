// src/index.js
(function () {
  const REGION_TO_LANG = {
    US: "en", GB: "en", AU: "en", CA: "en", IE: "en",
    FR: "fr", BE: "fr", 
    DE: "de", AT: "de", 
    CH: "de", // Switzerland - using German as default, but could be customized further
    ES: "es", MX: "es", AR: "es",
    IT: "it",
    PT: "pt", BR: "pt",
    NL: "nl",
    PL: "pl",
    SE: "sv",
    NO: "no",
    FI: "fi",
    DK: "da",
    RU: "ru",
    CN: "zh",
    JP: "ja",
    KR: "ko",
    IN: "hi",
    AE: "ar",
    SA: "ar",
    IL: "he",
    ID: "id",
    TH: "th",
    TR: "tr",
    VN: "vi",
    ZA: "en",
    NG: "en",
    EG: "ar",
    AQ: "en" // Antarctica
  };

  const DEFAULT_CONFIG = {
    theme: "dark",
    layout: "footer", // Options: "footer", "header", "inline", "modal", "interstitial"
    configurability: "full", // Options: "none", "some", "full"
    privacyPolicyUrl: "/privacy-policy",
    language: "en"
  };

  function getConfig(region) {
    const userConfig = window.__ConsentBannerConfig || {};
    
    // First try user config language
    // Then try region mapping
    // Then try HTML lang attribute
    // Finally fall back to browser language or 'en'
    const fallbackLang = userConfig.language || 
                         REGION_TO_LANG[region] || 
                         document.documentElement.lang || 
                         (navigator.language?.slice(0, 2) || "en");
    
    const config = Object.assign({}, DEFAULT_CONFIG, userConfig, { language: fallbackLang });
    console.log("[SMCB] Loaded config:", config);
    return config;
  }

  let CONFIG; // will be assigned after fetchRegion
  window.smcbConfig = () => CONFIG; // expose runtime config for debug

  const CONSENT_COOKIE_KEY = "cookie_consent_level";
  const DATA_LAYER = window.dataLayer = window.dataLayer || [];

  const I18N = {
    en: {
      description: "🍪 This website uses cookies to enhance your browsing experience and provide personalized services.",
      privacyPolicy: "Privacy Policy",
      acceptAll: "Accept All Cookies",
      denyAll: "Reject All Cookies",
      customize: "Customize Settings",
      preferences: "Cookie Preferences",
      necessary: "Essential Cookies (always enabled)",
      functionality: "Functional Cookies",
      tracking: "Analytics Cookies",
      targeting: "Marketing & Targeting Cookies",
      save: "Save Preferences",
      optOut: "Do Not Sell or Share My Personal Information",
      optOutConfirm: "You have opted out of the sale of your personal information.",
      optOutAppi: "Opt Out of Marketing Data Sharing",
      optOutPipeda: "Manage My Data Sharing Preferences",
      dismiss: "Dismiss",
      ok: "OK",
      readMore: "Read More",
      allowSelection: "Allow Selection",
      moreDetails: "More Details",
      strictlyNecessaryInfo: "These cookies are essential for the website to function properly and cannot be disabled.",
      functionalityInfo: "These cookies enable personalized features and functionality.",
      trackingInfo: "These cookies collect information about how you use our website to help us improve it.",
      targetingInfo: "These cookies are used to deliver relevant advertisements and marketing campaigns.",
      cookieMessage: "We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. By continuing to use this site, you consent to our use of cookies.",
      privacyPreferences: "Your Privacy Preferences",
      introText: "When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies. This information might be about you, your preferences or your device and is used to make the site work properly, provide a more personalized web experience, or allow the website to analyze and improve the services offered.",
      manageSettings: "Manage your settings",
      saveSettings: "SAVE THESE SETTINGS",
      alwaysOn: "ALWAYS ON",
      on: "ON",
      off: "OFF",
      necessaryDescription: "These cookies are essential for the website to function properly and cannot be disabled.",
      functionalityDescription: "These cookies enable personalized features and functionality.",
      trackingDescription: "These cookies collect information about how you use our website to help us improve it.",
      targetingDescription: "These cookies are used to deliver relevant advertisements and marketing campaigns.",
      allowAll: "ALLOW ALL",
    },
    fr: {
      description: "🍪 Ce site utilise des cookies pour améliorer votre expérience de navigation et fournir des services personnalisés.",
      privacyPolicy: "Politique de Confidentialité",
      acceptAll: "Accepter tous les cookies",
      denyAll: "Refuser tous les cookies",
      customize: "Personnaliser les paramètres",
      preferences: "Préférences de cookies",
      necessary: "Cookies essentiels (toujours activés)",
      functionality: "Cookies fonctionnels",
      tracking: "Cookies analytiques",
      targeting: "Cookies de marketing et de ciblage",
      save: "Enregistrer les préférences",
      optOut: "Ne pas vendre mes informations",
      optOutConfirm: "Vous avez choisi de ne pas vendre vos informations personnelles.",
      optOutAppi: "Désactiver le partage de données marketing",
      optOutPipeda: "Gérer mes préférences de partage de données",
      dismiss: "Ignorer",
      ok: "OK",
      readMore: "Lire plus",
      allowSelection: "Autoriser la sélection",
      moreDetails: "Plus de détails",
      strictlyNecessaryInfo: "Ces cookies sont essentiels au bon fonctionnement du site et ne peuvent pas être désactivés.",
      functionalityInfo: "Ces cookies permettent des fonctionnalités et des caractéristiques personnalisées.",
      trackingInfo: "Ces cookies collectent des informations sur la façon dont vous utilisez notre site pour nous aider à l'améliorer.",
      targetingInfo: "Ces cookies sont utilisés pour diffuser des publicités et des campagnes marketing pertinentes.",
      cookieMessage: "Nous utilisons des cookies pour améliorer votre expérience, analyser l'utilisation du site et aider nos efforts de marketing. En continuant à utiliser ce site, vous consentez à notre utilisation de cookies.",
      privacyPreferences: "Vos Préférences de Confidentialité",
      introText: "Lorsque vous visitez un site web, il peut stocker ou récupérer des informations sur votre navigateur, principalement sous forme de cookies. Ces informations peuvent concerner vous-même, vos préférences ou votre appareil et sont utilisées pour faire fonctionner le site correctement, offrir une expérience web plus personnalisée ou permettre au site d'analyser et d'améliorer les services offerts.",
      manageSettings: "Gérer vos paramètres",
      saveSettings: "ENREGISTRER CES PARAMÈTRES",
      alwaysOn: "TOUJOURS ACTIF",
      on: "ACTIF",
      off: "INACTIF",
      necessaryDescription: "Ces cookies sont essentiels au bon fonctionnement du site et ne peuvent pas être désactivés.",
      functionalityDescription: "Ces cookies permettent des fonctionnalités et des caractéristiques personnalisées.",
      trackingDescription: "Ces cookies collectent des informations sur la façon dont vous utilisez notre site pour nous aider à l'améliorer.",
      targetingDescription: "Ces cookies sont utilisés pour diffuser des publicités et des campagnes marketing pertinentes.",
      allowAll: "TOUT AUTORISER",
    },
    de: {
      description: "🍪 Diese Website verwendet Cookies, um Ihr Surferlebnis zu verbessern und personalisierte Dienste anzubieten.",
      privacyPolicy: "Datenschutzrichtlinie",
      acceptAll: "Alle Cookies akzeptieren",
      denyAll: "Alle Cookies ablehnen",
      customize: "Einstellungen anpassen",
      preferences: "Cookie-Einstellungen",
      necessary: "Essentielle Cookies (immer aktiviert)",
      functionality: "Funktionale Cookies",
      tracking: "Analyse-Cookies",
      targeting: "Marketing- und Targeting-Cookies",
      save: "Einstellungen speichern",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    es: {
      description: "🍪 Este sitio web utiliza cookies para mejorar su experiencia de navegación y ofrecer servicios personalizados.",
      privacyPolicy: "Política de Privacidad",
      acceptAll: "Aceptar todas las cookies",
      denyAll: "Rechazar todas las cookies",
      customize: "Personalizar configuración",
      preferences: "Preferencias de cookies",
      necessary: "Cookies esenciales (siempre habilitadas)",
      functionality: "Cookies funcionales",
      tracking: "Cookies analíticas",
      targeting: "Cookies de marketing y segmentación",
      save: "Guardar preferencias",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    it: {
      description: "🍪 Questo sito utilizza i cookie per migliorare la tua esperienza di navigazione e fornire servizi personalizzati.",
      privacyPolicy: "Informativa sulla Privacy",
      acceptAll: "Accetta tutti i cookie",
      denyAll: "Rifiuta tutti i cookie",
      customize: "Personalizza impostazioni",
      preferences: "Preferenze cookie",
      necessary: "Cookie essenziali (sempre attivi)",
      functionality: "Cookie funzionali",
      tracking: "Cookie analitici",
      targeting: "Cookie di marketing e targeting",
      save: "Salva preferenze",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    pt: {
      description: "🍪 Este site usa cookies para melhorar sua experiência de navegação e fornecer serviços personalizados.",
      privacyPolicy: "Política de Privacidade",
      acceptAll: "Aceitar todos os cookies",
      denyAll: "Rejeitar todos os cookies",
      customize: "Personalizar configurações",
      preferences: "Preferências de cookies",
      necessary: "Cookies essenciais (sempre ativados)",
      functionality: "Cookies funcionais",
      tracking: "Cookies analíticos",
      targeting: "Cookies de marketing e segmentação",
      save: "Salvar preferências",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    nl: {
      description: "🍪 Deze website gebruikt cookies om uw browse-ervaring te verbeteren en gepersonaliseerde diensten te leveren.",
      privacyPolicy: "Privacybeleid",
      acceptAll: "Alle cookies accepteren",
      denyAll: "Alle cookies weigeren",
      customize: "Instellingen aanpassen",
      preferences: "Cookie-voorkeuren",
      necessary: "Essentiële cookies (altijd ingeschakeld)",
      functionality: "Functionele cookies",
      tracking: "Analytische cookies",
      targeting: "Marketing- en targeting-cookies",
      save: "Voorkeuren opslaan",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    ru: {
      description: "🍪 Этот сайт использует файлы cookie для улучшения вашего опыта просмотра и предоставления персонализированных услуг.",
      privacyPolicy: "Политика конфиденциальности",
      acceptAll: "Принять все файлы cookie",
      denyAll: "Отклонить все файлы cookie",
      customize: "Настроить параметры",
      preferences: "Настройки файлов cookie",
      necessary: "Необходимые файлы cookie (всегда включены)",
      functionality: "Функциональные файлы cookie",
      tracking: "Аналитические файлы cookie",
      targeting: "Маркетинговые и таргетинговые файлы cookie",
      save: "Сохранить настройки",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    zh: {
      description: "🍪 本网站使用 Cookie 来增强您的浏览体验并提供个性化服务。",
      privacyPolicy: "隐私政策",
      acceptAll: "接受所有 Cookie",
      denyAll: "拒绝所有 Cookie",
      customize: "自定义设置",
      preferences: "Cookie 偏好设置",
      necessary: "必要 Cookie（始终启用）",
      functionality: "功能性 Cookie",
      tracking: "分析 Cookie",
      targeting: "营销和定向 Cookie",
      save: "保存偏好设置",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    ja: {
      description: "🍪 このウェブサイトは、閲覧体験を向上させ、パーソナライズされたサービスを提供するためにCookieを使用しています。",
      privacyPolicy: "プライバシーポリシー",
      acceptAll: "すべてのCookieを受け入れる",
      denyAll: "すべてのCookieを拒否する",
      customize: "設定をカスタマイズする",
      preferences: "Cookie設定",
      necessary: "必須Cookie（常に有効）",
      functionality: "機能Cookie",
      tracking: "分析Cookie",
      targeting: "マーケティングおよびターゲティングCookie",
      save: "設定を保存",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    pl: {
      description: "🍪 Ta strona używa plików cookie, aby poprawić Twoje doświadczenie przeglądania i dostarczać spersonalizowane usługi.",
      privacyPolicy: "Polityka prywatności",
      acceptAll: "Zaakceptuj wszystkie pliki cookie",
      denyAll: "Odrzuć wszystkie pliki cookie",
      customize: "Dostosuj ustawienia",
      preferences: "Preferencje dotyczące plików cookie",
      necessary: "Niezbędne pliki cookie (zawsze włączone)",
      functionality: "Funkcjonalne pliki cookie",
      tracking: "Analityczne pliki cookie",
      targeting: "Marketingowe i targetujące pliki cookie",
      save: "Zapisz preferencje",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    sv: {
      description: "🍪 Denna webbplats använder cookies för att förbättra din surfupplevelse och tillhandahålla personliga tjänster.",
      privacyPolicy: "Integritetspolicy",
      acceptAll: "Acceptera alla cookies",
      denyAll: "Avvisa alla cookies",
      customize: "Anpassa inställningar",
      preferences: "Cookie-inställningar",
      necessary: "Nödvändiga cookies (alltid aktiverade)",
      functionality: "Funktionella cookies",
      tracking: "Analytiska cookies",
      targeting: "Marknadsförings- och målinriktade cookies",
      save: "Spara inställningar",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    no: {
      description: "🍪 Dette nettstedet bruker informasjonskapsler for å forbedre nettleseropplevelsen og gi personlige tjenester.",
      privacyPolicy: "Personvernpolicy",
      acceptAll: "Godta alle informasjonskapsler",
      denyAll: "Avvis alle informasjonskapsler",
      customize: "Tilpass innstillinger",
      preferences: "Innstillinger for informasjonskapsler",
      necessary: "Nødvendige informasjonskapsler (alltid aktivert)",
      functionality: "Funksjonelle informasjonskapsler",
      tracking: "Analytiske informasjonskapsler",
      targeting: "Markedsførings- og målrettede informasjonskapsler",
      save: "Lagre innstillinger",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    fi: {
      description: "🍪 Tämä sivusto käyttää evästeitä parantaakseen selailukokemustasi ja tarjotakseen yksilöityjä palveluita.",
      privacyPolicy: "Tietosuojakäytäntö",
      acceptAll: "Hyväksy kaikki evästeet",
      denyAll: "Hylkää kaikki evästeet",
      customize: "Mukauta asetuksia",
      preferences: "Evästeasetukset",
      necessary: "Välttämättömät evästeet (aina käytössä)",
      functionality: "Toiminnalliset evästeet",
      tracking: "Analytiikkaevästeet",
      targeting: "Markkinointi- ja kohdennusevästeet",
      save: "Tallenna asetukset",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    da: {
      description: "🍪 Denne hjemmeside bruger cookies til at forbedre din browseroplevelse og levere personlige tjenester.",
      privacyPolicy: "Privatlivspolitik",
      acceptAll: "Accepter alle cookies",
      denyAll: "Afvis alle cookies",
      customize: "Tilpas indstillinger",
      preferences: "Cookie-præferencer",
      necessary: "Nødvendige cookies (altid aktiveret)",
      functionality: "Funktionelle cookies",
      tracking: "Analytiske cookies",
      targeting: "Marketing- og målretningscookies",
      save: "Gem præferencer",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    hi: {
      description: "🍪 यह वेबसाइट आपके ब्राउ़ज़िंग अनुभव को बेहतर बनाने और व्यक्तिगत सेवाएं प्रदान करने के लिए कुकीज़ का उपयोग करती है।",
      privacyPolicy: "गोपनीयता नीति",
      acceptAll: "सभी कुकीज़ स्वीकार करें",
      denyAll: "सभी कुकीज़ अस्वीकार करें",
      customize: "सेटिंग्स अनुकूलित करें",
      preferences: "कुकी प्राथमिकताएँ",
      necessary: "आवश्यक कुकीज़ (हमेशा सक्षम)",
      functionality: "कार्यात्मक कुकीज़",
      tracking: "विश्लेषणात्मक कुकीज़",
      targeting: "मार्केटिंग और लक्षित कुकीज़",
      save: "प्राथमिकताएँ सहेजें",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    ar: {
      description: "🍪 يستخدم هذا الموقع ملفات تعريف الارتباط لتحسين تجربة التصفح وتقديم خدمات مخصصة.",
      privacyPolicy: "سياسة الخصوصية",
      acceptAll: "قبول جميع ملفات تعريف الارتباط",
      denyAll: "رفض جميع ملفات تعريف الارتباط",
      customize: "تخصيص الإعدادات",
      preferences: "تفضيلات ملفات تعريف الارتباط",
      necessary: "ملفات تعريف الارتباط الضرورية (مفعلة دائمًا)",
      functionality: "ملفات تعريف الارتباط الوظيفية",
      tracking: "ملفات تعريف الارتباط التحليلية",
      targeting: "ملفات تعريف الارتباط للتسويق والاستهداف",
      save: "حفظ التفضيلات",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    he: {
      description: "🍪 אתר זה משתמש בעוגיות כדי לשפר את חוויית הגלישה שלך ולספק שירותים מותאמים אישית.",
      privacyPolicy: "מדיניות פרטיות",
      acceptAll: "קבל את כל העוגיות",
      denyAll: "דחה את כל העוגיות",
      customize: "התאם הגדרות",
      preferences: "העדפות עוגיות",
      necessary: "עוגיות חיוניות (תמיד מופעלות)",
      functionality: "עוגיות פונקציונליות",
      tracking: "עוגיות אנליטיות",
      targeting: "עוגיות שיווק ומיקוד",
      save: "שמור העדפות",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    id: {
      description: "🍪 Situs web ini menggunakan cookie untuk meningkatkan pengalaman penjelajahan Anda dan menyediakan layanan yang dipersonalisasi.",
      privacyPolicy: "Kebijakan Privasi",
      acceptAll: "Terima Semua Cookie",
      denyAll: "Tolak Semua Cookie",
      customize: "Sesuaikan Pengaturan",
      preferences: "Preferensi Cookie",
      necessary: "Cookie Penting (selalu aktif)",
      functionality: "Cookie Fungsional",
      tracking: "Cookie Analitik",
      targeting: "Cookie Pemasaran & Penargetan",
      save: "Simpan Preferensi",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    th: {
      description: "🍪 เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การท่องเว็บของคุณและให้บริการที่ปรับแต่งตามความต้องการ",
      privacyPolicy: "นโยบายความเป็นส่วนตัว",
      acceptAll: "ยอมรับคุกกี้ทั้งหมด",
      denyAll: "ปฏิเสธคุกกี้ทั้งหมด",
      customize: "ปรับแต่งการตั้งค่า",
      preferences: "การตั้งค่าคุกกี้",
      necessary: "คุกกี้ที่จำเป็น (เปิดใช้งานเสมอ)",
      functionality: "คุกกี้ด้านฟังก์ชัน",
      tracking: "คุกกี้วิเคราะห์",
      targeting: "คุกกี้การตลาดและการกำหนดเป้าหมาย",
      save: "บันทึกการตั้งค่า",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    tr: {
      description: "Bu web sitesi, tarama deneyiminizi geliştirmek ve kişiselleştirilmiş hizmetler sunmak için çerezleri kullanır.",
      privacyPolicy: "Gizlilik Politikası",
      acceptAll: "Tüm Çerezleri Kabul Et",
      denyAll: "Tüm Çerezleri Reddet",
      customize: "Ayarları Özelleştir",
      preferences: "Çerez Tercihleri",
      necessary: "Gerekli Çerezler (her zaman etkin)",
      functionality: "İşlevsel Çerezler",
      tracking: "Analitik Çerezler",
      targeting: "Pazarlama ve Hedefleme Çerezleri",
      save: "Tercihleri Kaydet",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    vi: {
      description: "🍪 Trang web này sử dụng cookie để cải thiện trải nghiệm duyệt web của bạn và cung cấp các dịch vụ cá nhân hóa.",
      privacyPolicy: "Chính sách Bảo mật",
      acceptAll: "Chấp nhận Tất cả Cookie",
      denyAll: "Từ chối Tất cả Cookie",
      customize: "Tùy chỉnh Cài đặt",
      preferences: "Tùy chọn Cookie",
      necessary: "Cookie Cần thiết (luôn bật)",
      functionality: "Cookie Chức năng",
      tracking: "Cookie Phân tích",
      targeting: "Cookie Tiếp thị & Nhắm mục tiêu",
      save: "Lưu Tùy chọn",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    },
    ko: {
      description: "🍪 이 웹사이트는 귀하의 브라우징 경험을 향상시키고 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다.",
      privacyPolicy: "개인정보 보호정책",
      acceptAll: "모든 쿠키 수락",
      denyAll: "모든 쿠키 거부",
      customize: "설정 사용자 지정",
      preferences: "쿠키 환경설정",
      necessary: "필수 쿠키 (항상 활성화)",
      functionality: "기능 쿠키",
      tracking: "분석 쿠키",
      targeting: "마케팅 및 타겟팅 쿠키",
      save: "환경설정 저장",
      optOut: "Do Not Sell My Information",
      optOutConfirm: "You have opted out of the sale of your personal information."
    }
  };

  function t(key) {
    const lang = CONFIG.language in I18N ? CONFIG.language : "en";
    return I18N[lang][key] || key;
  }

  async function fetchRegion() {
    // Try ipapi.co first
    try {
      console.log("[SMCB] Attempting to fetch region from ipapi.co...");
      
      const res = await fetch("https://ipapi.co/json/")
      if (!res.ok) throw new Error(`ipapi.co responded with status: ${res.status}`);
      
      const data = await res.json();
      console.log("[SMCB] Successfully used ipapi.co:", data.country_code);
      
      // Store original country code for language selection
      const countryCode = data.country_code;
      
      // GDPR countries (EU member states + UK, Switzerland, Norway, Iceland, Liechtenstein)
      const gdprCountries = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","GB","UK","CH"];
      
      let region;
      if (gdprCountries.includes(countryCode)) {
        region = "GDPR";
      } else if (countryCode === "US") {
        if (data.region_code === "CA") {
          region = "CPRA";
        } else {
          region = "US";
        }
      } else if (countryCode === "BR") {
        region = "LGPD";
      } else if (countryCode === "CA") {
        region = "PIPEDA";
      } else if (countryCode === "JP") {
        region = "APPI";
      } else if (countryCode === "KR") {
        region = "PIPA";
      } else {
        region = "ROW";
      }
      
      // Return both the regulatory region and the country code
      return { region, countryCode };
    } catch (e) {
      console.log("[SMCB] Error with ipapi.co:", e.message);
      console.log("[SMCB] Falling back to ipwho.is...");
      
      // Try ipwho.is as fallback
      try {
        const res = await fetch("https://ipwho.is/");
        const data = await res.json();
        
        if (!data.success) {
          throw new Error("ipwho.is returned unsuccessful response");
        }
        
        console.log("[SMCB] Successfully used ipwho.is:", data.country_code);
        
        // GDPR countries (EU member states + UK, Switzerland, Norway, Iceland, Liechtenstein)
        const gdprCountries = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","GB","UK","CH"];
        
        if (gdprCountries.includes(data.country_code)) {
          return "GDPR";
        }
        
        // US with special case for California
        if (data.country_code === "US") {
          if (data.region_code === "CA") {
            return "CPRA";
          }
          return "US";
        }
        
        // Other specific privacy regulation regions
        if (data.country_code === "BR") return "LGPD";
        if (data.country_code === "CA") return "PIPEDA";
        if (data.country_code === "JP") return "APPI";
        if (data.country_code === "KR") return "PIPA";
        
        // Default to Rest of World
        return "ROW";
      } catch (e2) {
        console.log("[SMCB] Error with ipwho.is:", e2.message);
        console.log("[SMCB] All geolocation attempts failed, using UNKNOWN");
        return "UNKNOWN";
      }
    }
  }

  function getDefaultConsentByRegion(region) {
    switch(region) {
      case "GDPR":
        return {
          functionality: false,
          tracking: false,
          targeting: false,
          optOutEnabled: false
        };
      case "CPRA": // California
        return {
          functionality: true,
          tracking: true,
          targeting: true,
          optOutEnabled: true
        };
      case "US": // Other US states
        return {
          functionality: true,
          tracking: true,
          targeting: true,
          optOutEnabled: false
        };
      case "LGPD": // Brazil
        return {
          functionality: false,
          tracking: false,
          targeting: false,
          optOutEnabled: false
        };
      case "PIPEDA": // Canada
        return {
          functionality: true,
          tracking: true,
          targeting: true,
          optOutEnabled: true
        };
      case "APPI": // Japan
        return {
          functionality: true,
          tracking: true,
          targeting: true,
          optOutEnabled: true
        };
      case "PIPA": // Korea
        return {
          functionality: false,
          tracking: false,
          targeting: false,
          optOutEnabled: false
        };
      case "ROW": // Rest of World
        return {
          functionality: false,
          tracking: false,
          targeting: false,
          optOutEnabled: false
        };
      case "UNKNOWN":
      default:
        return {
          functionality: false,
          tracking: false,
          targeting: false,
          optOutEnabled: true
        };
    }
  }

  function getStoredConsent() {
    try {
      const value = localStorage.getItem(CONSENT_COOKIE_KEY);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  }

  function setConsent(consents, eventName) {
    localStorage.setItem(CONSENT_COOKIE_KEY, JSON.stringify(consents));
    document.cookie = `${CONSENT_COOKIE_KEY}=${JSON.stringify(consents)}; path=/; max-age=31536000`;
    DATA_LAYER.push({ event: eventName });
  }

  function getOptOutText(region) {
    if (region === "CPRA") {
      return t("optOut"); // Default is "Do Not Sell or Share My Personal Information"
    } else if (region === "APPI") {
      return t("optOutAppi");
    } else if (region === "PIPEDA") {
      return t("optOutPipeda");
    }
    return t("optOut");
  }

  function animateShowBanner(banner) {
    // Start with opacity 0
    banner.style.opacity = "0";
    document.body.appendChild(banner);
    
    // Force a reflow
    banner.offsetHeight;
    
    // Transition to full opacity
    banner.style.opacity = "1";
  }

  function animateHideBanner(bannerElement, callback) {
    if (!bannerElement) {
      bannerElement = document.getElementById("consent-banner");
      if (!bannerElement) {
        console.error("Cannot find banner to hide");
        if (callback) callback();
        return;
      }
    }
    
    // Animate opacity to 0
    bannerElement.style.opacity = "0";
    
    // Wait for animation to complete
    setTimeout(() => {
      if (callback) callback();
    }, 300); // Match this with the CSS transition time
  }

  function injectBanner() {
    // Create overlay for modal and interstitial only (removed inline)
    if (CONFIG.layout === "modal" || CONFIG.layout === "interstitial") {
      const overlay = document.createElement("div");
      overlay.className = "cb-overlay";
      document.body.appendChild(overlay);
    }

    // Reserve space for header to prevent layout shift
    if (CONFIG.layout === "header") {
      document.body.classList.add("has-header-notice");
      
      // Measure actual banner height and set padding accordingly
      function updateHeaderPadding() {
        const banner = document.querySelector(".cb-wrapper.header");
        if (banner) {
          const height = banner.offsetHeight;
          document.body.style.paddingTop = `${Math.max(height, 60)}px`;
        }
      }
      
      // Call multiple times to catch layout changes
      setTimeout(updateHeaderPadding, 50);
      setTimeout(updateHeaderPadding, 300);
      
      // Also update on window resize
      window.addEventListener('resize', updateHeaderPadding);
    }

    // Create banner element
    const banner = document.createElement("div");
    banner.id = "consent-banner";

    // Get stored consent or defaults
    const storedConsent = getStoredConsent() || {};
    const region = CONFIG.region || "UNKNOWN";
    const optOutEnabled = storedConsent.optOutEnabled || false;
    
    // Base wrapper with proper layout class
    let bannerHTML = `<div class="cb-wrapper ${CONFIG.theme} ${CONFIG.layout}" data-config="${CONFIG.configurability}">`;
    
    // Title for the banner
    bannerHTML += `<div class="cb-title">${t("privacyPreferences")}</div>`;
    
    // Introduction text
    bannerHTML += `<p class="cb-intro-text">${t("introText")} <a href="${CONFIG.privacyPolicyUrl}" target="_blank">${t("privacyPolicy")}</a></p>`;
    
    // Actions vary by configurability
    if (CONFIG.configurability === "none") {
      // Simplest version - just a dismiss button
      bannerHTML += `<div class="cb-actions">
        <button id="cb-dismiss" class="cb-primary-button">${t("dismiss")}</button>
      </div>`;
    } else if (CONFIG.configurability === "some") {
      if (optOutEnabled) {
        // For regions requiring opt-out (California, Japan, Canada)
        bannerHTML += `<div class="cb-actions">
          <button id="cb-ok" class="cb-primary-button">${t("ok")}</button>
          <button id="cb-opt-out">${getOptOutText(region)}</button>
        </div>`;
      } else {
        // Standard accept/deny options
        bannerHTML += `<div class="cb-actions">
          <button id="cb-accept" class="cb-primary-button">${t("acceptAll")}</button>
          <button id="cb-deny">${t("denyAll")}</button>
        </div>`;
      }
    } else { // full configurability
      // Main actions - Allow All button
      bannerHTML += `<div class="cb-actions">
        <button id="cb-accept" class="cb-primary-button">${t("allowAll")}</button>
      </div>`;
      
      // Settings accordion
      bannerHTML += `
        <div class="cb-settings-accordion">
          <div class="cb-accordion-header" id="settings-header">
            <span>${t("manageSettings")}</span>
            <span class="cb-accordion-toggle">▼</span>
          </div>
          <div class="cb-accordion-content" id="settings-content" style="display: none;">
            <div class="cb-cookie-row">
              <div class="cb-cookie-info">
                <div class="cb-cookie-name">${t("necessary")}</div>
                <div class="cb-cookie-description">${t("necessaryDescription")}</div>
              </div>
              <div class="cb-toggle-container">
                <span class="cb-toggle-status">${t("alwaysOn")}</span>
              </div>
            </div>
            
            <div class="cb-cookie-row">
              <div class="cb-cookie-info">
                <div class="cb-cookie-name">${t("functionality")}</div>
                <div class="cb-cookie-description">${t("functionalityDescription")}</div>
              </div>
              <div class="cb-toggle-container">
                <label class="cb-toggle">
                  <input type="checkbox" id="cb-func">
                  <span class="cb-toggle-slider"></span>
                </label>
                <span class="cb-toggle-status" id="func-status">${t("off")}</span>
              </div>
            </div>
            
            <div class="cb-cookie-row">
              <div class="cb-cookie-info">
                <div class="cb-cookie-name">${t("tracking")}</div>
                <div class="cb-cookie-description">${t("trackingDescription")}</div>
              </div>
              <div class="cb-toggle-container">
                <label class="cb-toggle">
                  <input type="checkbox" id="cb-track">
                  <span class="cb-toggle-slider"></span>
                </label>
                <span class="cb-toggle-status" id="track-status">${t("off")}</span>
              </div>
            </div>
            
            <div class="cb-cookie-row">
              <div class="cb-cookie-info">
                <div class="cb-cookie-name">${t("targeting")}</div>
                <div class="cb-cookie-description">${t("targetingDescription")}</div>
              </div>
              <div class="cb-toggle-container">
                <label class="cb-toggle">
                  <input type="checkbox" id="cb-target">
                  <span class="cb-toggle-slider"></span>
                </label>
                <span class="cb-toggle-status" id="target-status">${t("off")}</span>
              </div>
            </div>
            
            <div class="cb-save-settings">
              <button id="cb-save" class="cb-primary-button">${t("saveSettings")}</button>
            </div>
          </div>
        </div>`;
    }
    
    bannerHTML += `</div>`; // Close wrapper div
    
    if (CONFIG.layout === "interstitial") {
      // Wrap the content in an inner container
      bannerHTML = `<div class="cb-wrapper ${CONFIG.theme} ${CONFIG.layout}" data-config="${CONFIG.configurability}">
        <div class="cb-interstitial-inner">
          ${bannerHTML.slice(bannerHTML.indexOf('>')+1, bannerHTML.lastIndexOf('</div>'))}
        </div>
      </div>`;
    }
    
    banner.innerHTML = bannerHTML;

    if (!document.body) {
      console.warn("[SMCB] document.body not ready — banner injection skipped");
      return;
    }

    // Remove the inline-specific code from the layout selection
    if (CONFIG.layout === "inline") {
      // Skip inline layout - not supported anymore
      console.log("[SMCB] Inline layout no longer supported, falling back to modal");
      CONFIG.layout = "modal"; // Fall back to modal instead
      animateShowBanner(banner);
    } else {
      animateShowBanner(banner);
    }
    
    // Pre-check boxes based on default consent for full configurability
    if (CONFIG.configurability === "full") {
      try {
        const defaults = getDefaultConsentByRegion(region);
        
        // Set checkbox states
        const funcCheckbox = document.getElementById("cb-func");
        const trackCheckbox = document.getElementById("cb-track");
        const targetCheckbox = document.getElementById("cb-target");
        
        if (funcCheckbox) {
          funcCheckbox.checked = defaults.functionality;
          document.getElementById("func-status").textContent = defaults.functionality ? t("on") : t("off");
        }
        
        if (trackCheckbox) {
          trackCheckbox.checked = defaults.tracking;
          document.getElementById("track-status").textContent = defaults.tracking ? t("on") : t("off");
        }
        
        if (targetCheckbox) {
          targetCheckbox.checked = defaults.targeting;
          document.getElementById("target-status").textContent = defaults.targeting ? t("on") : t("off");
        }
      } catch (e) {
        console.error("Error setting toggle values:", e);
      }
    }
    
    attachHandlers();

    // After creating and injecting the banner
    setTimeout(() => {
      const bannerWrapper = document.querySelector('.cb-wrapper');
      if (bannerWrapper) {
        // Add mobile class if needed
        if (isMobileDevice()) {
          bannerWrapper.classList.add('mobile-view');
        }
        
        // Force redraw to ensure transitions work properly
        bannerWrapper.offsetHeight;
      }
    }, 10);
  }

  // Improve device detection
  function isMobileDevice() {
    const isMobile = window.innerWidth < 768 || 
           (('ontouchstart' in window) && window.innerWidth < 1024);
           
    // Add or remove mobile-view class based on viewport
    const banner = document.querySelector('.cb-wrapper');
    if (banner) {
      if (isMobile) {
        banner.classList.add('mobile-view');
      } else {
        banner.classList.remove('mobile-view');
      }
    }
    
    return isMobile;
  }

  // Add window resize handler to update mobile/desktop styling
  window.addEventListener('resize', function() {
    isMobileDevice();
  });

  // Update attachHandlers function to check for mobile
  function attachHandlers() {
    // Get a reference to the banner
    const banner = document.getElementById("consent-banner");
    if (!banner) {
      console.error("Banner element not found");
      return;
    }
    
    // Accordion functionality with mobile awareness
    const accordionHeader = document.getElementById("settings-header");
    if (accordionHeader) {
      // On mobile, ALWAYS start with accordion open and force display
      const content = document.getElementById("settings-content");
      
      // Force mobile check and set initial state
      if (isMobileDevice()) {
        if (content) {
          content.style.display = "block";
          const toggle = accordionHeader.querySelector(".cb-accordion-toggle");
          if (toggle) toggle.textContent = "▲";
          
          // Add a class to identify it's been properly initialized for mobile
          content.classList.add('mobile-expanded');
        }
      }
      
      // Modify accordion click handler to work better on mobile
      accordionHeader.onclick = () => {
        const content = document.getElementById("settings-content");
        const toggle = accordionHeader.querySelector(".cb-accordion-toggle");
        
        if (!content) return;
        
        // On mobile devices, we still allow toggling but ensure it always works
        if (isMobileDevice()) {
          if (content.classList.contains('mobile-expanded')) {
            // Allow hiding on mobile too, if specifically clicked
            content.style.display = "none";
            content.classList.remove('mobile-expanded');
            if (toggle) toggle.textContent = "▼";
          } else {
            content.style.display = "block";
            content.classList.add('mobile-expanded');
            if (toggle) toggle.textContent = "▲";
          }
        } else {
          // Desktop behavior unchanged
          if (content.style.display === "none") {
            content.style.display = "block";
            if (toggle) toggle.textContent = "▲";
          } else {
            content.style.display = "none";
            if (toggle) toggle.textContent = "▼";
          }
        }
      };
    }
    
    // Handler for "Accept All" button
    const acceptBtn = document.getElementById("cb-accept");
    if (acceptBtn) {
      acceptBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          setConsent({ 
            functionality: true, 
            tracking: true, 
            targeting: true,
            optOutEnabled: getStoredConsent()?.optOutEnabled || false 
          }, "consent_accepted");
          
          // Remove the banner element
          if (bannerElement && bannerElement.parentNode) {
            bannerElement.parentNode.removeChild(bannerElement);
          }
          
          // Remove overlay if exists
          const overlay = document.querySelector(".cb-overlay");
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          
          // Reset header spacing completely
          resetHeaderSpacing();
        });
      };
    }

    // Handler for Dismiss/OK button in "none" or "some" configurability
    const dismissBtn = document.getElementById("cb-dismiss");
    if (dismissBtn) {
      dismissBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          setConsent({ 
            functionality: true, 
            tracking: true, 
            targeting: true,
            optOutEnabled: getStoredConsent()?.optOutEnabled || false 
          }, "consent_updated");
          
          // Remove the banner element
          if (bannerElement && bannerElement.parentNode) {
            bannerElement.parentNode.removeChild(bannerElement);
          }
          
          // Remove overlay if exists
          const overlay = document.querySelector(".cb-overlay");
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          
          if (CONFIG.layout === "header") {
            resetHeaderSpacing();
          }
        });
      };
    }
    
    // Handler for OK button in "some" configurability with optOutEnabled
    const okBtn = document.getElementById("cb-ok");
    if (okBtn) {
      okBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          // Keep existing consent levels, just dismiss the banner
          document.getElementById("consent-banner").remove();
          
          const overlay = document.querySelector(".cb-overlay");
          if (overlay) overlay.remove();
          
          if (CONFIG.layout === "header") {
            resetHeaderSpacing();
          }
        });
      };
    }

    // Handler for "Deny All" button
    const denyBtn = document.getElementById("cb-deny");
    if (denyBtn) {
      denyBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          setConsent({ 
            functionality: false, 
            tracking: false, 
            targeting: false,
            optOutEnabled: getStoredConsent()?.optOutEnabled || false 
          }, "consent_denied");
          
          // Remove the banner element
          if (bannerElement && bannerElement.parentNode) {
            bannerElement.parentNode.removeChild(bannerElement);
          }
          
          // Remove overlay if exists
          const overlay = document.querySelector(".cb-overlay");
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          
          if (CONFIG.layout === "header") {
            resetHeaderSpacing();
          }
        });
      };
    }

    // Handler for "Allow Selection" button
    const allowSelectionBtn = document.getElementById("cb-allow-selection");
    if (allowSelectionBtn) {
      allowSelectionBtn.onclick = () => {
        console.log("Allow selection clicked"); // Add debug log
        
        // Hide main content and show preferences
        const mainContent = document.getElementById("cb-main-content");
        const preferences = document.getElementById("cb-preferences");
        
        console.log("Elements found:", !!mainContent, !!preferences); // Debug
        
        if (mainContent) mainContent.style.display = "none";
        if (preferences) preferences.style.display = "block";
        
        // Pre-check boxes based on default consent
        try {
          const region = CONFIG.region || "US";
          const defaults = getDefaultConsentByRegion(region);
          document.getElementById("cb-func").checked = defaults.functionality;
          document.getElementById("cb-track").checked = defaults.tracking;
          document.getElementById("cb-target").checked = defaults.targeting;
        } catch (e) {
          console.error("Error setting checkbox values:", e);
        }
      };
    }

    // Add back button handler to return to main view
    const backBtn = document.getElementById("cb-back");
    if (backBtn) {
      backBtn.onclick = () => {
        document.getElementById("cb-preferences").style.display = "none";
        document.getElementById("cb-main-content").style.display = "block";
      };
    }

    // Handler for "Save Preferences" button
    const saveBtn = document.getElementById("cb-save");
    if (saveBtn) {
      saveBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          const consents = {
            functionality: document.getElementById("cb-func").checked,
            tracking: document.getElementById("cb-track").checked,
            targeting: document.getElementById("cb-target").checked,
            optOutEnabled: getStoredConsent()?.optOutEnabled || false
          };
          setConsent(consents, "consent_updated");
          
          // Remove the banner element
          if (bannerElement && bannerElement.parentNode) {
            bannerElement.parentNode.removeChild(bannerElement);
          }
          
          // Remove overlay if exists
          const overlay = document.querySelector(".cb-overlay");
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
          
          if (CONFIG.layout === "header") {
            resetHeaderSpacing();
          }
        });
      };
    }

    // Add opt-out handler if the button exists
    const optOutBtn = document.getElementById("cb-opt-out");
    if (optOutBtn) {
      optOutBtn.onclick = () => {
        const bannerElement = document.getElementById("consent-banner");
        animateHideBanner(bannerElement, () => {
          const storedConsent = getStoredConsent() || {};
          const updatedConsent = {
            ...storedConsent,
            tracking: false,
            targeting: false
          };
          
          setConsent(updatedConsent, "consent_opt_out");
          
          // Immediately close the banner
          document.getElementById("consent-banner").remove();
          
          // Remove overlay if exists
          const overlay = document.querySelector(".cb-overlay");
          if (overlay) overlay.remove();
          
          if (CONFIG.layout === "header") {
            resetHeaderSpacing();
          }
        });
      };
    }
    
    // Add handlers for toggle switches to update status text
    const toggles = ["func", "track", "target"];
    toggles.forEach(type => {
      const checkbox = document.getElementById(`cb-${type}`);
      if (checkbox) {
        checkbox.onchange = () => {
          const status = document.getElementById(`${type}-status`);
          if (status) {
            status.textContent = checkbox.checked ? t("on") : t("off");
          }
        };
      }
    });
  }

  // Add a complete header reset function
  function resetHeaderSpacing() {
    document.body.classList.remove("has-header-notice");
    document.body.style.paddingTop = "0"; // Explicit reset
    
    // Remove any inline styles potentially added to the body
    const bodyStyle = document.body.getAttribute("style") || "";
    if (bodyStyle.includes("padding-top")) {
      const newStyle = bodyStyle.replace(/padding-top:[^;]+;?/g, "");
      if (newStyle.trim()) {
        document.body.setAttribute("style", newStyle);
      } else {
        document.body.removeAttribute("style");
      }
    }
  }

  async function onReady() {
    console.log("[SMCB] onReady triggered");
    const stored = getStoredConsent();
    if (!stored) {
      const result = await fetchRegion();
      console.log("[SMCB] Region info:", result);
      
      // Use countryCode for language selection but region for regulatory defaults
      CONFIG = getConfig(result.countryCode);
      CONFIG.region = result.region; // Store the regulatory region in CONFIG
      
      const defaults = getDefaultConsentByRegion(result.region);
      console.log("[SMCB] Defaults:", defaults);
      setConsent(defaults, "consent_default");
      injectBanner();
    } else {
      const result = await fetchRegion();
      CONFIG = getConfig(result.countryCode);
      CONFIG.region = result.region;
      console.log("[SMCB] Consent already stored. Banner will not show.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  function addResourceHints() {
    // DNS prefetch for primary IP API
    const dnsPrefetch1 = document.createElement('link');
    dnsPrefetch1.rel = 'dns-prefetch';
    dnsPrefetch1.href = 'https://ipapi.co';
    document.head.appendChild(dnsPrefetch1);
    
    // Preconnect for primary IP API
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://ipapi.co';
    document.head.appendChild(preconnect1);
    
    // DNS prefetch for fallback IP API
    const dnsPrefetch2 = document.createElement('link');
    dnsPrefetch2.rel = 'dns-prefetch';
    dnsPrefetch2.href = 'https://ipwho.is';
    document.head.appendChild(dnsPrefetch2);
    
    // Preconnect for fallback IP API
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://ipwho.is';
    document.head.appendChild(preconnect2);
    
    // If using third-party consent management platforms
    if (window.__ConsentBannerConfig?.thirdParty) {
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.href = window.__ConsentBannerConfig.thirdParty;
      preload.as = 'script';
      document.head.appendChild(preload);
    }
  }

  // Call this function early in the execution
  addResourceHints();
})();
