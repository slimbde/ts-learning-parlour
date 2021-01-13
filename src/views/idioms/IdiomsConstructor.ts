import { TTrainingConstructor } from "../TTrainingConstructor";
import { IdiomsSetHandler } from "./IdiomsSetHandler";



export class IdiomsConstructor extends TTrainingConstructor {

  render(): void {
    if (!localStorage.getItem("user"))
      throw new Error("idioms:401:not-authorized")

    super.render()

    this.setHandler = new IdiomsSetHandler(this.db)
    this.applyNewNotionAsync()
      .then(_ => {
        this.hintDiv.style.backgroundImage = "none"
        this.hintDiv.style.opacity = "0"
      })
  }


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "idioms training"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "fill in blanks with appropriate idiom"

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

    const menuIdioms = document.querySelector("#menu-idioms").children
    for (let ch of menuIdioms)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "idioms"
  }
}