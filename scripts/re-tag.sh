# Make your new changes
npm run build
git add .
git commit -m "test: update banner logic"

# Push changes to branch
git push origin test-banner

# Re-tag the latest commit
git tag -f v0.0.2-test
git push origin -f v0.0.2-test