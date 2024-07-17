import { User } from "../models/user.schema";

export const signup = async(req, res, next)=>{
   const {username, email, password} = req.body;
   if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
   };

   if (password.length < 6) {
    return res.status(400).send("Password must be at least 6 characters long");
   };
   
   const existingUser = await User.findOne({username});
   if (existingUser) {
    return res.status(409).send("User already exists");
   };
   try {
    // const newUser = new user({username, email, password});
    // await newUser.save();
    await User.create({username, email, password});
    return res.status(201).send("User created successfully");
   } catch (error) {
    return res.status(500).send("Server error");
    next(error.message);
   };

};
