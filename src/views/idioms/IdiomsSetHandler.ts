import { shuffle, TSetHandler } from "../../models/ISetHandler";

export class IdiomsSetHandler extends TSetHandler {

  async scoreAsync(): Promise<void> {
    this.db.scoreIdiomsForAsync(this.userName, this.NotionId)
  }

  async nextAsync(): Promise<void> {
    if (!this.set) {
      this.set = await this.db.getIdiomsForAsync(this.userName)
      shuffle(this.set)
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.set.shift()
  }
}