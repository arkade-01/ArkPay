import User from "../models/models";
import {Response, Request} from "express"
import { createToken } from "../middlewares/jwt";
import { getOTP } from "../services/emailService";
 

export const signup = async (req: Request, res: Response) => {
  const { email, password, country } = req.body;
  try {
     const user = await User.create({email, password, country})
     const token = createToken(user._id)
     res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000}) // 2 days // htppOnly - reminder
     res.sendStatus(201)
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(403).json({error: err.message})
      console.log("Error Creating User: ", err)
    }
    // Handle case where err is not an Error object
    else {
    res.sendStatus(403).json({error: "An unknown error occurred"})
    console.log("Error Creating User: ", err)
    }
  }
}


export const signin = async (req: Request, res: Response) => {
  const {email, password} = req.body
  try {
    const user = await User.signIn(email, password)
    const token = createToken(user._id)
    res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }) // 2 days // htppOnly - reminder
    res.sendStatus(200).json({ message: "User Signed In" })
  } catch (err: unknown) {
    // Type guard to check if err is an Error object
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
      console.log("Error Signing in User: ", err);
    } else {
      // Handle case where err is not an Error object
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Signing in User: Unknown error", err);
    }
  }
}

export const signout = (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 }) // 1ms
  res.sendStatus(200).json({ message: "User Signed Out" })
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await getOTP(email, 'reset');
    res.status(200).json({ message: 'Password reset code sent to your email' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
      console.log("Error Sending Password Reset Code: ", err);
    } else {
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Sending Password Reset Code: Unknown error", err);
    }
  }
};