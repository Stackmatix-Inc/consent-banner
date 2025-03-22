// src/index.js
(function () {
  const REGION_TO_LANG = {
    US: "en", GB: "en", AU: "en", CA: "en", IE: "en",
    FR: "fr", BE: "fr", CH: "fr",
    DE: "de", AT: "de", CH: "de",
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
    layout: "footer",
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
      description: "🍪 We use cookies to improve your experience.",
      privacyPolicy: "Privacy Policy",
      acceptAll: "Accept All",
      denyAll: "Deny All",
      customize: "Customize",
      preferences: "Preferences",
      necessary: "Necessary (always on)",
      functionality: "Functional",
      tracking: "Analytics",
      targeting: "Targeting",
      save: "Save Preferences"
    },
    fr: {
      description: "🍪 Nous utilisons des cookies pour améliorer votre expérience.",
      privacyPolicy: "Politique de Confidentialité",
      acceptAll: "Tout accepter",
      denyAll: "Tout refuser",
      customize: "Personnaliser",
      preferences: "Préférences",
      necessary: "Nécessaire (toujours activé)",
      functionality: "Fonctionnels",
      tracking: "Analytiques",
      targeting: "Ciblage",
      save: "Sauvegarder les préférences"
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
    const banner = document.createElement("div");
    banner.id = "consent-banner";
    banner.innerHTML = `
      <div class="cb-wrapper ${CONFIG.theme} ${CONFIG.layout}">
        <p>${t("description")} <a href="${CONFIG.privacyPolicyUrl}" target="_blank">${t("privacyPolicy")}</a></p>
        <div class="cb-actions">
          <button id="cb-accept">${t("acceptAll")}</button>
          <button id="cb-deny">${t("denyAll")}</button>
          <button id="cb-customize">${t("customize")}</button>
        </div>
      </div>
      <div id="cb-preferences" style="display:none">
        <h3>${t("preferences")}</h3>
        <label><input type="checkbox" disabled checked> ${t("necessary")}</label>
        <label><input type="checkbox" id="cb-func"> ${t("functionality")}</label>
        <label><input type="checkbox" id="cb-track"> ${t("tracking")}</label>
        <label><input type="checkbox" id="cb-target"> ${t("targeting")}</label>
        <button id="cb-save">${t("save")}</button>
      </div>
    `;

    if (!document.body) {
      console.warn("[SMCB] document.body not ready — banner injection skipped");
      return;
    }

    document.body.appendChild(banner);
    attachHandlers();
  }

  function attachHandlers() {
    document.getElementById("cb-accept").onclick = () => {
      setConsent({ functionality: true, tracking: true, targeting: true }, "consent_accepted");
      document.getElementById("consent-banner").remove();
    };

    document.getElementById("cb-deny").onclick = () => {
      setConsent({ functionality: false, tracking: false, targeting: false }, "consent_denied");
      document.getElementById("consent-banner").remove();
    };

    document.getElementById("cb-customize").onclick = () => {
      document.getElementById("cb-preferences").style.display = "block";
    };

    document.getElementById("cb-save").onclick = () => {
      const consents = {
        functionality: document.getElementById("cb-func").checked,
        tracking: document.getElementById("cb-track").checked,
        targeting: document.getElementById("cb-target").checked,
      };
      setConsent(consents, "consent_updated");
      document.getElementById("consent-banner").remove();
    };
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
})();
