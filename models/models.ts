import { Schema, model, Document } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  email: string;
  password: string;
  country: string;
  payoutCurrency: string;
}


const userSchema = new Schema ({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  payoutCurrency: {
    type: String,
    required: true,
  }
})

const User = model<IUser>("User", userSchema);


export default User;