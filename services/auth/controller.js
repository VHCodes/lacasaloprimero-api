import bcrypt from "bcrypt";

import User from "../users/model.js";
import PasswordToken from "../users/modelPasswordToken.js";
import ConfirmationToken from "../users/modelConfirmationToken.js";

import * as Validation from "../users/validation.js";
import * as DTO from "../users/dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";

import * as Token from "../../utils/token.js";
import * as Mail from "./utils/mail.js";

export const signUp = async (req, res) => {
  try {
    const { username, email, password, url } = req.body;

    await Validation.signUp(username, email, password);

    const newUser = new User({ username, email, password, isAdmin: false });

    const token = bcrypt.hashSync(newUser._id.toString(), 10);
    const newConfirmationToken = new ConfirmationToken({ user: newUser._id, token });

    //transaction
    const savedUser = await newUser.save();
    const savedConfirmationToken = await newConfirmationToken.save();
    Mail.sendSignUp(savedUser.email, savedUser.username, url, savedConfirmationToken.token);
    //transaction

    handleSuccess(res, { user: DTO.single(savedUser) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const confirm = async (req, res) => {
  try {
    let { token } = req.query;

    await Validation.confirm(token);

    const confirmationTokenFound = await ConfirmationToken.findOne({ token }).populate("user");
    const userFound = confirmationTokenFound.user;

    //transaction
    await confirmationTokenFound.deleteOne();
    token = Token.create(userFound._id);
    Mail.sendConfirm(userFound.email, userFound.username);
    //transaction

    handleSuccess(res, { token, user: DTO.single(userFound) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    await Validation.logIn(email, password);

    const userFound = await User.findOne({ email });

    const token = Token.create(userFound._id);

    handleSuccess(res, { token, user: DTO.single(userFound) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const verify = async (req, res) => {
  try {
    const { _id } = req;

    await Validation.verify(_id);

    const userFound = await User.findById(_id);

    handleSuccess(res, { user: DTO.single(userFound) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const requestResetPassword = async (req, res) => {
  try {
    const { email, url } = req.body;

    await Validation.requestResetPassword(email);

    const userFound = await User.findOne({ email });

    const token = bcrypt.hashSync(userFound._id.toString(), 10);
    const newPasswordToken = new PasswordToken({ user: userFound._id, token, createdAt: Date.now() });

    const passwordTokenFound = await PasswordToken.findOne({ user: userFound._id });

    //transaction
    if (passwordTokenFound) await passwordTokenFound.deleteOne();
    const savedPasswordToken = await newPasswordToken.save();
    Mail.sendRequestResetPassword(userFound.email, userFound.username, url, savedPasswordToken.token);
    //transaction

    handleSuccess(res);
  } catch (error) {
    handleErrors(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    let { password, token } = req.body;

    await Validation.resetPassword(token, password);

    const passwordTokenFound = await PasswordToken.findOne({ token }).populate("user");
    const userFound = passwordTokenFound.user;
    userFound.password = password;

    //transaction
    const savedUser = await userFound.save();
    await passwordTokenFound.deleteOne();
    token = Token.create(savedUser._id);
    Mail.sendResetPassword(savedUser.email, savedUser.username);
    //transaction

    handleSuccess(res, { token, user: DTO.single(savedUser) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const { _id } = req;

    await Validation.updatePassword(_id, password, newPassword);

    const userFound = await User.findById(_id);
    userFound.password = newPassword;
    const savedUser = await userFound.save();

    handleSuccess(res, { user: DTO.single(savedUser) });
  } catch (error) {
    handleErrors(res, error);
  }
};
