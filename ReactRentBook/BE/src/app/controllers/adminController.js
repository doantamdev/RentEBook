const Orders = require('../model/Order');

class adminController {
  async storedOrder(req, res) {
    try {
      const orders = await Orders.find();
      const deletedCount = await Orders.countDocumentsWithDeleted({deleted:true});
      res.render('admin/storedOrder', {
        orders,
        deletedCount
      })
      // res.json(orders);
    } catch (err) {
      res.status(404).json(err);
    }
  }
  async destroyOrder(req, res) {
    try {
      await Orders.delete({ _id: req.params.id });
      res.redirect('back');
    } catch (err) {
      res.status(500).json(err);
    }
  }
  async trashOrder(req, res) {
    try {
      const orders = await Orders.findWithDeleted({deleted:true})
      res.render('admin/trashOrder', {
        orders
      })
      // res.json(orders);
    } catch (err) {
      res.status(404).json(err);
    }
  }

  async restoreOrder(req, res) {
    try {
      await Orders.restore({ _id: req.params.id });
      res.redirect('back');
    } catch (err) {
      res.status(500).json(err);
    }
  }

  async forceDelete(req, res) {
    try {
      await Orders.deleteOne({ _id: req.params.id });
      res.redirect('back');
    } catch (err) {
      res.status(500).json(err);
    }
  }

}

module.exports = new adminController();









