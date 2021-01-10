import { IDbHandler } from "./IDbHandler";
import { TLearnable } from "./TLearnable";


export interface ISetHandler {
  nextAsync(): Promise<void>
  enqueue(): void
  scoreAsync(): Promise<void>
  incrementWrong(): void
  incrementCorrect(): void
  Count: number
  Correct: number
  Wrong: number
  Rate: number
  NotionId: string
  Issue: string
  Solution: string
  PreviousIssue: string
  PreviousSolution: string
}



export abstract class TSetHandler implements ISetHandler {
  protected db: IDbHandler
  protected userName: string
  protected set: TLearnable[]
  protected correct: number
  protected wrong: number
  protected currentNotion: TLearnable
  protected previousNotion: TLearnable

  get Count(): number { return this.set.length }
  get Correct(): number { return this.correct }
  get Wrong(): number { return this.wrong }
  get Issue(): string { return this.currentNotion.issue }
  get Solution(): string { return this.currentNotion.solution }
  get PreviousIssue(): string { return this.previousNotion?.issue }
  get PreviousSolution(): string { return this.previousNotion?.solution }
  get NotionId(): string { return this.currentNotion.id.toString() }
  get Rate(): number {
    return !this.correct && !this.wrong
      ? 0
      : (this.correct | 0) / ((this.correct | 0) + (this.wrong | 0)) * 100
  }

  constructor(dbHandler: IDbHandler) {
    this.db = dbHandler
    this.userName = localStorage.getItem("user")
    this.correct = 0
    this.wrong = 0
  }

  abstract scoreAsync(): Promise<void>
  abstract nextAsync(): Promise<void>

  enqueue(): void { this.set.push(this.currentNotion) }
  incrementWrong(): void { ++this.wrong }
  incrementCorrect(): void { ++this.correct }
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