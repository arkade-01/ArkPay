import express from "express"
import homeRouter from ".."
import authRouter from "../auth"
import payRouter from "../payment"
import dashboardRouter from "../dashboard"
import transactionRouter from "../transactions"
import userRouter from "../user"
import walletRouter from "../wallets"

const allRoutes = express()

allRoutes.use('/home', homeRouter)
allRoutes.use('/auth', authRouter)
allRoutes.use('/dashboard', dashboardRouter)
allRoutes.use('/payments', payRouter)
allRoutes.use('/wallets', walletRouter)
allRoutes.use('/transactions', transactionRouter)
allRoutes.use('/user', userRouter)

export default allRoutes