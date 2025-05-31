import express from 'express';
import { protectRoute } from '../middlewares/auth';
import { fetchUser, resetAPIKey, updateUser, updateUserPayout } from '../controllers/settingsController';

const settingsRouter = express();

//Fetch user details
settingsRouter.get('/', protectRoute, fetchUser)

//Update user payout details
settingsRouter.post('/update-payout', protectRoute, updateUserPayout)

//Generate new API key
settingsRouter.post('/generate-api-key', protectRoute, resetAPIKey)

settingsRouter.post('/update-user', protectRoute, updateUser)

export default settingsRouter