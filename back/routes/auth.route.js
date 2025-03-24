import express from 'express';
import verifyToken from '../middleware/auth.middleware.js';
import {
    signup,
    signin,
    getMe,
    logout,
    refreshToken
} from '../controllers/auth.controller.js';

const router = express.Router();

// Sign up
router.post('/signup', signup);
// Sign in
router.post('/signin', signin);
// Logout
router.get('/logout',logout);
// Check Auth
router.get('/me',verifyToken,getMe);
// Check Auth
router.post('/refresh',refreshToken);


export default router;