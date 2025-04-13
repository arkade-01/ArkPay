import express from "express"
import { signup, signin, signout, forgotPassword } from "../controllers/authController"

const authRouter = express()

//Signup Route
authRouter.post('/signup',signup )

// Signin Route
authRouter.post('/signin', signin)

// Signout Route
authRouter.post('/signout', signout)

// Forgot Password
authRouter.post('/forgot-password', forgotPassword)

export default authRouter;