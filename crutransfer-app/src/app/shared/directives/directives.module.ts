import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';

const directives = [
  ClickOutsideDirective
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ...directives
  ],
  exports: [...directives]
})
export class DirectivesModule { }
