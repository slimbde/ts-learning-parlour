import { IConstructor } from "./src/models/IConstructor";
import { IDbHandler } from "./src/models/Db/IDbHandler";
import { ILangProvider } from "./src/models/Language/ILangProvider";

declare global {
  interface Window {
    construct: IConstructor
    db: IDbHandler
    langProvider: ILangProvider
    render(what: string): void
    toggleMenu(): void
    hideMenu(): void
  }
}