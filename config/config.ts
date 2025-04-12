import dotenv from "dotenv"

dotenv.config()

interface Config {
  port: Number
  database: {
    url: string
  }
  jwtSecret: string
}	

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DB_HOST as string || "localhost",
  },
  jwtSecret: process.env.SECRET as string,
}

export default config