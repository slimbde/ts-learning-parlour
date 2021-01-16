import { TTrainingConstructor } from "../TTrainingConstructor";
import { GeneralsSetHandler } from "./GeneralsSetHandler";



export class GeneralsConstructor extends TTrainingConstructor {

  render(): void {
    if (!localStorage.getItem("user"))
      throw new Error("generals:401:not-authorized")

    super.render()

    this.setHandler = new GeneralsSetHandler(this.db)
    this.applyNewNotionAsync()
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

  protected highlightMenu(): void {
    this.deselectMenu()

    const menuGenerals = document.querySelector("#menu-generals").children
    for (let ch of menuGenerals)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "generals"
  }
}