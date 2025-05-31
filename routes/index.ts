import express, {Response, Request} from "express"

const homeRouter = express()

homeRouter.get("/", (req: Request, res: Response) => {
  res.send(
    "ArkPay is Active"
  )
})

export default homeRouter