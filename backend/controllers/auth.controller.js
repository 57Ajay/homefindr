import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";

const generateAccessAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        if(!user){
            return new ApiResponse("User not Found", null, 404);
        };
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    }catch(error){
        throw new ApiError("Token generation failed", 500, error.message)
    };
};

const signup = asyncHandler(async(req, res)=>{
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
   
});

const signIn = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    if ((!username && !email) || !password){
        throw new ApiError("Username or email and password are required", 400);
    };
    const user = await User.findOne({$or : [{username}, {email}]});
    if (!user) {
        throw new ApiError("User not found", 404);
    };
    const isPasswordMatched = await user.isPasswordMatched(password);
    if (!isPasswordMatched) {
        throw new ApiError("Invalid password", 401);
    };
    try {
        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 60 * 24, // 1 days
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, 
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        }).send(
            new ApiResponse("User signed in successfully", loggedInUser, 200)
        )
    } catch (error) {
        throw new ApiError("Error signing in", 500, error.message);
    };
});

export {signup, signIn};
