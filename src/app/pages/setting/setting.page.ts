import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  title: string = '';
  language: any = [];
  user: User;
  lang: string = '';
  isCustomers: boolean = false;

  darkTheme: boolean;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private dataAccess: DataAccessService,
    private _t: TranslateValueService,
    private loadingService: LoadingService,
    private presentService: AlertsService,
    private storage: StorageService
  ) {
    this.user = {};
  }

  ngOnInit() {
    this.language = [
      {
        code: 'es',
        value: 'Español',
      },
      {
        code: 'en',
        value: 'English',
      },
    ];
  }

  async ionViewDidEnter() {
    this.title = this._t.l('Title.setting');
    this.getUser();
    const lang = await this.storage.get(DbKey.languageKey);
    this.lang = lang;
    this.translateService.setDefaultLang(lang);
    this.dataAccess.setLanguage(lang);

    const theme = await this.storage.get(DbKey.ThemeModeKey);
    if (theme) {
      document.body.setAttribute('color-theme', 'dark');
      this.darkTheme = true;
      this.storage.set(DbKey.ThemeModeKey, this.darkTheme);
    } else {
      document.body.setAttribute('color-theme', 'light');
      this.darkTheme = false;
      this.storage.set(DbKey.ThemeModeKey, this.darkTheme);
    }
  }

  getUser() {
    this.storage.get(DbKey.LOCAL_USER).then((result) => {
      this.user = result;
    });
  }

  changeLanguage(event: any) {
    this.translateService.setDefaultLang(event.detail.value);
    this.dataAccess.setLanguage(event.detail.value);
  }

  toggleDarkTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute('color-theme', 'dark');
      this.darkTheme = event.detail.checked;
      this.storage.set(DbKey.ThemeModeKey, this.darkTheme);
    } else {
      document.body.setAttribute('color-theme', 'light');
      this.darkTheme = event.detail.checked;
      this.storage.set(DbKey.ThemeModeKey, this.darkTheme);
    }
  }

  async onClickExit() {
    this.presentService.presentAlertConfirm(
      this._t.l('Messages.confirm'),
      '',
      this._t.l('Messages.infoCloseSession'),
      [
        {
          text: this._t.l('Button.cancel'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this._t.l('Button.accept'),
          role: 'confirm',
          handler: async () => {
            await this.loadingService.presentLoading();
            this.storage.remove(DbKey.LOCAL_USER).then(() => {
              this.storage.set(DbKey.HAS_LOGGED_IN, false);
              this.loadingService.dismissLoading();
              this.router.navigateByUrl(AppConst.LoginPage);
            });
          },
        },
      ]
    );
  }

}
