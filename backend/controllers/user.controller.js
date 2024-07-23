import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import bcrypt from 'bcrypt';
import { generateAccessAndRefreshToken } from "./auth.controller"

const updateUserProfile = asyncHandler(async (req, res) => {
    const { username, email, avatar, password } = req.body;
    const updateData = { username, email, avatar };
  
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
  
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');
  
    if (!user) {
      throw new ApiError('User not found', 404);
    }
  
    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    };
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
  
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict'
    };
  
    return res
      .cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json(new ApiResponse("User Update Successful",
        updatedUser, 200));
  });

const deleteUserAccount = asyncHandler(async(req, res, next)=>{
    try {
        const userId = req.user._id;
    
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
        return next(new ApiError('User not found', 404));
        };

        return res
            .status(200)
            .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'strict' })
            .clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'strict' })
            .json(new ApiResponse("User deletion success", { message: "Account deleted and logged out" }, 200));

    } catch (error) {
        console.error('Error deleting profile:', error);
        next(new ApiError('Internal Server Error', 500));
    }
});

export {updateUserProfile, deleteUserAccount};
