import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Accounts } from 'src/app/models/accounts';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CameraService } from 'src/app/shared/services/camera.service';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';
import { CreateOrEditAccountsComponent } from './create-or-edit-accounts/create-or-edit-accounts.component';
import { Transaction } from 'src/app/models/transaction';
import { CreateOrEditIncomeComponent } from './create-or-edit-income/create-or-edit-income.component';
import { CreateOrEditExpenseComponent } from './create-or-edit-expense/create-or-edit-expense.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.page.html',
  styleUrls: ['./movements.page.scss'],
})
export class MovementsPage implements OnInit {

  title: string = '';
  @ViewChild('popover_report') popover_report: PopoverController;

  user: User = {};
  newsList: any[] = [];
  isVisible: boolean = true;

  isCustomers: boolean = false;
  loaded: boolean = false;
  dateStart: string = '';
  dateEnd: string = '';
  lang: string;

  folder = '';
  slideOpts = {};
  isVisibleAction: boolean = true;
  selectedSegment: string = 'I';
  transactionIncome: Transaction[] = [];
  transactionExpense: Transaction[] = [];

  constructor(
    private dataService: DataFireStoreService,
    private _t: TranslateValueService,
    private storage: StorageService,
    private cameraService: CameraService,
    private popover: PopoverController,
    private presentService: AlertsService) {
  }

  ngOnInit() {
    this.slideOpts = {
      slidesPerView: 1.4,
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  async ionViewDidEnter() {
    this.user = await this.storage.get(DbKey.LOCAL_USER);

    this.dataService.getListDoc<any>(AppConst.DocAccounts, this.user.id).subscribe((result) => {
      this.newsList = result;
      this.loaded = true;
      this.isVisible = false;
    });
    this.dataService.getTransactionByCode<any>(AppConst.DocTransaction, 'I', this.user.id).subscribe((result) => {
      // Convertir las cadenas de fecha en objetos Date
      result.forEach(item => {
        item.createDate = new Date(item.createDate);
      });

      // Ordenar los objetos por fecha de forma ascendente
      result.sort((a, b) => b.createDate - a.createDate);

      // Seleccionar los últimos 30 registross
      this.transactionIncome = result.slice(-30);
    });
    this.dataService.getTransactionByCode<any>(AppConst.DocTransaction, 'E', this.user.id).subscribe((result) => {
      // Convertir las cadenas de fecha en objetos Date
      result.forEach(item => {
        item.createDate = new Date(item.createDate);
      });

      // Ordenar los objetos por fecha de forma ascendente
      result.sort((a, b) => b.createDate - a.createDate);

      // Seleccionar los últimos 30 registros
      this.transactionExpense = result.slice(-30);
    });
    this.storage.get(DbKey.languageKey).then((lang) => {
      if (!lang) {
        return lang = 'en';
      }
      this.lang = lang;
    });
  }

  onClickCamera() {
    const image = this.cameraService.onCamera();
    image.then(async (x) => {

    });
  }

  formatDate(value: any) {
    return format(parseISO(value), "yyyy-MM-dd", { locale: es });
  }

  formatDateUs(value: any): string | null {
    return format(parseISO(value), "yyyy-MM-dd");
  }

  formatDateUsStart(): string {
    const currentDate = new Date();
    return format(currentDate, "yyyy-MM-dd");
  }

  deleteAccount(item: any) {
    if (!this.isVisibleAction) {
      return;
    }
    this.presentService.presentAlertConfirm(
      this._t.l('Messages.confirm'),
      '',
      this._t.l('Messages.deletedAccount'),
      [
        {
          text: this._t.l('Button.cancel'),
          role: 'cancel',
          handler: () => { },
        },
        {
          text: this._t.l('Button.accept'),
          role: 'confirm',
          handler: async () => {
          },
        },
      ]);
  }

  updateAccounts(data?: any) {
    this.openAccount(data, 'U');
  }

  addAccounts() {
    var account = new Accounts();
    this.openAccount(account, 'N');
  }

  async openAccount(data?: any, action?: string) {
    const popover = await this.popover.create({
      component: CreateOrEditAccountsComponent,
      componentProps: {
        accounts: data,
        action: action,
      },
      cssClass: 'modal-content',
    });
    return await popover.present();
  }

  openSegment() {
    if (this.selectedSegment === 'I') {
      var income = new Transaction();
      income.type = 'I';
      this.openIncome(income, 'N');
    } else {
      var expense = new Transaction();
      expense.type = 'E';
      this.openExpense(expense, 'N');
    }
  }

  async openIncome(data?: any, action?: string) {
    const popover = await this.popover.create({
      component: CreateOrEditIncomeComponent,
      componentProps: {
        transaction: data,
        action: action,
      },
      cssClass: 'modal-content',
    });
    return await popover.present();
  }

  async openExpense(data?: any, action?: string) {
    const popover = await this.popover.create({
      component: CreateOrEditExpenseComponent,
      componentProps: {
        transaction: data,
        action: action,
      },
      cssClass: 'modal-content',
    });
    return await popover.present();
  }
}
