import { IDbHandler } from "../../models/IDbHandler";
import { shuffle, TSetHandler } from "../../models/ISetHandler";

export class PhrasalsSetHandler extends TSetHandler {
  private category: string

  get Hint(): string { return this.currentNotion.meaning }

  constructor(dbHandler: IDbHandler, category: string) {
    super(dbHandler)
    this.category = category
  }

  async scoreAsync(): Promise<void> { }

  async nextAsync(): Promise<void> {
    if (!this.set) {
      this.set = await this.db.getPhrasalsForAsync(this.category)
      shuffle(this.set)
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.set.shift()
  }
}