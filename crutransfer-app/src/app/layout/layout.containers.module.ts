import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FooterComponent } from './footer/footer.component';
import { TopnavComponent } from './topnav/topnav.component';

@NgModule({
  declarations: [
    TopnavComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    CollapseModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  exports: [
    TopnavComponent,
    FooterComponent
  ]
})
export class LayoutContainersModule { }
