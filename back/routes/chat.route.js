import express from 'express';
import {checkAuthMiddle} from '../middleware/auth.middleware.js';
import { 
    getUsers,
    sendMessage,
    messages
} from '../controllers/chat.controller.js';

const router = express.Router();

// Get users
router.get("/users",checkAuthMiddle,getUsers);
// Send Message
router.post("/send",checkAuthMiddle,sendMessage);
// Messages
router.get("/messages/:email",checkAuthMiddle,messages);

export default router;