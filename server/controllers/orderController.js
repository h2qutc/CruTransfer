Order = require('../models/orderModel');

exports.index = (req, res) => {
    Order.get((err, orders) => {
        if (err) {
            res.json({
                status: 'error',
                message: err
            });
        }

        res.json({
            status: 'success',
            message: 'Orders retrieved successfully',
            data: orders
        })
    })
}


exports.new = (req, res) => {
    const order = new Order();
    order.sender = req.body.sender;
    order.fileInfos = req.body.fileInfos;
    order.password = req.body.password;
    order.option = req.body.option;
    order.message = req.body.message;
    order.recipients = req.body.recipients;

    order.save((err) => {
        if (err) {
            res.json(err);
        }

        res.status(200).json({
            message: 'New order created',
            data: order
        })
    })
}


exports.view = (req, res) => {
    Order.findById(req.params.order_id, (err, order) => {
        if (err) res.send(err);
        res.json({
            message: 'Order loading...',
            data: order
        })
    })
}


exports.update = (req, res) => {
    Order.findById(req.params.order_id, (err, order) => {
        if (err) res.send(err);

        order.sender = req.body.sender;
        order.fileInfos = req.body.fileInfos;
        order.password = req.body.password;
        order.option = req.body.option;
        order.message = req.body.message;
        order.recipients = req.body.recipients;

        order.save((err) => {
            if (err) {
                res.json(res);
            }
            res.json({
                message: 'Order updated',
                data: order
            })
        })
    })
}


exports.delete = (req, res) => {
    Order.remove({
        id: req.params.order_id
    }, (err, order) => {
        if (err) res.send(err);
        res.json({
            status: 'success',
            message: 'Order deleted'
        })
    })
}