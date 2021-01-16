import { TTrainingConstructor } from "../TTrainingConstructor";
import { GerundsSetHandler } from "./GerundsSetHandler";



export class GerundsConstructor extends TTrainingConstructor {

  render(): void {
    if (!localStorage.getItem("user"))
      throw new Error("gerunds:401:not-authorized")

    super.render()

    this.setHandler = new GerundsSetHandler(this.db)
    this.applyNewNotionAsync()
  }


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "gerunds training"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "fill in blanks with gerund or infinitive"

    return [trainingTitle, trainingTask]
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()

    return [progressInfo, trainingFieldTitle, trainingFieldWorkspace]
  }

  protected highlightMenu(): void {
    this.deselectMenu()

    const menuGerunds = document.querySelector("#menu-gerunds").children
    for (let ch of menuGerunds)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "gerunds"
  }
}