import { Schema, model } from "mongoose";

const listingSchema = new Schema({
    username: {
        
    },
    email: {

    }
}, {timestamps: true});

export const Listing = model("Listing", listingSchema);