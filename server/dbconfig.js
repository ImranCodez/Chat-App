const mongoose = require("mongoose");
const dbcongfig = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB_Connected hoise"));
};

module.exports = dbcongfig;
