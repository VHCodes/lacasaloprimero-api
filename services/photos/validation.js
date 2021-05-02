import mongoose from "mongoose";

import { error, ValidationErrors } from "../../utils/error/error.js";
import { handleVerificationErrors } from "../../utils/handlers.js";

export const createPhoto = async (photo) => {
  const errors = (await Promise.all([photoRules(photo)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

export const ID = async (id) => {
  const errors = (await Promise.all([idRules(id)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

//Internal
const idRules = (id) => {
  if (!id) return { [error.id]: "El ID es obligatorio." };

  if (!mongoose.Types.ObjectId.isValid(id)) return { [error.id]: "El ID ingresado no es correcto." };
};

const photoRules = (photo) => {
  if (!photo) return { [error.photo]: "La foto es obligatoria." };

  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(photo.mimetype)) return { [error.photo]: "La foto solo puede ser en formato: jpg jpeg png." };

  const size = 3;
  const maxSize = size * 1024 * 1024;
  if (photo.size > maxSize) return { [error.photo]: `La foto es muy grande. Tamaño maximo: ${size}mb` };
};
