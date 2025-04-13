import dotenv from "dotenv"
import path from "path"

dotenv.config()

interface Config {
  port: Number
  database: {
    url: string
    collection: string
    path: string
  }
  jwtSecret: string
  emailService: {
    service: string
    auth: {
      user: string
      pass: string
    }
    from: string
    subjectPrefix: string
  }
  templatePath: string
  setTemplatePath: (newPath: string) => void
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  database: {
    url: process.env.DB_HOST as string || "localhost",
    collection: process.env.MIGRATE_MONGO_COLLECTION as string || "migrations",
    path: process.env.MIGRATE_MIGRATIONS_PATH as string || "./migrations",
  },
  jwtSecret: process.env.SECRET as string,
  emailService: {
    service: process.env.EMAIL_SERVICE as string,
    auth: {
      user: process.env.EMAIL_USER as string,
      pass: process.env.EMAIL_PASS as string,
    },
    from: process.env.EMAIL_FROM as string,
    subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX as string || '',
  },
  templatePath: path.join(__dirname, '../templates'),
  setTemplatePath: function (newPath: string) {
    this.templatePath = newPath;
  }
}

export default config