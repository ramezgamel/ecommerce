const asyncHandler = require("express-async-handler");
const Category = require("../models/category.model");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const ApiFeature = require("../utils/apiFeatures")

exports.getAll = asyncHandler(async (req, res) => {
  const feature = new ApiFeature(Category.find(), req.query).fields().filter().paginate().search().sort()
  const category = await feature.query
  if (!category.length) throw new ApiError("No data to show", 404);
  res
    .status(200)
    .json({ status: "success", response: category, message: "Data Fetched" });
});

exports.getOne = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  res
    .status(200)
    .json({ status: "success", response: category, message: "Created" });
});

exports.createOne = asyncHandler(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    creator: req.user.id,
    slug: slugify(req.body.name, { lower: true }),
  });
  res
    .status(201)
    .json({ status: "success", response: category, message: "Created" });
});

exports.updateOne = asyncHandler(async (req, res) => {
  let category;
  if (req.user.role != "admin") {
    category = await Category.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      req.body,
      {
        new: true,
      }
    );
  } else {
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  }
  if (!category)
    throw new ApiError(
      `No category with this id or You don't have a permission.`,
      404
    );
  res
    .status(202)
    .json({ status: "success", response: category, message: "Updated" });
});

exports.deleteOne = asyncHandler(async (req, res) => {
  let category;
  if (req.user.role != "admin") {
    category = await Category.findByIdAndDelete({
      _id: req.params.id,
      creator: req.user.id,
    });
  } else {
    category = await Category.findByIdAndDelete(req.params.id);
  }
  if (!category)
    throw new ApiError(
      `No category with this id or You don't have a permission.`,
      404
    );
  res.status(204).json({ status: "success", response: {}, message: "Deleted" });
});
