import mongoose from "mongoose";

const passwordTokenSchema = mongoose.Schema(
  {
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  { versionKey: false }
);

const PasswordToken = mongoose.model("PasswordToken", passwordTokenSchema);

export default PasswordToken;
