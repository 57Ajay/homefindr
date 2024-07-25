import jwt from 'jsonwebtoken';
import { User } from '../models/user.schema';
import ApiError from '../utils/apiError';
import { config } from 'dotenv';
config();


const verifyToken = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.header('Authorization')) {
        const authHeader = req.header('Authorization');
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }

    // console.log('Extracted token:', token);

    if (!token) {
        return next(new ApiError("Unauthorized - No token provided", 401));
    }

    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new ApiError("Internal Server Error - Token secret is not defined", 500);
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log('Decoded token:', decoded);

        const user = await User.findById(decoded._id).select('-password -refreshToken');
        if (!user) {
            throw new ApiError("Unauthorized - User not found", 401);
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new ApiError("Unauthorized - Invalid token", 401));
        } else if (error instanceof ApiError) {
            return next(error);
        } else {
            return next(new ApiError("Internal Server Error", 500));
        }
    }
};

export default verifyToken;