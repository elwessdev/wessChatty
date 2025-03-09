import express from 'express';
import {checkAuthMiddle} from '../middleware/auth.middleware.js';
import { getUsers } from '../controllers/chat.controller.js';

const router = express.Router();

// Get users
router.get("/users",checkAuthMiddle,getUsers);

export default router;