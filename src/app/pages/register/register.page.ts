import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { DataAthenticationService } from 'src/app/shared/services/authenticate.service';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  title: string = '';
  user: User;
  constructor(
    private router: Router,
    private _t: TranslateValueService,
    private dataAccess: DataAccessService,
    private toasService: ToastService,
    private loadingService: LoadingService,
    private authService: DataAthenticationService,
  ) {
    this.user = {};
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.title = this._t.l('Title.createAccount');
  }

  async registerUser() {
    if (this.validateInput()) {
      if (this.dataAccess.validateEmail(this.user.email)) {
        await this.authService
          .registerUser(this.user.email, this.user.password, JSON.parse(JSON.stringify(this.user)), AppConst.DocUsers)
          .then((val) => {
            this.loadingService.dismissLoading();
            this.toasService.presentToast(this._t.l("Messages.succesSave") , 2000,'checkmark-circle', AppConst.SuccessColor);
            this.router.navigate([AppConst.LoginPage]);
            this.user = {};
          })
          .catch(() => { 
            this.loadingService.dismissLoading();
            this.toasService.presentToast(this._t.l("Messages.errorSave"),2000,'close-circle', AppConst.DangerColor);
          });
      }
    }else {
      this.toasService.presentToast(this._t.l("Messages.warningRegister"),2000,'close-circle', AppConst.WarningColor);
    }
  }

  validateInput(): boolean {
    if (this.user?.name.length === 0) {
      return false;
    }
    if (this.user?.surName.length === 0) {
      return false;
    }
    if (this.user?.userName.length === 0) {
      return false;
    }
    if (this.user?.email.length === 0) {
      return false;
    }
    if (this.user?.password.length === 0) {
      return false;
    }
    return true;
  }

  onClickBack(){
    this.router.navigate([AppConst.LoginPage]);
  }
}
