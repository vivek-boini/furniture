import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "./models/Product.js"

dotenv.config()

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const products = await Product.find({})
        console.log("--- PRODUCT DATA DUMP ---")
        products.forEach(p => {
            console.log(`ID: ${p._id}`)
            console.log(`Name: ${p.name}`)
            console.log(`Category: "${p.category}"`)
            console.log(`SubCategory: "${p.subCategory}"`) // Quote it to see whitespace
            console.log("-------------------------")
        })
        process.exit(0)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

run()
