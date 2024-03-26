import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    NgApexchartsModule,
    TranslateModule,
    HeaderModule,
    PipesModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule { }
