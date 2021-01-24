import { IDbHandler } from "./IDbHandler";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";


export interface ISetHandler {
  nextAsync(): Promise<void>
  findAsync(notion: string): Promise<TLearnable[]>
  enqueue(): void
  scoreAsync(): Promise<void>
  incrementWrong(): void
  incrementCorrect(): void
  assess(what: string): boolean
  Count: number
  Round: number
  Correct: number
  Wrong: number
  Rate: number
  NotionId: string
  Issue: string
  Hint: string
  Solution: string
  PreviousIssue: string
  PreviousSolution: string
  PreviousIPA: string
  PreviousExample: string
  Examples: string
}



export abstract class TSetHandler implements ISetHandler {
  protected db: IDbHandler
  protected userName: string
  protected set: TLearnable[]
  protected round: number
  protected correct: number
  protected wrong: number
  protected currentNotion: TLearnable
  protected previousNotion: TLearnable

  get Count(): number { return this.set.length }
  get Round(): number { return this.round }
  get Correct(): number { return this.correct }
  get Wrong(): number { return this.wrong }
  get NotionId(): string { return this.currentNotion.id.toString() }
  get Issue(): string { return this.currentNotion?.issue }
  get Hint(): string { return "" }
  get Solution(): string { return this.currentNotion?.solution }
  get PreviousIssue(): string { return this.previousNotion?.issue }
  get PreviousSolution(): string { return this.previousNotion?.solution }
  get PreviousIPA(): string { return this.previousNotion?.ipa }
  get PreviousExample(): string { return this.previousNotion?.example }
  get Examples(): string {
    let str = ""
    this.set.forEach((item: TLearnable) => item.example && (str += `${item.example.replace(item.issue, `<font color='black' style='font-weight:500'>${item.issue}</font>`)} `))

    return str
  }
  get Rate(): number {
    return !this.correct && !this.wrong
      ? 0
      : Math.round((this.correct | 0) / ((this.correct | 0) + (this.wrong | 0)) * 100)
  }

  constructor(dbHandler: IDbHandler) {
    this.db = dbHandler
    this.correct = 0
    this.wrong = 0
    this.round = 1
  }

  abstract scoreAsync(): Promise<void>

  async nextAsync(): Promise<void> { !this.userName && (this.userName = (await this.db.getUserAsync()).login) }
  enqueue(): void { this.set.push(this.currentNotion) }
  incrementWrong(): void { ++this.wrong }
  incrementCorrect(): void { ++this.correct }
  assess(what: string): boolean { return what.trim().toLowerCase() === this.Solution.trim().toLowerCase() }
  async findAsync(notion: string): Promise<TLearnable[]> {
    return await this.db.searchWordsAsync(notion)
  }
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * @returns shuffled array
 */
export const shuffle = (a: any[]): any[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}