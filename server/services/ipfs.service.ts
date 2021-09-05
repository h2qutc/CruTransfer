import { typesBundleForPolkadot } from "@crustio/type-definitions";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/promise/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { globSource } from "ipfs-http-client";
import { IFileInfo, IMessageInfo } from "../models";
import logger from "./log";
import { delay, loadKeyringPair } from "./utils";
const fs = require("fs");
var filesize = require("file-size");

const ipfsClient = require("ipfs-http-client");

// WS address of Crust chain
// const chain_ws_url = "ws://127.0.0.1:8081";
const chain_ws_url = "wss://api.decloudf.com/";
const wsProvider = new WsProvider(chain_ws_url);

// Seeds of account
const Dev_Seeds =
  "dad argue unknown alpha audit vault thing amount beauty matter breeze tragic";

export class IpfsService {
  api: ApiPromise;
  ipfs: any;
  krp: any;

  seeds: string;

  private static instance: IpfsService;

  public static getInstance(): IpfsService {
    if (!IpfsService.instance) {
      IpfsService.instance = new IpfsService();
    }
    return IpfsService.instance;
  }

  constructor() {
    this.seeds = process.env.CRUST_SEEDS || Dev_Seeds;
  }

  async init() {
    if (this.ipfs) {
      return;
    }
    logger.info("init ipfs service");

    this.api = await ApiPromise.create({
      provider: wsProvider,
      typesBundle: typesBundleForPolkadot,
    });
    // this.ipfs = await ipfsCore.create();
    this.ipfs = await ipfsClient.create();
  }

  async addFileToIpfsAndSendTx(fileContent: any): Promise<IFileInfo> {
    /***************************Base instance****************************/
    if (!this.ipfs) {
      await this.init();
    }

    const fileInfo: IFileInfo = await this.addFile(fileContent);
    return fileInfo;
  }

  async syncAndPlaceOrder(fileInfo: IFileInfo) {
    // Load on-chain identity
    const krp = loadKeyringPair(this.seeds);
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
    const poRes = await this.placeOrder(
      this.api,
      krp,
      fileInfo.cid,
      fileInfo.size,
      0
    );
    if (!poRes) {
      return null;
    } else {
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
  async placeOrder(
    api: ApiPromise,
    krp: any,
    fileCID: string,
    fileSize: number,
    tip: number
  ) {
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
  async addFile(fileContent: any) {
    // Add file to ipfs
    const cid = await this.ipfs.add(fileContent, {
      progress: (prog: any) => {},
    });

    // Get file status from ipfs
    const fileStat = await this.ipfs.files.stat("/ipfs/" + cid.path);

    return <IFileInfo>{
      cid: cid.path,
      size: fileStat.cumulativeSize,
    };
  }

  /**
   * Pin file to path
   * @param path
   * @returns
   */
  async pinFile(path: string): Promise<IFileInfo> {
    if (!this.api) {
      await this.init();
    }

    if (!fs.existsSync(path)) {
      logger.error(`Path not found: ${path}`);
      throw new Error(`Path not found: ${path}`);
    }

    const { cid } = await this.ipfs.add(globSource(path, { recursive: true }));

    if (!cid) {
      logger.error(`Pinned error: ${path}`);
      return null;
    }

    if (cid) {
      const fileStat = await this.ipfs.files.stat("/ipfs/" + cid.toString());
      return <IFileInfo>{
        cid: cid.toString(),
        size: fileStat.cumulativeSize,
        humanSize: filesize(fileStat.cumulativeSize, { fixed: 1 }).human("si"),
      };
    }
  }

  /**
   * Pin files to CRUST
   * @param cid
   */
  async publish(cid: string): Promise<IFileInfo> {
    const isPinnedInLocal = await this.checkPinnedInLocal(cid);
    if (!isPinnedInLocal) {
      logger.error(`CID ${cid} is not pinned in local`);
    } else {
      const fileStat = await this.ipfs.object.stat(cid);
      const fileSize = fileStat.CumulativeSize;
      return await this.syncAndPlaceOrder(<IFileInfo>{
        cid: cid,
        size: fileSize,
      });
    }
  }

  async checkPinnedInLocal(cid: string): Promise<boolean> {
    let found = false;
    for await (const pinned of this.ipfs.pin.ls({
      paths: cid,
      types: "recursive",
    })) {
      if (cid == pinned.cid.toString()) {
        found = true;
        break;
      }
    }
    return found;
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

        if (
          status.isInvalid ||
          status.isDropped ||
          status.isUsurped ||
          status.isRetracted
        ) {
          reject(<IMessageInfo>{
            hasError: true,
            message: "Invalid transaction.",
          });
        } else {
          // Pass it
        }

        if (status.isInBlock) {
          events.forEach(({ event: { method, section } }) => {
            if (section === "system" && method === "ExtrinsicFailed") {
              message = `❌ [tx]: Send transaction(${tx.type}) failed.`;
              resolve(<IMessageInfo>{ hasError: true, message: message });
            } else if (method === "ExtrinsicSuccess") {
              message = `✅ [tx]: Send transaction(${tx.type}) success.`;
              resolve(<IMessageInfo>{ hasError: false, message: message });
            }
          });
        } else {
          // Pass it
        }
      }).catch((e) => {
        reject(<IMessageInfo>{ hasError: true, message: e });
      });
    });
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
