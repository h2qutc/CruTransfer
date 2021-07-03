const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const User = require('../models/userModel');

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers.authorization || req.body.token;

    if (!token) {
        return res.status(403).send({ error: true, message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken,
};
module.exports = authJwt;