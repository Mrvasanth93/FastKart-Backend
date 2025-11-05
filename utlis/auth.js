const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const SECRET_KEY = process.env.SECRET_KEY 
const genrateToken = (userId) =>{
    const token = jwt.sign(userId,SECRET_KEY)
    return token;
}
const verifyToken = (token)=>{
    const verify = jwt.verify(token,SECRET_KEY)
    return verify
}
const encryptPassword = async(password) =>{
   const hashedPassword = await bcrypt.hash(password,10)
   return hashedPassword;
}
const decryptPassword = async(password,encryptedPassword) =>{
    const originalPassword = await bcrypt.compare(password,encryptedPassword)
    return originalPassword;
}
module.exports = {genrateToken,verifyToken,decryptPassword,encryptPassword}