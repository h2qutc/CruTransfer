import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { RoundprogressModule } from 'angular-svg-round-progressbar';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ClipboardModule } from 'ngx-clipboard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { LayoutContainersModule } from './layout';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutContainersModule,
    RoundprogressModule,
    PopoverModule.forRoot(),
    TranslateModule.forRoot(),
    CoreModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
