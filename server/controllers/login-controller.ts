import express from "express";
import { AuthConfig } from "../config";
import { checkDuplicateUsernameOrEmail } from "../middlewares";
import { User } from "../models";

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
}
