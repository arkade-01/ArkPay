import { checkOrderStatus, createOrder, fetchAccountName, fetchRate, fetchSupportedCurrencies, getInstitutions } from "../services/paymentHelper";
import { Response, Request } from "express"
import { OrderPayload, RatePayload, RateResponse, VerifyAccountPayload } from "../types/types";
import { userInfo } from "os";
import User from "../models/models";


export const getRate = async (req: Request, res: Response) => {
  const { token, amount, currency } = req.body;
  try {
    const rate = await fetchRate({
      token,
      amount,
      currency,
    });
    res.status(200).json(rate);
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json({ error: error.message });
      console.log("Error Fetching Rate: ", error);
    } else {
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Fetching Rate: Unknown error", error);
    }
  }
}

export const banks = async (req: Request, res: Response) => {
  const { currency } = req.body;
  try {
    const banks = await getInstitutions(currency);
    res.status(200).json(banks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json({ error: error.message });
      console.log("Error Fetching Rate: ", error);
    } else {
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Fetching Rate: Unknown error", error);
    }
    
  }
}

export const verifyAccount = async (req: Request, res: Response) => {
  try {

    const payload: VerifyAccountPayload = {
      institution: req.body.institution,
      accountIdentifier: req.body.accountNumber // Matching the expected field name in VerifyAccountPayload
    };

    const account = await fetchAccountName(payload);
    res.status(200).json(account);
  } catch (error) {
    res.status(403).json({ error: "An unknown error occurred" });
    console.log("Error verifying account:", error);
  }
}

export const currencies = async (req: Request, res: Response) => {
  try {
    const currencies = await fetchSupportedCurrencies()
    res.status(200).json(currencies);
  } catch(err) {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
      console.log("Error Fetching Currencies: ", err);
    } else {
      res.status(403).json({ error: "An unknown error occurred" });
      console.log("Error Fetching Currencies: Unknown error", err);
    }
  }
}

export const createOrderController = async (req: Request, res: Response) => {
  try {

    const user = await User.findById(req.body.userId);
    if (!user || !user.institutionCode || !user.bankAccountNumber || !user.accountName) {
      res.status(400).json({
        message: "Missing required user banking information",
        status: "error"
      });
      return
    }
    // Check if the user has a valid API key
    // Fetch the rate before creating the order
    const rate : RateResponse  = await fetchRate ({
      token: req.body.token,
      currency: "NGN",
      amount: 1
    });

    const payload: OrderPayload = {
      amount: req.body.amount,
      rate: rate.data,
      network: req.body.network,
      token: req.body.token,
      recipient: {
        institution: user.institutionCode,
        accountIdentifier: user.bankAccountNumber.toString(),
        accountName: user.accountName,
        memo: req.body.memo
      }, // This is properly typed as Recipient
      returnAddress: req.body.returnAddress,
      reference: req.body.reference,
      feePercent: req.body.feePercent,
      feeAddress: req.body.feeAddress
    };

    const order = await createOrder(payload);

    res.status(200).json({
      message: "Payment order initiated successfully",
      status: "success",
      data: order
    });
  } catch (error) {
     res.status(500).json({
      message: "Failed to create payment order",
      status: "error",
      data: null
    });
    console.log(error)
  }
}

export const checkOrderStatusController = async (req: Request, res: Response) => {
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
