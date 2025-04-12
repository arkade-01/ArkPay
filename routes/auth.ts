import express from "express"
import { signup, signin, signout } from "../controllers/authController"

const authRouter = express()

//Signup Route
authRouter.post('/signup',signup )

// Signin Route
authRouter.post('/signin', signin)

// Signout Route
authRouter.post('/signout', signout)

export default authRouter;