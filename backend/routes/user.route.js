import { Router } from "express";
import { updateUserProfile } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
const userRouter = Router();

userRouter.patch("/update-user", verifyToken, updateUserProfile);

export default userRouter;