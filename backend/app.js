import express from "express";
import dbConnect from "./db/dbConnect";
import userRouter from "./routes/user.route";
import cors from "cors";
import authRouter from "./routes/auth.route";

const allowedOrigins = [
  'http://localhost:5173'
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Include credentials if needed
}));

dbConnect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export { app };
