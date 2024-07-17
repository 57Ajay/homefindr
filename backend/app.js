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
app.use(
    (err, req, res, next) => {
        // Log the error for debugging (adjust as needed)
        console.error(err); 
      
        // Determine HTTP status code
        const statusCode = err.statusCode || 500; // Use custom status or 500 (Internal Server Error)
      
        // Prepare error response object (customize for your needs)
        const errorResponse = {
          status: 'error',
          message: err.message || 'Internal Server Error', // Use custom message or default
          ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}) // Include stack trace in development
        };
      
        // Send the error response
        res.status(statusCode).json(errorResponse);
        next();
      }
);


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

export {app};