import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CardOrderComponent } from './components';
import { DashboardComponent } from './dashboard.component';

const components = [
  CardOrderComponent
]

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule,
    RouterModule.forChild(routes),
    BsDropdownModule
  ],
  declarations: [
    DashboardComponent,
    ...components]
})
export class DashboardModule { }
