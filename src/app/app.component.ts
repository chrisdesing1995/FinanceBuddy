import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataAccessService } from './shared/services/data-access.service';
import { Storage } from '@ionic/storage-angular';
import { DbKey } from './shared/utils/dbKey';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
    private dataAccess: DataAccessService,
    private storage: Storage
  ) {
    this.inicialieApp();
  }

  async inicialieApp() {
    await this.storage.create();
    this.dataAccess.getLanguage().then((lang) => {
      if (!lang) {
        lang = 'en';
      }
      this.translateService.setDefaultLang(lang);
      this.dataAccess.setLanguage(lang);
    });

    this.dataAccess.getTheme().then((value) => {
      if (!value) {
        value = false;
      }
      if (value) {
        document.body.setAttribute('color-theme', 'dark');
        this.storage.set(DbKey.ThemeModeKey, value);
      } else {
        document.body.setAttribute('color-theme', 'light');
        this.storage.set(DbKey.ThemeModeKey, value);
      }
    });

  }
}
