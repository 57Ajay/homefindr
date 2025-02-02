import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import ApiResponse from "../utils/apiResponse";
import { Listing } from "../models/listing.schema";

const createListing = asyncHandler(async(req, res)=>{
     
    try {
        if (req.body.imageUrls.length === 0){
            throw new ApiError("Add at least one image out of six", 404)
        };

        if (req.body.imageUrls.length > 6){
            throw new ApiError("Only 6 images are allowed", 404)
        };
        
        const listing = await Listing.create(req.body);
        return res.status(201).json(
            new ApiResponse("Listing created successfully", listing, 201)
        );
        
    } catch (error) {
        throw new ApiError(error.message || "Can not  create List", 404)
    };
});

const deleteListing = asyncHandler(async(req, res)=>{
    try {
        const userId = req.user._id;
        const listingId = req.params.id;
        console.log("userId:\n", userId, "\nlistingId:\n", listingId);
        const listing = await Listing.findById(listingId);
        if (!listing){
            return res.json(
                new ApiResponse("Can not find Listing", null, 404)
            )
        };
        console.log("userRef:\n", listing.userRef)
        if (listing.userRef !== userId.toString()){
            return res.json(
                new ApiResponse("You are not authorized to delete this listing", null, 403)
            )
        };
        await listing.deleteOne();
        return res.json(
            new ApiResponse("Listing deleted SuccessFully", [], 200)
        );

    } catch (error) {
        throw new ApiError(error.message || "Can not delete Listing", 404)
    }

});

const updateListing = asyncHandler(async(req, res)=>{
    try {
        if (req.body.imageUrls.length === 0){
            throw new ApiError("Add at least one image out of six", 404)
        };

        if (req.body.imageUrls.length > 6){
            throw new ApiError("Only 6 images are allowed", 404)
        };

        const userId = req.user._id;
        const listingId = req.params.id;
        console.log("userId:\n", userId, "\nlistingId:\n", listingId);
        const listing = await Listing.findById(listingId);

        if (!listing){
            throw new ApiError("Can not find Listing", 404)
        };
        // console.log("userRef:\n", listing.userRef)
        if (listing.userRef !== userId.toString()){
            return res.json(
                new ApiResponse("You are not authorized to Update this listing", null, 403)
            )
        };
        const updatedListing = await Listing.findByIdAndUpdate(listingId, req.body, {new: true})
        return res.status(200).json(
            new ApiResponse("Listing Updated", updatedListing, 200)
        )
    } catch (error) {
        throw new ApiError(error.message || "Failed to update Listing", 404)
    }
});

const getListing = asyncHandler(async(req, res)=>{
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing){
            throw new ApiError("No listing found", 404)
        };
        console.log("Fetched listing:", listing);
        return res.status(200).json(
            new ApiResponse("Listing fetched SuccessFully", listing, 200)
        )
    } catch (error) {
        throw new ApiError("Failed to get listings", 500)
    }
});

const getListings = asyncHandler(async(req, res)=>{
    try {
        const limit = parseInt(req.query.limit) || 6;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let filter = {};

        // Handling offer
        if (req.query.offer === "true") {
            filter.offer = true;
        } else if (req.query.offer === "false") {
            filter.offer = false;
        }

        // Handling furnished
        if (req.query.furnished === "true") {
            filter.furnished = true;
        } else if (req.query.furnished === "false") {
            filter.furnished = false;
        }

        // Handling parking
        if (req.query.parking === "true") {
            filter.parking = true;
        } else if (req.query.parking === "false") {
            filter.parking = false;
        }

        // Handling type
        if (req.query.type && req.query.type !== "all") {
            filter.type = req.query.type;
        }

        const searchTerm = req.query.searchTerm || "";

        const sort = req.query.sort || "createdAt";

        const order = req.query.order === "asc" ? 1 : -1;

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: "i" },
            ...filter
        }).sort({ [sort]: order }).limit(limit).skip(startIndex);

        return res.status(200).json(
            new ApiResponse("All the listings fetched", listings, 200)
        );

    } catch (error) {
        throw new ApiError("Error getting All the listings, try again", 404);
    }
});


export { createListing, deleteListing, updateListing, getListing, getListings };