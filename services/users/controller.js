import User from "./model.js";
import ConfirmationToken from "./modelConfirmationToken.js";

import * as Validation from "./validation.js";
import * as DTO from "./dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";

export const getUsers = async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit));
    const offset = Math.max(0, parseInt(req.query.offset));

    const usersFound = await User.find({})
      .limit(limit)
      .skip(limit * offset)
      .sort({ createdAt: "desc" });

    const usersCount = await User.countDocuments({});

    handleSuccess(res, { users: DTO.multiple(usersFound), count: usersCount });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    const userFound = await User.findById(id);

    handleSuccess(res, { user: DTO.single(userFound) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, isAdmin } = req.body;
    const { id } = req.params;

    const checkUsername = typeof username === "undefined";
    const checkIsAdmin = typeof isAdmin === "undefined";

    await Validation.updateUser(id, username, isAdmin);

    let values = {};

    if (!checkUsername) values.username = username;
    if (!checkIsAdmin) values.isAdmin = isAdmin;

    const updatedUser = await User.findByIdAndUpdate(id, values, { new: true });

    handleSuccess(res, { user: DTO.single(updatedUser) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    //transaction
    let deletedUser = await User.findByIdAndDelete(id);

    if (deletedUser) await ConfirmationToken.findOneAndDelete({ user: deletedUser._id });
    //transaction

    handleSuccess(res, { user: DTO.single(deletedUser) });
  } catch (error) {
    handleErrors(res, error);
  }
};
