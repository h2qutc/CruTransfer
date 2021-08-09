import express from "express";
import { generateOTP, runAsyncWrapper, sendError, sendOk } from "../helpers";
import { ISender, Sender, User } from "../models";
import { EmailService } from "../services";

export class UserController {

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.route('/users')
      .get(this.getAll)
      .post(this.create);

    this.router.route('/users/:user_id')
      .get(this.getById)
      .patch(this.update)
      .put(this.update)
      .delete(this.delete);

    this.router.route('/users/sendCodeToSender').post(this.sendCodeToSender);
    this.router.route('/users/verifySender').post(this.verifySender);
  }

  getAll = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const payload = await User.find({}).exec();
    sendOk(res, payload, 'Users retrieved successfully');
  })


  create = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const user = new User();

    user.username = req.body.username || user.username;
    user.email = req.body.email;
    user.password = req.body.password;

    const payload = await user.save();
    sendOk(res, payload, 'New user created');
  })


  getById = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const payload = await User.findById(req.params.user_id).exec();
    if (!payload) {
      sendError(res, 404, 'User not found');
    }
    sendOk(res, payload, 'User found');
  })


  update = runAsyncWrapper(async (req: express.Request, res: express.Response) => {

    const user = await User.findById(req.params.user_id).exec();

    if (user == null) {
      sendError(res, 400, 'User not found');
    }

    if (user != null) {
      user.username = req.body.username || user.username;
      user.email = req.body.email;
      user.password = req.body.password;
      const saved = await user.save();
      sendOk(res, saved, 'User updated');
    }

  })


  delete = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const payload = await User.deleteOne({ id: req.params.user_id });
    sendOk(res, payload, 'User deleted');
  })

  sendCodeToSender = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const email = req.body.email;
    if (!email) {
      sendError(res, 400, 'Email is invalid');
    }

    const sender = new Sender();

    sender.email = req.body.email;
    sender.code = generateOTP(6);

    await sender.save();

    await this.sendEmailWithCodeToSender(sender);

    sendOk(res, 'Code sent');

  });

  verifySender = runAsyncWrapper(async (req: express.Request, res: express.Response) => {
    const email = req.body.email;
    const code = req.body.code;

    if (!email || !code) {
      sendError(res, 400, 'Email or code is invalid');
    }

    const sender = await Sender.findOne({
      email: email,
      code: code
    });

    if (sender == null) {
      sendError(res, 404, 'Code is invalid or expired');
    } else {

      await sender.deleteOne();

      sendOk(res, 'Sender was verified');
    }


  })

  private sendEmailWithCodeToSender = async (sender: ISender) => {
    const emailService = EmailService.getInstance();
    const data = {
      code: sender.code,
      recipients: [sender.email]
    };
    const subject = `CruTransfer - Your code is ${data.code}`;
    await emailService.sendEmailVerifySender(subject, data);
  }
}
