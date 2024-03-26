import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy  {
  private userSubscription: Subscription;
  private authSubscription: Subscription; 

  public type: string = 'password';
  public icono: string = 'eye';
  public register: boolean = false;
  lang: string = '';

  public user: User;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private dataAccess: DataAccessService,
    private toasService: ToastService,
    private dataService: DataFireStoreService,
    private authService: DataAthenticationService,
    private loadingService: LoadingService,
    private _t: TranslateValueService,
    private storage: StorageService,
    public auth: AngularFireAuth,
    public modal: ModalController
  ) {
    this.user = {};
    this.authSubscription = this.authService.stateAuth().subscribe((res) => {
      if (res !== null) {
        this.getInfoUser(res.uid);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    // Desuscribirnos para evitar memory leaks
    this.authSubscription.unsubscribe();
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  getInfoUser(uid: string) {
    this.userSubscription = this.dataService
      .getDocById<User>(AppConst.DocUsers, uid)
      .subscribe((rest) => {
        this.storage.set(DbKey.LOCAL_USER, rest);
      });
  }

  ionViewDidEnter() {
    this.dataAccess.getLanguage().then((lang) => {
      if (!lang) {
        lang = 'en';
      }
      this.lang = lang;
      this.translateService.setDefaultLang(lang);
      this.dataAccess.setLanguage(lang);
    });
  }

  onClickLogin() {
    this.router.navigateByUrl(AppConst.Profile);
  }

  getTypeInput() {
    if (this.type === 'password') {
      this.type = 'text';
      this.icono = 'eye-off';
    } else {
      this.type = 'password';
      this.icono = 'eye';
    }
  }

  changeLanguage(event: any) {
    this.translateService.setDefaultLang(event.detail.value);
    this.dataAccess.setLanguage(event.detail.value);
  }

  async onClickSingUp() {
    await this.loadingService.presentLoading(this._t.l("Messages.loadingLogin"));
    if (this.user?.email.length > 0 && this.user?.password.length > 0) {
      if (this.dataAccess.validateEmail(this.user.email)) {
        this.authService.login(this.user.email, this.user.password)
          .then((result) => {
            this.loadingService.dismissLoading();
            this.getUserById(result.user.uid);
          })
          .catch((err) => {
            this.loadingService.dismissLoading();
            this.handleError(this._t.l("Messages.warninglogin"));
          });
      } else {
        this.loadingService.dismissLoading();
        this.handleError(this._t.l("Messages.warningEmail"));
      }
    } else {
      this.loadingService.dismissLoading();
      this.handleError(this._t.l("Messages.warninglogin"));
    }
  }


  getUserById(uid: string) {
    this.userSubscription = this.dataService.getDocById<User>(AppConst.DocUsers, uid)
      .subscribe(
        (user: User) => {
          this.storage.set(DbKey.HAS_LOGGED_IN, true);
          this.storage.set(DbKey.LOCAL_USER, user);
          this.router.navigate([AppConst.Home]);
          this.loadingService.dismissLoading();
          this.toasService.presentToast(this._t.l("Title.welcome") + user.name, 2000, 'checkmark-circle', AppConst.SuccessColor);
        },
        (err) => {
          this.loadingService.dismissLoading();
          this.handleError(this._t.l("Messages.warninglogin"));
        }
      );
  }

  private handleError(message:string) {
    this.toasService.presentToast(
      message, 2000, 'close-circle', AppConst.DangerColor
    );
  }

  async createAccount() {
    this.router.navigate([AppConst.Register]);
  }

  async recoverPassword() {
    this.router.navigate([AppConst.ForgotPassword]);
  }
}
