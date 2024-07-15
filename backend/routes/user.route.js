import { Router } from "express";
import { createUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello World! This is Ajay");
});

userRouter.get("/name", (req, res)=>{
    res.send("My name is Ajay Upadhyay")
});

userRouter.post("/register", createUser);

export default userRouter;