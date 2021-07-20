import express from "express";
import { Order } from "../models";
import { EmailService } from "../services";

const sendError = (res: any, message: any) => {
	res.status(500, {
		error: true,
		message: message
	})
}

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


	getAll = (req: express.Request, res: express.Response) => {
		Order.find({}, (err: any, orders: any) => {
			if (err) {
				sendError(res, err);
			}

			res.status(200).json({
				payload: orders
			})
		})
	}


	create = (req: express.Request, res: express.Response) => {
		const order = new Order();
		order.sender = req.body.sender;
		order.fileInfos = req.body.fileInfos;
		order.password = req.body.password;
		order.action = req.body.action;
		order.message = req.body.message;
		order.recipients = req.body.recipients;

		order.save((err) => {
			if (err) {
				sendError(res, err);
			}

			res.status(200).json({
				message: 'New order created',
				payload: order
			})
		})
	}


	getById = (req: express.Request, res: express.Response) => {
		Order.findById(req.params.order_id, (err: any, order: any) => {
			if (err) res.send(err);
			res.json({
				message: `Order loaded`,
				payload: order
			})
		})
	}


	update = (req: express.Request, res: express.Response) => {
		Order.findById(req.params.order_id, (err: any, order: any) => {
			if (err) res.send(err);

			order.sender = req.body.sender;
			order.fileInfos = req.body.fileInfos;
			order.password = req.body.password;
			order.action = req.body.action;
			order.message = req.body.message;
			order.recipients = req.body.recipients;

			order.save((err: any) => {
				if (err) {
					sendError(res, err);
				}
				res.json({
					message: 'Order updated',
					payload: order
				})
			})
		})
	}


	delete = (req: express.Request, res: express.Response) => {
		Order.remove({
			id: req.params.order_id
		}, (err: any) => {
			if (err) {
				sendError(res, err);
			}
			res.json({
				message: 'Order deleted'
			})
		})
	}


	sendEmail = (req: express.Request, res: express.Response) => {
		const emailService = new EmailService();
		emailService.sendMail('recipient@gmail.com', 'demo email', 'content email');
		res.json({
			message: 'Email sent'
		})
	}
}
