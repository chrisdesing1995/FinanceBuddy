import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MovementsPageRoutingModule } from './movements-routing.module';

import { MovementsPage } from './movements.page';
import { CreateOrEditAccountsComponent } from './create-or-edit-accounts/create-or-edit-accounts.component';
import { CreateOrEditIncomeComponent } from './create-or-edit-income/create-or-edit-income.component';
import { CreateOrEditExpenseComponent } from './create-or-edit-expense/create-or-edit-expense.component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderModule } from 'src/app/core/header/header.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MovementsPageRoutingModule,
    TranslateModule,
    HeaderModule,
    PipesModule
  ],
  declarations: [MovementsPage, CreateOrEditAccountsComponent, CreateOrEditIncomeComponent, CreateOrEditExpenseComponent]
})
export class MovementsPageModule {}
