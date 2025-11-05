const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    orderItems:[
        {
            product:{
                type : mongoose.Schema.Types.ObjectId,
                ref:"products",
                quantity:{
                    type:Number,
                    default:1
                },
                price:{
                    type:Number
                }
            }
        }
    ],
    orderdDate:{
        type:Date,
        default:Date.now()
    },
    deliveredAt:{
        type:Date,
        default:Date.now() + 7 *24*60*60*1000
    },
    shippingAddres:{
        fullName:{type:String},
        addres:{type:String},
        city:{type:String},
        district:{type:String},
        state:{type:String,default:"tamilnadu"},
        pinCode:{type:String},
        country:{type:String,default:"india"},
        phone:{type:Number},
        alternateNumber:{type:Number},
        email:{type:String}
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    orderStatus:{
        type:String,
        default:"waiting for approvel"
    },
    paymentMethod:{
        type:String,
        default:"COD"
    },
    paymentStatus:{
        type:String,
        default:"pending"
    },
    itemsPrice:{
        type:Number
    },
    shippingPrice:{
        type:Number,
        default:60
    },
    totalPrice:{
        type:Number
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paidAt:{
        type:Date
    },
    isDeliverd:{
        type:Boolean,
        default:false
    }
})

const orderModel = mongoose.model("orders",orderSchema)

module.exports = orderModel;