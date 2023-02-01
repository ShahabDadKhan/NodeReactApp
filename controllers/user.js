// import { json } from "body-parser";
import User from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formatedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formatedFriends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update friend
export const addRemoveFriend = async (req, res) => {
  try {
    const { _id, friendId } = req.params;
    const user = await User.findById(_id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // If one of them removes the other, it will automatically remove the 1st one from the 2nd one too
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // If one of them adds the other, it will automatically adds the 1st one from the 2nd one too
      user.friends.push(friendId);
      friend.friends.push(id);

      await user.save();
      await friend.save();

      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );

      const formatedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );

      res.status(200).json(formatedFriends);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
