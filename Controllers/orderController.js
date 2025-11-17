const orderModel = require("../Models/OrderModel")

const productModel = require("../Models/ProductModel")

const userModel = require("../Models/userModel")

const createOrder = async (req, res) => {
    try {
        const { orderItems, fullName, addres, city, district, pinCode, phone } = req.body
        if (!orderItems || orderItems == "" || !fullName || fullName == "" || !addres || addres == "" || !city || city == "" || !district || district == "" || !pinCode || pinCode == "" || !phone || phone == "") {
            return res.json({
                success: false,
                message: "major fields are required"
            })
        }
        if (phone.toString().length != 10) {
            return res.json({
                success: false,
                message: "enter a valid mobile number"
            })
        }
        const user = req.user._id
        const product = []
        for (const items of orderItems) {
            const finded_product = await productModel.findOne({ _id: items.product })
            if (finded_product) {
                if (items.quantity) {
                    product.push(items.quantity * finded_product.productPrice)
                }
                else {
                    product.push(finded_product.productPrice)
                }
            }
        }
        const itemsPrice = product.reduce((acc, curr) => {
            return acc + curr
        }, 0)
        const totalPrice = 60 + itemsPrice
        const order = await orderModel.create({ orderItems, shippingAddres: { fullName, addres, city, district, pinCode, phone, alternateNumber: req.user.mobileNumber, email: req.user.email }, user, itemsPrice, totalPrice })
        if (order) {
            return res.json({
                success: true,
                order
            })
        }
        else {
            return res.json({
                success: false,
                message: "cannot make order"
            })
        }
    } catch (error) {
        if (error.message == "Cannot destructure property 'orderItems' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                errorFrom: "crete order",
                message: "major fields are required"
            })
        }
        return res.json({
            success: false,
            errorFrom: "crete order",
            message: error.message
        })
    }
}

const getAllOrders = async (req, res) => {
    const allOrders = await orderModel.find({})
    if (allOrders) {
        if (allOrders.length == 0) {
            return res.json({
                success: false,
                no_of_orders: allOrders.length,
                message: "no more orders"
            })
        }
        return res.json({
            success: true,
            no_of_orders: allOrders.length,
            orders: allOrders
        })
    }
}

const getMyOrders = async (req, res) => {
    const myOrders = await orderModel.find({ user: req.user._id })
    if (myOrders) {
        if (myOrders.length == 0) {
            return res.json({
                success: false,
                no_of_orders: myOrders.length,
                message: "no more orders"
            })
        }
        return res.json({
            success: true,
            no_of_orders: myOrders.length,
            orders: myOrders
        })
    }
}

const cancelOrder = async (req, res) => {
    const order_id = req.params.id;
    if (!order_id || order_id.length != 24) {
        return res.json({
            success: false,
            message: "un vaild order id"
        })
    }
    const order = await orderModel.findOne({ _id: order_id })
    if (order) {
        if (order.orderStatus == "delivered") {
            return res.json({
                success: false,
                message: "order is already delivered"
            })
        }
        if (order.orderStatus == "canceled") {
            return res.json({
                success: false,
                message: "order is already canceled"
            })
        }
        if (order.user.toString() == req.user._id.toString() || req.user.role == "admin") {
            const cancelOrder = await orderModel.updateOne({ _id: order._id }, {
                "orderStatus": "canceled"
            }, { new: true })
            if (cancelOrder) {
                if (cancelOrder.acknowledged == true) {
                    if (cancelOrder.matchedCount == 1) {
                        if (cancelOrder.modifiedCount == 1) {
                            return res.json({
                                success: true,
                                message: "order canceled"
                            })
                        }
                        return res.json({
                            success: false,
                            message: "order not canceled"
                        })
                    }
                    else {
                        return res.json({
                            successa: false,
                            message: "cannot find the order"
                        })
                    }
                }
                return res.json({
                    success: false,
                    message: "order cancel failed"
                })
            }
        }
        else {
            return res.json({
                success: false,
                message: "cannot delete order beacause this is not your order "
            })
        }
    }
    else {
        return res.json({
            success: false,
            message: "cannot find order by the id"
        })
    }
}

const updateOrder = async (req, res) => {
    const order_id = req.params.id;
    const order = req.body
    try {
        if (!order_id || order_id.length != 24) {
            return res.json({
                success: false,
                message: "un vaild product id"
            })
        }
        const finded_order = await orderModel.findOne({ _id: order_id });
        if (finded_order) {
            const updated_order = await orderModel.updateOne({ _id: finded_order._id }, order)
            if (updated_order) {
                console.log(updated_order);

                if (updated_order.acknowledged == true) {
                    if (updated_order.modifiedCount == 0) {
                        return res.json({
                            success: false,
                            message: "no more updates by you"
                        })
                    }
                    return res.json({
                        success: true,
                        message: "order updated"
                    })
                }
                return res.json({
                    success: false,
                    message: "cannot update order",
                    order: updated_order
                })
            }
        }
        return res.json({
            success: false,
            message: "cannot find order by the id"
        })
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "update order",
            error: error.message
        })
    }
}

const deleteOrder = async (req, res) => {
    const order_id = req.params.id
    if (!order_id || order_id.length != 24) {
        return res.json({
            success: false,
            message: "un vaild product id"
        })
    }
    try {
        const finded_order = await orderModel.findOne({ _id: order_id })
        if (finded_order) {
            const delete_order = await orderModel.deleteOne({ _id: order_id })
            if (!delete_order) {
                return res.json({
                    success: false,
                    message: "cannot delete order"
                })
            }
            return res.json({
                success:false,
                message:"order deleted"
            })
        }
        return res.json({
            success:false,
            message:"cannot find order"
        })
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "delte order",
            error: error.message
        })
    }
}

const addToCart = async (req,res) =>{
    const id = req.params.id
    if(!id){
        return res.json({
            success:false,
            message:"is is required"
        })
    }
    const finded_user = await userModel.findOne({_id:req.user._id})
    if(finded_user){
        var isExit = false
        finded_user.cart.map((data)=>{
            console.log(data);
            
        })
        if(finded_user.cart){
            return res.json({
            success:true,
            finded_user 
        })
        }
    }
    return res.json({
        success:false,
        message:"cannot find user"
    })
}

module.exports = { createOrder, getAllOrders, getMyOrders, cancelOrder, updateOrder,deleteOrder,addToCart };