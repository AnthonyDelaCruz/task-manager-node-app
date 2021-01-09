const mongoose = require("mongoose");

const schemaOptions = {
  timestamps: true,
};

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  schemaOptions
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
