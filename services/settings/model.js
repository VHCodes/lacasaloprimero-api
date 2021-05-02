import mongoose from "mongoose";

const settingsSchema = mongoose.Schema(
  {
    home: {
      property: {
        ref: "Property",
        type: mongoose.Schema.Types.ObjectId,
      },
      discount: Number,
    },
    categories: {
      perPage: Number,
    },
    multimedia: {
      perPage: Number,
    },
    constructionSystem: {
      content: String,
    },
    aboutUs: {
      content: String,
    },
    contact: {
      address: String,
      emails: [String],
      phones: [String],
      socialMedia: [
        {
          url: String,
          name: String,
        },
      ],
    },
  },
  { timestamps: true, versionKey: false }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
