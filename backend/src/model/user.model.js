import mongoose, { Schema } from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
    refreshToken_Expiry: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    accessToken_expiry: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return; //user password chage nhi hua dubraa hash mat karo
  this.password = await bcryptjs.hash(this.password, 10);
});

userSchema.methods.passwordCorrect = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

userSchema.methods.genrateRefeshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRSH_TOKEN_EXPIRY },
  );
};

userSchema.methods.genrateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

const User = mongoose.model("User", userSchema);
export default User;
