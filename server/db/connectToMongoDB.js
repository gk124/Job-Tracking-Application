const mongoose=require("mongoose");
require("dotenv").config();
const config = require("../config.json");

const connectToMongoDB=async()=>{
    try {
        await mongoose.connect(config.connectionString);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error.message);
    }
}

module.exports= connectToMongoDB();