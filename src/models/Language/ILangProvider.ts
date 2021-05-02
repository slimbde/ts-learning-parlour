import RuTable from './ru.json'
import EnTable from './en.json'


type LangTable = {
  [key: string]: string
}



/**
 * Language provider interface
 */
export interface ILangProvider {
  SwitchTo(lang: string): void
  GetLocation(location: string): string
  GetPageTitle(page: string): string
  GetPageTask(page: string): string
  GetSubmitBtn(): string
  GetCancelBtn(): string
  GetDbInfo(): string

  GetSummaryCorrect(): string
  GetSummaryWrong(): string
  GetSummarySuccess(): string
  GetSummaryRight(): string
  GetSummaryFail(): string
  GetSummaryPass(): string
  GetSummaryQuery(): string
  GetSummaryToGo(): string
  GetSummaryRound(): string

  GetSearchBtn(): string
  GetSearchPlaceholder(): string
  GetSearchEntries(): string

  GetAccountUsername(): string
  GetAccountPassword(): string
  GetAccountChangeBtn(): string
  GetAccountCredentialsFrame(): string
  GetAccountPasswordPlaceholder(): string
  GetAccountPasswordConfirm(): string
  GetAccountTodayWords(): string
  GetAccountTodayFrame(): string

  GetPhrasalsCategory(): string

  GetShowQuickSearch(): string
  GetHideQuickSearch(): string

  GetAuthTitle(): string
  GetAuthHintLogin(): string
  GetAuthHintPass(): string
  GetAuthLoginBtn(): string
  GetAuthRegBtn(): string
}




/**
 * Implementation of the interface
 */
export class TLangProvider implements ILangProvider {
  private Table: LangTable
  private langs: HTMLCollection = document.getElementsByClassName("language")



  SwitchTo(lang: string): void {
    for (let item of this.langs) item.classList.remove("active")

    switch (lang.toLowerCase().trim()) {
      case "ru":
        this.Table = RuTable;
        this.langs[1].classList.add("active")
        break
      default:
        this.Table = EnTable;
        this.langs[0].classList.add("active")
        break
    }

    document.title = this.Table["title-home"]

    document.getElementById("menu-home").children[1].textContent = this.Table["menu-home"]
    document.getElementById("menu-training").children[1].textContent = this.Table["menu-training"]
    document.getElementById("menu-generals").children[1].textContent = this.Table["menu-generals"]
    document.getElementById("menu-gerunds").children[1].textContent = this.Table["menu-gerunds"]
    document.getElementById("menu-phrases").children[1].textContent = this.Table["menu-phrases"]
    document.getElementById("menu-idioms").children[1].textContent = this.Table["menu-idioms"]
    document.getElementById("menu-phrasals").children[1].textContent = this.Table["menu-phrasals"]

    window.construct.renderAsync()
  }


  GetLocation = (location: string): string => this.Table[location]
  GetPageTitle = (page: string): string => this.Table[page]
  GetPageTask = (page: string): string => this.Table[page]
  GetSubmitBtn = (): string => this.Table["submit-btn"]
  GetCancelBtn = (): string => this.Table["cancel-btn"]
  GetDbInfo = (): string => this.Table["db-info"]

  GetSummaryCorrect = (): string => this.Table["summary-correct"]
  GetSummaryWrong = (): string => this.Table["summary-wrong"]
  GetSummarySuccess = (): string => this.Table["summary-success"]
  GetSummaryRight = (): string => this.Table["summary-right"]
  GetSummaryFail = (): string => this.Table["summary-fail"]
  GetSummaryPass = (): string => this.Table["summary-pass"]
  GetSummaryQuery = (): string => this.Table["summary-query"]
  GetSummaryToGo = (): string => this.Table["summary-togo"]
  GetSummaryRound = (): string => this.Table["summary-round"]

  GetSearchBtn = (): string => this.Table["search-btn"]
  GetSearchPlaceholder = (): string => this.Table["search-placeholder"]
  GetSearchEntries = (): string => this.Table["search-entries"]

  GetAccountUsername = (): string => this.Table["account-userName"]
  GetAccountPassword = (): string => this.Table["account-password"]
  GetAccountCredentialsFrame = (): string => this.Table["account-credentials-frame"]
  GetAccountChangeBtn = (): string => this.Table["account-change-btn"]
  GetAccountPasswordPlaceholder = (): string => this.Table["account-password-placeholder"]
  GetAccountPasswordConfirm = (): string => this.Table["account-confirm-placeholder"]
  GetAccountTodayWords = (): string => this.Table["account-today-words"]
  GetAccountTodayFrame = (): string => this.Table["account-today-frame"]

  GetPhrasalsCategory = (): string => this.Table["phrasals-category"]

  GetShowQuickSearch = (): string => this.Table["quick-search-show"]
  GetHideQuickSearch = (): string => this.Table["quick-search-hide"]

  GetAuthTitle = (): string => this.Table["auth-title"]
  GetAuthHintLogin = (): string => this.Table["auth-hint-login"]
  GetAuthHintPass = (): string => this.Table["auth-hint-pass"]
  GetAuthLoginBtn = (): string => this.Table["auth-login-btn"]
  GetAuthRegBtn = (): string => this.Table["auth-reg-btn"]
}