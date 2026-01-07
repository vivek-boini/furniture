import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.error('Connected to DB');
        const products = await Product.find({});
        console.error('PRODUCTS_START');
        console.error(JSON.stringify(products, null, 2));
        console.error('PRODUCTS_END');
        process.exit(0);
    })
    .catch(err => {
        console.error('ERROR:', err);
        process.exit(1);
    });
