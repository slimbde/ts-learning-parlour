import { TTrainingConstructor } from "../../models/TTrainingConstructor";
import { WordsSetHandler } from "./WordsSetHandler";


export class WordsConstructor extends TTrainingConstructor {
  private exampleDiv: HTMLDivElement

  async renderAsync(): Promise<void> {
    const authorized = await this.db.checkAuthStateAsync()
    if (!authorized)
      throw new Error("words:401:not-authorized")

    await super.renderAsync()

    this.setHandler = new WordsSetHandler(this.db)
    this.applyNewNotionAsync()
  }



  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "words training routine"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "guess the word"

    return [trainingTitle, trainingTask]
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()
    const trainingFieldExample = this.constructExampleField()

    return [progressInfo, trainingFieldTitle, trainingFieldWorkspace, trainingFieldExample]
  }

  protected highlightMenu(): void {
    super.deselectMenu()

    const menu = document.querySelector("#menu-training").children
    for (let ch of menu)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "training"
  }

  protected async applyNewNotionAsync(): Promise<void> {
    try {
      await this.setHandler.nextAsync()
    } catch (error) {
      this.renderSummary()
      return
    }

    this.correctDiv.textContent = `Correct: ${this.setHandler.Correct}`
    this.wrongDiv.textContent = `Wrong: ${this.setHandler.Wrong}`

    this.successDiv.textContent = `Success: ${Math.round(this.setHandler.Rate)}%`

    this.leftDiv.textContent = `Query: ${this.setHandler.NotionId} ~ Round: ${this.setHandler.Round}`
    this.rightDiv.textContent = `To go: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.setHandler.Solution

    this.answerIssue.textContent = this.setHandler.PreviousSolution
    this.answerAnswer.textContent = (this.setHandler.PreviousIssue || "") + " " + (this.setHandler.PreviousIPA || "")
    this.exampleDiv.textContent = this.setHandler.PreviousExample

    this.indicatorDiv.style.backgroundImage = "none"
    this.indicatorDiv.style.opacity = "0"

    this.input.value = ""
    this.input.focus()
  }



  private constructExampleField(): HTMLDivElement {
    const div = document.createElement("div")
    this.exampleDiv = div

    const trainingFieldExample = document.createElement("div")
    trainingFieldExample.className = "training-field-example"
    trainingFieldExample.appendChild(div)

    return trainingFieldExample
  }

  private renderSummary(): void {
    const progressInfo = document.querySelector(".progress-info")
    progressInfo.innerHTML = ""

    const anchor = document.createElement("a")
    anchor.textContent = "run again"
    anchor.addEventListener("click", _ => window.render("words"))

    const divPass = document.createElement("div")
    divPass.style.marginLeft = "auto"
    divPass.appendChild(anchor)

    const divStatus = document.createElement("div")
    divStatus.textContent = "You've solved your training routine for today"

    progressInfo.appendChild(divStatus)
    progressInfo.appendChild(divPass)

    this.leftDiv.textContent = `Correct: ${this.setHandler.Correct} Wrong: ${this.setHandler.Wrong} Success: ${this.setHandler.Rate}%`
    this.rightDiv.textContent = "Examples:"

    const trainingWorkspace = document.querySelector(".training-field-workspace")
    trainingWorkspace.innerHTML = ""

    this.exampleDiv.innerHTML = this.setHandler.Examples
  }
}