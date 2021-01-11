import { shuffle, TSetHandler } from "../../models/ISetHandler";
import * as moment from 'moment'
import { TLearnable } from "../../models/TLearnable";


export class WordsSetHandler extends TSetHandler {
  private today: TLearnable[] = []
  private last7days: TLearnable[] = []
  private last30days: TLearnable[] = []
  private last120days: TLearnable[] = []
  private currentSet: TLearnable[]

  get Count(): number { return this.currentSet.length + 1 }

  async scoreAsync(): Promise<void> { }

  async nextAsync(): Promise<void> {
    if (!this.set) {
      this.set = await this.db.getWordsForAsync(this.userName)
      shuffle(this.set)

      const maxDate = this.findMaxDate(this.set)

      this.set.forEach((one: TLearnable) => {
        switch (maxDate.diff(moment(one.addDate, "DD.MM.YYYY"), "days")) {
          case 3: case 7: this.last7days.push(one); break
          case 14: case 30: this.last30days.push(one); break
          case 60: case 120: this.last120days.push(one); break
          default: this.today.push(one); break
        }
      })

      this.currentSet = this.today.concat()
    }

    if (this.currentSet.length === 0) {
      switch (this.round) {
        case 1: this.currentSet = this.today.concat(this.last7days); break
        case 2: this.currentSet = this.today.concat(this.last7days.concat(this.last30days)); break
        case 3: this.currentSet = this.today.concat(this.last7days.concat(this.last30days.concat(this.last120days))); break

        default: alert("Congratulations! You've finished the training routine");
      }

      ++this.round
    }

    this.previousNotion = this.currentNotion
    this.currentNotion = this.currentSet.shift()
  }

  enqueue() { this.currentSet.push(this.currentNotion) }
  assess(what: string): boolean { return what === this.Issue }



  private findMaxDate(set: TLearnable[]): moment.Moment {
    let min = moment("01.01.1970", "DD.MM.YYYY")
    return set.reduce((prev: moment.Moment, curr: TLearnable) => {
      const currMoment = moment(curr.addDate, "DD.MM.YYYY")
      if (currMoment > prev)
        return currMoment
      return prev
    }, min)
  }
}