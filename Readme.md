# Site features

## To push the dist folder to the separate branch on remote
```
git push -d origin gh-pages
git subtree push --prefix dist origin gh-pages
```
However, when you run git-pages (on `https`) you are not allowed to load data from `http` sources..