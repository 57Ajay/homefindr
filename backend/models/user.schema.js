import { Schema, model } from "mongoose"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
}, {timestamps: true});

userSchema.pre('save', async(next)=>{
    if (this.isModified('password')){
        const salt = bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password, salt);
    };
});

userSchema.methods.isPasswordMatched = async(password)=>{
    if(this.password){
        return await bcrypt.compare(password, this.password);
    }
    else{
        return false
    };
};



export const User = model('User', userSchema);