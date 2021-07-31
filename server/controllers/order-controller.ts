import express from "express";
import { BaseUrlFront, DAYS_BEFORE_EXPIRED } from "../config";
import { addDays, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { IOrder, MailOrderData, Order } from "../models";
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

		//TOREMOVE
		this.router.route('/email').get(this.sendEmail);
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

		const fileInfos = req.body.fileInfos;
		fileInfos.humanSize = filesize(fileInfos.size, { fixed: 1 }).human('si');
		order.fileInfos = fileInfos;

		order.createdDate = new Date();
		order.expiredDate = addDays(order.createdDate, DAYS_BEFORE_EXPIRED);
		order.totalDownloads = 0;

		let payload = await order.save();
		order.link = `${BaseUrlFront}/download/${payload._id}`;
		payload = await order.save();

		await this.sendEmailToRecipients(order);
		await this.sendEmailToSender(order);

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
		const payload = await Order.deleteOne({ _id: req.params.order_id });
		console.log('oder', req.params.order_id)
		sendOk(res, payload, 'Order deleted');
	})


	sendEmail = async (req: express.Request, res: express.Response) => {

		const order = <any>{ "_id": { "$oid": "6101ccf619763a4c60b08689" }, "recipients": ["hqho@gmail.com"], "createdDate": { "$date": "2021-08-04T21:32:38.960Z" }, "expiredDate": { "$date": "2021-07-28T21:32:02.450Z" }, "sender": "hqho@gmail.com", "password": null, "action": 1, "message": "Feel free to check it out", "fileInfos": { "cid": "QmPD42ToJwAh9Yc69qz5YUvkv73DmR6gi5dzkkpc9EfyhY", "size": 29400, "name": "DemoPDF.pdf", "type": "application/pdf", "humanSize": "29.4 kB" }, "__v": 0, "link": "http://localhost:4205/6101ccf619763a4c60b08689" };

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

