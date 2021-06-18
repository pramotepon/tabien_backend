const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = Schema(
  {
    licence_code: { type: String, required: true, trim: true },
    licence_province: { type: String, required: true, trim: true },
    licence_price: { type: Number, trim: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    user_buy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    licence_status: { type: String, required: true, trim: true, default: "sale" }
  },
  {
    collection: "products",
    timestamps: true,
  }
);

const product = mongoose.model('Product', schema);
module.exports = product;