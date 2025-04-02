import express from "express"
import homeRouter from ".."

const allRoutes = express()

allRoutes.use('/home', homeRouter)

export default allRoutes