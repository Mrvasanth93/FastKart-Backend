const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 20
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    category: {
        type: String,
        required: true
    },
    image:{
        type:String
    },
    specifications: {
        colour: { type: String},
        size: { type: String, },
        ram: { type: String, },
        storage: { type: String },
        gender: { type: String },
        weight: { type: String }
    },
    ratings: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            rate: { type: Number },
            message: { type: String },
            user: { type: mongoose.Schema.Types.ObjectId }
        }
    ]
})

const productModel = mongoose.model("product", productSchema)

module.exports = productModel;
