import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';
import { DbKey } from 'src/app/shared/utils/dbKey';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() visibleBackButton: boolean = false;
  @Input() visibleMenu: boolean = false;
  @Input() visibleSetting: boolean = false;
  @Input() visibleExits: boolean = true;
  @Input() visibleProfile: boolean = false;
  @Input() valueHref: string = '';
  @Input() IconNameClose: string = 'close-outline';

  @Output() onBack = new EventEmitter();

  user: User = {};

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private storage: StorageService,
    private presentService: AlertsService,
    private _t: TranslateValueService
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.title = this._t.l('Menu.profile');
    this.storage.get(DbKey.LOCAL_USER).then((result) => {
      this.user = result;
    });
  }

  onClickBack() {
    this.onBack.emit();
  }

  onClickProfile(){
    this.router.navigateByUrl(AppConst.Profile);
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
