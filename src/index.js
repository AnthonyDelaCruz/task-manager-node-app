// 3rd party modules
const express = require("express");
const app = express();
require("dotenv").config();
// models
const Task = require("./models/Task");
// routers
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
// import mongoose folder to run mongoose code
require("./db/mongoose");
// constants
const PORT = process.env.PORT;

// middleware for when app is in maintenance mode
// app.use((req, res, next) => {
//   res.status(503).send("App is in maintenance mode.");
// });

// automatically parse JSON in req
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);

app.listen(PORT, () => console.log(`Server connected to PORT:${PORT}`));
