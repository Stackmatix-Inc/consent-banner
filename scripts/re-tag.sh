# Get the latest tag version and increment
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0-test")
CURRENT_VERSION=$(echo $LATEST_TAG | grep -o '[0-9]\+' | tail -1)
NEW_VERSION=$((CURRENT_VERSION + 1))

# Make your new changes
npm run build
git add .
git commit -m "test: update banner logic"

# Push changes to branch
git push origin test-env

# Re-tag the latest commit with incremented version
git tag -f v0.0.$NEW_VERSION-test
git push origin -f v0.0.$NEW_VERSION-test

# Output the CDN links with new version
echo "Use these CDN links in your HTML:"
echo "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/Stackmatix-Inc/consent-banner@v0.0.$NEW_VERSION-test/dist/consent-banner.min.css\">"
echo "<script>"
echo "// Configure the banner using GTM variables"
echo "window.__ConsentBannerConfig = {"
echo "  theme: {{consentBanner_theme}},"
echo "  layout: {{consentBanner_layout}},"
echo "  configurability: {{consentBanner_configurability}},"
echo "  privacyPolicyUrl: {{consentBanner_privacyPolicyUrl}},"
echo "  language: {{consentBanner_language}}"
echo "  // Add any other configurable options you need"
echo "};"
echo "</script>"
echo "<script src=\"https://cdn.jsdelivr.net/gh/Stackmatix-Inc/consent-banner@v0.0.$NEW_VERSION-test/dist/consent-banner.min.js\"></script>"
