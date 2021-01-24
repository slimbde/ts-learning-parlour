import window from '../../index'
import { TLearnable } from "../../models/TLearnable";
import { TUser } from "../../models/TUser";
import { TConstructor } from "../IConstructor";

export class AccountConstructor extends TConstructor {
  private user: TUser
  private newPassword: HTMLInputElement
  private newPasswordConfirm: HTMLInputElement
  private anchorNewPassword: HTMLAnchorElement


  //TODO: IMPLEMENT PASSWORD CHANGE
  async renderAsync(): Promise<void> {
    console.log("render-account")
    this.user = await this.db.getUserAsync()

    document.querySelector(".location").textContent = "account"

    const credentialsField = this.constructCredentialsField()
    const todayWordsField = this.constructTodayWordsField()

    const accountFieldWrapper = document.createElement("div")
    accountFieldWrapper.className = "account-field-wrapper"
    accountFieldWrapper.append(credentialsField, todayWordsField)

    const accountWrapper = document.createElement("div")
    accountWrapper.className = "account-wrapper"
    accountWrapper.append(...this.constructPageTitles(), accountFieldWrapper)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.append(accountWrapper)

    this.highlightMenu()
  }



  protected highlightMenu(): void {
    super.deselectMenu()
  }




  private constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "account-title"
    trainingTitle.textContent = "account options"

    const trainingTask = document.createElement("div")
    trainingTask.className = "account-task"
    trainingTask.textContent = "adjust your account settings"

    return [trainingTitle, trainingTask]
  }

  private constructCredentialsField(): HTMLDivElement {
    // name group
    const divName = document.createElement("div")
    divName.textContent = "User name"

    const loginInput = document.createElement("input")
    loginInput.value = this.user.login

    const group1 = document.createElement("div")
    group1.className = "account-info-group"
    group1.append(divName, loginInput)


    // password group
    const anchor = document.createElement("a")
    anchor.addEventListener("click", _ => this.showAlterPasswordFields())
    anchor.textContent = "Change"
    this.anchorNewPassword = anchor

    const inputNewPassword = document.createElement("input")
    inputNewPassword.placeholder = "new password"
    inputNewPassword.style.display = "none"
    this.newPassword = inputNewPassword

    const inputConfirmPassword = document.createElement("input")
    inputConfirmPassword.placeholder = "confirmation"
    inputConfirmPassword.style.display = "none"
    this.newPasswordConfirm = inputConfirmPassword

    const passwordDiv = document.createElement("div")
    passwordDiv.className = "account-password"
    passwordDiv.append(anchor, inputNewPassword, inputConfirmPassword)

    const divPassword = document.createElement("div")
    divPassword.textContent = "Password"

    const group2 = document.createElement("div")
    group2.className = "account-info-group"
    group2.append(divPassword, passwordDiv)


    // submit group
    const blankDiv = document.createElement("a")
    blankDiv.addEventListener("click", _ => window.render("account"))
    blankDiv.textContent = "Cancel"
    blankDiv.style.color = "lightcoral"

    const button = document.createElement("button")
    button.className = "btn"
    button.textContent = "Submit"

    const group3 = document.createElement("div")
    group3.className = "account-info-group"
    group3.append(blankDiv, button)

    const result = document.createElement("div")
    result.className = "account-info-wrapper"
    result.append(group1, group2, group3)
    return result
  }

  private showAlterPasswordFields(): void {
    this.anchorNewPassword.style.display = "none"
    this.newPassword.style.display = "block"
    this.newPasswordConfirm.style.display = "block"
  }

  private constructTodayWordsField(): HTMLDivElement {
    const title = document.createElement("div")
    title.className = "account-today-words-title"
    title.textContent = "СЛОВА НА СЕГОДНЯ:"

    const words = document.createElement("div")
    words.className = "account-today-words"

    this.db.getWordsForAsync(this.user.login)
      .then((resp: TLearnable[]) => {
        resp.forEach((word: TLearnable, idx: number) => {
          const div = document.createElement("div")
          div.textContent = `${idx + 1}. ${word.issue}`
          words.append(div)
        })
      })

    const result = document.createElement("div")
    result.className = "account-info-wrapper"
    result.style.flexGrow = "1"
    result.append(title, words)
    return result
  }

}