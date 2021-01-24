import { shuffle, TSetHandler } from "../../models/ISetHandler";

export class PhrasesSetHandler extends TSetHandler {

  async scoreAsync(): Promise<void> {
    this.db.scorePhrasesForAsync(this.userName, this.NotionId)
  }

  async nextAsync(): Promise<void> {
    await super.nextAsync()

    if (!this.set) {
      this.set = await this.db.getPhrasesForAsync(this.userName)
      shuffle(this.set)
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.set.shift()
  }
}