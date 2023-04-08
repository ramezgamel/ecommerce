const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Password Confirm is required"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Confirm password doest not match.",
      },
    },
    profileImg: {
      type: String,
      default: "default.jpeg"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordChangedAtAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPass = async function (clientPass, hashedPass) {
  return await bcrypt.compare(clientPass, hashedPass);
};

userSchema.methods.isPasswordChanged = function (jwtTimeStamps) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimeStamps < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 5 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
