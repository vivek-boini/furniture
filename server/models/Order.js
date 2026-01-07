import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" }
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

export default Order
