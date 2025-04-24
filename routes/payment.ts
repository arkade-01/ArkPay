import express from "express"
import { banks, createOrderController, currencies, getRate, verifyAccount } from "../controllers/paymentController"
import { validateKey } from "../middlewares/auth"

const payRouter = express()

payRouter.get('/', validateKey, getRate)

payRouter.get('/currencies', validateKey, currencies)

payRouter.get('/banks', validateKey, banks)	

payRouter.post('/account-name', validateKey, verifyAccount)

payRouter.post('/createOrder', validateKey, createOrderController)

export default payRouter