// import express from "express";
import Post from "../models/post.js";
import User from "../models/user.js";

// Create
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.params;
    const user = await User.findById(userId); // finding the user that uploaded the post

    const newPosts = new Post({
      userId,
      firstname: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPath: user.userPath,
      picturePath,
      likes: {},
      comments: [],
    }); // creating the new Post here

    await newPosts.save();

    const post = await Post.find(); // Grabing all the posts
    res.status(201).json(post); // status 201 means that you have created something
  } catch (error) {
    res.status(409).json({ err: error.message });
  }
};

// Read
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post); // Status 200 means that response is ok
  } catch (error) {
    res.status(409).json({ err: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params;
    const post = await Posts.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ err: error.message });
  }
};

// Update
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId)

    if(isLiked) {
        post.likes.delete(userId)
    } else {
        post.likes.set(userId, true)
    }

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    )

    // updating the posts on frontend
    res.status(200).json(updatePost)
  } catch (error) {
    res.status(404).json({ err: error.message });
  }
};
