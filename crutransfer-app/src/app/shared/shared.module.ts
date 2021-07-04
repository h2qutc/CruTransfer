import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StateButtonModule } from './components';
import { GradientWithRadialProgressCardModule } from './components/gradient-with-radial-progress-card/gradient-with-radial-progress-card.module';
import { RadialProcessCardModule } from './components/radial-process-card/radial-process-card.module';

const modules = [
  StateButtonModule,
  GradientWithRadialProgressCardModule,
  RadialProcessCardModule
]

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  exports: [...modules]
})
export class SharedModule { }
