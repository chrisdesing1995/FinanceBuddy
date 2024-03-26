import { User } from 'src/app/models/user';

export class AppConst {
  public static currentUser: User;

  // TODA CONSTANTE DEBE SER CON MAYUSCULA EJ (VAR_TEXT)
  public static readonly headerTitle: string = 'Inicio';
  //#endregion

  //#region RUTAS
  public static readonly LoginPage: string = '/login';
  public static readonly Home: string = '/home/dashboard';
  public static readonly Profile: string = '/home/user-profile';
  public static readonly Help: string = '/home/help';
  public static readonly Register: string = '/register';
  public static readonly ForgotPassword: string = '/forgot-password';
  //#endregion

  //#region NOMBRE DE COLLECTION
  public static readonly DocUsers: string = 'users/';
  public static readonly DocAccounts: string = 'accounts/';
  public static readonly DocGeneralParameter: string = 'generalParameters/';
  public static readonly DocTransaction: string = 'transactions/';
  //#endregion

  //#region NAME COLORS
  public static readonly SuccessColor: string = 'success';
  public static readonly DangerColor: string = 'danger';
  public static readonly WarningColor: string = 'warning';
  public static readonly SecondaryColor: string = 'secondary';
  //#endregion

    //#region GENERAL PARAMETER CODE
    public static readonly typeCategorieIncome: string = 'TYPECATEGORYINCOME';
    public static readonly typeCategorieExpense: string = 'TYPECATEGORYEXPENSE';
    public static readonly typeTransaction: string = 'TYPETRANSACTION';
    //#endregion
}
