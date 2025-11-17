const mongoose = require("mongoose")

const userScema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number
    },
    role: {
        type: String,
        default: "user"
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            quantity:Number
        }
    ]
})
const userModel = mongoose.model("user", userScema)

module.exports = userModel;