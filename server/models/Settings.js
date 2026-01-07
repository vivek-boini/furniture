import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema(
    {
        whatsappNumber: { type: String, default: "919999999999" },
        callNumber: { type: String, default: "+91999999999" },
        address: { type: String, default: "" },
        email: { type: String, default: "" }
    },
    { timestamps: true }
)

const Settings = mongoose.model("Settings", settingsSchema)

export default Settings
