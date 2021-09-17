import express from "express";
import { BaseUrlFront, DAYS_BEFORE_EXPIRED } from "../config";
import { addDays, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { verifyToken } from "../middlewares";
import {
  Drive, IOrder,
  MailOrderData,
  Order,
  SendActions
} from "../models";
import { EmailService } from "../services";
const filesize = require("file-size");

export class DriveController {

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route("/drive").get(this.getAll).post(this.create)

    this.router.route('/drive/share').post(this.share);

    this.router
      .route("/drive/:drive_id")
      .get(this.getById)
      .patch(this.update)
      .put(this.update)
      .delete(this.delete);

    this.router.route("/drive/getDriveByUser").post([verifyToken], this.getDriveByUser);
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
      const page = req.body.page;
      const limit = req.body.limit;

      const payload = await Drive.find({ ownerEmail: email }).limit(limit)
        .skip(limit * (page - 1))
        .sort( { createdDate: -1 });
      const count = await Drive.find({ ownerEmail: email }).countDocuments();
      res.status(200).send({
        docs: payload,
        page: page,
        pages:  Math.ceil(count / limit),
        total: count
      });
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

  share = runAsyncWrapper(
    async (req: express.Request, res: express.Response) => {

      const body = req.body;

      if (!body.sender || body.recipients.length == 0) {
        sendError(res, 400, "Bad request");
      }

      const order = new Order();
      order.fileInfos = body.drive.fileInfos;

      order.sender = body.sender;
      order.password = body.password;
      order.action = body.action;
      order.message = body.message;
      order.recipients = body.recipients;
      order.isAnonymous = body.isAnonymous;
      order.isVip = true;

      order.createdDate = new Date();
      order.expiredDate = addDays(order.createdDate, DAYS_BEFORE_EXPIRED);
      order.totalDownloads = 0;

      let payload = await order.save();
      order.link = `${BaseUrlFront}/#/download/${payload._id}`;
      payload = await order.save();

      sendOk(res, payload);

      if (order.action == SendActions.SendEmail) {
        await this.sendEmailToRecipients(order);
        await this.sendEmailToSender(order);
      }

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

}
