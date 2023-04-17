const express = require("express");
const globalError = require("./middleware/globalError");
const ApiError = require("./utils/apiError");
const path = require("path");

//============== MiddleWares ====================
const cors = require("cors");
const morgan = require("morgan");
const app = express();
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//==================== Routes =====================
const categoryRoutes = require("./routes/category.routes");
const productsRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const checkOutRoutes = require("./routes/checkOut.routes");
app.use("/categories", categoryRoutes);
app.use("/products", productsRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/checkOut", checkOutRoutes);

//============== Routes errors handling ==============
app.all("*", (req, res, next) => {
  console.log("====== route error =======");
  next(new ApiError(`can't find this route: ${req.originalUrl}`, 500));
});

//============== Global errors handling ==============
app.use(globalError);

module.exports = app;
