import { TUser } from "./TUser";

export interface IDbHandler {
  authenticateAsync(login: string, password: string): Promise<TUser>
  checkAuthStateAsync(): Promise<string>
}