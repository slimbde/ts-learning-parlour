import { IDbHandler } from "../../models/IDbHandler";
import { TSetHandler } from "../../models/ISetHandler";


export class GeneralsSetHandler extends TSetHandler {
  constructor(dbHandler: IDbHandler) {
    super(dbHandler)
  }

  async scoreAsync(entryId: string): Promise<void> {
    this.db.scoreGeneralsForAsync(this.user.id, entryId)
  }
}