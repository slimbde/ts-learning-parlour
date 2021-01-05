import { IDbHandler } from "./IDbHandler";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";

export interface ISetHandler {
  nextAsync(): Promise<TLearnable>
  enqueue(entry: TLearnable): void
  scoreAsync(entryId: string): Promise<void>
  Count: number
}



export abstract class TSetHandler implements ISetHandler {
  protected db: IDbHandler
  protected user: TUser
  protected set: TLearnable[]

  get Count(): number { return this.set.length }

  constructor(dbHandler: IDbHandler) {
    this.db = dbHandler
    this.user = (JSON.parse(localStorage.getItem("user")) as TUser)
  }

  abstract scoreAsync(entryId: string): Promise<void>

  async nextAsync(): Promise<TLearnable> {
    if (!this.set) {
      this.set = await this.db.getGeneralsForAsync(this.user.id)
      shuffle(this.set)
    }

    return this.set.shift()
  }

  enqueue(entry: TLearnable): void {
    this.set.push(entry)
  }
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * @returns shuffled array
 */
const shuffle = (a: any[]): any[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}