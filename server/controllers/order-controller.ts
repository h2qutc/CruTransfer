import express from "express";
import { BaseUrlFront, DAYS_BEFORE_EXPIRED, LIMIT_SIZE_BLOCK } from "../config";
import { addDays, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { verifyToken } from "../middlewares";
import {
  IBlock,
  IFileInfo,
  IOrder,
  MailOrderData,
  Order,
  SendActions,
  User,
} from "../models";
import { BlockService, EmailService, IpfsService } from "../services";
import logger from "../services/log";

export class OrderController {
  private blockService = BlockService.getInstance();
  private ipfsService = IpfsService.getInstance();

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/orders").get(this.getAll).post(this.create);

    this.router
      .route("/orders/:order_id")
      .get(this.getById)
      .patch(this.update)
      .put(this.update)
      .delete(this.delete);

    this.router.route("/orders/getOrdersByUser").post([verifyToken], this.getOrdersByUser);
    this.router
      .route("/orders/updateTotalDownloadForOrder/:order_id")
      .put(this.updateTotalDownloadForOrder);
  }

  getAll = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Order.find({});
      sendOk(res, payload);
    }
  );

  getOrdersByUser = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const email = req.body.email;
      const page = req.body.page;
      const limit = req.body.limit;

      const payload = await Order.find({ sender: email }).limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdDate: -1 });
      const count = await Order.find({ sender: email }).countDocuments();
      res.status(200).send({
        docs: payload,
        page: page,
        pages: Math.ceil(count / limit),
        total: count
      });
    }
  );

  create = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const body = JSON.parse(req.body.payload);

      if (body.action == SendActions.SendEmail) {
        if (!body.sender || body.recipients.length == 0) {
          sendError(res, 400, "Bad request");
        }
      }

      logger.info("begin pin file");
      const fileInfos = await this.pinFile((<any>req).files.files);
      logger.info("pin file ok", fileInfos);


      if (!fileInfos) {
        sendError("Unable to pin files");
      }

      const order = new Order();
      order.fileInfos = fileInfos;

      order.sender = body.sender;
      order.password = body.password;
      order.action = body.action;
      order.message = body.message;
      order.recipients = body.recipients;
      order.isAnonymous = body.isAnonymous;

      order.createdDate = new Date();
      order.expiredDate = addDays(order.createdDate, DAYS_BEFORE_EXPIRED);
      order.totalDownloads = 0;

      let payload = await order.save();
      order.link = `${BaseUrlFront}/#/download/${payload._id}`;
      payload = await order.save();

      logger.info("order saved OK", fileInfos);

      sendOk(res, payload);

      if (order.action == SendActions.SendEmail) {

        if (!order.isAnonymous) {
          const loggedUser = await User.findOne({ email: order.sender });
          if (loggedUser) {
            loggedUser.totalSize += order.fileInfos.size;
            await loggedUser.save();
          }
        }

        await this.sendEmailToRecipients(order);
        await this.sendEmailToSender(order);
      }
    }
  );

  getById = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Order.findById(req.params.order_id);
      if (!payload) {
        sendError(res, 404, "Order not found");
      }
      res.send(payload);
    }
  );

  update = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const order = await Order.findById(req.params.order_id);

      if (order == null) {
        sendError(res, 404, "Order not found");
      }

      if (order != null) {
        order.sender = req.body.sender;
        order.fileInfos = req.body.fileInfos;
        order.password = req.body.password;
        order.action = req.body.action;
        order.message = req.body.message;
        order.recipients = req.body.recipients;

        const saved = await order.save();
        sendOk(res, saved, "Order updated");
      }
    }
  );

  updateTotalDownloadForOrder = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const order = await Order.findById(req.params.order_id);
      if (order == null) {
        sendError(res, 400, "Order not found");
      }
      if (order != null) {
        order.totalDownloads++;
        await order.save();
        if (order.action == SendActions.SendEmail) {
          await this.sendEmailToSenderOnceDownloaded(order);
        }
        res.send(true);
      }
    }
  );

  delete = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {
      const payload = await Order.deleteOne({ _id: req.params.order_id });
      sendOk(res, payload, "Order deleted");
    }
  );

  private sendEmailToRecipients = async (order: IOrder) => {
    const emailService = EmailService.getInstance();
    const data = new MailOrderData(order);
    const subject = `${data.sender} sent you some files via CruTransfer`;
    await emailService.sendEmailToRecipients(subject, data);
  };

  private sendEmailToSender = async (order: IOrder) => {
    const emailService = EmailService.getInstance();
    const data = new MailOrderData(order);
    data.recipients = [order.sender];
    const subject = `Your files were sent successfully`;
    await emailService.sendEmailToSender(subject, data);
  };

  private sendEmailToSenderOnceDownloaded = async (order: IOrder) => {
    const emailService = EmailService.getInstance();
    const data = new MailOrderData(order);
    data.recipients = [order.sender];
    const subject = `Your files were downloaded successfully`;
    await emailService.sendEmailToSenderOnceDownloaded(subject, data);
  };

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

    logger.info('Begin pinBlockToCrust', block);

    const pathBlockToPin = this.blockService.factoryPathToPin(block);

    logger.info('pathBlockToPin', pathBlockToPin);

    const infos = await this.ipfsService.pinFile(pathBlockToPin);

    logger.info('pinFile result', infos);

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
