import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { VerifyAccountComponent } from './verify-account.component';

const routes: Routes = [
  {
    path: '',
    component: VerifyAccountComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    SimpleNotificationsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [VerifyAccountComponent]
})
export class VerifyAccountModule { }
