import * as DTOProperties from "../properties/dto.js";

export const single = (setting) => {
  if (!setting) return null;

  return {
    id: setting._id,
    home: { property: DTOProperties.single(setting.home.property), discount: setting.home.discount },
    categories: setting.categories,
    multimedia: setting.multimedia,
    constructionSystem: setting.constructionSystem,
    aboutUs: setting.aboutUs,
    contact: setting.contact,
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
};
