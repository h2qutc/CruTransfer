import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ApiService, IpfsService } from './services';

const services = [
  ApiService,
  IpfsService
];
const guards = [];
const interceptors = [];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...services,
        ...interceptors,
        ...guards
      ]
    };
  }
}