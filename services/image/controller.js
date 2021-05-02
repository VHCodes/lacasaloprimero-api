import path from "path";
import fs from "fs";

const directory = "public/images/";
const directoryPhoto = "public/images/photos/";
const directoryProperty = "public/images/properties/";

export const getPhoto = async (req, res) => {
  let pathPhoto;

  try {
    const { photo } = req.params;

    pathPhoto = path.join(path.resolve(), `${directoryPhoto}${photo}`);

    fs.accessSync(pathPhoto);
  } catch (error) {
    pathPhoto = path.join(path.resolve(), `${directory}imagen_no_disponible.png`);
  } finally {
    res.sendFile(pathPhoto);
  }
};

export const getProperty = async (req, res) => {
  let pathPhoto;

  try {
    const { property } = req.params;

    pathPhoto = path.join(path.resolve(), `${directoryProperty}${property}`);

    fs.accessSync(pathPhoto);
  } catch (error) {
    pathPhoto = path.join(path.resolve(), `${directory}imagen_no_disponible.png`);
  } finally {
    res.sendFile(pathPhoto);
  }
};
