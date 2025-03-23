import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,                                    // email must be unique
        lowercase: true,                                 // the email adress will be converted to lowercase before it is saved
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Editor", "Admin"],
        default: "Editor"
    },
    profileImage: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
}, {timestamps: true});


export default mongoose.model("User", userSchema);