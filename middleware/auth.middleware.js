const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new ApiError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  const user = await User.findById(decoded.id);
  if (!user)
    throw new ApiError("The user belong to this token does not exist.", 401);
  if (user.isPasswordChanged(decoded.iat))
    throw new ApiError(
      "User recently changed password! please log in again.",
      401
    );

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError("You don't have a permission to perform this action.", 403)
    }
    next();
  };
}
