import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { StateButtonModule } from './components';
import { ApplicationMenuModule } from './components/application-menu/application-menu.module';
import { CardDappAccountModule } from './components/card-dapp-account/card-dapp-account.module';
import { CardOrderModule } from './components/card-order/card-order.module';
import { GradientWithRadialProgressCardModule } from './components/gradient-with-radial-progress-card/gradient-with-radial-progress-card.module';
import { RadialProcessCardModule } from './components/radial-process-card/radial-process-card.module';
import { CruTagInputModule } from './components/tag-input/tag-input.module';
import { DirectivesModule } from './directives';

const modules = [
  StateButtonModule,
  GradientWithRadialProgressCardModule,
  RadialProcessCardModule,
  ApplicationMenuModule,
  PerfectScrollbarModule,
  CardOrderModule,
  DirectivesModule,
  CardDappAccountModule,
  CruTagInputModule
]

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  exports: [...modules]
})
export class SharedModule { }
