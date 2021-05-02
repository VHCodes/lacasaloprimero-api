import mongoose from "mongoose";

import Property from "./model.js";

import { error, ValidationError, ValidationErrors } from "../../utils/error/error.js";
import { handleVerificationErrors } from "../../utils/handlers.js";

export const createProperty = async (title, category, price, description, cover, blueprint) => {
  const errors = (
    await Promise.all([
      titleRules(title),
      categoryRules(category),
      priceRules(price),
      descriptionRules(description),
      coverRules(cover),
      blueprintRules(blueprint),
    ])
  ).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  const propertyFound = await Property.findOne({ title });

  if (propertyFound) throw new ValidationError(error.title, "El titulo ya se encuentra registrado.");
};

export const ID = async (id) => {
  const errors = (await Promise.all([idRules(id)])).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

export const updateProperty = async (id, title, category, price, description, cover, blueprint) => {
  const checkTitle = typeof title === "undefined";
  const checkCategory = typeof category === "undefined";
  const checkPrice = typeof price === "undefined";
  const checkDescription = typeof description === "undefined";
  const checkCover = typeof cover === "undefined";
  const checkBlueprint = typeof blueprint === "undefined";

  const errors = (
    await Promise.all([
      idRules(id),
      !checkTitle ? titleRules(title) : undefined,
      !checkCategory ? categoryRules(category) : undefined,
      !checkPrice ? priceRules(price) : undefined,
      !checkDescription ? descriptionRules(description) : undefined,
      !checkCover ? coverRules(cover) : undefined,
      !checkBlueprint ? blueprintRules(blueprint) : undefined,
    ])
  ).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));

  if (!checkTitle) {
    const propertyFound = await Property.findOne({ title });

    if (propertyFound && propertyFound._id != id)
      throw new ValidationError(error.title, "El titulo ya se encuentra registrado.");
  }
};

//Internal
const idRules = (id) => {
  if (!id) return { [error.id]: "El ID es obligatorio." };

  if (!mongoose.Types.ObjectId.isValid(id)) return { [error.id]: "El ID ingresado no es correcto." };
};

const titleRules = (title) => {
  if (!title) return { [error.title]: "El titulo es obligatorio." };

  const re = /^([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+\s)*[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+$/;
  if (!re.test(title)) return { [error.title]: "El titulo solo puede contener letras y números." };

  const min = 4;
  const max = 50;
  if (title.length < min || title.length > max)
    return { [error.title]: `El titulo debe tener entre ${min} y ${max} caracteres.` };
};

const categoryRules = (category) => {
  if (!category) return { [error.category]: "La categoria es obligatoria." };

  if (!mongoose.Types.ObjectId.isValid(category)) return { [error.category]: "La categoria ingresada no es correcta." };
};

const priceRules = (price) => {
  if (!price) return { [error.price]: "El precio es obligatorio." };

  const re = /^(\d+(?:[\,]\d{2})?)$/;
  if (!re.test(price)) return { [error.price]: "El precio debe ser un numero." };
};

const descriptionRules = (description) => {
  if (!description) return { [error.description]: "La descripcion es obligatoria." };

  const min = 10;
  if (description.length < min) return { [error.description]: `La descripcion debe tener mas de ${min} caracteres.` };
};

const coverRules = (cover) => {
  if (!cover) return { [error.cover]: "La caratula es obligatoria." };

  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(cover.mimetype))
    return { [error.cover]: "La caratula solo puede ser en formato: jpg jpeg png." };

  const size = 2;
  const maxSize = size * 1024 * 1024;
  if (cover.size > maxSize) return { [error.cover]: `La caratula es muy grande. Tamaño maximo: ${size}mb` };
};

const blueprintRules = (blueprint) => {
  if (!blueprint) return { [error.blueprint]: "El plano es obligatorio." };

  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(blueprint.mimetype))
    return { [error.blueprint]: "El plano solo puede ser en formato: jpg jpeg png." };

  const size = 2;
  const maxSize = size * 1024 * 1024;
  if (blueprint.size > maxSize) return { [error.blueprint]: `El plano es muy grande. Tamaño maximo: ${size}mb` };
};
