import { User } from "../models/user.schema";

const getUserByUsername = async(req, res)=>{

    const { username } = req.params;
    if (!username) {
        return res.status(400).send("Username is required");
    };
    const user = await User.find({ username }).select("-password").lean();
    if (!user) {
        return res.status(404).send("User not found");
    };
    return res.status(200).send(user)
};

export {getUserByUsername};
