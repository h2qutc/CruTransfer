import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadComponent } from './download.component';

const routes: Routes = [
  {
    path: '',
    component: DownloadComponent
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DownloadComponent]
})
export class DownloadModule { }
