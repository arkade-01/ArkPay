import User from "../models/models";
import {Response, Request} from "express"
import { createToken, genKey } from "../middlewares/auth";
import { getOTP, sendApiKeyEmail } from "../services/emailService";
 


export const signup = async (req: Request, res: Response) => {
  const {  email, password, country } = req.body;
  // Generate the API key
  const apiKey = genKey();

  try {
    // Store the unhashed API key to send in the email
    const originalApiKey = apiKey;

    // Create the user - this will hash the API key in the pre-save hook
    const user = await User.create({ email, password, apiKey, country });

    // Send the welcome email with API key after successful user creation
    await sendApiKeyEmail(email, originalApiKey);

    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }); // 2 days
    res.status(201).json({ user: user._id });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
      console.log("Error Creating User: ", err);
    }
    // Handle case where err is not an Error object
    else {
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Creating User: ", err);
    }
  }
}


export const signin = async (req: Request, res: Response) => {
  const {email, password} = req.body
  try {
    const user = await User.signIn(email, password)
    const token = createToken(user._id)
    res.cookie("jwt", token, { maxAge: 2 * 24 * 60 * 60 * 1000 }) // 2 days // htppOnly - reminder
    res.status(200).json({ message: "User Signed In" })
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
  res.status(200).json({ message: "User Signed Out" })
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

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return; // Still use return to stop function execution
    }

    // Check if the reset token exists and hasn't expired
    if (!user.resetToken || !user.resetTokenExpiration) {
      res.status(400).json({ error: 'No reset request found' });
      return;
    }

    // Check if the token has expired
    if (new Date() > user.resetTokenExpiration) {
      res.status(400).json({ error: 'Reset code has expired' });
      return;
    }

    // Verify the code matches
    if (user.resetToken !== code) {
      res.status(400).json({ error: 'Invalid reset code' });
      return;
    }

    // Update the password
    user.password = newPassword;

    // Clear the reset token and expiration
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    // Save the user - the pre-save hook will hash the password
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetAPIKey = async (req: Request, res: Response) => {
  try {
    // The user ID is available from the JWT token
    const userId = req.user._id;

    // Generate new API key
    const newApiKey = genKey();

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }

    // Update the API key  
    user.apiKey = newApiKey;

    // Save the user - the pre-save hook will hash the API key
    await user.save();

    // Send the new API key to the user   
    await sendApiKeyEmail(user.email, newApiKey);

     res.status(200).json({
      message: 'API key reset successful',
      // apiKey: newApiKey // Optionally return the key in the response too
    });
    return
  } catch (error) {
    console.error('Error resetting API key:', error);
     res.status(500).json({
      error: 'Failed to reset API key',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return
  }
}