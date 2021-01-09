import { TTrainingConstructor } from "../ITrainingConstructor";


export class TrainingConstructor extends TTrainingConstructor {

  render(): void {
    const userName = localStorage.getItem("user")
    if (!userName)
      throw new Error("training:401:not-authorized")

    super.render()

    //this.setHandler = new GeneralsSetHandler(this.db)
    //this.applyNewNotionAsync()
    //  .then(_ => {
    //    this.hintDiv.style.backgroundImage = "none"
    //    this.hintDiv.style.opacity = "0"
    //  })
  }

  passOver(): void {
    throw new Error("Method not implemented.");
  }
  handleSubmit(): void {
    throw new Error("Method not implemented.");
  }

  private constructExampleField(): HTMLDivElement {
    const trainingFieldExample = document.createElement("div")
    trainingFieldExample.className = "training-field-example"
    trainingFieldExample.textContent = "some example"
    return trainingFieldExample
  }

  protected constructTrainingZone(): HTMLDivElement[] {
    const progressInfo = this.constructProgressInfo()
    const trainingFieldTitle = this.constructTrainingFieldTitle()
    const trainingFieldWorkspace = this.constructTrainingFieldWorkspace()
    const trainingFieldExample = this.constructExampleField()

    return [progressInfo, trainingFieldTitle, trainingFieldWorkspace, trainingFieldExample]
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

  protected highlightMenu(): void {
    super.deselectMenu()

    const menu = document.querySelector("#menu-training").children
    for (let ch of menu)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "training"
  }
}