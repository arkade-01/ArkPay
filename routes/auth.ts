import express from "express"
import { signup, signin, signout, forgotPassword, resetPassword, resetAPIKey } from "../controllers/authController"
import { protectRoute } from "../middlewares/auth"

const authRouter = express()

//Signup Route
authRouter.post('/signup',signup )

// Signin Route
authRouter.post('/signin', signin)

// Signout Route
authRouter.post('/signout', signout)

// Forgot Password
authRouter.post('/forgot-password', forgotPassword)

//Reset Password 
authRouter.post('/reset-password', resetPassword)

//Generate new API key
authRouter.post('/generate-api-key', protectRoute, resetAPIKey)


export default authRouter;