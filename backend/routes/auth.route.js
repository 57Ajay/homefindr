import { Router } from "express";
import { signup, signIn, signOut, google } from "../controllers/auth.controller";
import verifyToken from "../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", verifyToken, signOut);
authRouter.post("/google", google);


export default authRouter;