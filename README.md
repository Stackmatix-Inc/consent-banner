# Consent Banner

A Google Tag Manager orientated consent-banner that integrates with the newly released Consent Mode. 
Optimized for wide-compatability across different devices and specific catering toward not effecting CLS & INP
Multi-region support with internalization and automatic Bing UET support.

## Current Version
- Themes: light/dark
- Layout: footer/header/modal/interstitial
- Configurability: none/some/full
- Privacy Policy URL: configurable
- Enable Bing UET: true/false
- Retrieve users region via ipapi.co or ipwho.is
- Sets default consent values based on region
- Integration with GTM Consent Mode via Template
- Per-region configuration

## Data Compliancy
Sets default consent values based on regional compliancy laws.
- 🌍 GDPR (General Data Protection Regulation)
- 🇺🇸 CCPA (California Consumer Privacy Act) 
- 🇧🇷 LGPD (Lei Geral de Proteção de Dados)
- 🇨🇦 PIPEDA (Personal Information Protection and Electronic Documents Act)
- 🇯🇵 APPI (Act on the Protection of Personal Information of Individuals with Regard to Automatic Processing of Personal Data)
- 🇰🇷 PIPA (Personal Information Protection Act)
- 🗽 US (United States)
- 🌐 ROW (Rest of World)


## Installation
### 1. Install Stackmatix Consent Banner Template on GTM
### 2. Create two tags with Templates:
- Default Consent State
  - Set trigger for On Consent Initialization
- Update Consent State
  - Set trigger for custom event: consent_updated


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Authors

- [@x-candy6](https://www.github.com/x-candy6)

