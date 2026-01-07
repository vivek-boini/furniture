import mongoose from "mongoose"

const callbackRequestSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, default: "" },
        message: { type: String, default: "" },
        status: {
            type: String,
            enum: ['pending', 'contacted', 'resolved'],
            default: 'pending'
        }
    },
    { timestamps: true }
)

const CallbackRequest = mongoose.model("CallbackRequest", callbackRequestSchema)

export default CallbackRequest
