const express = require("express")

const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteSingleProduct, productCreateResponse } = require("../Controllers/ProductController");

const { isAuthenticated, isAdminOrSeller } = require("../Middlewares/authMiddleware");

const { default: upload } = require("../Middlewares/Upload");

const productRoute = express()

productRoute.route("/post-product").post(isAuthenticated, isAdminOrSeller,upload.single("image"),createProduct);

productRoute.route("/get-products").get(getAllProducts)

productRoute.route("/get-product/:id").get(getSingleProduct)

productRoute.route("/update-product/:id").put(isAuthenticated, isAdminOrSeller, updateProduct)

productRoute.route("/delete-product/:id").delete(isAuthenticated, isAdminOrSeller, deleteSingleProduct)

module.exports = productRoute;