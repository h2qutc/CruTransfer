const config = require("../config/auth.config");
const User = require('../models/userModel');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ error: true, message: err });
            return;
        }

        res.send({ message: "User was registered successfully!" });

    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ error: true, message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ error: true, message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
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

            const token = jwt.sign({ id: user.id }, config.secret, {
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