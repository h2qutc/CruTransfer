import { Injectable } from '@angular/core';
import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, Keyring, WsProvider } from '@polkadot/api';
import { IFileInfo } from '../models';
import { delay, loadKeyringPair, sendTx } from './utils';
const IPFS = require('ipfs-core');

// WS address of Crust chain
// const chain_ws_url = "ws://127.0.0.1:9933";
const chain_ws_url = "wss://api.decloudf.com/";
const wsProvider = new WsProvider(chain_ws_url);

// Seeds of account
const seeds = "dad argue unknown alpha audit vault thing amount beauty matter breeze tragic";

const kr = new Keyring({
  type: 'sr25519',
});


@Injectable()
export class IpfsService {

  api: ApiPromise;
  ipfs: any;
  krp: any;

  constructor() { }

  async init() {
    // Connect to chain
    this.api = await ApiPromise.create({ provider: wsProvider, typesBundle: typesBundleForPolkadot });
    this.ipfs = await IPFS.create();

    // krp will be used in sending transaction
    // const krp = kr.addFromUri(seeds);
  }

  async addFileToIpfsAndSendTx(fileContent: File): Promise<IFileInfo> {

    /***************************Base instance****************************/
    // Read file
    // const fileContent = await fs.readFileSync(filePath);

    // api = await api.isReady;

    // Load on-chain identity
    const krp = loadKeyringPair(seeds);

    const fileInfo: IFileInfo = await this.addFile(this.ipfs, fileContent)
    console.info("File info: " + JSON.stringify(fileInfo));

    // Waiting for chain synchronization
    while (await this.isSyncing(this.api)) {
      console.info(
        `⛓  Chain is synchronizing, current block number ${(
          await await this.api.rpc.chain.getHeader()
        ).number.toNumber()}`
      );
      await delay(6000);
    }

    // Send storage order transaction
    const poRes = await this.placeOrder(this.api, krp, fileInfo.cid, fileInfo.size, 0)
    if (!poRes) {
      console.error("Place storage order failed");
      return;
    }
    else {
      console.info("Place storage order success");
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
    const txRes = JSON.parse(JSON.stringify((await sendTx(krp, pso))));
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
        progress: (prog) => console.log(`Add received: ${prog}`)
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

  async loadFile(cid: string) {
    await this.ipfs.get(cid);
  }


}
