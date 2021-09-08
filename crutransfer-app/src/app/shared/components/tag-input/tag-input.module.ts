import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInputComponent, TagInputModule } from 'ngx-chips';
import { CruTagInputComponent } from './tag-input.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TagInputModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    CruTagInputComponent
  ],
  exports: [
    CruTagInputComponent
  ]
})
export class CruTagInputModule { }
