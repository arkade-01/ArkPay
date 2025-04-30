import { Response, Request } from "express"
import User from "../models/models"
import { checkOrderStatus } from "../services/paymentHelper"

export const getUserTransactions = async (req: Request, res: Response) => {
  const userId = req.user._id
  const user = await User.findById(userId)
  if (!user) {
    res.status(404).json({ error: 'user not found' })
    return
  }

  const userTransactions = user.transactions
  res.status(200).json({
    userTransactions
  })
}

export const transactionDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const orderStatus = await checkOrderStatus(id);
    res.status(200).json({
      message: "Order status fetched successfully",
      status: orderStatus,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order status",
      status: error,
    });
    console.log(error)
  }
}