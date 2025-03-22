(function () {
  if (localStorage.getItem("cookie_consent")) return;

  const banner = document.createElement("div");
  banner.innerHTML = `
    <div id="cookie-banner">
      <p>We use cookies to improve your experience.</p>
      <button id="accept-cookies">Accept All</button>
      <button id="reject-cookies">Reject All</button>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById("accept-cookies").onclick = () => {
    localStorage.setItem("cookie_consent", "granted");
    gtag && gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });
    banner.remove();
  };

  document.getElementById("reject-cookies").onclick = () => {
    localStorage.setItem("cookie_consent", "denied");
    gtag && gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied'
    });
    banner.remove();
  };
})();
