import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { ListFilesDriveComponent, ModalUploadDriveComponent } from './components';
import { CardDriveComponent } from './components/card-drive/card-drive.component';
import { ModalShareDriveComponent } from './components/modal-share-drive/modal-share-drive.component';
import { DriveComponent } from './drive.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFiles: 1,
  url: 'https://httpbin.org/post',
  thumbnailWidth: 160,
  maxFilesize: 2000, // 2Go
  previewTemplate: `<div class="dz-preview dz-file-preview mb-3">
  <div class="d-flex flex-row "><div class="p-0 w-30 position-relative">
  <div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark">
  <span><i></i></span></div><div class="preview-container">
  <img data-dz-thumbnail class="img-thumbnail border-0" />
  <i class="simple-icon-doc preview-icon" ></i></div>
  </div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span>
  </div><div class="text-primary text-extra-small" data-dz-size />
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
  </div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>`
};

const routes: Routes = [
  {
    path: '',
    component: DriveComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DropzoneModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DriveComponent,
    ListFilesDriveComponent,
    CardDriveComponent,
    ModalUploadDriveComponent,
    ModalShareDriveComponent
  ],
  providers: [
    BsModalService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class DriveModule { }
