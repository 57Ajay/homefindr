import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";

const updateUserProfile = asyncHandler(async (req, res, next) => {
    try {
      const { username, email, avatar, password } = req.body;
      const updateData = { username, email, avatar };

      if (password) {
        updateData.password = password;
      }
  
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

export {updateUserProfile};
