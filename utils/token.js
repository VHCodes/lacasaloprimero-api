import jwt from "jsonwebtoken";

import { ValidationError, error } from "./error/error.js";

export const create = (id) => {
  return jwt.sign({ _id: id }, process.env.TOKEN_SECRET, { expiresIn: parseInt(process.env.TOKEN_EXPIRES) });
};

export const decode = (token) => {
  if (!token) throw new ValidationError(error.token, "No se ha proporcionado ningún token.");

  if (!token.startsWith("Bearer")) throw new ValidationError(error.token, "El formato del token no es correcto.");

  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    return decoded._id;
  } catch (e) {
    throw new ValidationError(error.token, "El token proporcionado esta corrupto.");
  }
};
