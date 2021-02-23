import { TTrainingConstructor } from "../../models/TTrainingConstructor";
import { PhrasesSetHandler } from "./PhrasesSetHandler";



export class PhrasesConstructor extends TTrainingConstructor {

  async renderAsync(): Promise<void> {
    const authorized = await this.db.checkAuthStateAsync()
    if (!authorized)
      throw new Error("phrases:401:not-authorized")

    await super.renderAsync()

    this.setHandler = new PhrasesSetHandler(this.db)
    this.applyNewNotionAsync()
  }


  protected constructPageTitles(): HTMLDivElement[] {
    const trainingTitle = document.createElement("div")
    trainingTitle.className = "training-title"
    trainingTitle.textContent = "phrases training"

    const trainingTask = document.createElement("div")
    trainingTask.className = "training-task"
    trainingTask.textContent = "fill in blanks with appropriate phrase"

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

    const menuPhrases = document.querySelector("#menu-phrases").children
    for (let ch of menuPhrases)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "phrases"
  }
}