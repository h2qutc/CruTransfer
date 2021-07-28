import express from "express";
import { DAYS_BEFORE_EXPIRED } from "../config";
import { addDays, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { IOrder, MailOrderData, Order } from "../models";
import { EmailService } from "../services";

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

		//TOREMOVE
		this.router.route('/email').get(this.sendEmail);
	}


	getAll = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.find({});
		sendOk(res, payload);
	})


	create = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

		const order = new Order();
		order.sender = req.body.sender;
		order.fileInfos = req.body.fileInfos;
		order.password = req.body.password;
		order.action = req.body.action;
		order.message = req.body.message;
		order.recipients = req.body.recipients;

		order.createdDate = new Date();
		order.createdDate = addDays(order.createdDate, DAYS_BEFORE_EXPIRED);

		const payload = await order.save();
		sendOk(res, payload);
	})


	getById = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.findById(req.params.order_id);
		if (!payload) {
			sendError(res, 404, 'Order not found');
		}
		sendOk(res, payload, 'Order found');
	})


	update = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const order = await Order.findById(req.params.order_id);

		if (order == null) {
			sendError(res, 400, 'Order not found');
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


	delete = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const payload = await Order.deleteOne({ id: req.params.order_id });
		sendOk(res, payload, 'Order deleted');
	})


	sendEmail = async (req: express.Request, res: express.Response) => {

		const order = <any>{ "_id": { "$oid": "60ff40e2979c4247f8a42821" }, "recipients": ["recipient1@gmail.com", "recipient2@outlook.com"], "created": { "$date": "2021-07-26T23:10:26.782Z" }, "sender": "hqho@gmail.com", "fileInfos": { "cid": "QmPD42ToJwAh9Yc69qz5YUvkv73DmR6gi5dzkkpc9EfyhY", "size": 29400, "name": "DemoPDF.pdf", "type": "application/pdf" }, "password": null, "action": 1, "message": "Feel free to check it out", "__v": 0 }

		const payload = await this.sendEmailToRecipients(order);

		res.json({
			message: 'Email sent',
			payload: payload
		})
	}


	private sendEmailToRecipients = async (order: IOrder) => {

		const emailService = EmailService.getInstance();

		const data = new MailOrderData(order);
		const subject = `${data.sender} sent you some files via CruTransfer`;

		const payload = await emailService.sendEmailToRecipients(subject, data);

		console.log('sendEmailToRecipients', payload);

	}

	private sendEmailToSender = async (order: IOrder) => {
		const emailService = EmailService.getInstance();

		const data = new MailOrderData(order);
		const subject = `Your files were sent successfully`;

		const payload = await emailService.sendEmailToSenderOnceDownloaded(subject, data);

		console.log('sendEmailToSender', payload);
	}


}

