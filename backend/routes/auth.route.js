import { Router } from "express";
import { signup, signIn, signOut } from "../controllers/auth.controller";
import verifyToken from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", verifyToken, signOut);

export default authRouter;