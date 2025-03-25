import express from 'express';
import {response,getHistory} from '../controllers/bot.controller.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// History
router.get('/',verifyToken,getHistory);
// Response
router.post('/',verifyToken,response);


export default router;