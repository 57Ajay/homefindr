import { User } from "../models/user.schema";

const getUserByUsername = async(req, res)=>{

    const { username } = req.params;
    if (!username) {
        return res.status(400).send("Username is required");
    };
    try {
        const user = await User.find({ username }).select("-password");
        if (!user) {
            return res.status(404).send("User not found");
        };
        return res.status(200).send(user);
    } catch (error) {
        console.error("Error Fetching User", error);
        return res.status(500).send("Server Error")
    };
};

export {getUserByUsername};
