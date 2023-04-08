const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require("../utils/apiError");


exports.getAll = (model) => {
  return asyncHandler(async (req, res) => {
    const data = await model.find();
    if (data.length == 0) throw new ApiError("Not found any data", 404);
    res.status(300).json({ success: true, response: data, message:'all data fetched' });
  });
}

exports.createOne = (model) => {
  return asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.name)
    const item = await model.create(req.body);
    res.status(201).json({ success: true, response: item, message:'Created successfully' });
  });
}

exports.updateOne = (model) => {
  return asyncHandler(async (req, res) => {
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    const item = await model.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(201).json({ success: true, response: item, message:'Updated' });
  });
}

exports.getOne = (model) => {
  return asyncHandler(async (req, res) => {
    const item = await model.findById(req.params.id);
    res.status(300).json({ success: true, response: item, message: "Fetched" });
  });
}

exports.deleteOne = (model) => {
  return asyncHandler(async (req, res) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if(!item) throw new ApiError(`No item with this id: ${req.params.id}`, 404)
    res.status(200).json({ success: true, response: item, message: "Deleted" });
  });
}