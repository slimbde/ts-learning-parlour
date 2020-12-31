import { TConstructor } from "../IConstructor";

export class HomeConstructor extends TConstructor {
  render(): void {
    const main = document.querySelector(".main-field")

    const title = this.constructTitle()
    const input = this.constructInputField()
    const answer = this.constructAnswerField()

    const searchWrapper = document.createElement("div")
    searchWrapper.className = "search-wrapper"
    searchWrapper.append(title)
    searchWrapper.append(input)
    searchWrapper.append(answer)

    main.innerHTML = ""
    main.append(searchWrapper)

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
    input.placeholder = "input your query"

    const btn = document.createElement("button")
    btn.textContent = "Search"

    const inputGroup = document.createElement("div")
    inputGroup.className = "input-group"
    inputGroup.append(input)
    inputGroup.append(btn)

    const summary = document.createElement("div")
    summary.className = "summary"
    summary.textContent = "Result"

    const inputWrapper = document.createElement("div")
    inputWrapper.className = "input-wrapper"
    inputWrapper.append(inputGroup)
    inputWrapper.append(summary)

    return inputWrapper
  }

  private constructAnswerField(): HTMLDivElement {
    const answerWrapper = document.createElement("div")
    answerWrapper.className = "answer-wrapper"

    return answerWrapper
  }

}