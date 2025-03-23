import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();
import morgan from "morgan";
import expressListEndpoints from "express-list-endpoints";
import passport from "./utilis/passport.js";
import session from "express-session";

// routes
import blogPostRouter from "./router/blogPost.routes.js";
import authorRouter from "./router/author.routes.js";
import commentRouter from "./router/comment.routes.js";



//  SERVER SETUP
const server = express();                           // creating the server




// ------------------------------ MIDDLEWARE ------------------------------

server.use(express.json());                         // is used to parse incoming requests with JSON payloads
server.use(cors())                                  // is used to allow cross-origin requests within the server (connecting the server to the frontend)
server.use(morgan("dev"));
server.use(session({
    secret: `secret`,
    resave: false,
    saveUninitialized: false
}));


// PASSPORT SETUP (insert after session)
server.use(passport.initialize());
server.use(passport.session());


// ------------------------------ URL ------------------------------

server.use("/blogPosts", blogPostRouter);           // connecting the server to the router
server.use("/authors", authorRouter);               // connecting the server to the router
server.use("/blogPosts", commentRouter);            // connecting the server to the router



// ------------------------------ MONGODB CONNECTION ------------------------------


mongoose.connect(process.env.MONGO_URL, { });


mongoose.connection.on('connected', () => {
    console.log('Database connected to MongoDB');   
});


mongoose.connection.on('error', (error) => {
    console.log('Error connecting to MongoDB', error);
});



// -------------------------------- SERVER LISTEN --------------------------------

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    // console.table(expressListEndpoints(server));
});
