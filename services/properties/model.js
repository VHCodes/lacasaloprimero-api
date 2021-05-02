import mongoose from "mongoose";

const propertySchema = mongoose.Schema(
  {
    title: String,
    url: String,
    category: {
      ref: "Category",
      type: mongoose.Schema.Types.ObjectId,
    },
    price: Number,
    description: String,
    cover: String,
    blueprint: String,
  },
  { timestamps: true, versionKey: false }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
