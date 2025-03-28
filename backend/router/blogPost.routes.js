import express from "express";
import BlogPost from "../models/BlogPost.js";
import upload from "../utilis/cloudinary.js";

const blogPostRouter = express.Router();


// -------------------------------------------- GET --------------------------------------------
blogPostRouter.get("/", async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;                       // if no page is provided, default to 1
    const postPerPage = parseInt(req.query.postPerPage) || 6;                 // if no postPerPage is provided, default to 5
    if (postPerPage > 6) postPerPage = 6;                                     // if postPerPage is greater than 5, set it to 5
    const skip = (page - 1) * postPerPage;

    // filters the posts by author
    const filter = req.query.author ? { author: req.query.author } : {};

    // count the total number of posts and calculate the total number of pages
    const totalPosts = await BlogPost.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / postPerPage);

    try {
        const posts = await BlogPost.find(filter)
            .populate("author", "firstName lastName profileImage")
            .sort({ createdAt: -1 })                                  // sort by createdAt in descending order, so the most recent posts are first
            .skip(skip)
            .limit(postPerPage);


        res.send({                                          // send the response (all field but the data are optional, only for debugging)
            page,
            currentPage: page,
            postPerPage,
            totalPages,
            totalResources: totalPosts,
            posts: posts
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});






// -------------------------------------------- GET BY ID --------------------------------------------
blogPostRouter.get("/:id", async (req, res, next) => {
    try {
        const singleBlogPost = await BlogPost.findById(req.params.id)
            .populate("author", "firstName lastName profileImage");

        if (!singleBlogPost) {
            return res.status(404).send({ error: "BlogPost not found" });
        }
        res.send(singleBlogPost);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});






// -------------------------------------------- POST --------------------------------------------
blogPostRouter.post("/", upload.single("cover"), async (req, res, next) => {
    try {
        const { category, title, readTime, author, content } = req.body;


        // date validation
        if (!category || !title || !author || !content || !req.file) {
            return res.status(400).send({
                error: "Missing required fields"
            });

        }

        // parse the readTime from string to object
        const parsedReadTime = JSON.parse(readTime);

        const newBlogPost = new BlogPost({
            category,
            title,
            cover: req.file.path,           // req.file.path is the path to the uploaded file
            readTime: parsedReadTime,
            author,
            content
        });

        const savedBlogPost = await newBlogPost.save();

        const populatedBlogPost = await BlogPost.findById(savedBlogPost._id)
            .populate("author", "firstName lastName profileImage");

        res.status(201).send(populatedBlogPost);
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Error while saving blog post",
            error: error.message
        });
    }
});






// -------------------------------------------- PUT --------------------------------------------
blogPostRouter.put("/:id", upload.single("cover"), async (req, res, next) => {
    try {
        const { category, title, readTime, content } = req.body;

        const updatedData = {
            category,
            title,
            readTime: JSON.parse(readTime),
            content
        };

        // update the cover image if a new one is provided
        if (req.file) {
            updatedData.cover = req.file.path;
        }

        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        ).populate("author", "firstName lastName");


        if (!updatedBlogPost) {
            return res.status(404).send({ error: "BlogPost not found" });
        }

        res.send(updatedBlogPost);
    } catch (error) {
        console.log("Server error:", error);
        res.status(500).json({
            message: "Error while updating blog post",
            error: error.message
        });
    }
});






// -------------------------------------------- DELETE --------------------------------------------
blogPostRouter.delete("/:id", async (req, res, next) => {
    try {
        const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deletedBlogPost) {
            return res.status(404).send({ error: "BlogPost not found" });
        }
        res.send({ message: `BlogPost deleted`, deletedBlogPost });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default blogPostRouter;