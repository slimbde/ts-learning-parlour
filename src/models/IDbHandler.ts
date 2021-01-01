import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";

export interface IDbHandler {
  /**
   * authenticates user to the database
   * @param login
   * @param password
   * @returns TUser structure
   */
  authenticateAsync(login: string, password: string): Promise<TUser>

  /**
   * checks and applies user authentication
   * @returns login name of the user
   */
  checkAuthStateAsync(): Promise<string>

  /**
   * retrieves every possible match from the database
   * @param particle the bit to search by
   * @returns TLearnable structure
   */
  searchWordsAsync(particle: string): Promise<TLearnable[]>
}