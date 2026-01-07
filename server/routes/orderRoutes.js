import express from "express"
import Product from "../models/Product.js"
import Order from "../models/Order.js"
import CallbackRequest from "../models/CallbackRequest.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

// GET /api/orders/stats - Admin Dashboard Stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const productCount = await Product.countDocuments()

    // Aggregation for Total Sales
    const salesData = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$amount" } } }
    ])
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0

    // Recent Orders
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5)

    // Pending Orders Count
    const pendingOrders = await Order.countDocuments({ status: "Pending" })

    // Callback Requests Count
    const callbackRequests = await CallbackRequest.countDocuments({ status: "pending" })

    return res.json({
      totalOrders,
      totalSales,
      productCount,
      pendingOrders,
      callbackRequestsCount: callbackRequests,
      recentOrders
    })
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/orders - Get all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    return res.json(orders)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/orders - Submit new order
router.post("/", async (req, res) => {
  try {
    const { product, name, email, phone, address, notes, status, amount } = req.body

    if (!product || !name || !email || !phone || !address) {
      return res.status(400).json({ message: "All required fields must be provided" })
    }

    const order = new Order({
      product,
      name,
      email,
      phone,
      address,
      notes: notes || "",
      amount: amount || 0,
      status: status || "Pending"
    })

    await order.save()
    return res.status(201).json(order)
  } catch (err) {
    return res.status(500).json({ message: "Server error" })
  }
})

// PATCH /api/orders/:id - Update order status
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    return res.json(order)
  } catch (err) {
    console.error("Failed to update order:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// DELETE /api/orders/:id - Delete order
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Order.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" })
    }

    return res.json({ message: "Order deleted" })
  } catch (err) {
    console.error("Failed to delete order:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
