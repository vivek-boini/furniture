import express from "express"
import Settings from "../models/Settings.js"
import CallbackRequest from "../models/CallbackRequest.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"

const router = express.Router()

// GET /api/settings - Public or Protected? 
// Should be public so the Shop can read it without logging in.
router.get("/", async (req, res) => {
    try {
        // We assume there's only one settings document. Find the first one.
        let settings = await Settings.findOne()

        // If no settings exist yet, create default
        if (!settings) {
            settings = new Settings()
            await settings.save()
        }

        return res.json(settings)
    } catch (err) {
        console.error("Failed to fetch settings:", err)
        return res.status(500).json({ message: "Server error" })
    }
})

// PUT /api/settings - Admin only update
router.put("/", protect, adminOnly, async (req, res) => {
    try {
        const { whatsappNumber, callNumber, address, email } = req.body

        let settings = await Settings.findOne()

        if (!settings) {
            settings = new Settings({ whatsappNumber, callNumber, address, email })
        } else {
            settings.whatsappNumber = whatsappNumber
            settings.callNumber = callNumber
            settings.address = address
            settings.email = email
        }

        await settings.save()
        return res.json(settings)
    } catch (err) {
        console.error("Failed to update settings:", err)
        return res.status(500).json({ message: "Server error" })
    }
})

// === CALL BACK REQUESTS ===

// POST /api/settings/callback - Public submit
router.post("/callback", async (req, res) => {
    try {
        const { name, phone, email, message } = req.body
        const newRequest = new CallbackRequest({ name, phone, email, message })
        await newRequest.save()
        res.status(201).json({ message: "Callback request received" })
    } catch (err) {
        console.error("Callback Submit Error:", err)
        res.status(500).json({ message: "Server error" })
    }
})

// GET /api/settings/callback - Admin list
router.get("/callback", protect, adminOnly, async (req, res) => {
    try {
        const requests = await CallbackRequest.find().sort({ createdAt: -1 })
        res.json(requests)
    } catch (err) {
        console.error("Callback Fetch Error:", err)
        res.status(500).json({ message: "Server error" })
    }
})

// PATCH /api/settings/callback/:id - Update status
router.patch("/callback/:id", protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body
        const request = await CallbackRequest.findById(req.params.id)
        if (!request) return res.status(404).json({ message: "Request not found" })

        request.status = status || request.status
        await request.save()
        res.json(request)
    } catch (err) {
        console.error("Callback Update Error:", err)
        res.status(500).json({ message: "Server error" })
    }
})

export default router
