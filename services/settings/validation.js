import mongoose from "mongoose";

import { error, ValidationErrors } from "../../utils/error/error.js";
import { handleVerificationErrors } from "../../utils/handlers.js";

export const updateSettings = async (home, categories, multimedia, constructionSystem, aboutUs, contact) => {
  const checkHome = typeof home === "undefined";
  const checkCategories = typeof categories === "undefined";
  const checkMultimedia = typeof multimedia === "undefined";
  const checkConstructionSystem = typeof constructionSystem === "undefined";
  const checkAboutUs = typeof aboutUs === "undefined";
  const checkContact = typeof contact === "undefined";

  const errors = (
    await Promise.all([
      !checkHome ? homeIDRules(home) : undefined,
      !checkHome ? homeDiscountRules(home) : undefined,
      !checkCategories ? categoriesPerPageRules(categories) : undefined,
      !checkMultimedia ? multimediaPerPageRules(multimedia) : undefined,
      !checkConstructionSystem ? constructionSystemContentRules(constructionSystem) : undefined,
      !checkAboutUs ? aboutUsContentRules(aboutUs) : undefined,
      !checkContact ? contactAddressRules(contact) : undefined,
      !checkContact ? contactEmailRules(contact) : undefined,
      !checkContact ? contactPhoneRules(contact) : undefined,
      !checkContact ? contactSocialMediaRules(contact) : undefined,
    ])
  ).filter((e) => e);

  if (errors.length !== 0) throw new ValidationErrors(handleVerificationErrors(errors));
};

const homeIDRules = (home) => {
  if (!home.property) return { [error.id]: "El ID es obligatorio." };

  if (!mongoose.Types.ObjectId.isValid(home.property)) return { [error.id]: "El ID ingresado no es correcto." };
};

const homeDiscountRules = (home) => {
  if (!home.discount) return { [error.discount]: "El descuento es obligatorio." };

  const re = /^[1-9][0-9]?$|^100$/;
  if (!re.test(home.discount)) return { [error.discount]: "El descuento debe ser un numero entero entre 1 y 100." };
};

const categoriesPerPageRules = (categories) => {
  if (!categories.perPage) return { [error.perPage]: "La cantidad a mostrar por pagina es obligatoria." };

  const re = /^[1-9][0-9]*$/;
  if (!re.test(categories.perPage))
    return { [error.perPage]: "La cantidad a mostrar por pagina debe ser un numero entero mayor a 0." };
};

const multimediaPerPageRules = (multimedia) => {
  if (!multimedia.perPage) return { [error.perPage]: "La cantidad a mostrar por pagina es obligatoria." };

  const re = /^[1-9][0-9]*$/;
  if (!re.test(multimedia.perPage))
    return { [error.perPage]: "La cantidad a mostrar por pagina debe ser un numero entero mayor a 0." };
};

const constructionSystemContentRules = (constructionSystem) => {
  if (!constructionSystem.content) return { [error.description]: "La descripcion es obligatoria." };

  const min = 10;
  if (constructionSystem.content.length < min)
    return { [error.description]: `La descripcion debe tener mas de ${min} caracteres.` };
};

const aboutUsContentRules = (aboutUs) => {
  if (!aboutUs.content) return { [error.description]: "La descripcion es obligatoria." };

  const min = 10;
  if (aboutUs.content.length < min)
    return { [error.description]: `La descripcion debe tener mas de ${min} caracteres.` };
};

const contactAddressRules = (contact) => {
  if (contact.address) {
    if (contact.address === "") return { [error.address]: "La dirección es obligatoria." };

    const re = /^([a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ,]+\s)*[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]+$/;
    if (!re.test(contact.address)) return { [error.address]: "La dirección solo puede contener letras y números." };

    const min = 4;
    const max = 100;
    if (contact.address.length < min || contact.address.length > max)
      return { [error.address]: `La dirección debe tener entre ${min} y ${max} caracteres.` };
  }
};

const emailRules = (email) => {
  if (!email) return { [error.email]: "El Correo electrónico es obligatorio." };

  if (email !== email.toString().toLowerCase())
    return { [error.email]: "El Correo electrónico debe ser ingresado en minúscula." };

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (!re.test(email)) return { [error.email]: "El Correo electrónico debe tener un formato valido." };
};

const contactEmailRules = (contact) => {
  if (contact.emails && Array.isArray(contact.emails)) {
    for (let i = 0; i < contact.emails.length; i++) {
      const res = emailRules(contact.emails[i]);

      if (res !== undefined) return res;
    }
  }
};

const phoneRules = (phone) => {
  if (!phone) return { [error.phone]: "El teléfono es obligatorio." };

  const re = /^\d+$/;
  if (!re.test(phone)) return { [error.phone]: "El teléfono debe ser un numero." };

  const max = 10;
  if (phone.length > max) return { [error.phone]: `El teléfono no puede tener mas de ${max} numeros.` };
};

const contactPhoneRules = (contact) => {
  if (contact.phones && Array.isArray(contact.phones)) {
    for (let i = 0; i < contact.phones.length; i++) {
      const res = phoneRules(contact.phones[i]);

      if (res !== undefined) return res;
    }
  }
};

const socialMediaRules = (socialMedia) => {
  if (!socialMedia.name || !socialMedia.url)
    return { [error.socialMedia]: "El nombre y url de la red social es obligatoria." };

  const re = /^[A-Za-z0-9]+$/g;
  if (!re.test(socialMedia.name))
    return { [error.socialMedia]: "El nombre de la red social solo puede tener letras y numeros." };

  const reUrl = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  if (!reUrl.test(socialMedia.url)) return { [error.socialMedia]: "La url de la red social es invalida." };
};

const contactSocialMediaRules = (contact) => {
  if (contact.socialMedia && Array.isArray(contact.socialMedia)) {
    for (let i = 0; i < contact.socialMedia.length; i++) {
      const res = socialMediaRules(contact.socialMedia[i]);

      if (res !== undefined) return res;
    }
  }
};
