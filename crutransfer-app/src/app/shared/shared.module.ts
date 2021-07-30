import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StateButtonModule } from './components';
import { ApplicationMenuModule } from './components/application-menu/application-menu.module';
import { GradientWithRadialProgressCardModule } from './components/gradient-with-radial-progress-card/gradient-with-radial-progress-card.module';
import { RadialProcessCardModule } from './components/radial-process-card/radial-process-card.module';

const modules = [
  StateButtonModule,
  GradientWithRadialProgressCardModule,
  RadialProcessCardModule,
  ApplicationMenuModule,
  PerfectScrollbarModule
]

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  exports: [...modules]
})
export class SharedModule { }
