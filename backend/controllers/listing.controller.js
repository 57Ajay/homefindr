import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { Listing } from "../models/listing.schema";

const createListing = asyncHandler(async(req, res, next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(
            new ApiResponse("Listing created successfully", listing, 201)
        );
    } catch (error) {
        throw new ApiError(error.message || "Can not  create List", 404)
    }
});

export { createListing };