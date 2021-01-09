import { TTrainingConstructor } from "../ITrainingConstructor";
import { GeneralsSetHandler } from "./GeneralsSetHandler";


export class GeneralsConstructor extends TTrainingConstructor {

  render(): void {
    const userName = localStorage.getItem("user")
    if (!userName)
      throw new Error("generals:401:not-authorized")

    super.render()

    this.setHandler = new GeneralsSetHandler(this.db)
    this.applyNewNotionAsync()
      .then(_ => {
        this.hintDiv.style.backgroundImage = "none"
        this.hintDiv.style.opacity = "0"
      })
  }


  passOver(): void {
    this.score()
    setTimeout(_ => this.applyNewNotionAsync(), 300)
  }

  handleSubmit(): void {
    if (this.input.value === this.currentNotion.solution)
      this.score()
    else {
      ++this.wrong
      this.setHandler.enqueue(this.currentNotion)
      this.input.placeholder = this.input.value

      this.blink(false)
    }

    setTimeout(_ => this.applyNewNotionAsync(), 300)
  }


  protected highlightMenu(): void {
    this.deselectMenu()

    const menuGenerals = document.querySelector("#menu-generals").children
    for (let ch of menuGenerals)
      !ch.classList.contains("active") && ch.classList.add("active")

    document.querySelector(".location").textContent = "generals"
  }

  private async applyNewNotionAsync(): Promise<void> {
    this.previousNotion = !!this.currentNotion ? Object.assign(this.currentNotion, {}) : null

    this.currentNotion = await this.setHandler.nextAsync()

    this.correctDiv.textContent = `Correct: ${this.correct}`
    this.wrongDiv.textContent = `Wrong: ${this.wrong}`

    const rate = this.correct + this.wrong === 0
      ? 0
      : this.correct / (this.correct + this.wrong) * 100
    this.successDiv.textContent = `Success: ${Math.round(rate)}%`

    this.leftDiv.textContent = `Query: ${this.currentNotion.id}`
    this.rightDiv.textContent = `To go: ${this.setHandler.Count}`

    this.issueDiv.textContent = this.currentNotion.issue

    this.answerIssue.textContent = !!this.previousNotion
      ? this.previousNotion.issue
      : ""

    this.answerAnswer.textContent = !!this.previousNotion
      ? this.previousNotion.solution
      : ""

    this.input.value = ""
    this.input.focus()
  }

  private blink(correct: boolean) {
    const color = correct ? "green" : "lightcoral"
    const str = correct ? "CORRECT" : "WRONG"

    this.hintDiv.style.color = correct ? color : "lightcoral"
    this.hintDiv.textContent = str
    this.hintDiv.style.opacity = "1"

    this.input.style.boxShadow = `0 0 10px ${color}`

    setTimeout(() => {
      this.hintDiv.style.opacity = "0"
      this.input.style.boxShadow = "unset"

      !correct && setTimeout(() => {
        this.hintDiv.style.opacity = "1"
        this.input.style.boxShadow = `0 0 10px ${color}`

        setTimeout(() => {
          this.hintDiv.style.opacity = "0"
          this.input.style.boxShadow = "unset"
        }, 300)
      }, 300)
    }, correct ? 1000 : 300)
  }

  private score(): void {
    ++this.correct
    this.input.placeholder = ""

    this.blink(true)

    this.setHandler.scoreAsync(this.currentNotion.id.toString())
  }
}