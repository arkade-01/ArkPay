import express from "express"
import homeRouter from ".."
import authRouter from "../auth"
import payRouter from "../payment"
import settingsRouter from "../settings"

const allRoutes = express()

allRoutes.use('/home', homeRouter)
allRoutes.use('/auth', authRouter)
allRoutes.use('/payment', payRouter)
allRoutes.use('/settings', settingsRouter)

export default allRoutes