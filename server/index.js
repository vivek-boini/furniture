import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import User from "./models/User.js"

dotenv.config()

const app = express()



const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowed = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173'
    ];

    if (allowed.includes(origin) || origin.endsWith('.onrender.com')) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log blocked origin for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/admins", adminRoutes)

// Basic health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

console.log(`Port: ${PORT}`)
if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment. Exiting.")
  process.exit(1)
}

const seedSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ email: "vivek@furnidecor.com" })
    if (!exists) {
      const superAdmin = new User({
        name: "Vivek",
        email: "vivek@furnidecor.com",
        password: "vivek123", // Pre-save hook will hash this
        role: "superadmin"
      })
      await superAdmin.save()
    }
  } catch (err) {
    console.error("Failed to seed SuperAdmin:", err)
  }
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    seedSuperAdmin()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error("MongoDB connection error:", err)
    // Don't exit process in dev, just log
    // process.exit(1) 
  })

// Log helper
const logToFile = (msg) => {
  const logMsg = `[${new Date().toISOString()}] ${msg}\n`
  fs.appendFileSync('server_error.log', logMsg)
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack)
  logToFile(`Global Error: ${err.stack}`)
  res.status(500).json({ message: "Internal Server Error", error: err.message })
})

// Catch Unhandled Promise Rejections (prevents crash)
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', err)
  logToFile(`Unhandled Rejection: ${err.message || err} at ${promise}`)
})

// Catch Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  logToFile(`Uncaught Exception: ${err.message || err}\n${err.stack}`)
})
