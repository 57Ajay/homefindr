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
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
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
     return res.status(400).json(new ApiResponse("Username, email, and password are required", null, 400));
    }
 
    if (password.length < 6) {
     return res.status(400).json(new ApiResponse("Password must be at least 6 characters long", null, 400));
    }
    
    const existingUser = await User.findOne({$or: [{username}, {email}]});
    if (existingUser) {
     return res.status(409).json(new ApiResponse(
       existingUser.username === username ? "Username already exists" : "Email already exists",
       null,
       409
     ));
    }
 
    try {
     const user = await User.create({username, email, password});
     const safeUser = user.toObject();
     delete safeUser.password;
     delete safeUser.refreshToken;
     return res.status(201).json(new ApiResponse("User created successfully", safeUser, 201));
    } catch (error) {
     return res.status(500).json(new ApiResponse("Error creating user", null, 500));
    }
 });

 const signIn = asyncHandler(async(req, res)=>{
    const {username, email, password} = req.body;
    if ((!username && !email) || !password){
        return res.status(400).json(new ApiResponse("Username or email and password are required", null, 400));
    }
    const user = await User.findOne({$or : [{username}, {email}]});
    if (!user) {
        return res.status(404).json(new ApiResponse("User not found", null, 404));
    }
    const isPasswordMatched = await user.isPasswordMatched(password);
    if (!isPasswordMatched) {
        return res.status(401).json(new ApiResponse("Invalid password", null, 401));
    }
    try {
        console.log(user._id);
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',
            path: '/'
        };

        return res.status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            })
            .cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            })
            .json(new ApiResponse("User signed in successfully", loggedInUser, 200));
    } catch (error) {
        console.error('Error in signIn:', error);
        return res.status(500).json(new ApiResponse("Error signing in", null, 500));
    }
});

const signOut = asyncHandler(async (req, res) => {
    try {
        // Log the user object for debugging
        console.log('User object in signOut:', req.user);

        if (!req.user || !req.user._id) {
            throw new ApiError("User not authenticated", 401);
        }

        // Find the user and update
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        if (!user) {
            throw new ApiError("User not found", 404);
        }

        // Clear cookies
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        // Log successful logout
        console.log(`User ${user._id} successfully logged out`);

        return res.status(200).json(
            new ApiResponse("Logout successful", null, 200)
        );
    } catch (error) {
        console.error('Error in signOut:', error);
        
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(
                new ApiResponse(error.message, null, error.statusCode)
            );
        }

        return res.status(500).json(
            new ApiResponse("Internal Server Error", null, 500)
        );
    }
});

const google = asyncHandler(async (req, res, next) => {
    const { username, email, avatar } = req.body;
    if (!username || !email){
        throw new ApiError("No username or email found", 404);
    };
    const user = await User.findOne({email});
    try {
        if (user){
            const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            };

            return res.status(200)
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            })
            .cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            }).json(new ApiResponse("User signed in successfully", loggedInUser, 200));
        }else{
            const generatePassword = Math.random().toString(36).slice(-8);
            const user = await User.create({username: username.replace(/\s+/g, '')+Math.random().toString(36).slice(-8), email, password: generatePassword, avatar});
            const safeUser = user.toObject();
            delete safeUser.password;
            delete safeUser.refreshToken;
            return res.status(201).json(new ApiResponse("User created successfully", safeUser, 201));
        }
    } catch (error) {
        next(error);
    };
});

export {signup, signIn, signOut, google};
