import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DetailOrderComponent } from './components';
import { DashboardComponent } from './dashboard.component';

const components = [
  DetailOrderComponent
]

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: ':id',
    component: DetailOrderComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationModule,
    CollapseModule,
    RouterModule.forChild(routes),
    BsDropdownModule,
    SharedModule,
    TranslateModule
  ],
  declarations: [
    DashboardComponent,
    ...components],
  providers: [
    BsModalService
  ]
})
export class DashboardModule { }
