import { TCategory } from "../../models/TCategory";
import { TTrainingConstructor } from "../TTrainingConstructor";
import { PhrasalsSetHandler } from "./PhrasalsSetHandler";



export class PhrasalsConstructor extends TTrainingConstructor {
  private select: HTMLSelectElement


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "phrasals training"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "select category and guess apt phrasal verb"

    return [trainingTitle, trainingTask]
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const label = document.createElement("label")
    label.textContent = "Select category:"
    label.htmlFor = "select"

    const select = document.createElement("select")
    select.className = "select-category"
    this.select = select

    this.db.getCategoriesAsync()
      .then((cats: TCategory[]) => {
        cats.forEach((cat: TCategory) => {
          const option = document.createElement("option")
          option.value = cat.range
          option.text = cat.range
          select.appendChild(option)
        })
      })


    const button = document.createElement("button")
    button.className = "btn"
    button.textContent = "GO"
    button.addEventListener("click", _ => this.renderCategory())

    const result = document.createElement("div")
    result.className = "progress-info"

    result.append(label)
    result.append(select)
    result.append(button)

    return [result]
  }

  protected highlightMenu(): void {
    this.deselectMenu()

    const menuPhrasals = document.querySelector("#menu-phrasals").children
    for (let ch of menuPhrasals)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "phrasals"
  }

  protected async applyNewNotionAsync(): Promise<void> {
    await this.setHandler.nextAsync()

    this.correctDiv.textContent = `Correct: ${this.setHandler.Correct}`
    this.wrongDiv.textContent = `Wrong: ${this.setHandler.Wrong}`

    this.successDiv.textContent = `Success: ${Math.round(this.setHandler.Rate)}%`

    this.leftDiv.textContent = `Query: ${this.setHandler.NotionId}`
    this.rightDiv.textContent = `To go: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.setHandler.Issue
    this.hintDiv.textContent = this.setHandler.Hint

    this.answerIssue.textContent = this.setHandler.PreviousIssue
    this.answerAnswer.textContent = this.setHandler.PreviousSolution

    this.indicatorDiv.style.backgroundImage = "none"
    this.indicatorDiv.style.opacity = "0"

    this.input.value = ""
    this.input.focus()
  }



  private renderCategory(): void {
    const category = this.select.value

    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()

    const trainingField = document.querySelector(".training-field")
    trainingField.innerHTML = ""
    trainingField.append(progressInfo, trainingFieldTitle, trainingFieldWorkspace)


    this.setHandler = new PhrasalsSetHandler(this.db, category)
    this.applyNewNotionAsync()
  }
}