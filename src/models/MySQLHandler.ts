import { DBInfo } from "./DBInfo";
import { IDbHandler } from "./IDbHandler";
import { TCategory } from "./TCategory";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";
import 'isomorphic-fetch'



export class MySQLHandler implements IDbHandler {
  private backEnd = `/`

  async registerAsync(login: string, password: string): Promise<void> {
    const body = new FormData()
    body.append("login", login)
    body.append("password", password)

    const resp = await fetch(`${this.backEnd}php-api/users`, {
      method: 'POST',
      body: body
    })

    await this.checkResponseAsync(resp)
  }

  async authenticateAsync(login: string, password: string): Promise<void> {
    try {
      const resp = await fetch(`${this.backEnd}php-api/users/authenticate?login=${login.trim().toLowerCase()}&password=${password}`)
      await this.checkResponseAsync(resp)
    } catch (error) {
      if (error.message === "Not found")
        throw new Error("Wrong login/password")
    }

    localStorage.removeItem("user")
    localStorage.setItem("user", JSON.stringify({ login, role: login === "admin" ? "admin" : "user" }))
  }

  async checkAuthStateAsync(): Promise<boolean> {
    return !!localStorage.getItem("user")
  }

  async getUserAsync(): Promise<TUser> {
    const userString = localStorage.getItem("user")
    if (userString)
      return JSON.parse(userString)

    throw new Error("No user has been logged in")
  }

  async logOutAsync(): Promise<void> {
    localStorage.removeItem("user")
  }

  async alterCredentialsAsync(prevLogin: string, login: string, password: string = ""): Promise<void> {
    const resp = await fetch(`${this.backEnd}php-api/users/altercredentials?prevLogin=${prevLogin}&login=${login}&password=${password}`)
    await this.checkResponseAsync(resp)
    localStorage.removeItem("user")
    localStorage.setItem("user", JSON.stringify({ login, role: login === "admin" ? "admin" : "user" }))
  }

  async searchWordsAsync(particle: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getfor?particle=${particle}`)
    await this.checkResponseAsync(resp)

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

  async getWordsForAsync(userName: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getsetfor?login=${userName}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Word"],
      ipa: dt["IPA"],
      solution: dt["Translation"],
      example: dt["Example"],
      addDate: dt["Add Date"]
    }))
  }

  async getGeneralsForAsync(userName: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getgeneralsfor?login=${userName}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Issue"],
      solution: dt["Answer"]
    }))
  }

  async scoreGeneralsForAsync(userName: string, notionId: string): Promise<void> {
    await fetch(`${this.backEnd}php-api/words/setgeneralsfor?login=${userName}&notionId=${notionId}`)
  }

  async getGerundsForAsync(userName: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getgerundsfor?login=${userName}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Issue"],
      solution: dt["Answer"]
    }))
  }

  async scoreGerundsForAsync(userName: string, notionId: string): Promise<void> {
    await fetch(`${this.backEnd}php-api/words/setgerundsfor?login=${userName}&notionId=${notionId}`)
  }

  async getPhrasesForAsync(userName: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getphrasesfor?login=${userName}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Issue"],
      solution: dt["Answer"]
    }))
  }

  async scorePhrasesForAsync(userName: string, notionId: string): Promise<void> {
    await fetch(`${this.backEnd}php-api/words/setphrasesfor?login=${userName}&notionId=${notionId}`)
  }

  async getIdiomsForAsync(userName: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getidiomsfor?login=${userName}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Issue"],
      solution: dt["Answer"]
    }))
  }

  async scoreIdiomsForAsync(userName: string, notionId: string): Promise<void> {
    await fetch(`${this.backEnd}php-api/words/setidiomsfor?login=${userName}&notionId=${notionId}`)
  }

  async getCategoriesAsync(): Promise<TCategory[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getphrasalscategories`)
    await this.checkResponseAsync(resp)
    return (resp.json() as Promise<TCategory[]>)
  }

  async getPhrasalsForAsync(category: string): Promise<TLearnable[]> {
    const resp = await fetch(`${this.backEnd}php-api/words/getphrasalsfor?category=${category}`)
    await this.checkResponseAsync(resp)
    const data = await (resp.json() as Promise<any>)

    return data.map((dt: any) => ({
      id: dt["#"],
      issue: dt["Translation"],
      solution: dt["Phrasal"],
      meaning: dt["hint"]
    }))
  }

  async getDbInfoAsync(): Promise<DBInfo> {
    const resp = await fetch(`${this.backEnd}php-api/users/getdbinfo`)
    await this.checkResponseAsync(resp)

    return await (resp.json() as Promise<DBInfo>)
  }

  async deleteNotionAsync(notion: TLearnable): Promise<number> {
    const resp = await fetch(`${this.backEnd}php-api/words/${notion.id}`, { method: 'DELETE' })
    await this.checkResponseAsync(resp)

    return await (resp.json() as Promise<number>)
  }

  async updateNotionAsync(notion: TLearnable): Promise<number> {
    const resp = await fetch(`${this.backEnd}php-api/words`, {
      method: 'PUT',
      body: JSON.stringify(notion)
    })

    await this.checkResponseAsync(resp)

    return await (resp.json() as Promise<number>)
  }

  async createNotionAsync(notion: TLearnable): Promise<number> {
    const body = new FormData()
    body.append("notion", JSON.stringify(notion))

    const resp = await fetch(`${this.backEnd}php-api/words`, {
      method: 'POST',
      body: body
    })

    await this.checkResponseAsync(resp)

    return await (resp.json() as Promise<number>)
  }

  /**
   * checks server response and throws common errors
   * @param resp response from server
   */
  private async checkResponseAsync(resp: Response): Promise<void> {
    if (resp.status > 400) {
      switch (resp.status) {
        case 504: throw new Error("DB is offline")
        default: {
          throw new Error(await resp.json())
        }
      }
    }
  }
}