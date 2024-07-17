import { User } from "../models/user.schema";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";

const getUserByUsername = asyncHandler( async(req, res, next)=>{
    const {username} = req.params;
    if (!username){
        throw new ApiError("Username is required", 400);
    };
    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            throw new ApiError("User not found", 404);
        };
        return res.send(
            new ApiResponse("User found", user, 200)
        );
    } catch (error) {
        throw new ApiError("Error getting user", 500, error.message);
    };
});

export {getUserByUsername};
