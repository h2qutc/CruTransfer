import express from "express";
import { runAsyncWrapper, sendError, sendOk } from "../helpers";
import { User } from "../models";

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
}
