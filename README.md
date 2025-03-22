
# Consent Banner

- A Google Tag Manager orientated consent-banner that integrates with the newly released Consent Mode. 
- Optimized for wide-compatability across different devices and specific catering toward not effecting CLS & INP
- Aimed to be a drop-in solution for managing consent-banners region wide

## Current Version
- Configurations for consent banner UI
- Internationalization support
- Sends consent updates to data layer for per-tag configuration via GTM Consent Mode(Beta)
- Retrieve users region
- Sets default consent values based on region

## Upcoming Features
- GTM Template for friendly setup
- Options for auto-blocking per vendor
- Wider data compliancy support
- More regions/languages

## Features
### Configurability
- Options for footer, forced(interstitial), header, modal
- Configurable Options
- Themes


## Installation
### 1. Paste this into a Custom HTML tag
```html 
<script>
// Configure the banner
window.__ConsentBannerConfig = {
  theme: 'dark',   // dark, light
  layout: 'footer',// footer, interstitial, header, modal
  configurability: 'full', // none, some, full
  privacyPolicyUrl: '/privacy-policy' // your privacy policy
};

// Load resources manually
(function() {
  // Add CSS
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/gh/Stackmatix-Inc/consent-banner@latest/dist/consent-banner.min.css';
  document.head.appendChild(link);
  
  // Add JS
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/Stackmatix-Inc/consent-banner@latest/dist/consent-banner.min.js';
  document.head.appendChild(script);
})();
</script>
```
### 2. Set trigger to "On Consent Initialization"

## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@x-candy6](https://www.github.com/x-candy6)

