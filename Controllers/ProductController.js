const productModel = require("../Models/ProductModel")
const path = require("path")
const createProduct = async (req, res, next) => {
    if (!req.file) {
        return res.json({
            success: false,
            message: "image file is required"
        })
    }

    try {
        const { productName, productDescription, productPrice, category,stock,colour,ram,size,storage,weight } = req.body
        if (!productName || productName == "" || !productDescription || productDescription == "" || !productPrice || productPrice == "" || !category || category == "") {
            return res.json({
                success: false,
                message: "major fields are required"
            })
        }
        const fileName = productName.replace(" ","_")+path.extname(req.file.originalname)
        const createProduct = await productModel.create({ productName, productDescription, productPrice, category, stock, specifications:{colour,ram,size,storage,weight}, user:req.user._id, image:fileName })
        if (createProduct) {
            return res.json({
                success: true,
                message: "product created"
            })
        }
        else {
            return res.json({
                success: false,
                message: "cannot create product"
            })
        }

    } catch (error) {
        if (error.message == "Cannot destructure property 'productName' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                errorFrom: "create product",
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "create product",
            error: error.message
        })
    }
}

const productCreateResponse = async (req, res) => {
    const createProduct = await productModel.create({ productName, productDescription, productPrice, category, stock, specifications, user })
    if (createProduct) {
        return res.json({
            success: true,
            message: "product created"
        })
    }
    else {
        return res.json({
            success: false,
            message: "cannot create product"
        })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        if (products) {
            if (products.length == 0) {
                return res.json({
                    success: false,
                    no_of_products: products.length,
                    message: "no more products"
                })
            }
            return res.json({
                success: true,
                no_of_products: products.length,
                products
            })
        }
        else {
            return res.json({
                success: false,
                message: "cannot get products"
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "get all products",
            error: error.message
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const product_id = req.params.id;
        if (!product_id || product_id.length != 24) {
            return res.json({
                success: false,
                message: "un vaild product id"
            })
        }
        const product = await productModel.find({ _id: product_id });
        if (product) {
            return res.json({
                success: true,
                product
            })
        }
        else {
            return res.json({
                success: false,
                message: "cannot get product"
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "get single product",
            message: error.message
        })
    }
}

const deleteSingleProduct = async (req, res) => {
    try {
        const product_id = req.params.id
        if (!product_id || product_id.length != 24) {
            return res.json({
                success: false,
                message: "un vaild product id"
            })
        }
        const find_product = await productModel.findOne({ _id: product_id })
        if (find_product) {
            if ((find_product.user.toString() == req.user._id.toString() && req.user.role == 'seller') || req.user.role == "admin") {
                const deletedProduct = await productModel.deleteOne({ _id: product_id })
                if (deletedProduct) {
                    return res.json({
                        success: true,
                        message: "product deleted",
                        deletedProduct
                    })
                }
                else {
                    return res.json({
                        success: false,
                        message: "cannot delete product"
                    })
                }
            }
            else {
                return res.json({
                    success: false,
                    message: "this page can only accesed by the admin account  or seller account and product is yours"
                })
            }
        }
        else {
            res.json({
                success: false,
                message: "cannot find product"
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "delete all products",
            message: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product_id = req.params.id
        if (!product_id || product_id.length != 24) {
            return res.json({
                success: false,
                message: "un vaild product id"
            })
        }
        const user = req.user
        const product = await productModel.findOne({ _id: product_id })
        if ((user._id.toString() == product.user.toString() && user.role == "seller") || user.role == "admin") {
            if (product) {
                if (product.user.toString() == user._id.toString() || user.role == "admin") {
                    const updateProduct = await productModel.updateOne({ _id: product._id }, req.body, { new: true })
                    if (updateProduct) {
                        if (updateProduct.acknowledged == true) {
                            if (updateProduct.matchedCount > 0) {
                                if (updateProduct.modifiedCount > 0) {
                                    return res.json({
                                        success: true,
                                        product: updateProduct
                                    })
                                }
                                return res.json({
                                    success: false,
                                    message: "do not update anyone"
                                })
                            }
                            else {
                                return res.json({
                                    successa: false,
                                    message: "cannont find update product"
                                })
                            }
                        }
                        return res.json({
                            success: false,
                            message: "update failed"
                        })
                    }
                    else {
                        return res.json({
                            success: false,
                            message: "cannot update product"
                        })
                    }
                }
                else {
                    return res.json({
                        success: false,
                        message: "this page can only access by the admin or seller account"
                    })
                }
            }
            else {
                return res.json({
                    success: false,
                    message: "cannot find product"
                })
            }
        }
        else {
            return res.json({
                success: false,
                message: "this page can only accesed by admin account or seller account and product is yours"
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "update product",
            message: error.message
        })
    }
}

const addReview = async (req, res) => {
    const { rate, message } = req.body;
    if (!rate || rate == "" || !message || message == "") {
        return res.json({
            success: false,
            message: "major fields are required"
        })
    }
}

const serch_products = async(req,res)=>{
    const serchquery = req.params.serch
    const serched_products = await productModel.find({
        $or:[
            {productName:{$regex:serchquery,$options:"i"}},
            {category:{$regex:serchquery,$options:"i"}},
            {productDescription:{$regex:serchquery,$options:"i"}}
        ]
    })
    if(serch_products){
        if(serch_products.length == 0){
            return res.json({
            success:true,
            no_of_products:serched_products.length,
            message:"no more products"
        })
        }
        return res.json({
            success:true,
            no_of_products:serched_products.length,
            products:serched_products
        })
    }
    return res.json({
        success:false,
        message:"cannot find products"
    })
}


module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteSingleProduct, productCreateResponse,serch_products }
