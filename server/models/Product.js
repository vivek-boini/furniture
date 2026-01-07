import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: false },
    description: { type: String },
    images: { type: [String], default: [] },
    isOffer: { type: Boolean, default: false },
    discountPrice: { type: Number },
    material: { type: String } // e.g. "Sheesham Wood", "Fabric"
  },
  { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

export default Product
