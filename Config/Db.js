const mongoose = require("mongoose")
const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.DATABASE_URL)
        if (db) {
            console.log("Database connected");
        }
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = connectDb;