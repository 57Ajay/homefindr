import { User } from "../models/user.schema";

const createUser = async(req, res)=>{
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4016803853.
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).send("Username and password are required");
    }
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(409).send("User already exists");
    }
    await User.create({username, password});
    res.status(201).send("User created successfully");
};

export {createUser};
