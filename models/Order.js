import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
      },
    ],
    email: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
