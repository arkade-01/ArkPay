import express from "express"
import allRoutes from "./routes/v1"
import { errorHandler } from "./middlewares/errorHandler";


const app = express()

// Declare All the Routes in the application
app.use('/v1/api',allRoutes )

// Global error handler (should be after routes)
app.use(errorHandler);

app.listen(3000)
console.log('Welcome to ArkPay API')