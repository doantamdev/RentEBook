const Orders = require('../model/Order');
const Users = require('../model/User');
var moment = require('moment');
const stripe = require('stripe')(process.env.stripe_secretKey);
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
class orderController {
  getOrder(req, res) {
    let cartItems;
    let finalPrice = 0;
    Users.findById(req.user.id)
      .populate('cart.items.productID')
      .exec()
      .then((user) => {
        cartItems = user.cart.items;
        const cartItemCount = cartItems.length;
        let totalPrice = 0;
        finalPrice = 0;
        let dayrent = 0;
        cartItems.forEach((p) => {
          dayrent = p.dayrent;
          totalPrice += p.productID.price;
          finalPrice = totalPrice * p.dayrent;
        });
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(finalPrice);
        return stripe.checkout.sessions
          .create({
            payment_method_types: ['card'],
            line_items: cartItems.map((p) => {
              return {
                price_data: {
                  currency: 'VND',
                  unit_amount: finalPrice,
                  product_data: {
                    name: p.productID.name,
                    description: p.productID.description,
                  },
                },
                quantity: cartItemCount,
              };
            }),
            mode: 'payment',
            success_url:
              req.protocol +
              '://' +
              req.get('host') +
              '/order/checkout/success',
            cancel_url:
              req.protocol + '://' + req.get('host') + '/checkout/cancel',
          })
          .then((session) => {
            // res.render('order', {
            //   cartItems,
            //   formattedPrice,
            //   cartItemCount,
            //   dayrent,
            //   sessionID: session.id,
            // });
            res.status(200).json({
              cartItems,
              formattedPrice,
              cartItemCount,
              dayrent,
              sessionID: session.id,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }

  createOrder(req, res) {
    Users.findById(req.user.id)
      .populate('cart.items.productID')
      .exec()
      .then((user) => {
        const products = user.cart.items.map((i) => {
          return {
            productData: { ...i.productID._doc },
            timerent: i.timerent,
            dayrent: i.dayrent,
          };
        });
        console.log(products);
        const order = new Orders({
          user: {
            name: user.username,
            userID: req.user.id,
          },
          products: products,
          dayrent: products[0].dayrent,
          timerent: products[0].timerent,
        });
        return order.save().then(() => {
          user.cart.items = [];
          return user.save();
        });
      })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getOrderSuccess(req, res, next) {
    res.render('orderSuccess');
  }
  postVNPAYPaymet(req, res, next) {
    let cartItems;
    let finalPrice = 0;
    Users.findById(req.user.id)
      .populate('cart.items.productID')
      .exec()
      .then((user) => {
        cartItems = user.cart.items;
        let totalPrice = 0;
        finalPrice = 0;
        let dayrent = 0;
        cartItems.forEach((p) => {
          dayrent = p.dayrent;
          totalPrice += p.productID.price;
          finalPrice = totalPrice * p.dayrent;
        });
        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr =
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress;

        let tmnCode = process.env.vnp_TmnCode;
        let secretKey = process.env.vnp_HashSecret;
        console.log(secretKey);
        let vnpUrl = process.env.vnp_Url;
        let returnUrl = process.env.vnp_ReturnUrl;
        let orderId = moment(date).format('DDHHmmss');
        let amount = finalPrice;
        let bankCode = '';

        // let locale = req.body.language;
        // if (locale === null || locale === '') {
        //   locale = 'vn';
        // }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
          vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require('crypto');
        let hmac = crypto.createHmac('sha512', secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        // res.redirect(vnpUrl);
        res.status(200).json(vnpUrl);
      });
  }
  getvnPayIPN(req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.vnp_HashSecret;
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == '00') {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            }
          } else {
            res.status(200).json({
              RspCode: '02',
              Message: 'This order has been updated to the payment status',
            });
          }
        } else {
          res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }
      } else {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  }

  vnPayReturn(req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require('crypto');
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
      res.render('orderSuccess', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
      res.render('home', { code: '97' });
    }
  }
}
module.exports = new orderController();
