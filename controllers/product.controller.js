const Product = require("../models/product.model");
const factoryHandlers = require("./factoryHandlers");

exports.getAll = factoryHandlers.getAll(Product);
exports.createOne = factoryHandlers.createOne(Product);
exports.getOne = factoryHandlers.getOne(Product);
exports.updateOne = factoryHandlers.updateOne(Product);
exports.deleteOne = factoryHandlers.deleteOne(Product);
