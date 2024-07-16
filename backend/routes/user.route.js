import { Router } from "express";
import { getUserByUsername } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/:username", getUserByUsername);

export default userRouter;