import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { TranslateModule} from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';
import { FooterModule } from 'src/app/core/footer/footer.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
