import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TagInputModule } from 'ngx-chips';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule, TokenInterceptor } from './core';
import { LayoutContainersModule } from './layout';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TagInputModule,
    LayoutContainersModule,
    RoundprogressModule,
    PopoverModule.forRoot(),
    TranslateModule.forRoot(),
    PaginationModule.forRoot(),
    CoreModule.forRoot(),
    SimpleNotificationsModule.forRoot({
      timeOut: 2000,
      showProgressBar: false
    }),
    ClipboardModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
