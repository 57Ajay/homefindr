import { Router } from "express";
import { signup, signIn } from "../controllers/auth.controller";


const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signIn);

export default authRouter;