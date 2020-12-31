import './styles.css'
import { IDbHandler } from "./models/IDbHandler"
import { MySQLHandler } from "./models/MySQLHandler"
import { IConstructor } from "./views/IConstructor"
import { LoginConstructor } from "./views/login/LoginConstructor"
import { HomeConstructor } from "./views/main/HomeConstructor"


interface ExtendedWindow extends Window {
  constructor: IConstructor
  render: (what: string) => void
}

declare var window: ExtendedWindow


window.render = (what: string): void => {
  switch (what) {
    case "login": window.constructor = new LoginConstructor(); break
    case "home": window.constructor = new HomeConstructor(); break

    default: throw new Error(`[render]: not existing route "${what}"`)
  }

  window.constructor.render()
}

window.constructor = new HomeConstructor();
window.render('home')

export default window

const db: IDbHandler = new MySQLHandler()
db.checkAuthStateAsync()