User = require('../models/userModel');

exports.index = (req, res) => {
    User.get((err, users) => {
        if (err) {
            res.json({
                status: 'error',
                message: err
            });
        }

        res.json({
            status: 'success',
            message: 'Users retrieved successfully',
            data: users
        })
    })
}


exports.new = (req, res) => {
    const user = new User();
    user.name = req.body.name || user.name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save((err) => {
        if (err) {
            res.json(err);
        }

        res.status(200).json({
            message: 'New user created',
            data: user
        })
    })
}


exports.view = (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
        res.json({
            message: 'User loading...',
            data: user
        })
    })
}


exports.update = (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
        user.name = req.body.name || user.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save((err) => {
            if (err) {
                res.json(res);
            }
            res.json({
                message: 'User updated',
                data: user
            })
        })
    })
}


exports.delete = (req, res) => {
    User.remove({
        id: req.params.user_id
    }, (err, user) => {
        if (err) res.send(err);
        res.json({
            status: 'success',
            message: 'User deleted'
        })
    })
}