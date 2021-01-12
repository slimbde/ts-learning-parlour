import { shuffle, TSetHandler } from "../../models/ISetHandler";

export class GerundsSetHandler extends TSetHandler {

  async scoreAsync(): Promise<void> {
    this.db.scoreGerundsForAsync(this.userName, this.NotionId)
  }

  async nextAsync(): Promise<void> {
    if (!this.set) {
      this.set = await this.db.getGerundsForAsync(this.userName)
      shuffle(this.set)
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.set.shift()
  }
}