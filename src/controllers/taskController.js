// models
const Task = require("../models/Task");

const createTask = async (req, res) => {
  const task = new Task({
    ...req.body, // spread the info in req.body i.e description, completed fields
    userId: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getTasks = async (req, res) => {
  // convert limit or skip query params to numbers
  Object.keys(req.query).forEach((queryParam) => {
    if (queryParam === "limit" || queryParam === "skip") {
      req.query[queryParam] = +req.query[queryParam];
    }

    if (queryParam === "sortBy") {
      const [sortField, sortType] = req.query[queryParam].split(":");

      const sortTypeValues = {
        asc: 1,
        desc: -1,
        ascending: 1, // old docs are first
        descending: -1, // new docs are first
      };

      req.query["sort"] = { [sortField]: sortTypeValues[sortType] };

      delete req.query["sortBy"];
    }
  });

  try {
    const tasks = await Task.find({ userId: req.user._id }, null, {
      ...req.query,
    }).exec();

    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
};

const getTaskById = async (req, res) => {
  const { id: _id } = req.params;
  try {
    // find task by id and only if user created that task
    const task = await Task.findOne({ _id, userId: req.user._id });
    await task.execPopulate({
      path: "userId",
      select: ["-tokens", "-password"], // do not return tokens and password field
    });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
};

const updateTask = async (req, res) => {
  // extract params from url
  const { id: _id } = req.params;
  try {
    // find task - (traditional way [UPDATED])
    // only update task if user is the author
    const task = await Task.findOne({ _id, userId: req.user._id });
    const fieldsToBeUpdated = Object.keys(req.body);

    if (!task) {
      return res.status(404).send();
    }

    // apply the fields from the req to the user obj
    fieldsToBeUpdated.forEach((field) => (task[field] = req.body[field]));
    // save the updated document
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
};

const deleteTask = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id, userId: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
