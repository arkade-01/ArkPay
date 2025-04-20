import express from "express"
import { banks, createOrderController, currencies, getRate, verifyAccount } from "../controllers/paymentController"

const payRouter = express()

payRouter.get('/', getRate)

payRouter.get('/currencies', currencies)

payRouter.get('/banks', banks)	

payRouter.post('/account-name', verifyAccount)

payRouter.post('/createOrder', createOrderController)

export default payRouter