import { LoginConstructor } from "../views/login/LoginConstructor";
import { IDbHandler } from "./IDbHandler";
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
}