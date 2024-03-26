import { Component } from '@angular/core';
import { AppConst } from 'src/app/shared/utils/const';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { DataFireStoreService } from 'src/app/shared/services/data-fire-store.service';
import * as moment from 'moment-timezone';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  title: string = '';
  tabs: any[] = [];

  constructor(
    private _t: TranslateValueService,
    private dataService: DataFireStoreService
  ) {
    this.title = AppConst.headerTitle;
  }

  ionViewDidEnter(): void {
    this._initialiseTranslation();
    this.listTabs();
  }

  _initialiseTranslation(): void {
    this.title = this._t.l('Title.home');
  }

  listTabs() {
    this.tabs = [
      {
        tab: 'dashboard',
        icon: 'bar-chart-outline',
        label: 'Footer.home',
      },
      {
        tab: 'movements',
        icon: 'trending-up-outline',
        label: 'Footer.movement',
      },
      {
        tab: 'user-profile',
        icon: 'person-circle-outline',
        label: 'Footer.profile',
      },
      {
        tab: 'setting',
        icon: 'information-circle-outline',
        label: 'Footer.setting',
      },
    ];
  }
}
