import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import { Accounts } from 'src/app/models/accounts';
import { Transaction } from 'src/app/models/transaction';
import { UserAudit } from 'src/app/models/user';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Component({
  selector: 'app-create-or-edit-expense',
  templateUrl: './create-or-edit-expense.component.html',
  styleUrls: ['./create-or-edit-expense.component.scss'],
})
export class CreateOrEditExpenseComponent implements OnInit {

  user: UserAudit = {};
  transaction: Transaction = new Transaction();
  typeCategories: any[] = [];
  typeCategory: any = {};
  accountsList: Accounts[] = [];
  account: Accounts = new Accounts();
  action: string = 'N';

  constructor(private dataService: DataFireStoreService,
    private dataAccess: DataAccessService,
    private _t: TranslateValueService,
    private toasService: ToastService,
    private storage: StorageService,
    private popover: PopoverController,
    private loadingService: LoadingService) { }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    const result = await this.storage.get(DbKey.LOCAL_USER);
    this.user.id = result.id;
    this.user.userName = result.userName;
    this.user.fullName = result.name + ' ' + result.surName;

    this.dataService.getGeneralParameterByCode<any>(AppConst.DocGeneralParameter, AppConst.typeCategorieExpense).subscribe((result) => {
      this.typeCategories = result;
    });

    this.dataService.getListDoc<any>(AppConst.DocAccounts, this.user.id).subscribe((result) => {
      this.accountsList = result;
    });

  }

  compareWithCategory(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onChangeCategory(ev) {
    this.typeCategory = ev.target.value;
    this.transaction.categorieId = this.typeCategory.id;
    this.transaction.categorieName = this.typeCategory.name;
  }

  compareWithAccount(o1, o2) {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  onChangeAccount(ev) {
    this.transaction.accountId = ev.target.value.id;
    this.transaction.accountName = ev.target.value.name;
    this.getAccountById(this.transaction.accountId);
  }

  getAccountById(accountId: string) {
    this.dataService
      .getDocById<Accounts>(AppConst.DocAccounts, accountId)
      .subscribe((result) => {
        this.account = result;
      });
  }

  updateBalanceAccount() {
    this.account.createDate = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
    this.account.createUser = this.user;
    this.account.currentBalance = (this.account.currentBalance - this.transaction.amount);
    this.dataService.updateDoc(this.account, AppConst.DocAccounts, this.account.id)
      .then((result) => { console.log(result); });
  }

  onClickClose() {
    this.transaction = new Transaction();
    this.transaction.type = 'E';
    this.popover.dismiss();
  }

  async save() {
    if (this.action == 'N') {
      if (this.validateInput()) {
        this.loadingService.presentLoading();
        this.transaction.id = await this.dataService.getGenerateId();
        this.transaction.createDate = format(Date.now(), 'yyyy-MM-dd HH:mm:ss');
        this.transaction.createUser = this.user;
        this.dataService
          .createDoc(JSON.parse(JSON.stringify(this.transaction)), AppConst.DocTransaction, this.transaction.id)
          .then(() => {
            this.loadingService.dismissLoading();
            this.toasService.presentToast(this._t.l("Messages.succesSave"), 2000, 'checkmark-circle', AppConst.SuccessColor);
            this.updateBalanceAccount();
            this.onClickClose();
          })
      }
    }
  }

  validateInput(): boolean {
    if (this.transaction?.amount < 0) {
      return false;
    }
    if (!this.dataAccess.isNumber(this.transaction?.amount)) {
      this.toasService.presentToast(this._t.l("Messages.warningNumber"), 2000, 'checkmark-circle', AppConst.WarningColor);
      return false;
    }
    if (this.transaction?.description.length === 0) {
      return false;
    }
    if (this.transaction?.categorieId.length <= 0) {
      return false;
    }
    if (this.transaction?.accountId.length <= 0) {
      return false;
    }

    return true;
  }
}
