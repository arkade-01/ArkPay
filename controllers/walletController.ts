import { genKey } from "../middlewares/auth";
import User from "../models/models";
import {Response, Request} from "express"
import { sendApiKeyEmail } from "../services/emailService";



export const resetAPIKey = async (req: Request, res: Response) => {
  try {
    // The user ID is available from the JWT token
    const userId = req.user._id;

    // Generate new API key
    const newApiKey = genKey();

    // Get the user
    const user = await User.findOne({
      id: userId
    });
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