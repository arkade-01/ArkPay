import express from 'express';
import { protectRoute } from '../middlewares/auth';
import {resetAPIKey} from '../controllers/walletController';

const walletRouter = express();

//Generate new API key
walletRouter.post('/generate-api-key', protectRoute, resetAPIKey)



export default walletRouter