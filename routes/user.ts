import express, {Response, Request} from "express"
import { protectRoute } from "../middlewares/auth";
import { updateUser, updateUserPayout } from "../controllers/userController";

const userRouter = express()

userRouter.post("/update-user", protectRoute, updateUser);

//Update user payout details
userRouter.post('/update-payout', protectRoute, updateUserPayout)

export default userRouter