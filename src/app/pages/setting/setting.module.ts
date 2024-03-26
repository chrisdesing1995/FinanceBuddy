import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingPageRoutingModule } from './setting-routing.module';

import { SettingPage } from './setting.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingPageRoutingModule,
    TranslateModule,
    HeaderModule,
  ],
  declarations: [SettingPage]
})
export class SettingPageModule {}
