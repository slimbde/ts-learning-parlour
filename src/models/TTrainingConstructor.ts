import window from '../index'
import { IDbHandler } from "./IDbHandler";
import { ISetHandler } from "./ISetHandler";
import { TLearnable } from "./TLearnable";
import { IConstructor } from "./IConstructor";





export abstract class TTrainingConstructor implements IConstructor {
  protected db: IDbHandler = window.db
  protected setHandler: ISetHandler

  protected correctDiv: HTMLDivElement
  protected wrongDiv: HTMLDivElement
  protected successDiv: HTMLDivElement
  protected indicatorDiv: HTMLDivElement
  protected leftDiv: HTMLDivElement
  protected rightDiv: HTMLDivElement
  protected issueDiv: HTMLDivElement
  protected hintDiv: HTMLDivElement
  protected input: HTMLInputElement
  protected answerIssue: HTMLDivElement
  protected answerAnswer: HTMLDivElement

  private quickSearchBtn: HTMLButtonElement
  private quickInput: HTMLInputElement
  private quickResult: HTMLDivElement
  private quickSearchLoading: HTMLDivElement

  async renderAsync(): Promise<void> {
    const trainingZone = this.constructTrainingZone()

    const trainingField = document.createElement("div")
    trainingField.className = "training-field"
    trainingField.append(...trainingZone)

    const trainingFieldWrapper = document.createElement("div")
    trainingFieldWrapper.className = "training-field-wrapper"
    trainingFieldWrapper.append(trainingField)

    const trainingWrapper = document.createElement("div")
    trainingWrapper.className = "training-wrapper"

    const pageTitles = this.constructPageTitles()
    trainingWrapper.append(...pageTitles, trainingFieldWrapper)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.append(trainingWrapper)

    this.highlightMenu()
  }


  protected abstract highlightMenu(): void
  protected abstract constructPageTitles(): HTMLDivElement[]
  protected abstract constructTrainingZone(): HTMLDivElement[]


  protected constructProgressInfo(): HTMLDivElement {
    const quickSearch = this.constructQuickSearch()

    const quickSearchToggle = document.createElement("a")
    quickSearchToggle.textContent = "Show quick search"
    quickSearchToggle.className = "quick-search-toggle"
    quickSearchToggle.addEventListener("click", _ => {
      quickSearch.classList.toggle("hidden")
      quickSearchToggle.textContent = "Show quick search"

      if (!quickSearch.classList.contains("hidden")) {
        quickSearchToggle.textContent = "Hide quick search"
        this.quickSearchBtn.style.visibility = "visible"

        this.quickInput.placeholder = ""
        this.quickInput.value = ""
        this.quickInput.focus()
      }
      else
        this.quickSearchBtn.style.visibility = "hidden"
    })

    const loading = document.createElement("div")
    loading.className = "quick-search-loading"
    this.quickSearchLoading = loading

    const divCorrect = document.createElement("div")
    divCorrect.textContent = "Correct: 0"
    this.correctDiv = divCorrect

    const divWrong = document.createElement("div")
    divWrong.textContent = "Wrong: 0"
    this.wrongDiv = divWrong

    const divSuccess = document.createElement("div")
    divSuccess.textContent = "Success: 0%"
    this.successDiv = divSuccess

    const divHint = document.createElement("div")
    divHint.id = "hint"
    this.indicatorDiv = divHint

    const anchor = document.createElement("a")
    anchor.textContent = "pass over"
    anchor.addEventListener("click", _ => this.passOver())

    const divPass = document.createElement("div")
    divPass.style.marginLeft = "auto"
    divPass.append(anchor)

    const result = document.createElement("div")
    result.className = "progress-info"
    result.append(quickSearchToggle)
    result.append(loading)
    result.append(quickSearch)
    result.append(divCorrect)
    result.append(divWrong)
    result.append(divSuccess)
    result.append(divHint)
    result.append(divPass)

    return result
  }

  protected constructTrainingFieldTitle(): HTMLDivElement {
    const left = document.createElement("div")
    left.className = "title-left"
    left.textContent = "Query: 0"
    this.leftDiv = left

    const right = document.createElement("div")
    right.className = "title-right"
    right.textContent = "To go: 0"
    this.rightDiv = right

    const result = document.createElement("div")
    result.className = "training-field-title"
    result.append(left)
    result.append(right)

    return result
  }

  protected constructTrainingFieldWorkspace(): HTMLDivElement {
    const issueDiv = document.createElement("div")
    issueDiv.className = "training-field-issue"
    this.issueDiv = issueDiv

    const hint = document.createElement("div")
    hint.className = "hint"
    this.hintDiv = hint

    const input = document.createElement("input")
    input.type = "text"
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      e.key === "Enter" && this.handleSubmit()
      e.ctrlKey && e.key === "Enter" && this.passOver()
    })
    this.input = input

    const btn = document.createElement("button")
    btn.className = "btn"
    btn.textContent = "Submit"
    btn.addEventListener("click", _ => this.handleSubmit())

    const inputDiv = document.createElement("div")
    inputDiv.className = "training-field-input"
    inputDiv.append(hint)
    inputDiv.append(input)
    inputDiv.append(btn)

    const issue = document.createElement("div")
    issue.className = "issue"
    this.answerIssue = issue

    const answer = document.createElement("div")
    answer.className = "answer"
    this.answerAnswer = answer

    const answerDiv = document.createElement("div")
    answerDiv.className = "training-field-answer"
    answerDiv.append(issue)
    answerDiv.append(answer)

    const result = document.createElement("div")
    result.className = "training-field-workspace"
    result.append(issueDiv)
    result.append(inputDiv)
    result.append(answerDiv)

    return result
  }

  protected deselectMenu(): void {
    const menu = document.querySelector(".menu-wrapper").children
    for (let ch of menu) {
      for (let subCh of ch.children)
        subCh.classList.remove("active")
    }

    const header = document.querySelector(".header-container").children
    for (let ch of header) {
      for (let subCh of ch.children)
        subCh.classList.remove("active")
    }
  }

  protected passOver(): void {
    this.score()
    setTimeout(() => this.applyNewNotionAsync(), 300)
  }

  protected handleSubmit(): void {
    if (this.setHandler.assess(this.input.value))
      this.score()
    else {
      this.setHandler.incrementWrong()
      this.setHandler.enqueue()
      this.input.placeholder = this.input.value

      this.blink(false)
    }

    setTimeout(() => this.applyNewNotionAsync(), 300)
  }

  protected async applyNewNotionAsync(): Promise<void> {
    await this.setHandler.nextAsync()

    this.correctDiv.textContent = `Correct: ${this.setHandler.Correct}`
    this.wrongDiv.textContent = `Wrong: ${this.setHandler.Wrong}`

    this.successDiv.textContent = `Success: ${Math.round(this.setHandler.Rate)}%`

    this.leftDiv.textContent = `Query: ${this.setHandler.NotionId}`
    this.rightDiv.textContent = `To go: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.setHandler.Issue

    this.answerIssue.textContent = this.setHandler.PreviousIssue
    this.answerAnswer.textContent = this.setHandler.PreviousSolution

    this.indicatorDiv.style.backgroundImage = "none"

    this.input.value = ""
    this.input.focus()
  }

  protected blink(correct: boolean) {
    const color = correct ? "darkgoldenrod" : "lightcoral"
    const str = correct ? "CORRECT" : "WRONG"

    this.indicatorDiv.style.color = color
    this.indicatorDiv.textContent = str
    this.indicatorDiv.style.opacity = "1"

    this.input.style.boxShadow = `0 0 10px ${color}`

    setTimeout(() => {
      this.indicatorDiv.style.opacity = "0"
      this.input.style.boxShadow = "unset"

      !correct && setTimeout(() => {
        this.indicatorDiv.style.opacity = "1"
        this.input.style.boxShadow = `0 0 10px ${color}`

        setTimeout(() => {
          this.indicatorDiv.style.opacity = "0"
          this.input.style.boxShadow = "unset"
        }, 300)
      }, 300)
    }, correct ? 1000 : 300)
  }

  protected score(): void {
    this.setHandler.incrementCorrect()
    this.input.placeholder = ""

    this.blink(true)

    this.setHandler.scoreAsync()
  }



  private constructQuickSearch(): HTMLDivElement {
    const input = document.createElement("input")
    input.addEventListener("keypress", (e: KeyboardEvent) => e.key === "Enter" && this.findQuickSearch())
    this.quickInput = input

    const button = document.createElement("button") as HTMLButtonElement
    button.style.visibility = "hidden"
    button.className = "btn"
    button.textContent = "FIND"
    button.addEventListener("click", _ => this.findQuickSearch())
    this.quickSearchBtn = button

    const quickResult = document.createElement("div")
    quickResult.className = "quick-result-wrapper hidden"
    this.quickResult = quickResult

    const mainField = document.querySelector(".main-field")
    mainField.removeEventListener("click", _ => !quickResult.classList.contains("hidden") && quickResult.classList.add("hidden"))
    mainField.addEventListener("click", _ => !quickResult.classList.contains("hidden") && quickResult.classList.add("hidden"))

    const result = document.createElement("div")
    result.className = "quick-search-wrapper hidden"
    result.append(input, button, quickResult)

    return result
  }

  private findQuickSearch(): void {
    const particle = this.quickInput.value.trim().toLowerCase()

    if (particle.length > 0) {
      this.quickSearchLoading.style.opacity = "1"

      this.setHandler.findAsync(particle)
        .then((data: TLearnable[]) => {
          this.quickResult.innerHTML = ""

          data.forEach((entry: TLearnable) => {
            const entryDiv = document.createElement("div")
            entryDiv.className = "quick-result-entry"
            entryDiv.innerHTML = `${entry.notion} ${entry.ipa} ${entry.meaning}`
            this.quickResult.append(entryDiv)
          })

          this.quickResult.classList.contains("hidden") && this.quickResult.classList.toggle("hidden")
          this.quickSearchLoading.style.opacity = "0"
        })
        .catch((error: Error) => {
          this.quickInput.placeholder = "nothing found"
          this.quickInput.value = ""
          this.quickSearchLoading.style.opacity = "0"
        })
    }
  }
}