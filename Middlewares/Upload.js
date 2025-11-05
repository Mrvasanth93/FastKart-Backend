import multer from "multer";
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads")
    },
    filename:(req,file,cb)=>{
        const fileName = req.body.productName ? req.body.productName.replace(" ","_")+path.extname(file.originalname) : file.originalname
        cb(null,fileName)
    }
})

const upload = multer({storage})

export default upload