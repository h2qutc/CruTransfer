import { Injectable } from '@angular/core';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Observable, Subject } from 'rxjs';
import { IFileInfo, IMessageInfo } from '../models';
import { delay, loadKeyringPair } from './utils';

const importedIPFS = require('ipfs-core');

// WS address of Crust chain
// const chain_ws_url = "ws://127.0.0.1:9933";
const chain_ws_url = "wss://api.decloudf.com/";
const wsProvider = new WsProvider(chain_ws_url);

// Seeds of account
const seeds = "dad argue unknown alpha audit vault thing amount beauty matter breeze tragic";

// const seeds = 'body pencil basic thunder liquid quiz retreat visual uncle crash file cinnamon';

const kr = new Keyring({
  type: 'sr25519',
});


@Injectable()
export class IpfsService {

  api: ApiPromise;
  ipfs: any;
  krp: any;

  private _progressSubject: Subject<any> = new Subject<any>();
  progress$: Observable<IMessageInfo> = this._progressSubject.asObservable();

  constructor() { }

  async init() {
    if (this.api) {
      return;
    }
    this.api = await ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });
    this.ipfs = await importedIPFS.create();
  }

  async addFileToIpfsAndSendTx(fileContent: File): Promise<IFileInfo> {

    /***************************Base instance****************************/
    if (!this.api) {
      await this.init();
    }

    const fileInfo: IFileInfo = await this.addFile(this.ipfs, fileContent);
    this.syncAndPlaceOrder(fileInfo);
    return fileInfo;


  }

  async syncAndPlaceOrder(fileInfo: IFileInfo) {

    // Load on-chain identity
    const krp = loadKeyringPair(seeds);
    // Waiting for chain synchronization
    while (await this.isSyncing(this.api)) {
      console.info(
        `⛓  Chain is synchronizing, current block number ${(
          await this.api.rpc.chain.getHeader()
        ).number.toNumber()}`
      );
      await delay(6000);
    }

    // Send storage order transaction
    const poRes = await this.placeOrder(this.api, krp, fileInfo.cid, fileInfo.size, 0)
    if (!poRes) {
      // console.error("Place storage order failed", poRes);
      // this.notify(<IMessageInfo>{ hasError: true, message: 'Place storage order failed' });
      return null;
    }
    else {
      // console.info("Place storage order success");
      // this.notify(<IMessageInfo>{ hasError: false, message: 'Place storage order success' });
      return fileInfo;
    }

    // Check file status on chain
    // while (true) {
    //   const orderState = await this.getOrderState(this.api, fileInfo.cid);
    //   console.info("Order status: " + JSON.stringify(orderState));
    //   await delay(10000);
    // }
  }

  /**
   * Place stroage order
   * @param api chain instance
   * @param fileCID the cid of file
   * @param fileSize the size of file in ipfs
   * @param tip tip for this order
   * @return true/false
   */
  async placeOrder(api: ApiPromise, krp: any, fileCID: string, fileSize: number, tip: number) {
    // Determine whether to connect to the chain
    await api.isReadyOrError;
    // Generate transaction
    const pso = api.tx.market.placeStorageOrder(fileCID, fileSize, tip);
    // Send transaction
    const txRes = await this.sendTx(krp, pso);

    return JSON.parse(JSON.stringify(txRes));
  }

  /**
   * Add file into local ipfs node
   * @param ipfs ipfs instance
   * @param fileContent can be any of the following types: ` Uint8Array | Blob | String | Iterable<Uint8Array> | Iterable<number> | AsyncIterable<Uint8Array> | ReadableStream<Uint8Array>`
   */
  async addFile(ipfs: any, fileContent: any) {
    // Add file to ipfs
    const cid = await ipfs.add(
      fileContent,
      {
        progress: (prog) => { }
      }
    );

    // Get file status from ipfs
    const fileStat = await ipfs.files.stat("/ipfs/" + cid.path);

    return <IFileInfo>{
      cid: cid.path,
      size: fileStat.cumulativeSize
    };
  }

  /**
   * Get on-chain order information about files
   * @param api chain instance
   * @param cid the cid of file
   * @return order state
   */
  async getOrderState(api: ApiPromise, cid: string) {
    await api.isReadyOrError;
    return await api.query.market.files(cid);
  }

  /**
    * Used to determine whether the chain is synchronizing
    * @param api chain instance
    * @returns true/false
    */
  async isSyncing(api: ApiPromise) {
    const health = await api.rpc.system.health();
    let res = health.isSyncing.isTrue;

    if (!res) {
      const h_before = await api.rpc.chain.getHeader();
      await delay(3000);
      const h_after = await api.rpc.chain.getHeader();
      if (h_before.number.toNumber() + 1 < h_after.number.toNumber()) {
        res = true;
      }
    }

    return res;
  }


  /**
   * Send tx to crust network
   * @param krp On-chain identity
   * @param tx substrate-style tx
   * @returns tx already been sent
   */
  async sendTx(krp: KeyringPair, tx: SubmittableExtrinsic) {
    return new Promise((resolve, reject) => {
      tx.signAndSend(krp, ({ events = [], status }) => {
        let message = `Transaction status: ${status.type}`;
        this.notify(<IMessageInfo>{ isFinalized: status.isFinalized, hasError: false, message: message });

        if (
          status.isInvalid ||
          status.isDropped ||
          status.isUsurped ||
          status.isRetracted
        ) {
          reject(<IMessageInfo>{ hasError: true, message: 'Invalid transaction.' })
        } else {
          // Pass it
        }

        if (status.isInBlock) {
          events.forEach(({ event: { method, section } }) => {
            if (section === 'system' && method === 'ExtrinsicFailed') {
              message = `❌ [tx]: Send transaction(${tx.type}) failed.`;
              resolve(<IMessageInfo>{ hasError: true, message: message });

            } else if (method === 'ExtrinsicSuccess') {
              message = `✅ [tx]: Send transaction(${tx.type}) success.`;
              resolve(<IMessageInfo>{ hasError: false, message: message });
            }
          });
        } else {
          // Pass it
        }
      }).catch(e => {
        reject(<IMessageInfo>{ hasError: true, message: e });
      });
    });
  }

  async loadFile(cid: string): Promise<Uint8Array[]> {
    if (!this.api) {
      await this.init();
    }
    this.ipfs.cat(cid);
    const content: Uint8Array[] = [];
    for await (const chunk of this.ipfs.cat(cid)) {
      content.push(chunk);
    }
    return content;
  }

  private notify(infos: any) {
    this._progressSubject.next(infos);
  }


}
