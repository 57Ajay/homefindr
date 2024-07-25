import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { Listing } from "../models/listing.schema";

const createListing = asyncHandler(async(req, res, next)=>{
    try {
        const listing = await Listing.create(req.body)
    } catch (error) {
        next(error)
    }
});

export { createListing };