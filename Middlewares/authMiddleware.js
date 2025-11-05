const userModel = require("../Models/userModel");
const { verifyToken } = require("../utlis/auth")

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (token) {
            const _id = verifyToken(token);
            if (_id) {
                const user = await userModel.findOne({ _id })
                if (user) {
                    req.user = user
                    next()
                    return
                }
                return res.json({
                    success: false,
                    message: "cannot find user"
                })
            }
            return res.json({
                success: false,
                message: "un Authorized token"
            })
        }
        return res.json({
            success: false,
            message: "continue with login"
        })
    } catch (error) {
        return res.json({
            success: false,
            errorFrom: "authmiddleware",
            error: error.message
        })
    }
}

const isAdminOrSeller = async (req, res, next) => {
    if (req.user) {
        if (req.user.role == "admin" || req.user.role == "seller") {
            next();
            return
        }
        else {
            return res.json({
                success: false,
                message: "this page can only accessed by the admin or seller"
            })
        }
    }
    else{
        return res.json({
            success:false,
            message:"continue with login"
        })
    }
}

const isAdmin = async (req,res,next) =>{
    if (req.user) {
        if (req.user.role == "admin") {
            next();
            return
        }
        else {
            return res.json({
                success: false,
                message: "this page can only accessed by the admin"
            })
        }
    }
    else{
        return res.json({
            success:false,
            message:"continue with login"
        })
    }
}
module.exports = { isAuthenticated, isAdminOrSeller, isAdmin }