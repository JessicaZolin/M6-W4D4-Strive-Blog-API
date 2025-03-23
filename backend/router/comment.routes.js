import express from "express";
import Comment from "../models/Comment.js";


const commentRouter = express.Router();


// -------------------------------------------- GET --------------------------------------------
commentRouter.get("/:id/comments", async (req, res, next) => {
    try {
        const comments = await Comment.find({blogPost: req.params.id})
        .populate("author", "firstName lastName")
        .sort({ createdAt: -1 });
        res.send(comments);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// -------------------------------------------- POST --------------------------------------------
commentRouter.post("/:id", async (req, res, next) => {
    try {
        const { content, author, blogPost } = req.body;
        const newComment = new Comment({ content, author, blogPost });
        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate("author", "firstName lastName");
        res.status(201).send(populatedComment);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// -------------------------------------------- DELETE --------------------------------------------
commentRouter.delete("/:id/comment/:commentId", async (req, res, next) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!deletedComment) {
            return res.status(404).send({ error: "Comment not found" });
        }
        res.send({message: 'Comment deleted', deletedComment});
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default commentRouter;