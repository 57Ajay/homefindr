import express from "express";
import dbConnect from "./db/dbConnect";
import userRouter from "./routes/user.route";
import cors from "cors";
const app = express();
const corsOptions = {
    origin: "*", // Replace with your frontend's domain
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
dbConnect();
app.use(express.json());
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);


export {app};