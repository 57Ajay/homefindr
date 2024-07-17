import { Router } from "express";
import { getUserByUsername } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/:username", getUserByUsername);
userRouter.get("/", (req, res) => {
    res.send("Hello from user router");
});
export default userRouter;