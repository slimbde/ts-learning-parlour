import { DBInfo } from "./DBInfo"
import { IDbHandler } from "./IDbHandler"


export interface IConstructor {
  renderAsync(): Promise<void> // renders a view
}





export abstract class TConstructor implements IConstructor {
  protected db: IDbHandler = window.db

  abstract renderAsync(): Promise<void>

  protected abstract highlightMenu(): void

  protected async renderDbInfo(): Promise<void> {
    this.db.getDbInfoAsync()
      .then((dbInfo: DBInfo) => {
        const info = document.querySelector(".info")
        info.innerHTML = ""

        const infoTitle = document.createElement("div")
        infoTitle.className = "info-title"
        infoTitle.textContent = "DB info:"
        info.appendChild(infoTitle)

        Object.keys(dbInfo).forEach((key: string) => {
          const value = dbInfo[key]
          const div = document.createElement("div")
          div.className = "info-notion"
          div.textContent = `${key} ${value}`
          info.appendChild(div)
        })
      })
      .catch(console.error)
  }

  protected deselectMenu(): void {
    const menu = document.querySelector(".menu-wrapper").children
    for (let ch of menu) {
      for (let subCh of ch.children)
        subCh.classList.remove("active")
    }

    const header = document.querySelector(".header-container").children
    for (let ch of header) {
      for (let subCh of ch.children)
        subCh.classList.remove("active")
    }
  }
}