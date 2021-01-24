import { DBInfo } from "./DBInfo";
import { TCategory } from "./TCategory";
import { TLearnable } from "./TLearnable";
import { TUser } from "./TUser";


export interface IDbHandler {
  /**
   * authenticates user to the database
   * @param login
   * @param password
   */
  authenticateAsync(login: string, password: string): Promise<void>

  /**
   * checks and applies user authentication
   * @returns login name of the user
   */
  checkAuthStateAsync(): Promise<boolean>

  /**
   * performs a new user registration
   * @param login new user login
   * @param password new user password
   */
  registerAsync(login: string, password: string): Promise<void>

  /**
   * gets the currently logged user or throws
   * @returns TUser structure
   */
  getUserAsync(): Promise<TUser>

  /**
   * loggs out
   */
  logOutAsync(): Promise<void>

  /**
   * retrieves every possible match from the database
   * @param particle the bit to search by
   * @returns TLearnable structure
   */
  searchWordsAsync(particle: string): Promise<TLearnable[]>

  /**
   * retrieves not solved generals list from the database
   * @param login person login
   * @returns TLearnable structure
   */
  getGeneralsForAsync(login: string): Promise<TLearnable[]>

  /**
   * sets as solved a notion for a user
   * @param login user login
   * @param notionId notion id
   */
  scoreGeneralsForAsync(login: string, notionId: string): Promise<void>

  /**
   * retrieves not solved gerunds list from the database
   * @param login person login
   * @returns TLearnable structure
   */
  getGerundsForAsync(login: string): Promise<TLearnable[]>

  /**
   * sets as solved a notion for a user
   * @param login user login
   * @param notionId notion id
   */
  scoreGerundsForAsync(login: string, notionId: string): Promise<void>

  /**
   * retrieves not solved phrases list from the database
   * @param login person login
   * @returns TLearnable structure
   */
  getPhrasesForAsync(login: string): Promise<TLearnable[]>

  /**
   * sets as solved a notion for a user
   * @param login user login
   * @param notionId notion id
   */
  scorePhrasesForAsync(login: string, notionId: string): Promise<void>

  /**
   * retrieves not solved idioms list from the database
   * @param login person login
   * @returns TLearnable structure
   */
  getIdiomsForAsync(login: string): Promise<TLearnable[]>

  /**
   * sets as solved a notion for a user
   * @param login user login
   * @param notionId notion id
   */
  scoreIdiomsForAsync(login: string, notionId: string): Promise<void>

  /**
   * retrieves today words for a certain user
   * @param login user login
   * @returns TLearnable structure
   */
  getWordsForAsync(login: string): Promise<TLearnable[]>

  /**
   * retrieves a notion categories from db
   * @returns categories list
   */
  getCategoriesAsync(): Promise<TCategory[]>

  /**
   * retrieves phrasals for a certain category
   * @param category phrasals range
   * @returns TLearnable structure
   */
  getPhrasalsForAsync(category: string): Promise<TLearnable[]>

  /**
   * retrieves db info
   * @returns JSON object
   */
  getDbInfoAsync(): Promise<DBInfo>
}