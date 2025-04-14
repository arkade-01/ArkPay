import { get } from "http";
import { fetchAccountName, fetchRate, fetchSupportedCurrencies, getInstitutions } from "../services/paymentHelper";
import { Response, Request } from "express"
import { VerifyAccountPayload } from "../types/types";


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

