const dotenv = require('dotenv');
const Product = require('../models/products');
const productdata = require('../data/products.json')
const createConnection = require('../config/database');

dotenv.config({path:'backend/config/config.env'});

createConnection();

const seedProducts=async()=>{
    try {
        await Product.deleteMany();
        console.log("products deleteed ");
        await Product.insertMany(productdata);
        console.log("Product inserted");
        process.exit()
    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}

seedProducts();
