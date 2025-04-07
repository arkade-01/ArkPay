import express from "express"
import allRoutes from "./routes/v1"
import { errorHandler } from "./middlewares/errorHandler";
import config from "./config/config";
import connectToDatabase from "./config/dbConfig";



const start = async () => {
    try {
        await connectToDatabase();
        console.log("Connected to MongoDB successfully!");

      const app = express()

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