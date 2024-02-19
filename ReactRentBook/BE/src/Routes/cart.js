const express = require('express');
const cartController = require('../app/controllers/cartController');
const verifyController = require('../app/middlewares/verifyController');
const orderController = require('../app/controllers/orderController');
const router = express.Router();

router.post('/addcart', verifyController.verifyToken, cartController.addCart);
router.get('/', verifyController.verifyToken, cartController.getCart);
router.post('/postcart', verifyController.verifyToken, cartController.postCart);
router.post('/deleteCartItem', cartController.deleteItemsCart);
router.post('/create_payment_url', cartController.postPaymentUrl);

//*VNPAY
router.get('/vnpay_return', orderController.vnPayReturn);
module.exports = router;
