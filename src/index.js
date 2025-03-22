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
    const fallbackLang = userConfig.language || REGION_TO_LANG[region] || (navigator.language?.slice(0, 2) || "en");
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
      save: "Save Preferences"
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
      save: "Enregistrer les préférences"
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
      save: "Einstellungen speichern"
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
      save: "Guardar preferencias"
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
      save: "Salva preferenze"
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
      save: "Salvar preferências"
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
      save: "Voorkeuren opslaan"
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
      save: "Сохранить настройки"
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
      save: "保存偏好设置"
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
      save: "設定を保存"
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
      save: "Zapisz preferencje"
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
      save: "Spara inställningar"
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
      save: "Lagre innstillinger"
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
      save: "Tallenna asetukset"
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
      save: "Gem præferencer"
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
      save: "प्राथमिकताएँ सहेजें"
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
      save: "حفظ التفضيلات"
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
      save: "שמור העדפות"
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
      save: "Simpan Preferensi"
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
      save: "บันทึกการตั้งค่า"
    },
    tr: {
      description: "🍪 Bu web sitesi, tarama deneyiminizi geliştirmek ve kişiselleştirilmiş hizmetler sunmak için çerezleri kullanır.",
      privacyPolicy: "Gizlilik Politikası",
      acceptAll: "Tüm Çerezleri Kabul Et",
      denyAll: "Tüm Çerezleri Reddet",
      customize: "Ayarları Özelleştir",
      preferences: "Çerez Tercihleri",
      necessary: "Gerekli Çerezler (her zaman etkin)",
      functionality: "İşlevsel Çerezler",
      tracking: "Analitik Çerezler",
      targeting: "Pazarlama ve Hedefleme Çerezleri",
      save: "Tercihleri Kaydet"
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
      save: "Lưu Tùy chọn"
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
      save: "환경설정 저장"
    }
  };

  function t(key) {
    const lang = CONFIG.language in I18N ? CONFIG.language : "en";
    return I18N[lang][key] || key;
  }

  async function fetchRegion() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return data.country || "US";
    } catch (e) {
      return "US";
    }
  }

  function getDefaultConsentByRegion(region) {
    if (["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IS","IE","IT","LV","LI","LT","LU","MT","NL","NO","PL","PT","RO","SK","SI","ES","SE","UK","CH"].includes(region)) {
      return { functionality: false, tracking: false, targeting: false };
    } else if (region === "US") {
      return { functionality: true, tracking: false, targeting: false };
    } else {
      return { functionality: true, tracking: true, targeting: true };
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

  function injectBanner() {
    // Create overlay for modal and interstitial
    if (CONFIG.layout === "modal" || CONFIG.layout === "interstitial") {
      const overlay = document.createElement("div");
      overlay.className = "cb-overlay";
      document.body.appendChild(overlay);
    }

    // Reserve space for header to prevent layout shift
    if (CONFIG.layout === "header") {
      document.body.classList.add("has-header-notice");
    }

    // Create banner element
    const banner = document.createElement("div");
    banner.id = "consent-banner";

    // Different HTML structure based on configurability level
    let bannerHTML = '';
    
    // Base wrapper with proper layout class
    bannerHTML = `<div class="cb-wrapper ${CONFIG.theme} ${CONFIG.layout}">
      <p>${t("description")} <a href="${CONFIG.privacyPolicyUrl}" target="_blank">${t("privacyPolicy")}</a></p>
      <div class="cb-actions">`;
    
    // Different action buttons based on configurability
    if (CONFIG.configurability === "none") {
      bannerHTML += `
        <button id="cb-accept">${t("acceptAll")}</button>
        <button id="cb-dismiss">${t("acceptAll")}</button>`;
    } else if (CONFIG.configurability === "some") {
      bannerHTML += `
        <button id="cb-accept">${t("acceptAll")}</button>
        <button id="cb-deny">${t("denyAll")}</button>`;
    } else { // full configurability
      bannerHTML += `
        <button id="cb-accept">${t("acceptAll")}</button>
        <button id="cb-deny">${t("denyAll")}</button>
        <button id="cb-customize">${t("customize")}</button>`;
    }
    
    bannerHTML += `</div></div>`;
    
    // Add preferences panel for full configurability
    if (CONFIG.configurability === "full") {
      bannerHTML += `
        <div id="cb-preferences" class="${CONFIG.theme}" style="display:none">
          <h3>${t("preferences")}</h3>
          <label><input type="checkbox" disabled checked> ${t("necessary")}</label>
          <label><input type="checkbox" id="cb-func"> ${t("functionality")}</label>
          <label><input type="checkbox" id="cb-track"> ${t("tracking")}</label>
          <label><input type="checkbox" id="cb-target"> ${t("targeting")}</label>
          <button id="cb-save">${t("save")}</button>
        </div>`;
    }
    
    banner.innerHTML = bannerHTML;

    if (!document.body) {
      console.warn("[SMCB] document.body not ready — banner injection skipped");
      return;
    }

    // For inline placement, find container or append to body
    if (CONFIG.layout === "inline") {
      const container = document.querySelector(CONFIG.inlineContainer || "body");
      if (container) {
        if (CONFIG.inlinePosition === "before") {
          container.prepend(banner);
        } else {
          container.appendChild(banner);
        }
      } else {
        document.body.appendChild(banner);
      }
    } else {
      document.body.appendChild(banner);
    }
    
    attachHandlers();
  }

  function attachHandlers() {
    document.getElementById("cb-accept").onclick = () => {
      // Acknowledge click right away
      const banner = document.getElementById("consent-banner");
      banner.style.opacity = "0.5";
      
      // Use setTimeout to yield to the browser
      setTimeout(() => {
        setConsent({ functionality: true, tracking: true, targeting: true }, "consent_accepted");
        document.getElementById("consent-banner").remove();
        
        // Remove overlay if exists
        const overlay = document.querySelector(".cb-overlay");
        if (overlay) overlay.remove();
        
        // Remove body class if header layout
        if (CONFIG.layout === "header") {
          document.body.classList.remove("has-header-notice");
        }
      }, 0);
    };

    // Add dismiss handler for no-configurability option
    if (CONFIG.configurability === "none") {
      document.getElementById("cb-dismiss").onclick = () => {
        const banner = document.getElementById("consent-banner");
        banner.style.opacity = "0.5";
        
        setTimeout(() => {
          setConsent({ functionality: true, tracking: true, targeting: true }, "consent_accepted");
          document.getElementById("consent-banner").remove();
          
          const overlay = document.querySelector(".cb-overlay");
          if (overlay) overlay.remove();
          
          if (CONFIG.layout === "header") {
            document.body.classList.remove("has-header-notice");
          }
        }, 0);
      };
    }

    // Only show deny/customize for some/full configurability
    if (CONFIG.configurability !== "none") {
      document.getElementById("cb-deny").onclick = () => {
        const banner = document.getElementById("consent-banner");
        banner.style.opacity = "0.5";
        
        setTimeout(() => {
          setConsent({ functionality: false, tracking: false, targeting: false }, "consent_denied");
          document.getElementById("consent-banner").remove();
          
          const overlay = document.querySelector(".cb-overlay");
          if (overlay) overlay.remove();
          
          if (CONFIG.layout === "header") {
            document.body.classList.remove("has-header-notice");
          }
        }, 0);
      };
    }

    // Only show customize for full configurability
    if (CONFIG.configurability === "full") {
      document.getElementById("cb-customize").onclick = () => {
        document.getElementById("cb-preferences").style.display = "block";
        
        // Pre-check boxes based on default consent
        const region = CONFIG.region || "US";
        const defaults = getDefaultConsentByRegion(region);
        document.getElementById("cb-func").checked = defaults.functionality;
        document.getElementById("cb-track").checked = defaults.tracking;
        document.getElementById("cb-target").checked = defaults.targeting;
      };

      document.getElementById("cb-save").onclick = () => {
        const banner = document.getElementById("consent-banner");
        banner.style.opacity = "0.5";
        
        setTimeout(() => {
          const consents = {
            functionality: document.getElementById("cb-func").checked,
            tracking: document.getElementById("cb-track").checked,
            targeting: document.getElementById("cb-target").checked,
          };
          setConsent(consents, "consent_updated");
          document.getElementById("consent-banner").remove();
          
          const overlay = document.querySelector(".cb-overlay");
          if (overlay) overlay.remove();
          
          if (CONFIG.layout === "header") {
            document.body.classList.remove("has-header-notice");
          }
        }, 0);
      };
    }
  }

  async function onReady() {
    console.log("[SMCB] onReady triggered");
    const stored = getStoredConsent();
    if (!stored) {
      const region = await fetchRegion();
      console.log("[SMCB] Region:", region);
      CONFIG = getConfig(region);
      const defaults = getDefaultConsentByRegion(region);
      console.log("[SMCB] Defaults:", defaults);
      setConsent(defaults, "consent_default");
      injectBanner();
    } else {
      CONFIG = getConfig(); // still load config for debugging
      console.log("[SMCB] Consent already stored. Banner will not show.");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  function addResourceHints() {
    // DNS prefetch for IP API
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://ipapi.co';
    document.head.appendChild(dnsPrefetch);
    
    // Preconnect for IP API
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://ipapi.co';
    document.head.appendChild(preconnect);
  }

  // Call this function early in the execution
  addResourceHints();
})();
