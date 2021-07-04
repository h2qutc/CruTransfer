import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
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
  declarations: [LoginComponent]
})
export class LoginModule { }
