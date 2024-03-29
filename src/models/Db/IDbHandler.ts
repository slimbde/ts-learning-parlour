import { DBInfo } from "../Entities/DBInfo";
import { TCategory } from "../Entities/TCategory";
import { TLearnable } from "../Entities/TLearnable";
import { TUser } from "../Entities/TUser";


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
   * alters user credentials or throws if something went wrong
   * @param prevLogin previous login
   * @param login new login
   * @param password optional new password
   */
  alterCredentialsAsync(prevLogin: string, login: string, password: string): Promise<void>

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

  /**
   * deletes a notion from db
   * @param notion the notion to delete
   * @returns number of rows affected
   */
  deleteNotionAsync(notion: TLearnable): Promise<number>

  /**
   * updates a db notion
   * @param notion the notion to update
   * @returns number of rows affected
   */
  updateNotionAsync(notion: TLearnable): Promise<number>

  /**
   * appends a db notion
   * @param notion a notion to create
   * @returns number of rows affected
   */
  createNotionAsync(notion: TLearnable): Promise<number>
}