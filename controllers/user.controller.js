const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");

exports.createUser = asyncHandler(async (req, res) => {
  const user = new User({ ...req.body });
  await user.save();
  res
    .status(201)
    .json({ success: true, response: user, message: "User Created" });
});

exports.getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users) throw new ApiError("No users to shown..", 404);
  res.status(200).json({
    success: true,
    response: { count: users.length, data: users },
    message: "Users Fetched",
  });
});

exports.getOne = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res
    .status(200)
    .json({ success: true, response: user, message: "User Fetched" });
});

exports.deleteOne = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate({ active: false });
  res
    .status(204)
    .json({ success: true, response: "", message: "User Deleted" });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  if (req.file) {
    req.body.profileImg = req.file.filename;
  }
  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw new ApiError("Invalid ID.", 401);
  const availableUpdate = [
    "name",
    "email",
    "password",
    "profileImg",
    "newPassword",
    "passwordConfirm",
  ];
  const checker = await user.checkPass(req.body.password, user.password);
  if (!checker) throw new ApiError("Invalid password", 401);
  for (const key in req.body) {
    if (!availableUpdate.includes(key))
      throw new ApiError(`Cant edit this field ${key}`, 400);
    user[key] = req.body[key];
    if (key == "newPassword") {
      user.password = req.body.newPassword;
      user.passwordConfirm = req.body.passwordConfirm;
    }
  }
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SEC);
  res.status(202).json({
    success: "true",
    response: { token },
    message: "Password has been changed.",
  });
});

exports.deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    response: {},
    message: "Your account is deleted",
  });
});
