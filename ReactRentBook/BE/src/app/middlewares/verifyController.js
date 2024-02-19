const jwt = require('jsonwebtoken');

class VerifyController {
  verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    console.log(req.cookies.accessToken);
    console.log(token);
    if (token) {
      // const accessToken = token.split(' ')[1];
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) {
          console.log(err);
          res.status(403).json('Token is not valid');
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(500).json('Login again');
    }
  };

  verifyAdmin = (req, res, next) => {
    this.verifyToken(req, res, () => {
      if (req.user.admin) {
        res.redirect('/admin/stored/order');
      } else {
        next();
      }
    });
  };
}

module.exports = new VerifyController();
