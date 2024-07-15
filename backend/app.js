import express from "express";
import dbConnect from "./db/dbConnect";
import userRouter from "./routes/user.route";
import cors from "cors";
import authRouter from "./routes/auth.route";


const app = express();
const corsOptions = {
    origin: "*", // Replace frontend's domain
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
dbConnect();
app.use(express.json());
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export {app};