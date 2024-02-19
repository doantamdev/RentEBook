const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // ngày thuê, ngày hệt hạn, tổng tiền
  products: [{
      productData: {type: Object, required: true},
      timerent: {type: Date, required: true},
      dayrent: {type: Number}
  }],
  user: {
    name: {type: String, required: true},
    userID: {type: Schema.Types.ObjectId, required: true, ref: 'Users'},
  },
  dayrent: {type: Number},
  timerent: {type: Date, required: true},
},
  {
    timestamps: true,
  },
);

orderSchema.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt: true});
const Orders = mongoose.model('order', orderSchema);
module.exports = Orders;