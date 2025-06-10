import express from "express"
import allRoutes from "./routes/v1"
import { errorHandler } from "./middlewares/errorHandler";
import config from "./config/config";
import connectToDatabase from "./config/dbConfig";
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';




const start = async () => {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB successfully!");

      const app = express()

      //middlewares
        app.use(cors({
          origin: '*', // Replace with your frontend URL
          credentials: true, // Allow cookies to be sent
    }))
        app.use(cookieParser())
        app.use(bodyParser.urlencoded({extended:false}))
        app.use(express.json())

      // Declare All the Routes in the application
      app.use('/v1/api', allRoutes)

      // Global error handler (should be after routes)
      app.use(errorHandler);

      app.listen(config.port)
      console.log('Welcome to ArkPay API')
      console.log(`Listening on port ${config.port}`)


    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit the process with failure
    }
}

// Call the start function to initialize the server
start()