import window from '../../index'
import { TConstructor } from "../../models/IConstructor";
import { LoginConstructor } from "../login/LoginConstructor";

export class RegisterConstructor extends TConstructor {

  async renderAsync(): Promise<void> {
    document.querySelector(".location").textContent = "register"

    const btn = document.createElement("button")
    btn.className = "btn"
    btn.textContent = "Register"
    btn.addEventListener("click", _ => this.registerActionAsync())

    const a = document.createElement("a")
    a.addEventListener("click", _ => this.loginActionAsync())
    a.textContent = "Log in"

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
    password.addEventListener("keydown", e => e.key === "Enter" && this.registerActionAsync())

    const login = document.createElement("input")
    login.id = "login"
    login.type = "text"
    login.placeholder = "login"
    login.addEventListener("keydown", e => e.key === "Enter" && this.registerActionAsync())

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

  protected highlightMenu(): void {
    super.deselectMenu()

    const loginEls = document.querySelector(".login-wrapper").children
    for (let ch of loginEls)
      !ch.classList.contains("active") && ch.classList.add("active")
  }

  private async registerActionAsync(): Promise<void> {
    const login = (document.getElementById("login") as HTMLInputElement)
    const password = (document.getElementById("password") as HTMLInputElement)

    const loginTip = (document.querySelector(".login-input-group span") as HTMLSpanElement)
    const loading = (document.querySelector(".login-input-group .loading") as HTMLDivElement)

    loginTip.style.display = "none"
    loading.style.display = "block"

    if (login.value && password.value) {
      try {
        await this.db.registerAsync(login.value, password.value)
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

  private async loginActionAsync(): Promise<void> {
    window.render("login")
  }
}