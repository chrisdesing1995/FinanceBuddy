import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format } from 'date-fns';
import { Accounts } from 'src/app/models/accounts';
import { UserAudit } from 'src/app/models/user';
import { DataAthenticationService } from 'src/app/shared/services/authenticate.service';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Component({
  selector: 'app-create-or-edit-accounts',
  templateUrl: './create-or-edit-accounts.component.html',
  styleUrls: ['./create-or-edit-accounts.component.scss'],
})
export class CreateOrEditAccountsComponent implements OnInit {

  accounts: Accounts = new Accounts();
  action: string = 'N';
  user: UserAudit = {};

  constructor(private popover: PopoverController,
    private dataAccess: DataAccessService,
    private storage: StorageService,
    private _t: TranslateValueService,
    private dataService: DataFireStoreService,
    private toasService: ToastService,
    private loadingService: LoadingService
  ) { 
    this.accounts = new Accounts();
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    const result = await this.storage.get(DbKey.LOCAL_USER);
    this.user.id = result.id;
    this.user.userName = result.userName;
    this.user.fullName = result.name + ' ' + result.surName;
  }

  async save() {
    if (this.action == 'N') {
      if (this.validateInput()) {
        this.loadingService.presentLoading();
        this.accounts.id = await this.dataService.getGenerateId();
        this.accounts.createDate = format(Date.now(), 'dd/MM/yyyy HH:mm:ss');
        this.accounts.createUser = this.user;
        this.dataService
          .createDoc(JSON.parse(JSON.stringify(this.accounts)), AppConst.DocAccounts, this.accounts.id)
          .then(() => {
            this.loadingService.dismissLoading();
            this.toasService.presentToast(this._t.l("Messages.succesSave"), 2000, 'checkmark-circle', AppConst.SuccessColor);
            this.onClickClose();
          })
      }
    } else {
      if (this.validateInput()) {
        this.loadingService.presentLoading();
        this.accounts.updateDate = format(Date.now(), 'dd/MM/yyyy HH:mm:ss');
        this.accounts.updateUser = this.user;
        this.dataService
          .updateDoc(JSON.parse(JSON.stringify(this.accounts)), AppConst.DocAccounts, this.accounts.id)
          .then(() => {
            this.loadingService.dismissLoading();
            this.toasService.presentToast(this._t.l("Messages.succesSave"), 2000, 'checkmark-circle', AppConst.SuccessColor);
            this.onClickClose();
          })
      }
    }

  }

  onClickClose() {
    this.accounts = new Accounts();
    this.popover.dismiss();
  }

  validateInput(): boolean {
    if (this.accounts?.currentBalance < 0) {
      return false;
    }
    if (!this.dataAccess.isNumber(this.accounts?.currentBalance)) {
      this.toasService.presentToast(this._t.l("Messages.warningNumber"), 2000, 'checkmark-circle', AppConst.WarningColor);
      return false;
    }
    if (this.accounts?.name.length === 0) {
      return false;
    }

    return true;
  }
}
