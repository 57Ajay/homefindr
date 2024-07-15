import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import { dbName } from "../constants/dbName";

const dbConnect = async()=>{
    // console.log(process.env.MONGODB_URL)
    await mongoose.connect(`${process.env.MONGODB_URL}/${dbName}`);
    console.log("Connected to MongoDB");
};

export default dbConnect;
