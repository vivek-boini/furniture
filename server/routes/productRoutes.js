import express from "express"
import Product from "../models/Product.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { upload } from "../config/cloudinary.js"

const router = express.Router()

// GET /api/products?category=...&minPrice=...&maxPrice=...&sort=...
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, material, sort } = req.query
    let query = {}
    const conditions = []

    // 1. Search Logic
    if (search) {
      const regex = new RegExp(search, 'i')
      conditions.push({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { subCategory: regex },
          { material: regex }
        ]
      })
    }

    // 2. Category Logic
    if (category && category !== 'All') {
      const regex = new RegExp(category, 'i')
      conditions.push({
        $or: [
          { category: regex },
          { subCategory: regex }
        ]
      })
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      // Logic: If discountPrice exists, use it, else use price
      // Simple approximation for Mongoose: 
      // We'll filter on 'price' for simplicity, or complex $expr if needed.
      // For now, let's filter on the base price to be consistent. 
      // OR improved: check if discountPrice is set, use it, else fallback.
      // But query params are simple numbers.

      const min = Number(minPrice) || 0
      const max = Number(maxPrice) || 100000

      // Standard easy way: filter both fields loosely or strict on 'price'
      // Ideally we want: (discountPrice >= min && discountPrice <= max) OR (!discountPrice && price >= min && price <= max)
      conditions.push({
        $or: [
          { discountPrice: { $gte: min, $lte: max } },
          { discountPrice: null, price: { $gte: min, $lte: max } },
          { discountPrice: { $exists: false }, price: { $gte: min, $lte: max } } // handle missing field
        ]
      })
    }

    // 4. Material Filter (comma separated)
    if (material) {
      const materials = material.split(',')
      // Regex match any of the selected materials (case insensitive)
      const materialRegexes = materials.map(m => new RegExp(m, 'i'))
      conditions.push({ material: { $in: materialRegexes } })
    }

    if (conditions.length > 0) {
      if (conditions.length === 1) {
        query = conditions[0]
      } else {
        query.$and = conditions
      }
    }

    // 5. Sorting
    let sortOption = { createdAt: -1 } // Default: Latest
    if (sort === 'price_asc') {
      sortOption = { price: 1 }
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 }
    } else if (sort === 'latest') {
      sortOption = { createdAt: -1 }
    }

    const products = await Product.find(query).sort(sortOption)
    return res.json(products)
  } catch (err) {
    console.error("Failed to fetch products:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// GET /api/products/:id - Single product details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    return res.json(product)
  } catch (err) {
    console.error("Failed to fetch product:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// POST /api/products (Protected, Admin only)
router.post("/", protect, adminOnly, upload.any(), async (req, res) => {
  try {
    const { name, category, subCategory, price, description, isOffer, discountPrice, material } = req.body
    let imageUrl = ""
    let images = []

    if (req.files && req.files.length > 0) {
      // Handle main image
      const mainImg = req.files.find(f => f.fieldname === 'image')
      if (mainImg) {
        imageUrl = mainImg.path // Cloudinary URL
      }

      // Handle additional images
      const addImgs = req.files.filter(f => f.fieldname === 'additionalImages')
      if (addImgs.length > 0) {
        images = addImgs.map(f => f.path) // Cloudinary URLs
      }
    }

    const product = new Product({
      name,
      category,
      subCategory,
      price,
      description,
      imageUrl,
      images,
      isOffer: isOffer === 'true' || isOffer === true,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      material
    })

    await product.save()
    return res.status(201).json(product)
  } catch (err) {
    console.error("Failed to create product:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// PUT /api/products/:id (Protected, Admin only)
router.put("/:id", protect, adminOnly, upload.any(), async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, subCategory, price, description, isOffer, discountPrice, material } = req.body

    const updateData = {
      name, category, subCategory, price, description, material,
      isOffer: isOffer === 'true' || isOffer === true,
      discountPrice: discountPrice ? Number(discountPrice) : undefined
    }

    if (req.files && req.files.length > 0) {
      const mainImg = req.files.find(f => f.fieldname === 'image')
      if (mainImg) {
        updateData.imageUrl = mainImg.path
      }

      const addImgs = req.files.filter(f => f.fieldname === 'additionalImages')
      if (addImgs.length > 0) {
        const newImages = addImgs.map(f => f.path)
        updateData.images = newImages
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    return res.json(product)
  } catch (err) {
    console.error("Failed to update product:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

// DELETE /api/products/:id (Protected, Admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Product.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ message: "Product not found" })
    return res.json({ message: "Deleted" })
  } catch (err) {
    console.error("Failed to delete product:", err)
    return res.status(500).json({ message: "Server error" })
  }
})

export default router
