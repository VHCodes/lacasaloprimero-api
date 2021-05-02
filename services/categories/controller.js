import Category from "./model.js";

import * as Validation from "./validation.js";
import * as DTO from "./dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";
import { slugify } from "../../utils/utils.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    await Validation.createCategory(name);

    const url = slugify(name);
    const newCategory = new Category({ name, url });
    const savedCategory = await newCategory.save();

    handleSuccess(res, { category: DTO.single(savedCategory) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getCategories = async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit));
    const offset = Math.max(0, parseInt(req.query.offset));

    const categories = await Category.find({})
      .limit(limit)
      .skip(limit * offset)
      .sort({ createdAt: "desc" });

    const categoriesCount = await Category.countDocuments({});

    handleSuccess(res, { categories: DTO.multiple(categories), count: categoriesCount });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    const category = await Category.findById(id);

    handleSuccess(res, { category: DTO.single(category) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const checkName = typeof name === "undefined";

    await Validation.updateCategory(id, name);

    let values = {};

    if (!checkName) {
      const url = slugify(name);

      values.name = name;
      values.url = url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, values, { new: true });

    handleSuccess(res, { category: DTO.single(updatedCategory) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    const deletedCategory = await Category.findByIdAndDelete(id);

    handleSuccess(res, { category: DTO.single(deletedCategory) });
  } catch (error) {
    handleErrors(res, error);
  }
};
