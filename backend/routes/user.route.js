import { Router } from "express";
import { deleteUserAccount, updateUserProfile } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
import regenerateAccessToken from "../middlewares/regenerateAccessToken.middleware";

const userRouter = Router();

userRouter.patch("/update-user", regenerateAccessToken, verifyToken, updateUserProfile);
userRouter.delete("/delete-user", regenerateAccessToken, verifyToken, deleteUserAccount);

export default userRouter;