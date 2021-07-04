import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { GradientWithRadialProgressCardComponent } from './gradient-with-radial-progress-card.component';

@NgModule({
  declarations: [
    GradientWithRadialProgressCardComponent
  ],
  imports: [
    CommonModule,
    RoundprogressModule
  ],
  providers: [],
  exports: [
    GradientWithRadialProgressCardComponent
  ]
})

export class GradientWithRadialProgressCardModule { }
