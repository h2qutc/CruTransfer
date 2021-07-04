import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { RadialProcessCardComponent } from './radial-process-card.component';

@NgModule({
  declarations: [
    RadialProcessCardComponent
  ],
  imports: [
    CommonModule,
    RoundprogressModule
  ],
  providers: [],
  exports: [
    RadialProcessCardComponent
  ]
})

export class RadialProcessCardModule { }
