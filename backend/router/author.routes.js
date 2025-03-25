import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/Users.js";
import upload from "../utilis/cloudinary.js";

const authorRouter = express.Router();

// -------------------------------------------- funzione generazione JWT --------------------------------------------
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

// -------------------------------------------- Login locale --------------------------------------------
authorRouter.post(
  "/login/local",
  upload.single("profileImage"),
  (req, res, next) => {
    console.log("Login attempt for email: ", req.body.email); // Log the email
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        console.log("Authentication failed: ", info.message); // Log the email
        return res.status(400).send({ error: info.message });
      }

      const token = generateToken(user);
      const userToSend = {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      };
      console.log("User logged in sucessfully: ", user.email); // Log the user
      return res.status(200).send({ user: userToSend, token });
    })(req, res, next);
  }
);

// -------------------------------------------- Registrazione locale --------------------------------------------
authorRouter.post(
  "/register",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).send({ error: "User already exists" });

      // Hash the password
      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileImage: req.file ? req.file.path : "",  // check if req.file exists and set profileImage accordingly
      });

      // Save the new user
      console.log("Saving user to database...");
      await newUser.save();
      console.log("User saved successfully!", {
        email: newUser.email,
        hasPassword: !!newUser.password,
      });

      const userToSend = {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        profileImage: newUser.profileImage,
      };
      const token = generateToken(newUser);
      return res.status(200).send({ user: userToSend, token });
    } catch (error) {
      console.log(error, error.message);
      return res.status(500).send({ error: error.message });
    }
  }
);

// -------------------------------------------- Login con Google --------------------------------------------
authorRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

authorRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  }
);

// -------------------------------------------- Update user profile --------------------------------------------
authorRouter.put(
  "/:userId",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { firstName, lastName, currentPassword, newPassword } = req.body;

      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update basic info
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      // Update password if provided
      if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ message: "Current password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }

      // Update profile image if provided
      if (req.file) {
        console.log('Updating profile image:', req.file);
        user.profileImage = req.file.path;
      }

      // Handle profile image update
      if (req.file) {
        // console.log('Received file:', req.file);
        // The profileImage URL should be available in req.file.path after Cloudinary upload
        user.profileImage = req.file.path;
        // console.log('Updated profile image URL:', user.profileImage);
      }

      // Save updated user
      await user.save();

      // Return updated user without password
      const userToSend = {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      };

      res.status(200).json(userToSend);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// -------------------------------------------- Endpoint per ottenere le info dell'utente corrente --------------------------------------------
authorRouter.get("/me", async (req, res) => {
  try {
    // Get the users token from the request object
    const authHeader = req.headers.authorization;
    // console.log("Auth Header: ", authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).send({ error: "Token not found" });

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(" ")[1];
    // console.log("Token: ", token);

    // Verify the token by decoding it and becoming the user id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token: ", decodedToken);

    // Find the user based on the token
    const user = await User.findById(decodedToken.id).select("-password");
    // console.log("User found: ", user);
    if (!user) return res.status(404).send({ error: "User not found" });

    res.send(user);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).send({ error: "Invalid or expired token" });
    }
    res.status(500).send({ error: error.message });
  }
});

export default authorRouter;
