import { shuffle, TSetHandler } from "../../models/ISetHandler";


export class WordsSetHandler extends TSetHandler {

  async scoreAsync(): Promise<void> { }

  async nextAsync(): Promise<void> {
    if (!this.set) {
      this.set = await this.db.getWordsForAsync(this.userName)
      shuffle(this.set)
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.set.shift()
  }
}