import path from "path";
import fs from "fs";

import Photo from "./model.js";

import * as Validation from "./validation.js";
import * as DTO from "./dto.js";

import { handleErrors, handleSuccess } from "../../utils/handlers.js";

const directory = "public/images/photos/";

export const createPhoto = async (req, res) => {
  try {
    const photo = req.files ? req.files.photo : undefined;

    await Validation.createPhoto(photo);

    const newPhoto = new Photo();

    const ext = path.extname(photo.name);
    const name = `photo-${newPhoto._id}${ext}`;
    const url_photo = `${directory}${name}`;

    //transaction
    await photo.mv(url_photo);
    newPhoto.photo = name;
    const savedPhoto = await newPhoto.save();
    //transaction

    handleSuccess(res, { photo: DTO.single(savedPhoto) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getPhotos = async (req, res) => {
  try {
    const limit = Math.max(0, parseInt(req.query.limit));
    const offset = Math.max(0, parseInt(req.query.offset));

    const photos = await Photo.find({})
      .limit(limit)
      .skip(limit * offset)
      .sort({ createdAt: "desc" });

    const photosCount = await Photo.countDocuments({});

    handleSuccess(res, { photos: DTO.multiple(photos), count: photosCount });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const getPhoto = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    const photo = await Photo.findById(id);

    handleSuccess(res, { photo: DTO.single(photo) });
  } catch (error) {
    handleErrors(res, error);
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;

    await Validation.ID(id);

    //transaction
    const deletedPhoto = await Photo.findByIdAndDelete(id);
    if (deletedPhoto) fs.unlinkSync(`${directory}${deletedPhoto.photo}`);
    //transaction

    handleSuccess(res, { photo: DTO.single(deletedPhoto) });
  } catch (error) {
    handleErrors(res, error);
  }
};
