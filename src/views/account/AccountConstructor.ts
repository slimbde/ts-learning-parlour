import { TLearnable } from "../../models/TLearnable";
import { TUser } from "../../models/TUser";
import { TConstructor } from "../../models/IConstructor";
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

  private dbNotion: HTMLInputElement      // input for notion
  private dbIpa: HTMLInputElement         // input for ipa
  private dbMeaning: HTMLInputElement     // input for meaning
  private dbExample: HTMLInputElement     // input for example
  private submitBtn: HTMLAnchorElement
  private deleteBtn: HTMLAnchorElement
  private currentNotion: TLearnable
  private messageDb: HTMLSpanElement      // query result span
  private instantRequests: string[] = []  // requests array for handling last request

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

    fieldsToAppend.forEach(el => accountFieldWrapper.appendChild(el))

    const accountWrapper = document.createElement("div")
    accountWrapper.className = "account-wrapper"
    const titles = this.constructPageTitles()
    titles.forEach(t => accountWrapper.appendChild(t))
    accountWrapper.appendChild(accountFieldWrapper)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.appendChild(accountWrapper)

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
    group1.appendChild(divName)
    group1.appendChild(loginInput)


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
    passwordDiv.appendChild(anchor)
    passwordDiv.appendChild(inputNewPassword)
    passwordDiv.appendChild(inputConfirmPassword)

    const divPassword = document.createElement("div")
    divPassword.textContent = "Password"

    const group2 = document.createElement("div")
    group2.className = "account-info-group"
    group2.appendChild(divPassword)
    group2.appendChild(passwordDiv)


    //////// message group
    const message = document.createElement("span")
    message.className = "message"
    this.messageCredentials = message

    const group3 = document.createElement("div")
    group3.className = "account-info-group"
    group3.appendChild(message)

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
    group4.appendChild(cancelAnchor)
    group4.appendChild(button)

    ////// frame title
    const ftitle = document.createElement("span") as HTMLSpanElement
    ftitle.className = "frame-title"
    ftitle.textContent = "user: credentials"

    const result = document.createElement("div")
    result.className = "account-info-wrapper"
    result.appendChild(ftitle)
    result.appendChild(group1)
    result.appendChild(group2)
    result.appendChild(group3)
    result.appendChild(group4)
    return result
  }

  private showAlterPasswordFields(): void {
    this.anchorNewPassword.style.display = "none"
    this.newPassword.style.display = "block"
    this.newPasswordConfirm.style.display = "block"
  }

  private constructDbHandlingField(): HTMLDivElement {
    ///////// inputs
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
    this.dbExample.onkeyup = (e: KeyboardEvent) => {
      if (e.key === "Enter")
        this.updateNotion()
    }

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
    dbRow.appendChild(this.dbNotion)
    dbRow.appendChild(this.dbIpa)
    dbRow.appendChild(this.dbMeaning)
    dbRow.appendChild(this.dbExample)

    const rowsGroup = document.createElement("div") as HTMLDivElement
    rowsGroup.className = "account-db-group"
    rowsGroup.id = "db-controls"
    rowsGroup.appendChild(dbRow)
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
    btnGroup.appendChild(append)
    btnGroup.appendChild(submit)
    btnGroup.appendChild(delet)

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
        this.instantRequests.push(query)                  // push new valid query to the array
        const requestsNum = this.instantRequests.length   // store current array length

        setTimeout(() => {
          if (requestsNum === this.instantRequests.length) {      // in 300ms collate stored length with current

            if ((input as HTMLInputElement).value.trim().length < 2)  // if input is empty - return
              return

            this.db.searchWordsAsync(this.instantRequests.pop())  // if the length is same - handle last request
              .then((resp: TLearnable[]) => {
                this.instantRequests.length = 0   // right after we got an answer - clear the array
                if (resp.length > 0) {
                  this.instantSearch.innerHTML = ""

                  resp.forEach((entry: TLearnable) => {
                    const div = document.createElement("div")
                    const content = `${entry.notion} ${entry.ipa}<br>${entry.meaning}`
                    div.innerHTML = content.replace(query, `<font color='red'>${query === "to" ? "to&nbsp;" : query}</font>`)
                    div.addEventListener("click", _ => this.fillFormRow(entry))

                    this.instantSearch.appendChild(div)
                  })

                  this.instantSearch.style.visibility = "visible"
                  setTimeout(() => this.instantSearch.style.opacity = "1", 0)
                }
              })
              .catch((ex: Error) => {
                this.instantSearch.style.opacity = "0"
                setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 300)
              })

            return
          }

          this.instantSearch.style.opacity = "0"
          setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 0)
        }, 300)
      }
      else {
        this.instantSearch.style.opacity = "0"
        setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 0)
      }
    }

    const inputGroup = document.createElement("div") as HTMLDivElement
    inputGroup.className = "account-db-group"
    inputGroup.appendChild(input)
    inputGroup.appendChild(instantSearch)

    ////// message span
    const span = document.createElement("span") as HTMLSpanElement
    span.className = "message"
    this.messageDb = span

    ////// frame title
    const ftitle = document.createElement("span") as HTMLSpanElement
    ftitle.className = "frame-title"
    ftitle.textContent = "admin: database"

    ////// result
    const result = document.createElement("div") as HTMLDivElement
    result.className = "account-info-wrapper"
    result.style.flexGrow = "1"
    result.appendChild(ftitle)
    result.appendChild(inputGroup)
    result.appendChild(btnGroup)
    result.appendChild(span)
    result.appendChild(rowsGroup)
    result.style.backgroundColor = "rgba(176, 196, 222, 0.075)"
    result.style.height = "100%"
    result.style.maxHeight = "266px"

    return result
  }

  private constructTodayWordsField(): HTMLDivElement {
    const title = document.createElement("div")
    title.className = "account-today-words-title"
    title.textContent = "THE WORDS FOR TODAY:"

    const words = document.createElement("div")
    words.className = "account-today-words"

    this.db.getWordsForAsync(this.user.login)
      .then((resp: TLearnable[]) => {
        resp.forEach((word: TLearnable, idx: number) => {
          const div = document.createElement("div")
          div.textContent = `${idx + 1}. ${word.issue}`
          words.appendChild(div)
        })
      })

    ////// frame title
    const ftitle = document.createElement("span") as HTMLSpanElement
    ftitle.className = "frame-title"
    ftitle.textContent = "user: today words"

    const result = document.createElement("div")
    result.className = "account-info-wrapper"
    result.style.flexGrow = "1"
    result.appendChild(ftitle)
    result.appendChild(title)
    result.appendChild(words)
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
    } catch (error) {
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

    const pureNotion = this.dbNotion.value.includes("to ")
      ? this.dbNotion.value.substr(3)
      : this.dbNotion.value

    const notion: TLearnable = {
      notion: this.dbNotion.value,
      ipa: this.dbIpa.value,
      meaning: this.dbMeaning.value,
      example: this.dbExample.value,
      issue: this.dbExample.value.includes(pureNotion)
        ? this.dbExample.value.slice(0).replace(pureNotion, `__(${this.dbMeaning.value})__`)
        : '',
      solution: this.dbExample.value.includes(pureNotion) ? pureNotion : ''
    }

    ////// appending new notion
    if (!this.currentNotion) {
      this.db.createNotionAsync(notion)
        .then((num: number) => {
          this.blink(this.messageDb, true, `The notion ${num} has successfully been appended`)
          this.clearCurrentNotionAsync()
        })
        .catch((err: Error) => {
          const msg = err.message.toLowerCase().includes("duplicate")
            ? `The notion '${this.dbNotion.value}' is already there`
            : err.message
          this.blink(this.messageDb, false, msg)
        })
    }
    ////// updating existing ones
    else {
      notion.id = this.currentNotion.id

      this.currentNotion.issue && (notion.issue = this.currentNotion.issue)
      this.currentNotion.solution && (notion.solution = this.currentNotion.solution)

      this.db.updateNotionAsync(notion)
        .then((num: number) => {
          this.blink(this.messageDb, true, `The notion ${num} has successfully been updated`)
          this.clearCurrentNotionAsync()
        })
        .catch((err: Error) => {
          const msg = err.message.toLowerCase().includes("duplicate")
            ? `The notion '${this.dbNotion.value}' is already there`
            : err.message
          this.blink(this.messageDb, false, msg)
        })
    }
  }

  private deleteNotion(): any {
    if (this.deleteBtn.classList.contains("disabled"))
      return

    if (confirm("Are you sure?")) {
      this.db.deleteNotionAsync(this.currentNotion)
        .then((num: number) => {
          this.blink(this.messageDb, true, `The notion '${num}' has successfully been removed from the database`)
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