const express = require("express")

const { signup, login, getProfile, updateProfile, justMessage, logout, updateEmail, updatePassword } = require("../Controllers/authController")

const {isAuthenticated} = require("../Middlewares/authMiddleware")

const authRoute = express.Router()

authRoute.route("/signup").post(signup)

authRoute.route("/login").post(login)

authRoute.route("/profile").get(isAuthenticated,getProfile)

authRoute.route("/update-profile").put(isAuthenticated,updateProfile)

authRoute.route("/logout").delete(isAuthenticated,logout)

authRoute.route("/update-email").put(isAuthenticated,updateEmail)

authRoute.route("/update-password").put(isAuthenticated,updatePassword)

module.exports = authRoute