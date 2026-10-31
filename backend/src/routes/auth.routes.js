import {Router} from "express";
import { getMe, loginUser, registerUser, resendEmail, verifyEmail } from "../controllers/auth.controller.js";
import { registerValidation } from "../validation/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router()

authRouter.post("/register", registerValidation, registerUser)

authRouter.post("/resend-email", resendEmail)

authRouter.get("/verify-email", verifyEmail)

authRouter.post("/login", loginUser)

authRouter.get("/get-me", authUser, getMe)



export default authRouter
