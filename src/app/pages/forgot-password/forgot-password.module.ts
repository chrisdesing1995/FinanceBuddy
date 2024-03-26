import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

import { ForgotPasswordPage } from './forgot-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule,
    TranslateModule,
    HeaderModule
  ],
  declarations: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
