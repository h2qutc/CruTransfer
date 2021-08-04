import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { AccountComponent } from './account.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent
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
  declarations: [AccountComponent]
})
export class AccountModule { }
