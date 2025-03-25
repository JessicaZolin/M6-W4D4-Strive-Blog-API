import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import User from "../models/Users.js";
import dotenv from "dotenv";
dotenv.config();



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);   
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);


// Google Strategy
passport.use(
    new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 
    process.env.BACKEND_URL + process.env.GOOGLE_CALLBACK_PATH  // must be registered in the Google developer console
    /* "http://localhost:3002/authors/google/callback" */,
  },
  async (accessToken, refreshToken, profile, done) => {
   try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
        // Create a new user
        user = await User.create({
            googleId: profile.id,
            firstName: profile.name.givenName,
            email: profile.emails[0].value,
            lastName: profile.name.familyName,
            password: await bcrypt.hash(Math.random().toString(36), 10),        // Random password
        })
    }
    return done(null, user);
  } catch (error) {
      return done(error, false);
    }
  }
));


export default passport;