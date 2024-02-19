const express = require('express');
const router = express.Router();
const adminController = require('../app/controllers/adminController');
router.get('/stored/order', adminController.storedOrder);
router.delete('/:id', adminController.destroyOrder);

router.get('/trash/order', adminController.trashOrder);
router.patch('/:id/restore', adminController.restoreOrder);
router.delete('/:id/force', adminController.forceDelete);

module.exports = router;