import { Router } from "express";
import { signup } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signup);

export default authRouter;