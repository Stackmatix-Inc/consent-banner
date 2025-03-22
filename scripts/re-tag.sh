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