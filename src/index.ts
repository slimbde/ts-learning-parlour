import './styles.css'
import { MySQLHandler } from "./models/MySQLHandler"
import { LoginConstructor } from "./views/login/LoginConstructor"
import { HomeConstructor } from "./views/home/HomeConstructor"
import { GeneralsConstructor } from "./views/generals/GeneralsConstructor"
import { RegisterConstructor } from "./views/register/RegisterConstructor"
import { WordsConstructor } from "./views/training/WordsConstructor"
import { GerundsConstructor } from "./views/gerunds/GerundsConstructor"
import { PhrasesConstructor } from "./views/phrases/PhrasesConstructor"
import { IdiomsConstructor } from "./views/idioms/IdiomsConstructor"
import { PhrasalsConstructor } from "./views/phrasals/PhrasalsConstructor"
import { AccountConstructor } from "./views/account/AccountConstructor"


/////////// I've overridden window object. See window.d.ts for details
window.render = (what: string): void => {
  switch (what) {
    case "home": window.construct = new HomeConstructor(); break
    case "login": window.construct = new LoginConstructor(); break
    case "register": window.construct = new RegisterConstructor(); break
    case "generals": window.construct = new GeneralsConstructor(); break
    case "words": window.construct = new WordsConstructor(); break
    case "gerunds": window.construct = new GerundsConstructor(); break
    case "phrases": window.construct = new PhrasesConstructor(); break
    case "idioms": window.construct = new IdiomsConstructor(); break
    case "phrasals": window.construct = new PhrasalsConstructor(); break
    case "account": window.construct = new AccountConstructor(); break

    default: throw new Error(`[render]: not existing route "${what}"`)
  }

  // if user is not logged in, an Exception is thrown 'referrer:code:message'
  window.construct.renderAsync()
    .catch(error => {
      const errInfo = !!error.message && error.message.split(":")
      if (errInfo && errInfo[1] === "401") {
        window.construct = new LoginConstructor(errInfo[0]) // pass referrer to login constructor
        window.construct.renderAsync()
      }
    })
}

window.toggleMenu = () => document.querySelector(".menu-wrapper").classList.toggle("menu-wrapper-visible")
window.hideMenu = () => document.querySelector(".menu-wrapper").classList.remove("menu-wrapper-visible")

window.db = new MySQLHandler()

window.render("home")
window.db.checkAuthStateAsync()
  .then((isLogged: boolean) => isLogged && LoginConstructor.applyCredentialsAsync(window.db))
