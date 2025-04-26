import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcrypt"

// Define the interface for the User document
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  apiKey: string | null;
  apiUsage: ApiUsage;
  country: string;
  payoutCurrency: string;
  bankAccount?: number;
  bankName?: string;
  resetToken?: string;
  resetTokenExpiration?: Date;

  incrementApiUsage: () => Promise<IUser>;
}

interface ApiUsage {
  dates: {
    [date: string]: number;  // Date string -> number of calls
  };
  totalCalls: number;
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
  apiKey: {
    type: String,
    default: null,
  },
  apiUsage: {
    dates: {type: Map, of: Number, default: {},},
    totalCalls: {type: Number, default: 0}
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
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },

}, {timestamps: true})

userSchema.pre('save', async function (next) {
  // Only hash the password if it's modified or new
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Only hash the API key if it's modified or new
  if (this.isModified('apiKey') && this.apiKey) {
    const salt = await bcrypt.genSalt();
    this.apiKey = await bcrypt.hash(this.apiKey, salt);
  }

  next();
});

userSchema.methods.incrementApiUsage = async function () {
  const today = new Date().toISOString().split('T')[0];

  // Initialize today's count if it doesn't exist
  const currentCount = this.apiUsage.dates.get(today) || 0;

  // Update the count for today
  this.apiUsage.dates.set(today, currentCount + 1);

  // Increment total calls
  this.apiUsage.totalCalls += 1;

  return this.save();
};

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