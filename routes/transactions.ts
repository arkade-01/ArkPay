import express from "express"
import { protectRoute } from "../middlewares/auth"
import { transactionDetails, getUserTransactions } from "../controllers/transactionsController"

const transactionRouter = express()

transactionRouter.get('/', protectRoute, getUserTransactions)

transactionRouter.get('/transactiondetails/:id', protectRoute, transactionDetails)

export default transactionRouter