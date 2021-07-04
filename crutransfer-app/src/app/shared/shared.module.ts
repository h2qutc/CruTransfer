import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StateButtonModule } from './components';

const modules = [
  StateButtonModule,
]

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  exports: [...modules]
})
export class SharedModule { }
