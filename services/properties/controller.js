import path from "path";
import fs from "fs";

import Property from "./model.js";
import Category from "../categories/model.js";

import * as Validation from "./validation.js";
import * as DTO from "./dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";
import { slugify } from "../../utils/utils.js";
import { comaToDot } from "./utils/utils.js";

const directory = "public/images/properties/";

export const createProperty = async (req, res) => {
  try {
    const { title, category, price, description } = req.body;

    const cover = req.files ? req.files.cover : undefined;
    const blueprint = req.files ? req.files.blueprint : undefined;

    await Validation.createProperty(title, category, price, description, cover, blueprint);

    const newProperty = new Property({
      title,
      url: slugify(title),
      category,
      price: comaToDot(price),
      description,
    });

    let ext = path.extname(cover.name);
    let name = `cover-${newProperty._id}${ext}`;
    const url_cover = `${directory}${name}`;
    newProperty.cover = name;

    ext = path.extname(blueprint.name);
    name = `blueprint-${newProperty._id}${ext}`;
    const url_blueprint = `${directory}${name}`;
    newProperty.blueprint = name;

    //transaction
    await cover.mv(url_cover);
    await blueprint.mv(url_blueprint);
    const savedProperty = await newProperty.save();
    //transaction
    await savedProperty.populate("category").execPopulate();

    handleSuccess(res, { property: DTO.single(savedProperty) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getProperties = async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit));
    const offset = Math.max(0, parseInt(req.query.offset));
    const category = req.query.category;
    const url = req.query.url;

    let values = {};

    if (category) {
      values = { category };
    }

    if (url) {
      values = { url };
    }

    const properties = await Property.find(values)
      .limit(limit)
      .skip(limit * offset)
      .sort({ createdAt: "desc" })
      .populate("category")
      .exec();

    const propertiesCount = await Property.countDocuments(values);

    handleSuccess(res, { properties: DTO.multiple(properties), count: propertiesCount });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);
    const property = await Property.findById(id).populate("category");

    handleSuccess(res, { property: DTO.single(property) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { title, category, price, description } = req.body;
    const { id } = req.params;

    const cover = req.files ? req.files.cover : undefined;
    const blueprint = req.files ? req.files.blueprint : undefined;

    const checkTitle = typeof title === "undefined";
    const checkCategory = typeof category === "undefined";
    const checkPrice = typeof price === "undefined";
    const checkDescription = typeof description === "undefined";
    const checkCover = typeof cover === "undefined";
    const checkBlueprint = typeof blueprint === "undefined";

    await Validation.updateProperty(id, title, category, price, description, cover, blueprint);

    const propertyFound = await Property.findById(id);

    //transaction
    let values = {};

    if (propertyFound) {
      if (!checkTitle) {
        values.title = title;
        values.url = slugify(title);
      }

      if (!checkCategory) values.category = category;
      if (!checkPrice) values.price = comaToDot(price);
      if (!checkDescription) values.description = description;

      let ext;
      let name;

      if (!checkCover) {
        ext = path.extname(cover.name);
        name = `cover-${propertyFound._id}${ext}`;
        const url_cover = `${directory}${name}`;

        fs.unlinkSync(`${directory}${propertyFound.cover}`);

        await cover.mv(url_cover);

        values.cover = name;
      }

      if (!checkBlueprint) {
        ext = path.extname(blueprint.name);
        name = `blueprint-${propertyFound._id}${ext}`;
        const url_blueprint = `${directory}${name}`;

        fs.unlinkSync(`${directory}${propertyFound.blueprint}`);

        await blueprint.mv(url_blueprint);

        values.blueprint = name;
      }
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, values, { new: true });
    //transaction

    await updatedProperty.populate("category").execPopulate();

    handleSuccess(res, { property: DTO.single(updatedProperty) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    //transaction
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (deletedProperty) {
      fs.unlinkSync(`${directory}${deletedProperty.cover}`);
      fs.unlinkSync(`${directory}${deletedProperty.blueprint}`);
    }
    //transaction

    await deletedProperty.populate("category").execPopulate();

    handleSuccess(res, { property: DTO.single(deletedProperty) });
  } catch (error) {
    handleErrors(res, error);
  }
};
