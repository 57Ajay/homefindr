import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import bcrypt from 'bcrypt';
import { generateAccessAndRefreshToken } from "./auth.controller"
import { Listing } from "../models/listing.schema";

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

const deleteUserAccount = asyncHandler(async(req, res)=>{
    try {
        const userId = req.user._id;
        await Listing.deleteMany({ userRef: userId.toString() });
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
        return next(new ApiError('User not found', 404));
        };

        return res
            .status(200)
            .clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'strict' })
            .clearCookie("refreshToken", { httpOnly:
               true, secure: true, sameSite: 'strict' })
            .json(new ApiResponse("User deletion success", { message: "Account and associated listings deleted, user logged out" }, 200));

    } catch (error) {
        console.error('Error deleting profile:', error);
        throw new ApiError('Internal Server Error' || error.message, 500);
    }
});

const getUserListings = asyncHandler(async(req, res)=>{
  // console.log("req.user._id:\n", req.user._id, "\n", "req.params.id:\n", req.params.id)
  if(req.user._id == req.params.id){
    try {
      const listings = await Listing.find({userRef: req.params.id});
      res.status(201).json(
        new ApiResponse("Listings fetched successfully", listings, 201)
      );

    } catch (error) {
      throw new ApiError("Can not get listings", 404, error.message)
    }
  }else{
    throw new ApiError("you can only view your own listings", 401)
  }
});

const getUser = asyncHandler(async(req, res)=>{
  try {
    const userId = req.params.id;
    if(!userId){
      throw new ApiError("No userId found", 404)
    };
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user){
      throw new ApiError("User not found", 404)
    };
    return res.status(200).json(
      new ApiResponse("user fetched successfully", user, 200)
    )
  } catch (error) {
    throw new ApiError(error.message || "Cannot get the user, try again later", 404)
  }
});


export {
  updateUserProfile, deleteUserAccount, getUserListings, getUser };
