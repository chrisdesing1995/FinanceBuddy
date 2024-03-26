import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataAthenticationService } from 'src/app/shared/services/authenticate.service';
import { DataAccessService } from 'src/app/shared/services/data-access.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { TranslateValueService } from 'src/app/shared/services/translateValue.service';
import { AppConst } from 'src/app/shared/utils/const';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  title: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private _t: TranslateValueService,
    private dataAccess: DataAccessService,
    private toasService: ToastService,
    private authService: DataAthenticationService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.title = this._t.l('Title.recoverPassword');
  }

  validateInput(): boolean {
    if (this.email.length === 0) {
      return false;
    }
    return true;
  }

  async resetPasswod() {
    if (this.dataAccess.validateEmail(this.email)) {
      await this.authService.resetPassword(this.email);
      this.router.navigate([AppConst.LoginPage]);
    } else {
      this.toasService.presentToast(this._t.l("Messages.warningRegister"), 2000, 'close-circle', AppConst.WarningColor);
    }
  }
  onClickBack(){
    this.router.navigate([AppConst.LoginPage]);
  }
}
