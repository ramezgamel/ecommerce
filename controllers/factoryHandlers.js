const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeature = require("../utils/apiFeatures");

exports.createOne = (model) => {
  return asyncHandler(async (req, res) => {
    if (req.file) {
      req.body[req.file.fieldname] = req.file.filename;
    }
    if (req.files) {
      if (req.files.images) {
        let imagesName = [];
        req.files.images.forEach((img) => {
          imagesName.push(img.filename);
        });
        req.body.images = imagesName;
      }
      if (req.files.imageCover != undefined) {
        req.body.imageCover = req.files.imageCover[0].filename;
      } else {
        req.body.imageCover = imagesName[0];
      }
    }
    const item = await model.create({
      ...req.body,
      creator: req.user.id,
      slug: slugify(req.body.name, { lower: true }),
    });
    res
      .status(201)
      .json({ status: "success", response: item, message: "Created" });
  });
};

exports.getAll = (model) => {
  return asyncHandler(async (req, res) => {
    const feature = new ApiFeature(model.find(), req.query)
      .fields()
      .filter()
      .paginate()
      .search()
      .sort();
    const items = await feature.query;
    if (!items.length) throw new ApiError("No data to show", 404);
    res
      .status(200)
      .json({ status: "success", response: items, message: "Data Fetched" });
  });
};

exports.updateOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    let item;
    if (req.user.role != "admin") {
      item = await model.findOneAndUpdate(
        { _id: req.params.id, creator: req.user.id },
        req.body,
        {
          new: true,
        }
      );
    } else {
      item = await model.findByIdAndUpdate(
        req.params.id,
        { ...req.body, slug: slugify(req.body.name, { lower: true }) },
        {
          new: true,
        }
      );
    }
    if (!item)
      throw new ApiError(
        `No item with this id or You don't have a permission.`,
        404
      );
    res
      .status(202)
      .json({ status: "success", response: item, message: "Updated" });
  });
};

exports.getOne = (model) => {
  return asyncHandler(async (req, res) => {
    const item = await model.findById(req.params.id);
    if (!item) throw new ApiError("Invalid id", 400);
    res.status(202).json({ success: true, response: item, message: "Fetched" });
  });
};

exports.deleteOne = (model) => {
  return asyncHandler(async (req, res) => {
    let item;
    if (req.user.role != "admin") {
      item = await model.findByIdAndDelete({
        _id: req.params.id,
        creator: req.user.id,
      });
    } else {
      item = await model.findByIdAndDelete(req.params.id);
    }
    if (!item)
      throw new ApiError(
        `No item with this id or You don't have a permission.`,
        404
      );
    res
      .status(204)
      .json({ status: "success", response: {}, message: "Deleted" });
  });
};
