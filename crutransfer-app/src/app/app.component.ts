import { Component, OnInit } from '@angular/core';

import { ApiRx, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';

const wsProvider = new WsProvider('wss://api.decloudf.com/');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crutransfer-app';

  api: ApiRx;

  constructor(){

  }

  ngOnInit(){
    ApiRx.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot }).subscribe((api => {
      this.api = api;
    }))

  }
}
