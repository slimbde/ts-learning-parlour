import { LoginConstructor } from "../views/login/LoginConstructor";
import { IDbHandler } from "./IDbHandler";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";


export class MySQLHandler implements IDbHandler {

  async authenticateAsync(login: string, password: string): Promise<TUser> {
    const resp = await fetch(`php-api/users/authenticate?login=${login}&password=${password}`)
    if (resp.status > 400) {
      //debugger
      throw new Error("Authentication rejected");
    }

    const user = await (resp.json() as Promise<TUser>)
    localStorage.setItem("user", JSON.stringify(user))

    return user
  }

  async checkAuthStateAsync(): Promise<string> {
    if (localStorage.getItem("user")) {
      const userName = (JSON.parse(localStorage.getItem("user")) as TUser).login
      LoginConstructor.applyCredentialsAsync(userName)

      return userName
    }

    return ""
  }

  async searchWordsAsync(particle: string): Promise<TLearnable[]> {
    const resp = await fetch(`php-api/words/getfor?particle=${particle}`)
    if (resp.status === 200) {
      const data = await (resp.json() as Promise<any>)

      return data.map((dt: any) => {
        //const dbDate = (dt["Add Date"] as string).split(".")
        //const date = [dbDate[2], dbDate[1], dbDate[0]].join("-")

        return {
          id: dt["#"],
          notion: dt["Word"],
          ipa: dt["IPA"],
          meaning: dt["Translation"],
          example: dt["Example"],
          addDate: dt["Add Date"]
        }
      })
    }

    throw new Error("Nothing found")
  }
}