import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@cru-transfer/shared';
import { TranslateModule } from '@ngx-translate/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TagInputModule } from 'ngx-chips';
import { DropzoneConfigInterface, DropzoneModule, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { ColorSwitcherComponent, CruTagInputComponent, ModalUploadFileComponent, ModalVerifySenderComponent } from './components';
import { HomeComponent } from './home.component';

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
    TagInputModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeComponent,
    ModalUploadFileComponent,
    ModalVerifySenderComponent,
    CruTagInputComponent, ColorSwitcherComponent],
  providers: [
    BsModalService,
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})
export class HomeModule { }
