import './styles.css'
import { IDbHandler } from "./models/IDbHandler"
import { MySQLHandler } from "./models/MySQLHandler"
import { IConstructor } from "./views/IConstructor"
import { LoginConstructor } from "./views/login/LoginConstructor"
import { HomeConstructor } from "./views/home/HomeConstructor"
import { GeneralsConstructor } from "./views/generals/GeneralsConstructor"
import { RegisterConstructor } from "./views/register/RegisterConstructor"
import { WordsConstructor } from "./views/training/WordsConstructor"
import { GerundsConstructor } from "./views/gerunds/GerundsConstructor"
import { PhrasesConstructor } from "./views/phrases/PhrasesConstructor"
import { IdiomsConstructor } from "./views/idioms/IdiomsConstructor"
import { PhrasalsConstructor } from "./views/phrasals/PhrasalsConstructor"


interface ExtendedWindow extends Window {
  constructor: IConstructor
  render(what: string): void
  toggleMenu(): void
  hideMenu(): void
}

declare var window: ExtendedWindow


window.render = (what: string): void => {
  switch (what) {
    case "home": window.constructor = new HomeConstructor(); break
    case "login": window.constructor = new LoginConstructor(); break
    case "register": window.constructor = new RegisterConstructor(); break
    case "generals": window.constructor = new GeneralsConstructor(); break
    case "words": window.constructor = new WordsConstructor(); break
    case "gerunds": window.constructor = new GerundsConstructor(); break
    case "phrases": window.constructor = new PhrasesConstructor(); break
    case "idioms": window.constructor = new IdiomsConstructor(); break
    case "phrasals": window.constructor = new PhrasalsConstructor(); break

    default: throw new Error(`[render]: not existing route "${what}"`)
  }

  try {
    // if user is not logged in, an Exception is thrown 'referrer:code:message'
    window.constructor.render()
  } catch (error) {
    const errInfo = !!error.message && error.message.split(":")
    if (errInfo && errInfo[1] === "401") {
      window.constructor = new LoginConstructor(errInfo[0]) // pass referrer to login constructor
      window.constructor.render()
    }
  }
}

window.toggleMenu = () => document.querySelector(".menu-wrapper").classList.toggle("menu-wrapper-visible")
window.hideMenu = () => document.querySelector(".menu-wrapper").classList.remove("menu-wrapper-visible")


export default window

!!window.constructor && window.render('home')

const db: IDbHandler = new MySQLHandler()
db.checkAuthStateAsync()