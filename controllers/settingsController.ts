import { genKey } from "../middlewares/auth";
import User from "../models/models";
import {Response, Request} from "express"
import { sendApiKeyEmail } from "../services/emailService";


export const fetchUser = async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await User.findOne({
      id: userId
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Create a sanitized user object without password and API key
    const sanitizedUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      bankName: user.bankName,
      bankAccountNumber: user.bankAccountNumber,
      accountName: user.accountName,
      apiUsage: user.apiUsage,
      transactions: user.transactions,
    };

    res.status(200).json({ user: sanitizedUser });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const {
    firstName,
    lastName,
    email,
    country,
    bankName,
    bankAccountNumber,
    accountName,
    institutionCode,
  } = req.body;
  
  try {
    const user = await User.findOne({
      id: userId
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update user fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.country = country || user.country;
    user.bankName = bankName || user.bankName;
    user.bankAccountNumber = bankAccountNumber || user.bankAccountNumber;
    user.accountName = accountName || user.accountName;
    user.institutionCode = institutionCode || user.institutionCode;	

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const updateUserPayout = async (req: Request, res: Response) => {
  const userId = req.user._id;
  const { payoutCurrency } = req.body;
  try {
    const user = await User.findOne({
      id: userId
    })
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }
    user.payoutCurrency = payoutCurrency;

    await user.save();
    res.status(200).json({ message: 'User updated successfully' });
    return
  } catch (error) {
    res.status(500).json({ error: error });
    return
  }
}


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