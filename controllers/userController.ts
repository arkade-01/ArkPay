import User from "../models/models";
import {Response, Request} from "express"


export const updateUser = async (req: Request, res: Response) => {
  const userId = req.user.id;
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
      id: userId,
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
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
    res.status(200).json({ message: "User updated successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

export const updateUserPayout = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { payoutCurrency } = req.body;
  try {
    const user = await User.findOne({
      id: userId,
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    user.payoutCurrency = payoutCurrency;

    await user.save();
    res.status(200).json({ message: "User updated successfully" });
    return;
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
};

