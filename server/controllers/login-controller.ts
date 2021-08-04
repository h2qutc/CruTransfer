import express from "express";
import { AuthConfig } from "../config";
import { runAsyncWrapper, sendError, sendOk } from "../helpers";
import { checkDuplicateUsernameOrEmail } from "../middlewares";
import { IUser, User } from "../models";
import { EmailService } from "../services";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

export class LoginController {

	public router = express.Router();

	constructor() {
		this.initRoutes();
	}

	private initRoutes() {
		this.router.route('/signup').post([checkDuplicateUsernameOrEmail], this.signup);
		this.router.route('/signin').post(this.signin);
		this.router.route('/forgotPassword').post(this.forgotPassword);
		this.router.route('/resetPassword').post(this.resetPassword);
	}

	public signup = (req: express.Request, res: express.Response) => {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8)
		});

		user.save((err: any, user: any) => {
			if (err) {
				res.status(500).send({ error: true, message: err });
				return;
			}

			res.send({ message: "User was registered successfully!" });

		});
	};

	public signin = (req: express.Request, res: express.Response) => {
		User.findOne({
			email: req.body.email
		})
			.exec((err: any, user: any) => {
				if (err) {
					res.status(500).send({ error: true, message: err });
					return;
				}

				if (!user) {
					return res.status(404).send({ error: true, message: "User Not found." });
				}

				const passwordIsValid = bcrypt.compareSync(
					req.body.password,
					user.password
				);

				if (!passwordIsValid) {
					return res.status(401).send({
						error: true,
						accessToken: null,
						message: "Invalid Password!"
					});
				}

				const token = jwt.sign({ id: user.id }, AuthConfig.secret, {
					expiresIn: 86400 // 24 hours
				});

				res.status(200).json({
					payload: {
						id: user._id,
						username: user.username,
						email: user.email,
						accessToken: token
					}
				});
			});
	};

	public forgotPassword = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const user = await User.findOne({
			email: req.body.email
		});

		if (user == null) {
			sendError(res, 404, 'Email not found');
		} else {
			user.code = "1102";
			await user.save();
			await this.sendEmailForgotPassword(user);
			sendOk(res, true, 'Code was sent');
		}
	});

	public resetPassword = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

		const user = await User.findOne({
			email: req.body.email,
			code: req.body.code
		});

		if (user == null) {
			sendError(res, 404, 'Code is invalid');
		} else {
			user.password = bcrypt.hashSync(req.body.password, 8);
			await user.save();
			sendOk(res, true, 'Password is updated');
		}
	});

	private sendEmailForgotPassword = async (user: IUser) => {
		const emailService = EmailService.getInstance();
		const data = {
			code: user.code,
			recipients: [user.email]
		};
		const subject = `CruTransfer - Your code is ${user.code}`;
		await emailService.sendEmailToRecipients(subject, data);
	}
}
