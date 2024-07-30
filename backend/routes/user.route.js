import { Router } from "express";
import { deleteUserAccount, updateUserProfile, getUserListings, getUser } from "../controllers/user.controller";
import verifyToken from "../middlewares/auth.middleware";
import regenerateAccessToken from "../middlewares/regenerateAccessToken.middleware";

const userRouter = Router();

userRouter.patch("/update-user", regenerateAccessToken, verifyToken, updateUserProfile);
userRouter.delete("/delete-user", regenerateAccessToken, verifyToken, deleteUserAccount);
userRouter.get("/listings/:id", verifyToken, getUserListings)
userRouter.get("/:id", verifyToken, getUser)

export default userRouter;