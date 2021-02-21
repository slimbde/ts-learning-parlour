import window from '../../index'
import { TLearnable } from "../../models/TLearnable";
import { TUser } from "../../models/TUser";
import { TConstructor } from "../IConstructor";
import { LoginConstructor } from "../login/LoginConstructor";

export class AccountConstructor extends TConstructor {
  private user: TUser
  private newName: HTMLInputElement
  private newPassword: HTMLInputElement
  private newPasswordConfirm: HTMLInputElement
  private anchorNewPassword: HTMLAnchorElement
  private messageCredentials: HTMLSpanElement
  private dbRow: HTMLDivElement
  private instantSearch: HTMLDivElement

  private dbNotion: HTMLInputElement
  private dbIpa: HTMLInputElement
  private dbMeaning: HTMLInputElement
  private dbExample: HTMLInputElement
  private submitBtn: HTMLAnchorElement
  private deleteBtn: HTMLAnchorElement
  private currentNotion: TLearnable
  private messageDb: HTMLSpanElement

  async renderAsync(): Promise<void> {
    this.user = await this.db.getUserAsync()

    document.querySelector(".location").textContent = "account"

    const credentialsField = this.constructCredentialsField()
    const todayWordsField = this.constructTodayWordsField()

    const accountFieldWrapper = document.createElement("div")
    accountFieldWrapper.className = "account-field-wrapper"

    const fieldsToAppend = [credentialsField]
    if (this.user.role === "admin") {
      const dbHandlingField = this.constructDbHandlingField()
      fieldsToAppend.push(dbHandlingField)
    }
    fieldsToAppend.push(todayWordsField)

    accountFieldWrapper.append(...fieldsToAppend)

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
    /////// name group
    const divName = document.createElement("div")
    divName.textContent = "User name"

    const loginInput = document.createElement("input")
    loginInput.value = this.user.login
    this.newName = loginInput

    const group1 = document.createElement("div")
    group1.className = "account-info-group"
    group1.append(divName, loginInput)


    /////// password group
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


    //////// message group
    const message = document.createElement("span")
    message.className = "message"
    this.messageCredentials = message

    const group3 = document.createElement("div")
    group3.className = "account-info-group"
    group3.append(message)

    //////// submit group
    const cancelAnchor = document.createElement("a")
    cancelAnchor.addEventListener("click", _ => window.render("account"))
    cancelAnchor.textContent = "Cancel"
    cancelAnchor.style.color = "lightcoral"

    const button = document.createElement("button")
    button.className = "btn"
    button.textContent = "Submit"
    button.addEventListener("click", _ => this.alterCredentials())

    const group4 = document.createElement("div")
    group4.className = "account-info-group"
    group4.append(cancelAnchor, button)

    const result = document.createElement("div")
    result.className = "account-info-wrapper"
    result.append(group1, group2, group3, group4)
    return result
  }

  private showAlterPasswordFields(): void {
    this.anchorNewPassword.style.display = "none"
    this.newPassword.style.display = "block"
    this.newPasswordConfirm.style.display = "block"
  }

  private constructDbHandlingField(): HTMLDivElement {
    ///////// db controls
    const constructColumn = (id: string): HTMLInputElement => {
      const result = document.createElement("input") as HTMLInputElement
      result.id = id
      result.placeholder = id
      return result
    }

    this.dbNotion = constructColumn("notion")
    this.dbIpa = constructColumn("ipa")
    this.dbMeaning = constructColumn("meaning")
    this.dbExample = constructColumn("example")

    const checkNotion = () => {
      if (this.dbNotion.value && this.dbMeaning.value)
        this.submitBtn.classList.remove("disabled")
      else if (!this.currentNotion)
        this.submitBtn.classList.add("disabled")
    }

    this.dbNotion.onkeyup = checkNotion
    this.dbMeaning.onkeyup = checkNotion

    const dbRow = document.createElement("div") as HTMLDivElement
    dbRow.className = "account-db-row"
    dbRow.append(this.dbNotion, this.dbIpa, this.dbMeaning, this.dbExample)

    const rowsGroup = document.createElement("div") as HTMLDivElement
    rowsGroup.className = "account-db-group"
    rowsGroup.id = "db-controls"
    rowsGroup.append(dbRow)
    this.dbRow = rowsGroup

    //////// buttons
    const append = document.createElement("a")
    append.onclick = _ => this.showDbRow()
    append.textContent = "Append"

    const submit = document.createElement("a") as HTMLAnchorElement
    submit.onclick = _ => this.updateNotion()
    submit.textContent = "Submit"
    submit.className = "disabled"
    this.submitBtn = submit

    const delet = document.createElement("a")
    delet.onclick = _ => this.deleteNotion()
    delet.textContent = "Delete"
    delet.className = "disabled"
    this.deleteBtn = delet

    const btnGroup = document.createElement("div") as HTMLDivElement
    btnGroup.className = "account-db-group"
    btnGroup.append(append, submit, delet)

    ////// search field
    const instantSearch = document.createElement("div")
    instantSearch.className = "account-instant-wrapper"
    this.instantSearch = instantSearch
    this.instantSearch.onmouseleave = _ => this.instantSearch.style.opacity = "0"
    this.instantSearch.onmouseenter = _ => this.instantSearch.style.opacity = "1"

    const input = document.createElement("input")
    input.placeholder = "find"
    input.onkeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        this.instantSearch.style.opacity = "0"
        setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 500)
      }
    }
    input.oninput = async (e: InputEvent) => {
      const query = (e.target as HTMLInputElement).value.trim().toLowerCase()

      if (query.length > 1) {
        this.db.searchWordsAsync(query)
          .then((resp: TLearnable[]) => {
            if (resp.length > 0) {
              this.instantSearch.innerHTML = ""

              resp.forEach((entry: TLearnable) => {
                const div = document.createElement("div")
                const content = `${entry.notion} ${entry.ipa}<br>${entry.meaning}`
                div.innerHTML = content.replace(query, `<font color='red'>${query === "to" ? "to&nbsp;" : query}</font>`)
                div.addEventListener("click", _ => this.fillFormRow(entry))

                this.instantSearch.append(div)
              })

              this.instantSearch.style.visibility = "visible"
              setTimeout(() => this.instantSearch.style.opacity = "1", 0)
            }
          })
          .catch((ex: Error) => {
            this.instantSearch.style.opacity = "0"
            setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 500)
          })

        return
      }

      this.instantSearch.style.opacity = "0"
      setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 0)
    }

    const inputGroup = document.createElement("div") as HTMLDivElement
    inputGroup.className = "account-db-group"
    inputGroup.append(input, instantSearch)

    ////// message span
    const span = document.createElement("span") as HTMLSpanElement
    span.className = "message"
    this.messageDb = span

    ////// result
    const result = document.createElement("div") as HTMLDivElement
    result.className = "account-info-wrapper"
    result.style.flexGrow = "1"
    result.append(inputGroup, btnGroup, span, rowsGroup)
    result.style.backgroundColor = "rgba(176, 196, 222, 0.075)"

    return result
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

  private alterCredentials(): void {
    try {
      const newLogin = this.newName.value.trim().toLowerCase()
      if (newLogin.length === 0) {
        this.newName.focus()
        throw new Error("Provide correct login name")
      }

      let newPassword = ""
      if (this.newPassword.style.display !== "none") {
        const pass = this.newPassword.value.trim().toLowerCase()
        if (pass.length === 0) {
          this.newPassword.focus()
          throw new Error("Provide correct password")
        }

        const passConfirm = this.newPasswordConfirm.value.trim().toLowerCase()
        if (pass !== passConfirm) {
          this.newPasswordConfirm.focus()
          throw new Error("Confirmation doesn't match")
        }

        newPassword = pass
      }

      this.db.alterCredentialsAsync(this.user.login, newLogin, newPassword)
        .catch((error: Error) => this.blink(this.messageCredentials, false, error.message))
        .then(_ => {
          this.blink(this.messageCredentials, true, "The credentials have been updated!")
          setTimeout(() => LoginConstructor.applyCredentialsAsync(this.db), 2000)
        })
    } catch (error: any) {
      this.blink(this.messageCredentials, false, error.message)
    }
  }

  private blink(span: HTMLSpanElement, ok: boolean, text: string) {
    const cls = ok ? "success" : "fail"

    span.style.display = "block"
    span.classList.remove("success", "fail")
    span.classList.add(cls)
    span.textContent = text

    setTimeout(() => span.style.opacity = "1", 0)

    setTimeout(() => {
      span.style.opacity = "0"
      setTimeout(() => span.style.display = "none", 500)
    }, 2000)
  }

  private showDbRow(): void {
    this.dbRow.style.height = "fit-content"
    this.dbRow.style.opacity = "1"
    this.clearCurrentNotionAsync()
    this.dbNotion.focus()
  }

  private fillFormRow(entry: TLearnable): void {
    this.showDbRow()

    this.currentNotion = entry
    this.dbNotion.value = entry.notion
    this.dbIpa.value = entry.ipa
    this.dbMeaning.value = entry.meaning
    this.dbExample.value = entry.example

    this.instantSearch.style.opacity = "0"
    setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 500)

    this.submitBtn.classList.remove("disabled")
    this.deleteBtn.classList.remove("disabled")
  }

  private updateNotion(): any {
    if (this.submitBtn.classList.contains("disabled"))
      return

    if (!this.currentNotion) {
      this.db.createNotionAsync({
        notion: this.dbNotion.value,
        ipa: this.dbIpa.value,
        meaning: this.dbMeaning.value,
        example: this.dbExample.value
      })
        .then((num: number) => {
          this.blink(this.messageDb, true, `Row ${num} has been successfully appended`)
          this.clearCurrentNotionAsync()
        })
        .catch((err: Error) => {
          const msg = err.message.toLowerCase().includes("duplicate")
            ? `The notion '${this.dbNotion.value}' is already there`
            : err.message
          this.blink(this.messageDb, false, msg)
        })
    }
    else {
      alert("updating")
    }
  }

  private deleteNotion(): any {
    if (this.deleteBtn.classList.contains("disabled"))
      return

    if (confirm("Are you sure?")) {
      this.db.deleteNotionAsync(this.currentNotion)
        .then((num: number) => {
          this.blink(this.messageDb, true, `The notion '${num}' has been successfully removed from the database`)
          this.clearCurrentNotionAsync()
        })
        .catch((err: Error) => this.blink(this.messageDb, false, err.message))
    }
  }

  private async clearCurrentNotionAsync(): Promise<void> {
    this.currentNotion = undefined
    this.dbNotion.value = ""
    this.dbIpa.value = ""
    this.dbMeaning.value = ""
    this.dbExample.value = ""
    !this.submitBtn.classList.contains("disabled") && this.submitBtn.classList.toggle("disabled")
    !this.deleteBtn.classList.contains("disabled") && this.deleteBtn.classList.toggle("disabled")
  }
}