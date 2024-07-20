import { Router } from "express";
import { deleteUserAccount, updateUserProfile } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
const userRouter = Router();

userRouter.patch("/update-user", verifyToken, updateUserProfile);
userRouter.delete("/delete-user", verifyToken, deleteUserAccount);

export default userRouter;