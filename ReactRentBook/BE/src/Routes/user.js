const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const verifyController = require('../app/middlewares/verifyController');
router.post('/register', userController.registerUsers);
router.post('/login', userController.loginUsers);
router.post('/logout', verifyController.verifyToken, userController.userLogout);
router.get('/getAllUser', userController.getAllUsers);

//* Forget password
router.get('/forgetPasswordform', userController.forgetPasswordform);
router.post('/forgot-password', userController.forgotPassword);
router.get('/reset-password/:id/:token', userController.resetPassword);
router.post('/reset-password/:id/:token', userController.postResetPassword);

module.exports = router;
