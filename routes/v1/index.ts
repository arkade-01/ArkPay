import express from "express"
import homeRouter from ".."
import authRouter from "../auth"
import payRouter from "../payment"
import settingsRouter from "../settings"
import dashboardRouter from "../dashboard"
import transactionRouter from "../transactions"

const allRoutes = express()

allRoutes.use('/home', homeRouter)
allRoutes.use('/auth', authRouter)
allRoutes.use('/dashboard', dashboardRouter)
allRoutes.use('/payments', payRouter)
allRoutes.use('/settings', settingsRouter)
allRoutes.use('/transactions', transactionRouter)

export default allRoutes