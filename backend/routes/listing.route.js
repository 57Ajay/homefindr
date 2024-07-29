import { Router } from "express";
import { createListing, deleteListing, updateListing, getListing } from "../controllers/listing.controller";
import verifyToken from "../middlewares/auth.middleware";
const listingRouter = Router();

listingRouter.get("/", (req, res)=>{
    res.send("Here are all the listings");
});

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.patch("/update/:id", verifyToken, updateListing)
listingRouter.get("/get/:id", getListing)

export default listingRouter;