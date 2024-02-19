const express = require('express');
const router = express.Router();
const authorController = require('../app/controllers/authorController');
router.post('/postAuthor', authorController.postAuthor)
module.exports = router;