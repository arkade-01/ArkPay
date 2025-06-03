import express from "express"
import { signup, signin, signout, forgotPassword, resetPassword, fetchUser } from "../controllers/authController"
import { protectRoute } from "../middlewares/auth"

const authRouter = express()

//Signup Route
authRouter.post('/signup', signup )

// Signin Route
authRouter.post('/signin',  signin)

// Signout Route
authRouter.post('/signout',  protectRoute ,signout)

// Forgot Password
authRouter.post('/forgot-password',  forgotPassword)

//Reset Password 
authRouter.post('/reset-password',  resetPassword)

//Fetch user details
authRouter.get('/me', protectRoute, fetchUser)



export default authRouter;