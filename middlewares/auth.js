import * as Validation from "../services/users/validation.js";

import { handleErrors } from "../utils/handlers.js";
import * as Token from "../utils/token.js";

export const verifyToken = async (req, res, next) => {
  try {
    req._id = Token.decode(req.headers.authorization);

    next();
  } catch (error) {
    handleErrors(res, error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    await Validation.isAdmin(req._id);

    next();
  } catch (error) {
    handleErrors(res, error);
  }
};
