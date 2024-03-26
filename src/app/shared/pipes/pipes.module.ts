import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from './custom-Date.pipe';

@NgModule({
  declarations: [CustomDatePipe],
  exports:[CustomDatePipe],
  imports: [
    CommonModule
  ],
})
export class PipesModule { }
