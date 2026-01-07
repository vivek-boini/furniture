import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_me"

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "7d"
  })
}

// CUSTOMER SIGNUP
router.post("/customer-signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" })
    }

    // Create new customer
    const user = new User({
      name,
      email,
      password,
      role: "customer"
    })

    await user.save()

    const token = generateToken(user)
    return res.status(201).json({
      message: "Signup successful",
      token,
      name: user.name,
      email: user.email,
      role: "customer"
    })
  } catch (err) {
    console.error("Customer signup error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// CUSTOMER LOGIN
router.post("/customer-login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }

    // Find customer
    const user = await User.findOne({ email, role: "customer" })
    if (!user) {
      return res.status(400).json({ message: "Customer not found" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" })
    }

    const token = generateToken(user)
    return res.json({
      message: "Login successful",
      token,
      name: user.name,
      email: user.email,
      role: "customer"
    })
  } catch (err) {
    console.error("Customer login error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// ADMIN LOGIN
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" })
    }
    // Find admin user
    const user = await User.findOne({ email })

    if (user && (user.role === "admin" || user.role === "superadmin")) {
      const isMatch = await user.comparePassword(password)
      if (isMatch) {
        const token = generateToken(user)
        return res.json({
          message: "Admin login successful",
          token,
          name: user.name,
          email: user.email,
          role: user.role
        })
      }
    }

    return res.status(401).json({ message: "Invalid admin credentials" })
  } catch (err) {
    console.error("Admin login error:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
