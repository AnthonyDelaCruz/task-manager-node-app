// 3rd party
const express = require("express");
const router = express.Router();
// models
const Task = require("../models/Task");
// middlewares
const authMiddleware = require("../middlewares/auth");
// controllers
const taskControllers = require("../controllers/taskController");

// create task
router.post("/tasks", authMiddleware, taskControllers.createTask);

// get all tasks
router.get("/tasks", authMiddleware, taskControllers.getTasks);

// get task by id
router.get("/tasks/:id", authMiddleware, taskControllers.getTaskById);

// update task
router.patch("/tasks/:id", authMiddleware, taskControllers.updateTask);

// delete task
router.delete("/tasks/:id", authMiddleware, taskControllers.deleteTask);

module.exports = router;
