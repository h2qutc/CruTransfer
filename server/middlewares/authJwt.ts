import express from "express";
import { AuthConfig } from "../config";

const jwt = require("jsonwebtoken");

export const verifyToken = (req: express.Request, res: express.Response, next: any) => {
    let token = req.headers["x-access-token"] || req.headers.authorization || req.body.token;

    if (!token) {
        return res.status(403).send({ error: true, message: "No token provided!" });
    }

    jwt.verify(token, AuthConfig.secret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).send({ error: true, message: "Unauthorized!" });
        }
        (<any>req).userId = decoded.id;
        next();
    });
};