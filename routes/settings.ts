import express from 'express';
import { protectRoute } from '../middlewares/auth';
import {resetAPIKey, updateUser, updateUserPayout } from '../controllers/settingsController';

const settingsRouter = express();


//Update user payout details
settingsRouter.post('/update-payout', protectRoute, updateUserPayout)

//Generate new API key
settingsRouter.post('/generate-api-key', protectRoute, resetAPIKey)

settingsRouter.post('/update-user', protectRoute, updateUser)

export default settingsRouter