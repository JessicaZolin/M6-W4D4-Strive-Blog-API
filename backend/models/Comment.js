import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    }
    }, { timestamps: true });

export default mongoose.model("Comment", commentSchema);