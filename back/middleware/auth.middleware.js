import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token){
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

export default verifyToken;