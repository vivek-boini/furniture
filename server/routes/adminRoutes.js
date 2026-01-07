import express from "express"
import User from "../models/User.js"
import { protect, adminOnly, superAdminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

// @desc    Create a new admin
// @route   POST /api/admins/create
// @access  SuperAdmin
router.post("/create", protect, superAdminOnly, async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'admin' // Default to admin if not specified, but UI should restrict
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

// @desc    Get all admins
// @route   GET /api/admins/list
// @access  SuperAdmin
router.get("/list", protect, superAdminOnly, async (req, res) => {
    try {
        // Fetch all users who are admin or superadmin
        const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password')
        res.json(admins)
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

// @desc    Get current admin profile
// @route   GET /api/admins/profile
// @access  Private (Admin/SuperAdmin)
router.get("/profile", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
})

// @desc    Update admin profile
// @route   PUT /api/admins/profile
// @access  Private (Admin/SuperAdmin)
router.put("/profile", protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (user) {
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email

            if (req.body.password) {
                user.password = req.body.password
            }

            const updatedUser = await user.save()

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            })
        } else {
            res.status(404).json({ message: "User not found" })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
})

export default router
