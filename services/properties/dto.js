import * as DTO from "../categories/dto.js";
import { decimals, dotToComa } from "./utils/utils.js";

export const single = (property) => {
  if (!property) return null;

  return {
    id: property._id,
    title: property.title,
    url: property.url,
    category: DTO.single(property.category),
    price: dotToComa(decimals(property.price)),
    description: property.description,
    cover: `${process.env.BASE_URL}image/property/${property.cover}`,
    blueprint: `${process.env.BASE_URL}image/property/${property.blueprint}`,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
};

export const multiple = (properties) => properties.map((property) => single(property));
