import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ModalUploadFileComponent } from './components';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    DropzoneModule,
    RoundprogressModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent, ModalUploadFileComponent],
  providers: [
    BsModalService
  ]
})
export class HomeModule { }
