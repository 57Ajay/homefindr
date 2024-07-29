import { Router } from "express";
import { createListing, deleteListing, updateListing } from "../controllers/listing.controller";
import verifyToken from "../middlewares/auth.middleware";
const listingRouter = Router();

listingRouter.get("/", (req, res)=>{
    res.send("Here are all the listings");
});

listingRouter.post("/create", verifyToken, createListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.patch("/update/:id", verifyToken, updateListing)

export default listingRouter;