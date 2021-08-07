import express from "express";
import { AuthConfig, BaseUrlFront } from "../config";
import { generateOTP, runAsyncWrapper, sendError, sendOk } from "../helpers";
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
		this.router.route('/changePassword').post(this.changePassword);
		this.router.route('/activateAccount').post(this.activateAccount);
	}

	public signup = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8),
			isActive: false,
			codeActivation: generateOTP(6)
		});

		console.log('sign up', user);

		await user.save();

		await this.sendEmailActivateAccount(user);

		res.send({ message: "User was registered successfully!" });
	});

	public signin = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const user = await User.findOne({
			email: req.body.email
		})


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

	public forgotPassword = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
		const user = await User.findOne({
			email: req.body.email
		});

		if (user == null) {
			sendError(res, 404, 'Email not found');
		} else {
			user.codeResetPassword = generateOTP();
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

		if (!req.body.email) {
			sendError(res, 404, 'Email is invalid');
		}

		if (user == null) {
			sendError(res, 404, 'Code is invalid');
		} else {
			user.password = bcrypt.hashSync(req.body.password, 8);
			await user.save();
			sendOk(res, true, 'Password is updated');
		}
	});

	public activateAccount = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

		const user = await User.findOne({
			_id: req.body.id,
			codeActivation: req.body.code
		});

		if (user == null) {
			sendError(res, 404, 'Code is invalid');
		} else {
			user.isActive = true;
			user.codeActivation = '';
			await user.save();
			sendOk(res, true, 'User is activated');
		}
	});

	public changePassword = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

		const newPassword = req.body.newPassword;
		const confirmPassword = req.body.confirmPassword;

		if (newPassword != confirmPassword) {
			sendError(res, 404, 'The passwords must match.');
		}

		const user = await User.findOne({
			email: req.body.email,
		});

		if (user == null) {
			sendError(res, 404, 'User not found');
		} else {
			user.password = bcrypt.hashSync(req.body.newPassword, 8);
			await user.save();
			sendOk(res, true, 'Password is updated');
		}
	});

	private sendEmailForgotPassword = async (user: IUser) => {
		const emailService = EmailService.getInstance();
		const data = {
			code: user.codeResetPassword,
			recipients: [user.email]
		};
		const subject = `CruTransfer - Your code is ${user.codeResetPassword}`;
		await emailService.sendEmailForgotPassword(subject, data);
	}

	private sendEmailActivateAccount = async (user: IUser) => {
		const emailService = EmailService.getInstance();
		const link = `${BaseUrlFront}/verify-account/${user._id}/activate/${user.codeActivation}`;
		console.log('link active', link);
		const data = {
			link: link,
			recipients: [user.email]
		};
		const subject = `CruTransfer - Confirm your account`;
		await emailService.sendEmailActivateAccount(subject, data);
	}
}
