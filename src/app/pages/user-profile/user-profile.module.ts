import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

registerLocaleData(localeEs);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    TranslateModule,
    HeaderModule,
    PipesModule
  ],
  declarations: [UserProfilePage]
})
export class UserProfilePageModule {}
