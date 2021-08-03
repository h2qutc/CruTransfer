import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardOrderComponent } from './card-order.component';

@NgModule({
  declarations: [
    CardOrderComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    CardOrderComponent
  ]
})

export class CardOrderModule { }
