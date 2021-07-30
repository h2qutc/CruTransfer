import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { ApplicationMenuComponent } from './application-menu.component';

@NgModule({
  declarations: [
    ApplicationMenuComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [],
  exports: [
    ApplicationMenuComponent
  ]
})

export class ApplicationMenuModule { }
