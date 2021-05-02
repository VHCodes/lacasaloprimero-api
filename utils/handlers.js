import { error, ValidationError, ValidationErrors } from "./error/error.js";

export const handleErrors = (res, e) => {
  if (e instanceof ValidationError || e instanceof ValidationErrors) {
    res.json({ message: "error", errors: e.getError() });
  } else {
    console.log(e);
    res.json({ message: "error", errors: { [error.general]: "Error desconocido." } });
  }
};

export const handleVerificationErrors = (errors) => {
  return Object.assign({}, ...errors);
};

export const handleSuccess = (res, data = {}) => {
  res.json({ message: "success", data });
};
