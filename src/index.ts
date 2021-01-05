import './styles.css'
import { IDbHandler } from "./models/IDbHandler"
import { MySQLHandler } from "./models/MySQLHandler"
import { IConstructor } from "./views/IConstructor"
import { LoginConstructor } from "./views/login/LoginConstructor"
import { HomeConstructor } from "./views/home/HomeConstructor"
import { GeneralsConstructor } from "./views/generals/GeneralsConstructor"


interface ExtendedWindow extends Window {
  constructor: IConstructor
  render(what: string): void
  toggleMenu(): void
  hideMenu(): void
}

declare var window: ExtendedWindow


window.render = (what: string): void => {
  switch (what) {
    case "login": window.constructor = new LoginConstructor(); break
    case "home": window.constructor = new HomeConstructor(); break
    case "generals": window.constructor = new GeneralsConstructor(); break

    default: throw new Error(`[render]: not existing route "${what}"`)
  }

  try {
    window.constructor.render()
  } catch (error) {
    const errInfo = !!error.message && error.message.split(":")
    if (errInfo && errInfo[1] === "401") {
      window.constructor = new LoginConstructor(errInfo[0])
      window.constructor.render()
    }
  }
}

window.toggleMenu = () => document.querySelector(".menu-wrapper").classList.toggle("menu-wrapper-visible")
window.hideMenu = () => document.querySelector(".menu-wrapper").classList.remove("menu-wrapper-visible")


window.constructor = new HomeConstructor();
window.render('home')

export default window

const db: IDbHandler = new MySQLHandler()
db.checkAuthStateAsync()