const express = require("express");

const cors = require("cors")

require("dotenv").config()

const path = require("path")

const authRoute = require("./Routes/authRoutes");

const connectDb = require("./Config/Db");

const cookieParser = require("cookie-parser");

const productRoute = require("./Routes/productRoutes");

const orderRoute = require("./Routes/orderRoutes");

const app = express()

app.use(express.json())

const origin = 'https://fastkart-coral.vercel.app'

app.use(cors({origin:'https://fastkart-coral.vercel.app',credentials:true}))

connectDb();

app.use(cookieParser())

app.use("/auth",authRoute)

app.use("/order",orderRoute)

app.use("/product",productRoute)

app.use("/uploads",express.static(path.join(process.cwd(),'uploads')))

app.listen(process.env.PORT,()=>{console.log("server listening using port number");})