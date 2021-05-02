import Settings from "./model.js";

import * as Validation from "./validation.js";
import * as DTO from "./dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({}).populate("home.property");

    handleSuccess(res, { settings: DTO.single(settings) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { home, categories, multimedia, constructionSystem, aboutUs, contact } = req.body;

    const checkHome = typeof home === "undefined";
    const checkCategories = typeof categories === "undefined";
    const checkMultimedia = typeof multimedia === "undefined";
    const checkConstructionSystem = typeof constructionSystem === "undefined";
    const checkAboutUs = typeof aboutUs === "undefined";
    const checkContact = typeof contact === "undefined";

    await Validation.updateSettings(home, categories, multimedia, constructionSystem, aboutUs, contact);

    let values = {};

    if (!checkHome) {
      values.home = {
        property: home.property,
        discount: home.discount,
      };
    }

    if (!checkCategories) {
      values.categories = { perPage: categories.perPage };
    }

    if (!checkMultimedia) {
      values.multimedia = { perPage: multimedia.perPage };
    }

    if (!checkConstructionSystem) {
      values.constructionSystem = { content: constructionSystem.content };
    }

    if (!checkAboutUs) {
      values.aboutUs = { content: aboutUs.content };
    }

    if (!checkContact) {
      values.contact = {};

      if (contact.address) {
        values.contact.address = contact.address;
      }

      if (contact.emails) {
        values.contact.emails = contact.emails;
      }

      if (contact.phones) {
        values.contact.phones = contact.phones;
      }

      if (contact.socialMedia) {
        values.contact.socialMedia = contact.socialMedia;
      }
    }

    const updatedSettings = await Settings.findOneAndUpdate({}, values, { new: true });

    handleSuccess(res, { settings: DTO.single(updatedSettings) });
  } catch (error) {
    handleErrors(res, error);
  }
};
