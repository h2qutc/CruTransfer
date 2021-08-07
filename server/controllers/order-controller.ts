import express from "express";
import { BaseUrlFront, DAYS_BEFORE_EXPIRED } from "../config";
import { addDays, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { IOrder, MailOrderData, Order, SendActions } from "../models";
import { EmailService } from "../services";

var filesize = require('file-size');

export class OrderController {

	public router = express.Router();

	constructor() {
		this.initRoutes();
	}

	private initRoutes() {
		this.router.route('/orders')
			.get(this.getAll)
			.post(this.create);

		this.router.route('/orders/:order_id')
			.get(this.getById)
			.patch(this.update)
			.put(this.update)
			.delete(this.delete);

		this.router.route('/orders/getOrdersByUser').post(this.getOrdersByUser);
		this.router.route('/orders/updateTotalDownloadForOrder/:order_id').put(this.updateTotalDownloadForOrder);

	}


	getAll = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.find({});
		sendOk(res, payload);
	})

	getOrdersByUser = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const email = req.body.email;
		const payload = await Order.find({ sender: email });
		res.status(200).send(payload);
	})


	create = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

		const order = new Order();
		order.sender = req.body.sender;
		order.password = req.body.password;
		order.action = req.body.action;
		order.message = req.body.message;
		order.recipients = req.body.recipients;
		order.isAnonymous = req.body.isAnonymous;

		if (order.action == SendActions.SendEmail) {
			if (!order.sender || order.recipients.length == 0) {
				sendError(res, 400, 'Bad request');
			}
		}

		const fileInfos = req.body.fileInfos;
		fileInfos.humanSize = filesize(fileInfos.size, { fixed: 1 }).human('si');
		order.fileInfos = fileInfos;

		order.createdDate = new Date();
		order.expiredDate = addDays(order.createdDate, DAYS_BEFORE_EXPIRED);
		order.totalDownloads = 0;

		let payload = await order.save();
		order.link = `${BaseUrlFront}/download/${payload._id}`;
		payload = await order.save();

		if (order.action == SendActions.SendEmail) {
			await this.sendEmailToRecipients(order);
			await this.sendEmailToSender(order);
		}

		sendOk(res, payload);
	})


	getById = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.findById(req.params.order_id);
		if (!payload) {
			sendError(res, 404, 'Order not found');
		}
		res.send(payload);
	})


	update = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const order = await Order.findById(req.params.order_id);

		if (order == null) {
			sendError(res, 404, 'Order not found');
		}

		if (order != null) {
			order.sender = req.body.sender;
			order.fileInfos = req.body.fileInfos;
			order.password = req.body.password;
			order.action = req.body.action;
			order.message = req.body.message;
			order.recipients = req.body.recipients;

			const saved = await order.save();
			sendOk(res, saved, 'Order updated');
		}

	})

	updateTotalDownloadForOrder = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const order = await Order.findById(req.params.order_id);
		if (order == null) {
			sendError(res, 400, 'Order not found');
		}
		if (order != null) {
			order.totalDownloads++;
			await order.save();
			if (order.action == SendActions.SendEmail) {
				await this.sendEmailToSenderOnceDownloaded(order);
			}
			res.send(true);
		}
	})


	delete = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.deleteOne({ _id: req.params.order_id });
		sendOk(res, payload, 'Order deleted');
	})

	private sendEmailToRecipients = async (order: IOrder) => {
		const emailService = EmailService.getInstance();
		const data = new MailOrderData(order);
		const subject = `${data.sender} sent you some files via CruTransfer`;
		const payload = await emailService.sendEmailToRecipients(subject, data);
	}

	private sendEmailToSender = async (order: IOrder) => {
		const emailService = EmailService.getInstance();
		const data = new MailOrderData(order);
		const subject = `Your files were sent successfully`;
		const payload = await emailService.sendEmailToSender(subject, data);
	}

	private sendEmailToSenderOnceDownloaded = async (order: IOrder) => {
		const emailService = EmailService.getInstance();
		const data = new MailOrderData(order);
		const subject = `Your files were sent successfully`;
		const payload = await emailService.sendEmailToSenderOnceDownloaded(subject, data);
	}


}

