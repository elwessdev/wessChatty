import express from 'express';
import {checkAuthMiddle} from '../middleware/auth.middleware.js';
import {
    signup,
    signin,
    checkAuth,
    logout
} from '../controllers/auth.controller.js';

const router = express.Router();

// Sign up
router.post('/signup', signup);
// Sign in
router.post('/signin', signin);
// Logout
router.get('/logout',checkAuthMiddle,logout);
// Check Auth
router.get('/checkauth',checkAuthMiddle,checkAuth);


export default router;