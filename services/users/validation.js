import mongoose from "mongoose";

import User from "./model.js";
import ConfirmationToken from "./modelConfirmationToken.js";
import PasswordToken from "./modelPasswordToken.js";

import { error, ValidationError, ValidationErrors } from "../../utils/error/error.js";
import { handleVerificationErrors } from "../../utils/handlers.js";

export const signUp = async (username, email, password) => {
  const errors = (await Promise.all([usernameRules(username), emailRules(email), passwordRules(password)])).filter(
    (e) => e
  );

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  let userFound = await User.findOne({ username });

  if (userFound) throw new ValidationError([error.username], "El usuario ya se encuentra registrado.");

  userFound = await User.findOne({ email });

  if (userFound) throw new ValidationError([error.email], "El Correo electrónico ya se encuentra registrado.");
};

export const confirm = async (token) => {
  const confirmationTokenFound = await ConfirmationToken.findOne({ token });

  if (!confirmationTokenFound)
    throw new ValidationError([error.confirmationToken], "El token proporcionado esta corrupto o ya expiro.");
};

export const logIn = async (email, password) => {
  const errors = (await Promise.all([emailRules(email), passwordRules(password)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const userFound = await User.findOne({ email });

  if (!userFound) throw new ValidationError(error.email, "El Correo electrónico no se encuentra registrado.");

  const matchPassword = userFound.comparePassword(password);

  if (!matchPassword) throw new ValidationError(error.password, "La contraseña es incorrecta.");

  const confirmationTokenFound = await ConfirmationToken.findOne({ user: userFound._id });

  if (confirmationTokenFound) throw new ValidationError([error.confirmationToken], "Debes verificar tu cuenta.");
};

export const verify = async (id) => {
  await ID(id);

  const userFound = await User.findById(id);

  if (!userFound) throw new ValidationError(error.user, "No se encontró ningún usuario.");
};

export const ID = async (id) => {
  const errors = (await Promise.all([idRules(id)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

export const requestResetPassword = async (email) => {
  const errors = (await Promise.all([emailRules(email)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const userFound = await User.findOne({ email });

  if (!userFound) throw new ValidationError(error.email, "El Correo electrónico no se encuentra registrado.");
};

export const resetPassword = async (token, password) => {
  const errors = (await Promise.all([passwordRules(password)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const tokenPasswordFound = await PasswordToken.findOne({ token });

  if (!tokenPasswordFound)
    throw new ValidationError([error.passwordToken], "El token proporcionado esta corrupto o ya expiro.");
};

export const updatePassword = async (id, password, newPassword) => {
  await verify(id);

  const errors = (await Promise.all([passwordRules(password), passwordRules(newPassword)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const userFound = await User.findById(id);

  const matchPassword = userFound.comparePassword(password);

  if (!matchPassword) throw new ValidationError(error.password, "La contraseña es incorrecta.");
};

export const isAdmin = async (id) => {
  await verify(id);

  const userFound = await User.findById(id);

  if (!userFound.isAdmin) throw new ValidationError(error.user, "Se requieren permisos de administrador.");
};

export const updateUser = async (id, username, isAdmin) => {
  const checkUsername = typeof username === "undefined";
  const checkIsAdmin = typeof isAdmin === "undefined";

  const errors = (
    await Promise.all([
      idRules(id),
      !checkUsername ? usernameRules(username) : undefined,
      !checkIsAdmin ? isAdminRules(isAdmin) : undefined,
    ])
  ).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  if (!checkUsername) {
    const userFound = await User.findOne({ username });

    if (userFound && userFound._id != id)
      throw new ValidationError(error.username, "El usuario ya se encuentra registrado.");
  }
};

//Internal
const idRules = (id) => {
  if (!id) return { [error.id]: "El ID es obligatorio." };

  if (!mongoose.Types.ObjectId.isValid(id)) return { [error.id]: "El ID ingresado no es correcto." };
};

const emailRules = (email) => {
  if (!email) return { [error.email]: "El Correo electrónico es obligatorio." };

  if (email !== email.toLowerCase()) return { [error.email]: "El Correo electrónico debe ser ingresado en minúscula." };

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (!re.test(email)) return { [error.email]: "El Correo electrónico debe tener un formato valido." };
};

const passwordRules = (password) => {
  if (!password) return { [error.password]: "La contraseña es obligatoria." };

  const re = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\d]).*$/;
  if (!re.test(password))
    return {
      [error.password]:
        "La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 símbolo y 1 numero.",
    };
};

const usernameRules = (username) => {
  if (!username) return { [error.username]: "El usuario es obligatorio." };

  const min = 4;
  const max = 20;
  if (username.length < min || username.length > max)
    return { [error.username]: `El usuario debe tener entre ${min} y ${max} caracteres.` };

  const re = /^[a-zA-Z0-9ñÑ]+$/;
  if (!re.test(username)) return { [error.username]: "El usuario solo puede contener letras y números." };
};

const isAdminRules = (isAdmin) => {
  const re = /^(true|false)$/;
  if (!re.test(isAdmin) || typeof isAdmin === "string")
    return { [error.isAdmin]: "El administrador no puede ser de ese tipo." };
};
