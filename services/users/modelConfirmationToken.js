import mongoose from "mongoose";

const confirmationTokenSchema = mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const ConfirmationToken = mongoose.model("ConfirmationToken", confirmationTokenSchema);

export default ConfirmationToken;
