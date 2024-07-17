import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";

export const signup = asyncHandler(async(req, res, next)=>{
   const {username, email, password} = req.body;
   if (!username || !email || !password) {
    return new ApiResponse("Username, email, and password are required", 400);
   };

   if (password.length < 6) {
    return new ApiResponse("Password must be at least 6 characters long", 400);
   };
   
   const existingUser = await User.findOne({username});
   if (existingUser) {
    throw new ApiError("Username already exists", 409);
   };
   const existingEmail = await User.findOne({email});
   if (existingEmail) {
    throw new ApiError("Email already exists", 409);
   };

   try {
    // const newUser = new user({username, email, password});
    // await newUser.save();
    await User.create({username, email, password});
    return res.send(
        new ApiResponse("User created successfully", null, 201)
    )
   } catch (error) {
    throw new ApiError("Error creating user", 500, error.message);
   };
   next();
});
