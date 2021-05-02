import { TTrainingConstructor } from "../../models/TTrainingConstructor";
import { GerundsSetHandler } from "./GerundsSetHandler";



export class GerundsConstructor extends TTrainingConstructor {

  async renderAsync(): Promise<void> {
    const authorized = await this.db.checkAuthStateAsync()
    if (!authorized)
      throw new Error("gerunds:401:not-authorized")

    await super.renderAsync()

    this.setHandler = new GerundsSetHandler(this.db)
    this.applyNewNotionAsync()
  }


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = window.langProvider.GetPageTitle("title-gerunds")

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = window.langProvider.GetPageTask("task-gerunds")

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

    document.querySelector(".location").textContent = window.langProvider.GetLocation("location-gerunds")
  }
}