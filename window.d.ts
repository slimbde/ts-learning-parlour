import { IConstructor } from "./src/models/IConstructor";
import { IDbHandler } from "./src/models/IDbHandler";

declare global {
  interface Window {
    construct: IConstructor
    db: IDbHandler
    render(what: string): void
    toggleMenu(): void
    hideMenu(): void
  }
}