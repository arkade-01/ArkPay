import express from "express"
import homeRouter from ".."
import authRouter from "../auth"
import payRouter from "../payment"

const allRoutes = express()

allRoutes.use('/home', homeRouter)
allRoutes.use('/auth', authRouter)
allRoutes.use('/payment', payRouter)

export default allRoutes