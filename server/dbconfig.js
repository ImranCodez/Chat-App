const mongoose = require("mongoose");
const connectDatabase = async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log("Database connected");
};

module.exports = connectDatabase;
