import { Injectable } from '@angular/core';
import { ApiPromise } from '@polkadot/api';
import { Observable, Subject } from 'rxjs';
import { IMessageInfo } from '../models';

const importedIPFS = require('ipfs-core');

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


}
