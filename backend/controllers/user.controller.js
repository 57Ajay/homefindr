import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import bcrypt from 'bcrypt';

const updateUserProfile = asyncHandler(async (req, res, next) => {
    try {
      const { username, email, avatar, password } = req.body;
      const updateData = { username, email, avatar };

      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      };
      console.log('Update data:', updateData);

      const user = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }  // new returns the updated document, runValidators ensures validations are run
      ).select('-password -refreshToken');
  
      if (!user) {
        console.error('User not found');
        return next(new ApiError('User not found', 404));
      }
  
      console.log('User updated successfully:', user);
  
      return res.json(
        new ApiResponse("User Update SuccessFull", user, 200)
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      next(new ApiError('Internal Server Error', 500));
    }
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
