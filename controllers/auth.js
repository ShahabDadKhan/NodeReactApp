import bcrypt from "bcrypt"; // Allow us to encript our passowrd
import jwt from "jsonwebtoken"; // give us a way to send the user a web token that they can use for authoriztion
import User from "../models/user.js";

// Function to register the user
export const register = async (req, res) => {
  try {
    // Destructuring the parameters sent from Frontend in requeste body
    const {
      firstName,
      lastName,
      emial,
      password,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impressions,
    } = req.body;

    const salt = await bcrypt.genSalt(); // We are using salt to encrpt our passowrd using dcrypt
    const passwordHash = await bcrypt.hash(password, salt); // This will encrpt our passowrd with salt

    const newUser = new User({
      firstName,
      lastName,
      emial,
      password: passwordHash, //Using here our own encrypted password instead of just plain passowrd that user sends
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile,
      impressions,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();
    // Sending back the newly created user
    res.status(201).json(savedUser);
  } catch (arr) {
    res.status(500).json({ arror: err.message });
  }
};
