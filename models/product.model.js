const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    images:[
      {type: String}
    ],
    imageCover: String
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
