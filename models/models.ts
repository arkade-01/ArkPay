import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt"

// Define the interface for the User document
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  country: string;
  payoutCurrency: string;
}

interface UserInterface extends Model<IUser> {
  signIn(email: string, password: string): any
}

const userSchema = new Schema ({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required:[true, 'Enter a valid password, Minimum of 8 Characters']
  },
  country: {
    type: String,
    required: true,
  },
  payoutCurrency: {
    type: String,
  },
  bankAccount: {
    type: Number,
  },
  bankName: {
    type: String,
  },

})

userSchema.pre('save', async function(next) {
  const salt = await  bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.statics.signIn = async function(email: string, password: string) {
  const user = await this.findOne({ email })
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    }
    throw Error('Incorrect Password')
  }
  throw Error('Incorrect Email')
}

const User: UserInterface = model<IUser, UserInterface>("User", userSchema);


export default User;