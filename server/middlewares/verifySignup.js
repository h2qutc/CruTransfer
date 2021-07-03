const User = require('../models/userModel');

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
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

module.exports = {
    checkDuplicateUsernameOrEmail
};