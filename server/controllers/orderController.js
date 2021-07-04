Order = require('../models/orderModel');

sendError = (res, message) => {
    res.status(500, {
        error: true,
        message: message
    })
}

exports.index = (req, res) => {
    Order.get((err, orders) => {
        if (err) {
            sendError(res, err);
        }

        res.status(200).json({
            payload: orders
        })
    })
}


exports.new = (req, res) => {
    const order = new Order();
    order.sender = req.body.sender;
    order.fileInfos = req.body.fileInfos;
    order.password = req.body.password;
    order.action = req.body.action;
    order.message = req.body.message;
    order.recipients = req.body.recipients;

    order.save((err) => {
        if (err) {
            sendError(res, err);
        }

        res.status(200).json({
            message: 'New order created',
            payload: order
        })
    })
}


exports.view = (req, res) => {
    Order.findById(req.params.order_id, (err, order) => {
        if (err) res.send(err);
        res.json({
            message: `Order loaded`,
            payload: order
        })
    })
}


exports.update = (req, res) => {
    Order.findById(req.params.order_id, (err, order) => {
        if (err) res.send(err);

        order.sender = req.body.sender;
        order.fileInfos = req.body.fileInfos;
        order.password = req.body.password;
        order.action = req.body.action;
        order.message = req.body.message;
        order.recipients = req.body.recipients;

        order.save((err) => {
            if (err) {
                sendError(res, err);
            }
            res.json({
                message: 'Order updated',
                payload: order
            })
        })
    })
}


exports.delete = (req, res) => {
    Order.remove({
        id: req.params.order_id
    }, (err, order) => {
        if (err) {
            sendError(res, err);
        }
        res.json({
            message: 'Order deleted'
        })
    })
}