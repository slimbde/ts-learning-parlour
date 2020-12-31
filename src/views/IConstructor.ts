
export interface IConstructor {
  render(): void
}


export abstract class TConstructor implements IConstructor {
  abstract render(): void

  protected abstract highlightMenu(): void

  protected deselectMenu() {
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