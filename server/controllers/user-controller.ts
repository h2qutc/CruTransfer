import express from "express";
import { User } from "../models";

const sendError = (res: any, message: any) => {
  res.status(500, {
    error: true,
    message: message
  })
}


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

  getAll = (req: express.Request, res: express.Response) => {
    User.find({}, (err: any, users: any) => {
      if (err) {
        sendError(res, err);
      }

      res.json({
        message: 'Users retrieved successfully',
        payload: users
      })
    })
  }


  create = (req: express.Request, res: express.Response) => {
    const user = new User();

    user.username = req.body.username || user.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err: any) => {
      if (err) {
        sendError(res, err);
      }

      res.status(200).json({
        message: 'New user created',
        payload: user
      })
    })
  }


  getById = (req: express.Request, res: express.Response) => {
    User.findById(req.params.user_id, (err: any, user: any) => {
      if (err) {
        sendError(res, err);
      }
      res.json({
        message: 'User loading...',
        payload: user
      })
    })
  }


  update = (req: express.Request, res: express.Response) => {
    User.findById(req.params.user_id, (err: any, user: any) => {
      if (err) {
        sendError(res, err);
      }
      user.username = req.body.username || user.username;
      user.email = req.body.email;
      user.password = req.body.password;

      user.save((err: any) => {
        if (err) {
          sendError(res, err);
        }
        res.json({
          message: 'User updated',
          payload: user
        })
      })
    })
  }


  delete = (req: express.Request, res: express.Response) => {
    User.remove({
      id: req.params.user_id
    }, (err: any) => {
      if (err) {
        sendError(res, err);
      }
      res.json({
        message: 'User deleted'
      })
    })
  }
}
