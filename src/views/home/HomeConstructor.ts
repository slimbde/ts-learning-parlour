import { TLearnable } from "../../models/Entities/TLearnable";
import { TConstructor } from "../../models/IConstructor";

export class HomeConstructor extends TConstructor {
  private instantSearch: HTMLDivElement

  async renderAsync(): Promise<void> {
    document.querySelector(".location").textContent = window.langProvider.GetLocation("location-home")

    const title = this.constructTitle()
    const input = this.constructInputField()
    const answer = this.constructAnswerField()

    const searchWrapper = document.createElement("div")
    searchWrapper.className = "search-wrapper"
    searchWrapper.appendChild(title)
    searchWrapper.appendChild(input)
    searchWrapper.appendChild(answer)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.appendChild(searchWrapper)

    this.renderDbInfo()
    this.highlightMenu()
    document.getElementById("input").focus()
  }

  protected highlightMenu(): void {
    super.deselectMenu()

    const menuHome = document.querySelector("#menu-home").children
    for (let ch of menuHome)
      !ch.classList.contains("active") && ch.classList.add("active")
  }




  private constructTitle(): HTMLDivElement {
    const h1 = document.createElement("h1")
    h1.textContent = window.langProvider.GetPageTitle("title-home")

    const titleText = document.createElement("div")
    titleText.innerHTML = window.langProvider.GetPageTask("task-home")

    const titleContent = document.createElement("div")
    titleContent.className = "title-content"
    titleContent.appendChild(h1)
    titleContent.appendChild(titleText)

    const logo = document.createElement("div")
    logo.className = "logo"

    const titleWrapper = document.createElement("div")
    titleWrapper.className = "title-wrapper"
    titleWrapper.appendChild(logo)
    titleWrapper.appendChild(titleContent)

    return titleWrapper
  }

  private constructInputField(): HTMLDivElement {
    const input = document.createElement("input")
    input.type = "text"
    input.id = "input"
    input.placeholder = window.langProvider.GetSearchPlaceholder()
    input.addEventListener("keydown", e => e.key === "Enter" && this.search())

    input.addEventListener("input", async (e: InputEvent) => {
      const query = (e.target as HTMLInputElement).value.trim().toLowerCase()

      if (query.length > 1) {
        try {
          const resp = await this.db.searchWordsAsync(query)

          if (resp.length > 0) {
            this.instantSearch.innerHTML = ""

            resp.forEach((entry: TLearnable) => {
              const div = document.createElement("div")
              const content = `${entry.notion} ${entry.ipa}<br>${entry.meaning}`
              div.innerHTML = content.replace(query, `<font color='red'>${query === "to" ? "to&nbsp;" : query}</font>`)
              div.addEventListener("click", _ => this.search(entry.notion))

              this.instantSearch.appendChild(div)
            })

            this.instantSearch.style.visibility = "visible"
            setTimeout(() => this.instantSearch.style.opacity = "1", 0)
          }
          return
        }
        catch (ex) {
          this.instantSearch.style.opacity = "0"
          setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 500)
        }

        return
      }

      this.instantSearch.style.opacity = "0"
      setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 0)
    })

    const btn = document.createElement("button")
    btn.textContent = window.langProvider.GetSearchBtn()
    btn.addEventListener("click", _ => this.search())

    const inputGroup = document.createElement("div")
    inputGroup.className = "input-group"
    inputGroup.appendChild(input)
    inputGroup.appendChild(btn)

    const summary = document.createElement("div")
    summary.className = "summary"
    summary.textContent = "Result"

    const loading = document.createElement("div")
    loading.className = "loading"

    const instantSearch = document.createElement("div")
    instantSearch.className = "instant-wrapper"
    this.instantSearch = instantSearch

    const inputWrapper = document.createElement("div")
    inputWrapper.className = "input-wrapper"
    inputWrapper.appendChild(inputGroup)
    inputWrapper.appendChild(summary)
    inputWrapper.appendChild(loading)
    inputWrapper.appendChild(instantSearch)

    return inputWrapper
  }

  private constructAnswerField(): HTMLDivElement {
    const answerWrapper = document.createElement("div")
    answerWrapper.className = "answer-wrapper"

    return answerWrapper
  }

  private search(what?: string): void {
    this.instantSearch.style.opacity = "0"
    setTimeout(() => (this.instantSearch.style.visibility = "hidden"), 500)

    const input = (document.querySelector(".input-group input") as HTMLInputElement)

    if (input.value.trim() !== "" || what !== "") {
      const answerWrapper = (document.querySelector(".answer-wrapper") as HTMLDivElement)
      const summary = (document.querySelector(".summary") as HTMLDivElement)
      const loading = (document.querySelector(".loading") as HTMLDivElement)
      answerWrapper.textContent = ""
      loading.style.display = "flex"
      summary.style.display = "none"

      const inputVal = what || input.value.trim().toLowerCase()

      this.db.searchWordsAsync(inputVal)
        .then(words => {
          summary.textContent = `${window.langProvider.GetSearchEntries()}: ${words.length}`

          words.forEach(word => {
            const entry = document.createElement("div")
            entry.className = "answer-entry"

            const notion = document.createElement("div")
            notion.className = "notion"
            notion.innerHTML = word.notion.includes(inputVal)
              ? `<font>${word.notion.split(inputVal)[0]}<font color="red">${inputVal}</font>${word.notion.split(inputVal)[1]}</font>`
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
            definition.appendChild(notion)
            definition.appendChild(ipa)
            definition.appendChild(meaning)

            const example = document.createElement("div")
            example.className = "example"
            example.textContent = word.example

            const addDate = document.createElement("div")
            addDate.className = "addDate"
            addDate.textContent = word.addDate

            entry.appendChild(definition)
            entry.appendChild(example)
            entry.appendChild(addDate)
            answerWrapper.appendChild(entry)
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