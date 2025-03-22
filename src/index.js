// src/index.js
(function () {
  const CONFIG = window.__ConsentBannerConfig || {
    theme: "dark", // or 'light'
    layout: "footer", // or 'modal', 'header', etc.
    privacyPolicyUrl: "/privacy-policy",
  };

  const CONSENT_COOKIE_KEY = "cookie_consent_level";
  const DATA_LAYER = window.dataLayer = window.dataLayer || [];

  // Placeholder: Determine user's region and apply default consents
  function getDefaultConsentByRegion() {
    // TODO: Replace with real geo lookup (e.g. via IPinfo, Cloudflare, etc.)
    const region = "EEA"; // fallback default for now
    if (region === "EEA" || region === "UK" || region === "CH") {
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
        <p>🍪 We use cookies to improve your experience. <a href="${CONFIG.privacyPolicyUrl}" target="_blank">Privacy Policy</a></p>
        <div class="cb-actions">
          <button id="cb-accept">Accept All</button>
          <button id="cb-deny">Deny All</button>
          <button id="cb-customize">Customize</button>
        </div>
      </div>
      <div id="cb-preferences" style="display:none">
        <h3>Preferences</h3>
        <label><input type="checkbox" disabled checked> Necessary (always on)</label>
        <label><input type="checkbox" id="cb-func"> Functional</label>
        <label><input type="checkbox" id="cb-track"> Analytics</label>
        <label><input type="checkbox" id="cb-target"> Targeting</label>
        <button id="cb-save">Save Preferences</button>
      </div>
    `;
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

  document.addEventListener("DOMContentLoaded", () => {
    let stored = getStoredConsent();
    if (!stored) {
      const defaults = getDefaultConsentByRegion();
      setConsent(defaults, "consent_default");
      injectBanner();
    }
  });
})();
