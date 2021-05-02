import mongoose from "mongoose";

const photoSchema = mongoose.Schema(
  {
    photo: String,
  },
  { timestamps: true, versionKey: false }
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
