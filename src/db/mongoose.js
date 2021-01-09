// mongoose basics
const mongoose = require("mongoose");
const connectionUrl = process.env.MONGODB_URL;
const databaseName = "task-manager-api";

mongoose.connect(`${connectionUrl}/${databaseName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
