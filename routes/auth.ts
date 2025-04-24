import express from "express"
import { signup, signin, signout, forgotPassword, resetPassword, resetAPIKey } from "../controllers/authController"
import { protectRoute } from "../middlewares/auth"

const authRouter = express()

//Signup Route
authRouter.post('/signup', protectRoute,signup )

// Signin Route
authRouter.post('/signin', protectRoute, signin)

// Signout Route
authRouter.post('/signout', protectRoute, signout)

// Forgot Password
authRouter.post('/forgot-password', protectRoute, forgotPassword)

//Reset Password 
authRouter.post('/reset-password', protectRoute, resetPassword)

//Generate new API key
authRouter.post('/generate-api-key', protectRoute, resetAPIKey)


export default authRouter;