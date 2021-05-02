import { TCategory } from "../../models/Entities/TCategory";
import { TTrainingConstructor } from "../../models/TTrainingConstructor";
import { PhrasalsSetHandler } from "./PhrasalsSetHandler";



export class PhrasalsConstructor extends TTrainingConstructor {
  private select: HTMLSelectElement


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = window.langProvider.GetPageTitle("title-phrasals")

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = window.langProvider.GetPageTask("task-phrasals")

    return [trainingTitle, trainingTask]
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const label = document.createElement("label")
    label.textContent = window.langProvider.GetPhrasalsCategory()
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
    button.textContent = window.langProvider.GetSubmitBtn()
    button.addEventListener("click", _ => this.renderCategory())

    const result = document.createElement("div")
    result.className = "progress-info"

    result.appendChild(label)
    result.appendChild(select)
    result.appendChild(button)

    return [result]
  }

  protected highlightMenu(): void {
    this.deselectMenu()

    const menuPhrasals = document.querySelector("#menu-phrasals").children
    for (let ch of menuPhrasals)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = window.langProvider.GetLocation("location-phrasals")
  }

  protected async applyNewNotionAsync(): Promise<void> {
    await this.setHandler.nextAsync()

    this.correctDiv.textContent = `${window.langProvider.GetSummaryCorrect()}: ${this.setHandler.Correct}`
    this.wrongDiv.textContent = `${window.langProvider.GetSummaryWrong()}: ${this.setHandler.Wrong}`

    this.successDiv.textContent = `${window.langProvider.GetSummarySuccess()}: ${Math.round(this.setHandler.Rate)}%`

    this.leftDiv.textContent = `${window.langProvider.GetSummaryQuery()}: ${this.setHandler.NotionId}`
    this.rightDiv.textContent = `${window.langProvider.GetSummaryToGo()}: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.setHandler.Issue
    this.hintDiv.textContent = this.setHandler.Hint

    this.answerIssue.textContent = this.setHandler.PreviousIssue
    this.answerAnswer.textContent = this.setHandler.PreviousSolution

    this.indicatorDiv.style.backgroundImage = "none"

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
    trainingField.appendChild(progressInfo)
    trainingField.appendChild(trainingFieldTitle)
    trainingField.appendChild(trainingFieldWorkspace)


    this.setHandler = new PhrasalsSetHandler(this.db, category)
    this.applyNewNotionAsync()
  }
}