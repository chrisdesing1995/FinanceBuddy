import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { PopoverActionComponent } from './popover-action.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [PopoverActionComponent],
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule,
    TranslateModule
  ]
})
export class PopoverActionModule { }
