import express from "express";
import { BaseUrlFront, LIMIT_SIZE_BLOCK } from "../config";
import { runAsyncWrapper, sendError, sendOk } from "../helpers";
import {
  Drive, IBlock,
  IFileInfo
} from "../models";
import { BlockService, IpfsService } from "../services";
import logger from "../services/log";
const filesize = require("file-size");

export class DriveController {
  private blockService = BlockService.getInstance();
  private ipfsService = IpfsService.getInstance();

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/drive").get(this.getAll).post(this.create);

    this.router
      .route("/drive/:drive_id")
      .get(this.getById)
      .patch(this.update)
      .put(this.update)
      .delete(this.delete);

    this.router.route("/drive/getDriveByUser").post(this.getDriveByUser);
  }

  getAll = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Drive.find({});
      sendOk(res, payload);
    }
  );

  getDriveByUser = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const email = req.body.email;
      const payload = await Drive.find({ ownerEmail: email });
      res.status(200).send(payload);
    }
  );

  create = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {

      const entry = new Drive();

      const fileInfos = req.body.fileInfos;
      fileInfos.humanSize = filesize(fileInfos.size, { fixed: 1 }).human("si"),

      entry.fileInfos = fileInfos;
      entry.ownerEmail = req.body.ownerEmail;
      entry.ownerId = req.body.ownerId;
      entry.createdDate = new Date();

      let payload = await entry.save();
      entry.link = `${BaseUrlFront}/#/download/${entry._id}`;
      payload = await entry.save();

      sendOk(res, payload);

    }
  );

  getById = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Drive.findById(req.params.drive_id);
      if (!payload) {
        sendError(res, 404, "File not found");
      }
      res.send(payload);
    }
  );

  update = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const entry = await Drive.findById(req.params.drive_id);

      if (entry == null) {
        sendError(res, 404, "Drive not found");
      }

      if (entry != null) {
        const saved = await entry.save();
        sendOk(res, saved, "Drive updated");
      }
    }
  );

  delete = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Drive.deleteOne({ _id: req.params.drive_id });
      sendOk(res, payload, "Drive deleted");
    }
  );

  private pinFile = async (files: any): Promise<IFileInfo> => {
    const { latest, next, isNew, pathToPin } =
      await this.blockService.chooseBlockForFile(files, LIMIT_SIZE_BLOCK);

    // Move files to path before pinning
    await files.mv(pathToPin);
    const fileInfos = await this.ipfsService.pinFile(pathToPin);
    fileInfos.mimetype = files.mimetype;
    fileInfos.encoding = files.encoding;
    fileInfos.name = files.name;

    next.nbFiles++;
    next.totalSize += files.size;
    await this.blockService.update(next);

    if (isNew) {
      const res = await this.pinBlockToCrust(latest);
      if (!res) {
        return null;
      }
    }

    return fileInfos;
  };

  /**
   * Pin block to Crust
   * @param block
   */
  private pinBlockToCrust = async (block: IBlock): Promise<any> => {
    const pathBlockToPin = this.blockService.factoryPathToPin(block);
    const infos = await this.ipfsService.pinFile(pathBlockToPin);

    const res = await this.ipfsService.publish(infos.cid);

    if (res != null) {
      logger.info(`Pin block ${block.publicId} successfully to Crust`);

      block.pinnedDate = new Date();
      block.isPinnedToCrust = true;
      block.cid = infos.cid;

      await this.blockService.update(block);
    } else {
      logger.error(`Failed to pin block ${block.publicId} to Crust`);
    }

    return res;
  };
}
