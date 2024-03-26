import { UserAudit } from "./user";

export class Accounts {
  id?: string;
  name: string = "";
  quantity?: number = 0;
  currentBalance: number = 0;

  createUser?: UserAudit;
  createDate?: string;
  updateUser?: UserAudit;
  updateDate?: string;
}