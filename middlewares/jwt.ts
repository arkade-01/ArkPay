import jwt, { SignOptions } from "jsonwebtoken"
import config from "../config/config"
import { Response, Request, NextFunction } from "express"


const secret = config.jwtSecret

// Properly type the options
const options: SignOptions = {
  expiresIn: "2d" // Token expiration time (2 days)
}
export const createToken = (id: string) => {
 return jwt.sign({id},secret,options)
}

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" })
      }
      next()
    })
  } else {
    res.status(401).json({ error: "Unauthorized" })
  }
}