import express from "express";
import { User } from "../models";

export const checkDuplicateUsernameOrEmail = (req: express.Request, res: express.Response, next: any) => {
    User.findOne({
        username: req.body.username
    }).exec((err: any, user: any) => {
        if (err) {
            res.status(500).send({ error: true, message: err });
            return;
        }

        if (user) {
            res.status(400).send({ error: true, message: "Failed! Username is already in use!" });
            return;
        }

        User.findOne({
            email: req.body.email
        }).exec((err, user) => {

            if (err) {
                res.status(500).send({
                    error: true,
                    message: err
                });
                return;
            }

            if (user) {
                res.status(400).send(
                    {
                        error: true,
                        message: "Failed! Email is already in use!"
                    });
                return;
            }

            next();
        });
    });
};