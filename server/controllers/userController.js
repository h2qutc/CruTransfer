User = require('../models/userModel');

sendError = (res, message) => {
    res.status(500, {
        error: true,
        message: message
    })
}

exports.index = (req, res) => {
    User.get((err, users) => {
        if (err) {
            sendError(res, err);
        }

        res.json({
            message: 'Users retrieved successfully',
            payload: users
        })
    })
}


exports.new = (req, res) => {
    const user = new User();

    user.username = req.body.username || user.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
        if (err) {
            sendError(res, err);
        }

        res.status(200).json({
            message: 'New user created',
            payload: user
        })
    })
}


exports.view = (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) {
            sendError(res, err);
        }
        res.json({
            message: 'User loading...',
            payload: user
        })
    })
}


exports.update = (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) {
            sendError(res, err);
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save((err) => {
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


exports.delete = (req, res) => {
    User.remove({
        id: req.params.user_id
    }, (err, user) => {
        if (err) {
            sendError(res, err);
        }
        res.json({
            message: 'User deleted'
        })
    })
}