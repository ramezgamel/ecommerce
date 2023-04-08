const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Category must be unique"],
      required: [true, "Category required"],
      trim: true,
      minLength: 4,
      maxLength: 20,
    },
    creator:{
      type: mongoose.SchemaTypes.ObjectId,
      ref:"User"
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
