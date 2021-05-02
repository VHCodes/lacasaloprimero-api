import mongoose from "mongoose";

import Category from "./model.js";

import { error, ValidationError, ValidationErrors } from "../../utils/error/error.js";
import { handleVerificationErrors } from "../../utils/handlers.js";

export const createCategory = async (name) => {
  const errors = (await Promise.all([nameRules(name)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const categoryFound = await Category.findOne({ name });

  if (categoryFound) throw new ValidationError(error.name, "El nombre ya se encuentra registrado.");
};

export const ID = async (id) => {
  const errors = (await Promise.all([idRules(id)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

export const updateCategory = async (id, name) => {
  const checkName = typeof name === "undefined";

  const errors = (await Promise.all([idRules(id), !checkName ? nameRules(name) : undefined])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  if (!checkName) {
    const categoryFound = await Category.findOne({ name });

    if (categoryFound && categoryFound._id != id)
      throw new ValidationError(error.name, "El nombre ya se encuentra registrado.");
  }
};

//Internal
const idRules = (id) => {
  if (!id) return { [error.id]: "El ID es obligatorio." };

  if (!mongoose.Types.ObjectId.isValid(id)) return { [error.id]: "El ID ingresado no es correcto." };
};

const nameRules = (name) => {
  if (!name) return { [error.name]: "El nombre es obligatorio." };

  const re = /^([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+\s)*[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+$/;
  if (!re.test(name)) return { [error.name]: "El nombre solo puede contener letras y números." };

  const min = 4;
  const max = 20;
  if (name.length < min || name.length > max)
    return { [error.name]: `El nombre debe tener entre ${min} y ${max} caracteres.` };
};
