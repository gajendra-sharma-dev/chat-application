import User from "../model/user.model.js";
import asynchandler from "../util/AsyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import vaildator from "email-validator";

const generateAccessANDRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.genrateAccessToken();
  const refreshToken = user.genrateRefeshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((filed) => filed.trim() === "")) {
    throw new ApiError(400, "all filed is required");
  }

  if (!vaildator.validate(email)) {
    throw new ApiError(400, "email is not correct form");
  }
  const user = await User.findOne({ email: email });
  if (user) {
    throw new ApiError(
      400,
      "user already login this email. please use another email to sign up",
    );
  }

  const createNewUser = await User.create({
    username,
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateAccessANDRefreshToken(
    createNewUser._id,
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createNewUser, "user successfully register"));
});

const loginUser = asynchandler(async (req, res) => {
  const { password, email } = req.body;

  if (!password || password.trim() === "") {
    throw new ApiError(400, "password is reuired");
  }

  if (!email || email.trim() === "") {
    throw new ApiError(400, "password is reuired");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(400, "user not found those who contain this email");
  }
  console.log(user);

  const passwordIScorrect = await user.passwordCorrect(password);
  console.log(passwordIScorrect);

  if (!passwordIScorrect) {
    throw new ApiError(400, "password is incorrect");
  }
  const { accessToken, refreshToken } = await generateAccessANDRefreshToken(
    user._id,
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, refreshToken, accessToken },
        "user successfully login",
      ),
    );
});

const logout = asynchandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true },
  );
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user successfully logout"));
});

const getUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user get successfully"));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(410, "unauthorization request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_KEY,
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(410, "Invaild refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(410, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessANDRefreshToken(
      user._id,
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "access token refersh successfully",
        ),
      );
  } catch (error) {
    throw new ApiResponse(401, error?.massage || "Invaild refresh token");
  }
});

const updatePassword = asynchandler(async (req, res) => {
  const { oldpassword, newpassword } = req.body;

  if (!oldpassword) {
    throw new ApiError("old password is required");
  }

  if (!newpassword) {
    throw new ApiError("new password is required");
  }

  const user = await User.findById(req.user?._id);

  const passwordiscorrect = await user.passwordCorrect(oldpassword);

  if (!passwordiscorrect) {
    throw new ApiError(400, "password is incorrect");
  }
  user.password = newpassword;

  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, "password successfully change"));
});
const UpdateUserDetail = asynchandler(async (req, res) => {
  const { username, email } = req.body;

  if ([username, email].some((filed) => filed.trim() === "")) {
    throw new ApiError(400, "all filed is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { username, email } },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "user detail update successfully"));
});

export {
  registerUser,
  getUser,
  loginUser,
  logout,
  refreshAccessToken,
  UpdateUserDetail,
  updatePassword,
};
