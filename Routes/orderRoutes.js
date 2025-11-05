const express = require("express");

const {createOrder, getAllOrders, getMyOrders, cancelOrder, updateOrder, deleteOrder} = require("../Controllers/orderController");

const { isAuthenticated, isAdminOrSeller, isAdmin } = require("../Middlewares/authMiddleware");

const orderRoute = express();

orderRoute.route("/create-order").post(isAuthenticated,createOrder)

orderRoute.route("/get-all-orders").get(isAuthenticated,isAdmin,getAllOrders)

orderRoute.route("/my-orders").get(isAuthenticated,getMyOrders)

orderRoute.route("/cancel-order/:id").put(isAuthenticated,cancelOrder)

orderRoute.route("/update-order/:id").put(isAuthenticated,isAdmin,updateOrder)

orderRoute.route("/delete-order/:id").put(isAuthenticated,isAdmin,deleteOrder)

module.exports = orderRoute;