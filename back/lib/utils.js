import jwt from 'jsonwebtoken';

export const generateToken = (id,res)=> {
    const token = jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    );
    res.cookie("tkn", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === 'prod',
        // path: "/",
    });
    return token;
}