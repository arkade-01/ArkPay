import jwt, { SignOptions } from "jsonwebtoken"
import config from "../config/config"
import { Response, Request, NextFunction } from "express"
import  User  from "../models/models"
import bcrypt from "bcrypt"


declare global {
  namespace Express {
    interface Request {
      user?: any; // Or a more specific type representing your user model
    }
  }
}

const secret = config.jwtSecret

// Properly type the options
const options: SignOptions = {
  expiresIn: "2d" // Token expiration time (2 days)
}
export const createToken = (id: string) => {
 return jwt.sign({id},secret,options)
}

export const genKey = () => {
  //create a base-36 string that is always 30 chars long a-z0-9
  // 'an0qrr5i9u0q4km27hv2hue3ywx3uu'
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

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

export const validateKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      res.status(401).json({ error: "API key is required" });
      return;
    }

    // Find the user by API key pattern
    const users = await User.find({ apiKey: { $ne: null } });

    // Find a user whose API key matches when compared with bcrypt
    let foundUser = null;
    for (const user of users) {
      if (user.apiKey && await bcrypt.compare(apiKey, user.apiKey)) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }

    // Attach the user to the request for later use
    req.user = foundUser;

    // Increment API usage
    await foundUser.incrementApiUsage();

    next();
  } catch (error) {
    console.error("API key validation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};