import express, {Response, Request} from "express"
import { protectRoute } from "../middlewares/auth"
import getRecentTransactions, { getMetrics } from "../controllers/dashboardController"

const dashboardRouter = express()

dashboardRouter.get('/',protectRoute, getMetrics)

dashboardRouter.get('/recent-transactions', protectRoute, getRecentTransactions )

export default dashboardRouter