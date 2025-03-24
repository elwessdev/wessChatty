import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import { 
    getUsers,
    sendMessage,
    messages
} from '../controllers/chat.controller.js';

const router = express.Router();

// Get users
router.get("/users",verifyToken,getUsers);
// Send Message
router.post("/send",verifyToken,sendMessage);
// Messages
router.get("/messages/:email",verifyToken,messages);

export default router;