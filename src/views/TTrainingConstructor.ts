import { IDbHandler } from "../models/IDbHandler";
import { ISetHandler } from "../models/ISetHandler";
import { MySQLHandler } from "../models/MySQLHandler";
import { IConstructor } from "./IConstructor";





export abstract class TTrainingConstructor implements IConstructor {
  protected db: IDbHandler = new MySQLHandler()
  protected setHandler: ISetHandler

  protected correctDiv: HTMLDivElement
  protected wrongDiv: HTMLDivElement
  protected successDiv: HTMLDivElement
  protected hintDiv: HTMLDivElement
  protected leftDiv: HTMLDivElement
  protected rightDiv: HTMLDivElement
  protected issueDiv: HTMLDivElement
  protected input: HTMLInputElement
  protected answerIssue: HTMLDivElement
  protected answerAnswer: HTMLDivElement


  render(): void {
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
    this.hintDiv = divHint

    const anchor = document.createElement("a")
    anchor.textContent = "pass over"
    anchor.addEventListener("click", _ => this.passOver())

    const divPass = document.createElement("div")
    divPass.style.marginLeft = "auto"
    divPass.append(anchor)

    const result = document.createElement("div")
    result.className = "progress-info"
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

    const input = document.createElement("input")
    input.type = "text"
    input.addEventListener("keydown", (e: KeyboardEvent) => e.key === "Enter" && this.handleSubmit())
    this.input = input

    const btn = document.createElement("button")
    btn.className = "btn"
    btn.textContent = "Submit"
    btn.addEventListener("click", _ => this.handleSubmit())

    const inputDiv = document.createElement("div")
    inputDiv.className = "training-field-input"
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
    setTimeout(_ => this.applyNewNotionAsync(), 300)
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

    setTimeout(_ => this.applyNewNotionAsync(), 300)
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

    this.input.value = ""
    this.input.focus()
  }

  protected blink(correct: boolean) {
    const color = correct ? "green" : "lightcoral"
    const str = correct ? "CORRECT" : "WRONG"

    this.hintDiv.style.color = correct ? color : "lightcoral"
    this.hintDiv.textContent = str
    this.hintDiv.style.opacity = "1"

    this.input.style.boxShadow = `0 0 10px ${color}`

    setTimeout(() => {
      this.hintDiv.style.opacity = "0"
      this.input.style.boxShadow = "unset"

      !correct && setTimeout(() => {
        this.hintDiv.style.opacity = "1"
        this.input.style.boxShadow = `0 0 10px ${color}`

        setTimeout(() => {
          this.hintDiv.style.opacity = "0"
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
}