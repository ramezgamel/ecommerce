const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.LOCAL_DB).then((con) => {
    console.log(`DataBase Connected: ${con.connection.host}`);
  });
};

module.exports = dbConnection;
