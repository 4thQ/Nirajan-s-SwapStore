import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true },
  discount: { type: Number },
  type: {
    buy: { type: Boolean, default: true },
    rent: { type: Boolean, default: false },
    swap: { type: Boolean, default: false },
  },

  rentPerDay: {
    type: Number,
    required: function () {
      return this.type.rent;
    },
  },
  swapWith: {
    type: String,
    required: function () {
      return this.type.swap;
    },
  },
  status: {
    type: String,
    enum: ["available", "sold", "swapped", "rented"],
    default: "available",
  },
  amount: { type: Number },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  color: { type: String },
  size: { type: String },
  condition: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
