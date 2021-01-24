import window from '../../index'
import { IDbHandler } from "../../models/IDbHandler";
import { TUser } from "../../models/TUser";
import { TConstructor } from "../IConstructor";

export class LoginConstructor extends TConstructor {

  private static loginAnchor = (document.querySelector(".login-wrapper a") as HTMLAnchorElement)
  private static loginImage = (document.querySelector(".login-wrapper i") as HTMLElement)
  private static referrer: string
  private static user: TUser

  constructor(referrer?: string) {
    super()
    !!referrer && (LoginConstructor.referrer = referrer)
  }


  async renderAsync(): Promise<void> {
    if (await this.db.checkAuthStateAsync()) {
      window.render("account")
      return
    }

    this.renderLoginForm()
  }

  static async applyCredentialsAsync(db: IDbHandler): Promise<void> {
    this.user = await db.getUserAsync()
    LoginConstructor.loginAnchor.textContent = this.user.login

    LoginConstructor.loginImage.title = "Выйти из учетной записи"
    LoginConstructor.loginImage.style.transform = "scale(1,1)"
    LoginConstructor.loginImage.addEventListener("click", _ => this.logOut(db))

    !!this.referrer
      ? window.render(this.referrer)
      : window.render("home")
  }

  protected highlightMenu(): void {
    super.deselectMenu()

    const loginEls = document.querySelector(".login-wrapper").children
    for (let ch of loginEls)
      !ch.classList.contains("active") && ch.classList.add("active")
  }

  private async registerActionAsync(): Promise<void> {
    window.render("register")
  }

  private async loginActionAsync(): Promise<void> {
    const login = (document.getElementById("login") as HTMLInputElement)
    const password = (document.getElementById("password") as HTMLInputElement)

    const loginTip = (document.querySelector(".login-input-group span") as HTMLSpanElement)
    const loading = (document.querySelector(".login-input-group .loading") as HTMLDivElement)

    loginTip.style.display = "none"
    loading.style.display = "block"

    if (login.value && password.value) {
      try {
        await this.db.authenticateAsync(login.value, password.value)
        if (await this.db.checkAuthStateAsync())
          await LoginConstructor.applyCredentialsAsync(this.db)
      } catch (error) {
        password.value = ""
        loginTip.textContent = error
        setTimeout(_ => loginTip.style.opacity = "1", 50)
        setTimeout(_ => loginTip.style.opacity = "0", 3000)
      }
    }

    loading.style.display = "none"
    loginTip.style.display = "block"
  }

  private static logOut(db: IDbHandler): void {
    db.logOutAsync()
    this.loginAnchor.textContent = "login"
    this.loginAnchor.title = "Войти в учетную запись"

    this.loginImage.style.transform = "scale(-1,-1)"
    window.render("home")
  }

  private renderLoginForm(): void {
    document.querySelector(".location").textContent = "login"

    LoginConstructor.loginAnchor.textContent = "login"

    const btn = document.createElement("button")
    btn.className = "btn"
    btn.textContent = "Log in"
    btn.addEventListener("click", _ => this.loginActionAsync())

    const a = document.createElement("a")
    a.addEventListener("click", _ => this.registerActionAsync())
    a.textContent = "Register"

    const inputFooter = document.createElement("div")
    inputFooter.className = "input-footer"
    inputFooter.append(a)
    inputFooter.append(btn)

    const span = document.createElement("span")
    span.textContent = "notice"

    const loading = document.createElement("div")
    loading.className = "loading"

    const password = document.createElement("input")
    password.id = "password"
    password.type = "password"
    password.placeholder = "password"
    password.addEventListener("keydown", e => e.key === "Enter" && this.loginActionAsync())

    const login = document.createElement("input")
    login.id = "login"
    login.type = "text"
    login.placeholder = "login"
    login.addEventListener("keydown", e => e.key === "Enter" && this.loginActionAsync())

    const text = document.createElement("div")
    text.textContent = "Specify your credentials below:"

    const group = document.createElement("div")
    group.className = "login-input-group"
    group.append(text)
    group.append(login)
    group.append(password)
    group.append(span)
    group.append(loading)
    group.append(inputFooter)

    const card = document.createElement("div")
    card.className = "login-card"
    card.append(group)

    const main = document.querySelector(".main-field") as HTMLElement
    main.innerHTML = ""
    main.append(card)

    this.highlightMenu()
    login.focus()
  }


}