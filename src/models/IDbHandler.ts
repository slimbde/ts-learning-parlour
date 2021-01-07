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
   * performs a new user registration
   * @param login new user login
   * @param password new user password
   * @returns new registered user or throws exception
   */
  registerAsync(login: string, password: string): Promise<TUser>

  /**
   * retrieves every possible match from the database
   * @param particle the bit to search by
   * @returns TLearnable structure
   */
  searchWordsAsync(particle: string): Promise<TLearnable[]>

  /**
   * retrieves not solved generals list from the database
   * @param id person id
   * @returns TLearnable structure
   */
  getGeneralsForAsync(id: string): Promise<TLearnable[]>

  /**
   * sets as solved a notion for a user
   * @param id user id
   * @param notionId notion id
   */
  scoreGeneralsForAsync(id: string, notionId: string): Promise<void>
}