const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/orderController');
const verifyController = require('../app/middlewares/verifyController');
const siteController = require('../app/controllers/siteController');
router.get('/', verifyController.verifyToken, orderController.getOrder);

//*VISA PAYMENT
router.get('/checkout/success', orderController.getOrderSuccess);
router.get('/checkout/cancel', siteController.index);


//*VNPAY PAYMENT
router.post('/create_payment_url', verifyController.verifyToken, orderController.postVNPAYPaymet);
router.get('/vnpay_ipn', verifyController.verifyToken, orderController.getvnPayIPN);

//*Save order to database
router.post('/create-order', verifyController.verifyToken, orderController.createOrder);
module.exports = router;