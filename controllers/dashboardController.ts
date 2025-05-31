import { Response, Request } from "express"
import User from "../models/models"

export const getMetrics = async (req: Request, res: Response) => {
  const userId = req.user.id
  const user = await User.findOne({
    id: userId
  })
  if (!user) {
    res.status(404).json({ error: 'user not found' })
    return
  }

  // Calculate total transactions
  const totalTransactions = user.transactions.length;

  // Calculate total amount processed
  const totalAmountProcessed = user.transactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);

  const completedPayouts = totalAmountProcessed;

  // Return the metrics
  res.status(200).json({
    totalTransactions,
    totalAmountProcessed,
    completedPayouts
  });
}

export const getRecentTransactions = async (req: Request, res: Response) => {
  const userId = req.user.id
  const user = await User.findOne({
    id: userId
  })
  if (!user) {
    res.status(404).json({ error: 'user not found' })
    return
  }

  const recentTransactions = user.transactions
    .slice(-10)  // Get the last 10 transactions
    .reverse();  // Reverse to get most recent first

  res.status(200).json({
    recentTransactions
  });
}

export default getRecentTransactions;