import { LoginConstructor } from "../views/login/LoginConstructor";
import { IDbHandler } from "./IDbHandler";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";


export class MySQLHandler implements IDbHandler {

  async registerAsync(login: string, password: string): Promise<TUser> {
    const resp = await fetch(`php-api/users/register?login=${login}&password=${password}`)
    //debugger
    if (resp.status > 400) {
      switch (resp.status) {
        case 504: throw new Error("DB is offline")
        default: throw new Error("Registration rejected")
      }
    }

    const user = await (resp.json() as Promise<TUser>)
    localStorage.setItem("user", JSON.stringify(user))

    return user
  }

  async authenticateAsync(login: string, password: string): Promise<TUser> {
    const resp = await fetch(`php-api/users/authenticate?login=${login}&password=${password}`)
    //debugger
    if (resp.status > 400) {
      switch (resp.status) {
        case 504: throw new Error("DB is offline")
        case 404: throw new Error("Wrong login or password")
        default: throw new Error("Authentication rejected")
      }
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

      return data.map((dt: any) => ({
        id: dt["#"],
        notion: dt["Word"],
        ipa: dt["IPA"],
        meaning: dt["Translation"],
        example: dt["Example"],
        addDate: dt["Add Date"]
      }))
    }
    else {
      if (resp.status > 500)
        console.error(`[SearchWordsAsync]: ${resp.status} - ${resp.statusText} at ${resp.url}`)
    }

    throw new Error("Nothing found")
  }

  async getGeneralsForAsync(id: string): Promise<TLearnable[]> {
    const resp = await fetch(`php-api/words/getgeneralsfor?id=${id}`)
    if (resp.status == 200) {
      const data = await (resp.json() as Promise<any>)

      return data.map((dt: any) => ({
        id: dt["#"],
        issue: dt["Issue"],
        solution: dt["Answer"]
      }))
    }
    else {
      if (resp.status > 500)
        console.error(`[GetGeneralsFor]: ${resp.status} - ${resp.statusText} at ${resp.url}`)
    }

    throw new Error("Nothing found")
  }

  async scoreGeneralsForAsync(id: string, notionId: string): Promise<void> {
    await fetch(`php-api/words/setgeneralsfor?id=${id}&notionId=${notionId}`)
  }
}