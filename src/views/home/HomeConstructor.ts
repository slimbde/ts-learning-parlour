import window from "../../index"
import { IDbHandler } from "../../models/IDbHandler";
import { MySQLHandler } from "../../models/MySQLHandler";
import { TConstructor } from "../IConstructor";

export class HomeConstructor extends TConstructor {
  private db: IDbHandler = new MySQLHandler()

  render(): void {
    document.querySelector(".location").textContent = "home"
    document.querySelector(".login-wrapper a").addEventListener("click", _ => window.render("login"))

    const title = this.constructTitle()
    const input = this.constructInputField()
    const answer = this.constructAnswerField()

    const searchWrapper = document.createElement("div")
    searchWrapper.className = "search-wrapper"
    searchWrapper.append(title)
    searchWrapper.append(input)
    searchWrapper.append(answer)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.append(searchWrapper)

    document.getElementById("input").focus()
    this.highlightMenu()
  }


  protected highlightMenu(): void {
    super.deselectMenu()

    const menuHome = document.querySelector("#menu-home").children
    for (let ch of menuHome)
      !ch.classList.contains("active") && ch.classList.add("active")
  }

  private constructTitle(): HTMLDivElement {
    const h1 = document.createElement("h1")
    h1.textContent = "Learning parlour"

    const titleText = document.createElement("div")
    titleText.innerHTML = `Input English word or a particle of the word.<br /> Use either English or Russian letters.`

    const titleContent = document.createElement("div")
    titleContent.className = "title-content"
    titleContent.append(h1)
    titleContent.append(titleText)

    const logo = document.createElement("div")
    logo.className = "logo"

    const titleWrapper = document.createElement("div")
    titleWrapper.className = "title-wrapper"
    titleWrapper.append(logo)
    titleWrapper.append(titleContent)

    return titleWrapper
  }

  private constructInputField(): HTMLDivElement {
    const input = document.createElement("input")
    input.type = "text"
    input.id = "input"
    input.placeholder = "input your query"
    input.addEventListener("keydown", e => e.key === "Enter" && this.search())

    const btn = document.createElement("button")
    btn.textContent = "Search"
    btn.addEventListener("click", _ => this.search())

    const inputGroup = document.createElement("div")
    inputGroup.className = "input-group"
    inputGroup.append(input)
    inputGroup.append(btn)

    const summary = document.createElement("div")
    summary.className = "summary"
    summary.textContent = "Result"

    const loading = document.createElement("div")
    loading.className = "loading"

    const inputWrapper = document.createElement("div")
    inputWrapper.className = "input-wrapper"
    inputWrapper.append(inputGroup)
    inputWrapper.append(summary)
    inputWrapper.append(loading)

    return inputWrapper
  }

  private constructAnswerField(): HTMLDivElement {
    const answerWrapper = document.createElement("div")
    answerWrapper.className = "answer-wrapper"

    return answerWrapper
  }

  private search(): void {
    const input = (document.querySelector(".input-group input") as HTMLInputElement)

    if (input.value.trim() !== "") {
      const answerWrapper = (document.querySelector(".answer-wrapper") as HTMLDivElement)
      const summary = (document.querySelector(".summary") as HTMLDivElement)
      const loading = (document.querySelector(".loading") as HTMLDivElement)
      answerWrapper.textContent = ""
      loading.style.display = "flex"
      summary.style.display = "none"
      const inputVal = input.value.trim().toLowerCase()

      this.db.searchWordsAsync(inputVal)
        .then(words => {
          summary.textContent = `entries: ${words.length}`

          words.forEach(word => {
            const entry = document.createElement("div")
            entry.className = "answer-entry"

            const notion = document.createElement("div")
            notion.className = "notion"
            notion.innerHTML = word.notion.includes(inputVal)
              ? `<b>${word.notion.split(inputVal)[0]}<font color="red">${inputVal}</font>${word.notion.split(inputVal)[1]}</b>`
              : word.notion

            const ipa = document.createElement("div")
            ipa.className = "ipa"
            ipa.textContent = word.ipa

            const meaning = document.createElement("div")
            meaning.className = "meaning"
            meaning.innerHTML = word.meaning.includes(inputVal)
              ? `<b>${word.meaning.split(inputVal)[0]}<font color="red">${inputVal}</font>${word.meaning.split(inputVal)[1]}</b>`
              : word.meaning

            const definition = document.createElement("div")
            definition.className = "definition"
            definition.append(notion)
            definition.append(ipa)
            definition.append(meaning)

            const example = document.createElement("div")
            example.className = "example"
            example.textContent = word.example

            const addDate = document.createElement("div")
            addDate.className = "addDate"
            addDate.textContent = word.addDate

            entry.append(definition)
            entry.append(example)
            entry.append(addDate)
            answerWrapper.append(entry)
          })
        })
        .catch((error: Error) => {
          summary.textContent = `entries: ${error.message}`
        })
        .finally(() => {
          loading.style.display = "none"
          summary.style.display = "flex"
          input.placeholder = inputVal
          input.value = ""
        })
    }

  }

}