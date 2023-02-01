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
      email,
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
      email,
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
    res.status(500).json({ error: err.message });
  }
};

// Logging In Function

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking user
    const user = await User.findOne({ email: email });
    if (!user) res.status(400).json({ error: "User does not exist." });

    // checking user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.__id }, process.env.JWT__SECRET);
    // Deleting user password so that is doesn't send it to frontend and be xposed
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
