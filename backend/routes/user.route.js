import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.send("Hello World! This is Ajay");
});

userRouter.get("/name", (req, res)=>{
    res.send("My name is Ajay Upadhyay")
});


export default userRouter;