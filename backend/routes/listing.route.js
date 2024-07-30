import { Router } from "express";
import { createListing, deleteListing, updateListing, getListing } from "../controllers/listing.controller";
import verifyToken from "../middlewares/auth.middleware";
import regenerateAccessToken from "../middlewares/regenerateAccessToken.middleware";
const listingRouter = Router();

listingRouter.get("/", (req, res)=>{
    res.send("Here are all the listings");
});

listingRouter.post("/create", regenerateAccessToken, verifyToken, createListing);
listingRouter.delete("/delete/:id", regenerateAccessToken, verifyToken, deleteListing);
listingRouter.patch("/update/:id",regenerateAccessToken, verifyToken, updateListing)
listingRouter.get("/get/:id", getListing)

export default listingRouter;