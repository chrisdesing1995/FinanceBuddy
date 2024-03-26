import { UserAudit } from "./user";

export class Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  type: 'I' | 'E';
  categorieId: string;
  categorieName: string;
  accountId: string;
  accountName: string;

  createUser?: UserAudit;
  createDate?: string;
  updateUser?: UserAudit;
  updateDate?: string;
}
