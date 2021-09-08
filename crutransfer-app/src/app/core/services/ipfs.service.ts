import { Injectable } from '@angular/core';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { KeyringPair } from '@polkadot/keyring/types';
import { from, Observable, Subject } from 'rxjs';
import { IDappAccount, IFileInfo, IMessageInfo } from '../models';

const importedIPFS = require('ipfs-core');

// WS address of Crust chain
// const chain_ws_url = "ws://127.0.0.1:8081";
const chain_ws_url = "wss://api.decloudf.com/";
const wsProvider = new WsProvider(chain_ws_url);

@Injectable()
export class IpfsService {

  api: ApiPromise;
  ipfs: any;
  krp: any;

  private _progressSubject: Subject<any> = new Subject<any>();
  progress$: Observable<IMessageInfo> = this._progressSubject.asObservable();

  constructor() { }

  async init() {
    if (this.ipfs) {
      return;
    }
    this.api = await ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });
    this.ipfs = await importedIPFS.create();
  }


  async loadFile(cid: string): Promise<Uint8Array[]> {
    this.ipfs.cat(cid);
    const content: Uint8Array[] = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      content.push(chunk);
    }
    return content;
  }

  async placeStorageOrderViaDapp(account: IDappAccount, cid: string, filesize: number) {

    if (!this.api) {
      await this.init();
    }

    await this.api.isReadyOrError;

    const transferExtrinsic = this.api.tx.market.placeStorageOrder(cid, filesize, null);

    const injector = await web3FromSource(account.meta.source);

    return transferExtrinsic.signAndSend(account.address, { signer: injector.signer });

  }
}
