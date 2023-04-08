const asyncHandler = require("express-async-handler");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const slugify = require("slugify");
const ApiFeature = require("../utils/apiFeatures");

exports.getAll = asyncHandler(async (req, res) => {
  const feature = new ApiFeature(Product.find(), req.query).search().paginate();
  const products = await feature.query;
  if (!products.length) throw new ApiError("No data to show", 404);
  res
    .status(200)
    .json({ status: "success", response: products, message: "Data Fetched" });
});

exports.createOne = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    creator: req.user.id,
    slug: slugify(req.body.name, { lower: true }),
  });
  res
    .status(201)
    .json({ status: "success", response: product, message: "Created" });
});

exports.getOne = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  res
    .status(200)
    .json({ status: "success", response: product, message: "Created" });
});

exports.updateOne = asyncHandler(async (req, res) => {
  let product;
  if (req.user.role != "admin") {
    product = await Product.findOneAndUpdate(
      {_id: req.params.id, creator: req.user.id},
      req.body,
      {
        new: true,
      }
    );
  }else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
  }
  if (!product)
    throw new ApiError(
      `No product with this id or You don't have a permission.`,
      404
    );
  res
    .status(202)
    .json({ status: "success", response: product, message: "Updated" });
});

exports.deleteOne = asyncHandler(async (req, res) => {
  let product;
  if (req.user.role != "admin") {
    product = await Product.findByIdAndDelete(
      { _id: req.params.id, creator: req.user.id }
    );
  } else {
    product = await Product.findByIdAndDelete(req.params.id);
  }
  if (!product)
    throw new ApiError(
      `No product with this id or You don't have a permission.`,
      404
    );
  res.status(204).json({ status: "success", response: {}, message: "Deleted" });
});
