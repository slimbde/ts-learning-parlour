import { IDbHandler } from "../models/IDbHandler";
import { ISetHandler } from "../models/ISetHandler";
import { MySQLHandler } from "../models/MySQLHandler";
import { TLearnable } from "../models/TLearnable";
import { IConstructor } from "./IConstructor";



export interface ITrainingConstructor extends IConstructor {
  passOver(): void
  handleSubmit(): void
}




export abstract class TTrainingConstructor implements ITrainingConstructor {
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

  protected currentNotion: TLearnable
  protected previousNotion: TLearnable
  protected correct = 0
  protected wrong = 0


  render(): void {
    const pageTitles = this.constructPageTitles()
    const trainingZone = this.constructTrainingZone()

    const trainingField = document.createElement("div")
    trainingField.className = "training-field"
    trainingField.append(...trainingZone)

    const trainingFieldWrapper = document.createElement("div")
    trainingFieldWrapper.className = "training-field-wrapper"
    trainingFieldWrapper.append(trainingField)

    const trainingWrapper = document.createElement("div")
    trainingWrapper.className = "training-wrapper"
    trainingWrapper.append(...pageTitles, trainingFieldWrapper)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.append(trainingWrapper)

    this.highlightMenu()
  }

  abstract passOver(): void
  abstract handleSubmit(): void
  protected abstract highlightMenu(): void

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

  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "general vocabulary"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "fill in blanks with appropriate notion"

    return [trainingTitle, trainingTask]
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()

    return [progressInfo, trainingFieldTitle, trainingFieldWorkspace]
  }

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
}