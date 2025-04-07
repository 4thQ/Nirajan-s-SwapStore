import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["buy", "rent", "swap"], required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "canceled"],
    default: "pending",
  },
  rentDuration: { type: Number },
  message: { type: String },
  address: { type: String, required: true },
  amount: { type: Number },
  phoneNumber: { type: String, required: true },
  swapItem: { type: Schema.Types.ObjectId, ref: "Item" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
