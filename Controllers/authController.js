const userModel = require("../Models/userModel");
const { genrateToken, encryptPassword, decryptPassword, verifyToken } = require("../utlis/auth");

const signup = async (req, res) => {
    try {
        const { fullName, userName, email, password, mobileNumber } = req.body;
        if (!fullName || fullName == "" || !userName || userName == "" || !email || email == "" || !password || password == "" || !mobileNumber || mobileNumber == "") {
            return res.json({
                success: false,
                message: "major fields are required"
            })
        }
        if(mobileNumber.toString().length != 10){
            return res.json({
                success:false,
                message:"enter a valid mobile number"
            })
        }
        const findByEmail = await userModel.findOne({ email })
        if (findByEmail) {
            return res.json({
                success: false,
                message: "user already exist by the email"
            })
        }
        const findByMobileNumber = await userModel.findOne({mobileNumber})
        if (findByMobileNumber) {
            return res.json({
                success: false,
                message: "user already exist by the mobile number"
            })
        }

        const findByUsername = await userModel.findOne({userName:`@${userName}`})
        if (findByUsername) {
            return res.json({
                success: false,
                message: "user already exist by the username"
            })
        }
        const hashedPassword = await encryptPassword(password)
        const user = await userModel.create({ fullName, userName: `@${userName}`, email, password: hashedPassword, mobileNumber });
        if (user) {
            return res.json({
                success: true,
                message: "Signup successfull",
                user
            })
        }
        return res.json({
            success: false,
            message: "Signup failed try again"
        })
    } catch (error) {
        if (error.message == "Cannot destructure property 'fullName' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "signup",
            message: error.message
        })
    }
}

const login = async (req, res) => {
    const handleLogin = async (passwordFromClient, user) => {
        const isVaild = await decryptPassword(passwordFromClient, user.password)
        if (isVaild) {
            const token = genrateToken(user._id.toString());
            res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 })
            return res.json({
                success: true,
                message: "login successfull",
                user
            })
        }
        return res.json({
            success: false,
            message: "Password not matched"
        })
    }
    try {
        const { credintials, password } = req.body

        if (!credintials || credintials == "" || !password || password == "") {
            return res.json({
                success: false,
                message: "major fields are required"
            })
        }
        if (isNaN(credintials)) {
            const findByEmail = await userModel.findOne({ email: credintials })
            if (findByEmail) {
                return handleLogin(password, findByEmail)
            }
            else {
                const findByUsername = await userModel.findOne({ userName: `@${credintials}` })
                if (findByUsername) {
                    return handleLogin(password, findByUsername)
                }
                else {
                    return res.json({
                        success: false,
                        message: "cannot find user"
                    })
                }
            }
        }
        else {
            const findByMobileNumber = await userModel.findOne({ mobileNumber: credintials })
            if (findByMobileNumber) {
                return handleLogin(password, findByMobileNumber)
            }
            else {
                return res.json({
                    success: false,
                    message: "cannot find user"
                })
            }
        }

    } catch (error) {
        if (error.message == "Cannot destructure property 'credintials' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "login",
            message: error.message
        })
    }

}

const getProfile = async (req, res) => {
    if (req.user) {
        return res.json({
            success: true,
            user: req.user
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        var { userName, fullName, mobileNumber } = req.body;
        const user = req.user;
        if (!userName || userName == "") {
            userName = user.userName
        }
        if (!fullName || fullName == "") {
            fullName = user.fullName
        }
        if (!mobileNumber || mobileNumber == "") {
            mobileNumber = user.mobileNumber
        }
        if(mobileNumber.toString().length != 10){
            return res.json({
                success:false,
                message:"enter a valid mobile number"
            })
        }

        const isExistbyUserName = await userModel.findOne({ userName: `@${userName}` })
        if (isExistbyUserName) {
            return res.json({
                success: false,
                message: "username is already exist"
            })
        }

        const updateUser = await userModel.updateOne({ _id: user._id }, {
            userName: `@${userName}`,
            fullName,
            mobileNumber,
        })
        if (updateUser.acknowledged == true) {
            if (updateUser.matchedCount > 0) {
                if (updateUser.modifiedCount > 0) {
                    return res.json({
                        success: true,
                        message: "updated successfully"
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
                    message: "cannont find update user"
                })
            }
        }
        return res.json({
            success: false,
            message: "update failed"
        })

    } catch (error) {
        if (error.message == "Cannot destructure property 'userName' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                errorFrom: "update profile",
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "update profile",
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    console.log(req.user);
    console.log(req.cookies.token);
    if (req.user) {
        req.user = null
    }
    res.clearCookie("token", { maxAge: 0 })
    console.log(req.user);
    console.log(req.cookies.token);
    return res.json({
        success: true,
        message: "logout..."
    })
}

const updateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || email == "") {
            return res.json({
                success: false,
                message: "email is required"
            })
        }
        const isExistByEmail = await userModel.findOne({ email })
        if (isExistByEmail) {
            return res.json({
                success: false,
                message: "email is already exist"
            })
        }
        const user = req.user
        const updateEmail = await userModel.updateOne({ _id: user._id }, { email })
        if (updateEmail.acknowledged == true) {
            if (updateEmail.matchedCount == 1) {
                if (updateEmail.modifiedCount == 1) {
                    return res.json({
                        success: true,
                        message: "email updated successfully"
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
                    message: "cannont find update user"
                })
            }
        }
        return res.json({
            success: false,
            message: "update failed"
        })
    } catch (error) {
        if (error.message == "Cannot destructure property 'email' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                errorFrom: "update email",
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "update email",
            error: error.message
        })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body
        const user = req.user
        if (!oldPassword || oldPassword == "" || !newPassword || newPassword == "" || !confirmPassword || confirmPassword == "") {
            return res.json({
                success: false,
                message: "fill the credintials"
            })
        }
        if (oldPassword == newPassword) {
            return res.json({
                success: false,
                message: "same password , try new character"
            })
        }
        if (await decryptPassword(oldPassword, user.password)) {
            if (newPassword == confirmPassword) {
                const encryptedPassword = await encryptPassword(newPassword);
                const updatePassword = await userModel.updateOne({ _id: user._id }, { password: encryptedPassword })
                if (updatePassword.acknowledged == true) {
                    if (updatePassword.matchedCount > 0) {
                        if (updatePassword.modifiedCount > 0) {
                            return res.json({
                                success: true,
                                message: "password updated successfully"
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
                            message: "cannont find update user"
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
                    message: "password not same"
                })
            }
        }
        else {
            return res.json({
                success: false,
                message: "password not matched"
            })
        }
    } catch (error) {
        if (error.message == "Cannot destructure property 'oldPassword' of 'req.body' as it is undefined.") {
            return res.json({
                success: false,
                errorFrom: "update password",
                message: "fill the credintials"
            })
        }
        return res.json({
            success: false,
            errorFrom: "update password",
            error: error.message
        })
    }

}

module.exports = { signup, login, getProfile, updateProfile, logout, updateEmail, updatePassword }