import { Component, OnInit } from '@angular/core';

import { ApiRx, WsProvider } from '@polkadot/api';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
const IPFS = require('ipfs-core');

const wsProvider = new WsProvider('wss://api.decloudf.com/');


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crutransfer-app';

  api: ApiRx;
  ipfs: any;


  constructor() {

  }

  ngOnInit() {
    ApiRx.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot }).subscribe((api => {
      this.api = api;
      console.log('api', this.api.genesisHash.toHex());
    }));


  }

  async onFileSelected(event) {

    const ipfs = await IPFS.create();

    const fileContent: File = event.target.files[0];

    if (fileContent) {
      console.log('file', fileContent);
      // Add file into ipfs
      const fileInfo = await this.addFile(ipfs, fileContent)
      console.log("File info: " + JSON.stringify(fileInfo));

    }
  }

  async addFile(ipfs: any, fileContent: any) {
    // Add file to ipfs
    const cid = await ipfs.add(
      fileContent,
      {
        progress: (prog) => console.log(`Add received: ${prog}`)
      }
    );

    // Get file status from ipfs
    const fileStat = await ipfs.files.stat("/ipfs/" + cid.path);

    return {
      cid: cid.path,
      size: fileStat.cumulativeSize
    };
  }

}
