import { TTrainingConstructor } from "../TTrainingConstructor";
import { WordsSetHandler } from "./WordsSetHandler";


export class WordsConstructor extends TTrainingConstructor {
  private exampleDiv: HTMLDivElement

  render(): void {
    if (!localStorage.getItem("user"))
      throw new Error("words:401:not-authorized")

    super.render()

    this.setHandler = new WordsSetHandler(this.db)
    this.applyNewNotionAsync()
      .then(_ => {
        this.hintDiv.style.backgroundImage = "none"
        this.hintDiv.style.opacity = "0"
      })
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
    await this.setHandler.nextAsync()

    this.correctDiv.textContent = `Correct: ${this.setHandler.Correct}`
    this.wrongDiv.textContent = `Wrong: ${this.setHandler.Wrong}`

    this.successDiv.textContent = `Success: ${Math.round(this.setHandler.Rate)}%`

    this.leftDiv.textContent = `Query: ${this.setHandler.NotionId} ~ Round: ${this.setHandler.Round}`
    this.rightDiv.textContent = `To go: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.setHandler.Solution

    this.answerIssue.textContent = this.setHandler.PreviousSolution
    this.answerAnswer.textContent = (this.setHandler.PreviousIssue || "") + " " + (this.setHandler.PreviousIPA || "")
    this.exampleDiv.textContent = this.setHandler.PreviousExample

    this.input.value = ""
    this.input.focus()
  }



  private constructExampleField(): HTMLDivElement {
    const trainingFieldExample = document.createElement("div")
    trainingFieldExample.className = "training-field-example"
    trainingFieldExample.textContent = ""
    this.exampleDiv = trainingFieldExample
    return trainingFieldExample
  }
}