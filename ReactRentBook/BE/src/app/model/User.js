const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usersSchema = new Schema(
  {
    username: { type: String, minlength: 6, required: true, unique: true },
    gmail: { type: String, minlength: 6, required: true, unique: true },
    password: { type: String, minlength: 6, required: true },
    admin: { type: Boolean, default: false },
    cart: {
      items: [
        {
          productID: { type: Schema.Types.ObjectId, ref: 'book', required: true },
          timerent: { type: Date},
          dayrent: { type: Number }
        }
      ],
    }
  },
  {
    timestamps: true,
  },
);
usersSchema.methods.addToCart = function (book) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productID.toString() === book._id.toString();
  });
  const updateCartItems = [...this.cart.items];
  updateCartItems.push({
    productID: book._id,
  });
  const updatedCart = {
    items: updateCartItems
  };
  this.cart = updatedCart;
  return this.save();
};
usersSchema.methods.updateToCart = function (selectedDate,daysDifference) {
  this.cart.items.forEach(item => {
    item.timerent = selectedDate;
    item.dayrent = daysDifference;
  });
  return this.save();
};
usersSchema.methods.removeFromCart = function (productID) {
  const updateCartItems = this.cart.items.filter(item => {
    return item.productID.toString() !== productID.toString();
  });
  this.cart.items = updateCartItems;
  return this.save();
}
const Users = mongoose.model('user', usersSchema);
module.exports = Users;