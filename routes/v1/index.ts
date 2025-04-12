import express from "express"
import homeRouter from ".."
import authRouter from "../auth"

const allRoutes = express()

allRoutes.use('/home', homeRouter)
allRoutes.use('/auth', authRouter)

export default allRoutes