const router = require('express').Router();
const userController = require('./controllers/userController');
const orderController = require('./controllers/orderController');

router.get('/', (req, res) => {
    res.json({
        status: 'API Its working',
        message: 'Welcome CruTransfer API'
    })
});


// USER routes
router.route('/users')
    .get(userController.index)
    .post(userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    .patch(userController.update)
    .put(userController.update)
    .delete(userController.delete);

// ORDER routes
router.route('/orders')
    .get(orderController.index)
    .post(orderController.new);

router.route('/orders/:order_id')
    .get(orderController.view)
    .patch(orderController.update)
    .put(orderController.update)
    .delete(orderController.delete);

module.exports = router;