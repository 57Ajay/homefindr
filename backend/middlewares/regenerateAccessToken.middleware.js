import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { User } from "../models/user.schema";



const regenerateAccessToken = async (req, res, next) => {
    let refreshToken;
  // console.log("Tokens Check: \n", req.cookies.refreshToken, "AccessToken:\n", req.cookies.accessToken);

    if (req.cookies && req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
      // console.log("refreshToken check:> \n",refreshToken);
    } else if (req.header('Authorization')) {
      const authHeader = req.header('Authorization');
      if (authHeader.startsWith('Bearer ')) {
        refreshToken = authHeader.substring(7);
      };
    } else if (req.query && req.query.token) {
      refreshToken = req.query.token;
    };
  
    if (!refreshToken) {
      return next(new ApiError("Unauthorized - No refresh token provided", 401));
    };
  
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded._id).select('-password');
      // console.log("decoded user check: \n",user);
      if (!user) {
        throw new ApiError("Unauthorized - User not found", 401);
      };
  
      const newAccessToken = await user.generateAccessToken();
      req.user = user;
      req.accessToken = newAccessToken;
      req.cookies.accessToken = newAccessToken;
      // console.log("req.user:>\n", req.user);
      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      };

      res.status(200).cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      next();

    } catch (error) {
      console.error('Refresh token verification error:', error);
  
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError("Unauthorized - Invalid refresh token", 401));
      } else if (error instanceof ApiError) {
        return next(error);
      } else {
        return next(new ApiError("Internal Server Error", 500));
      };
    };
};

export default regenerateAccessToken;