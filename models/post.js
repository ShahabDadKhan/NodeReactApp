import mongoose from "mongoose";

const postScheme = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    locatoin: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      typeof: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postScheme);

export default Post;
