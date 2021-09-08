import { Injectable } from '@angular/core';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Observable, Subject } from 'rxjs';
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
    if (!this.ipfs) {
      await this.init();
    }
    this.ipfs.cat(cid);
    const content: Uint8Array[] = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      content.push(chunk);
    }
    return content;
  }

  /**
   * Add file into local ipfs node
   * @param ipfs ipfs instance
   * @param fileContent can be any of the following types: ` Uint8Array | Blob | String | Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>`
   */
  async addFile(fileContent: any) {

    if (!this.ipfs) {
      await this.init();
    }
    // Add file to ipfs
    const cid = await this.ipfs.add(fileContent, {
      progress: (prog: any) => { },
    });

    // Get file status from ipfs
    const fileStat = await this.ipfs.files.stat("/ipfs/" + cid.path);

    return <IFileInfo>{
      cid: cid.path,
      size: fileStat.cumulativeSize,
      mimetype: fileContent.type,
      name: fileContent.name
    };
  }


  async placeStorageOrderViaDapp(account: IDappAccount, fileInfos: IFileInfo) {

    // if (!this.api) {
    //   await this.init();
    // }

    // await this.api.isReadyOrError;
    // const transferExtrinsic = this.api.tx.market.placeStorageOrder(fileInfos.cid, fileInfos.size, null);
    // const injector = await web3FromSource(account.meta.source);
    // return transferExtrinsic.signAndSend(account.address, { signer: injector.signer });
    return { isInBlock: true, asInBlock: 4 };

  }
}
