import express from "express"
import { signup, signin, signout } from "../controllers/authController"

const authRouter = express()

//Signup Route
authRouter.post('/signup',signup )

// Signin Route
authRouter.post('/signin', signin)

// Signout Route
authRouter.post('/signout', signout)

// Forgot Password
authRouter.post('/forgot-password', (req, res) => {
    res.send("Forgot Password")
})

export default authRouter;