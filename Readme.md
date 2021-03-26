# Site features

## To push the dist folder to the separate branch on remote
```
git push -d origin gh-pages
git subtree push --prefix dist origin gh-pages
```
However, when you run git-pages (on `https`) you are not allowed to load data from `http` sources..

## Window object overriding
**window.d.ts**
```typescript
declare global {
  interface Window {
    construct: IConstructor
    db: IDbHandler
    render(what: string): void
    toggleMenu(): void
    hideMenu(): void
  }
}
```

## IE ADAPTATION
- IE doesn't allow `div.append( )` method. Use **`div.appendChild()`** instead
- IE doesn't allow `Array.find( )` method. Use **`Array.filter( )[0]`** instead