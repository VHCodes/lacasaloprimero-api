import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: String,
    url: String,
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
