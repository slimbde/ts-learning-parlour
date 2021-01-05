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
    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()

    //const trainingFieldExample = document.createElement("div")
    //trainingFieldExample.className = "training-field-example"
    //trainingFieldExample.textContent = "some example"

    const trainingField = document.createElement("div")
    trainingField.className = "training-field"
    trainingField.append(progressInfo)
    trainingField.append(trainingFieldTitle)
    trainingField.append(trainingFieldWorkspace)
    //trainingField.append(trainingFieldExample)

    const trainingFieldWrapper = document.createElement("div")
    trainingFieldWrapper.className = "training-field-wrapper"
    trainingFieldWrapper.append(trainingField)

    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "general vocabulary"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "fill in blanks with appropriate notion"

    const trainingWrapper = document.createElement("div")
    trainingWrapper.className = "training-wrapper"
    trainingWrapper.append(trainingTitle)
    trainingWrapper.append(trainingTask)
    trainingWrapper.append(trainingFieldWrapper)

    const main = document.querySelector(".main-field")
    main.innerHTML = ""
    main.append(trainingWrapper)
  }

  abstract passOver(): void
  abstract handleSubmit(): void

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

  private constructProgressInfo(): HTMLDivElement {
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

  private constructTrainingFieldTitle(): HTMLDivElement {
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

  private constructTrainingFieldWorkspace(): HTMLDivElement {
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