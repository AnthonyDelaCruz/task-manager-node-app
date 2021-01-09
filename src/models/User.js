const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// models
const Task = require("../models/Task");

const schemaOptions = {
  timestamps: true,
};
// create a schema
// reason - schema was created to take advantage of middleware functionalities
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      validate(email) {
        if (validator.isEmail(email)) {
          return true;
        } else {
          throw new Error("Must be a valid email.");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate: {
        validator(password) {
          if (password.includes("password")) {
            throw new Error('Password must not include the word "password"');
          }
          return true;
        },
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  schemaOptions
);

// methods are attached to the document
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // add token to user instance
  user.tokens = [...user.tokens, { token }];
  await user.save();

  return token;
};

// virtual fields
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id", // field in User model that is equal to userId in Task model i.e _id
  foreignField: "userId", // field on the referenced model to set relationship
});

// add new method to user Schema
// static methods are directly attached to model
// model.[CUSTOM_STATIC_FUNCTION]
userSchema.statics.findByCredentials = async function (email, password) {
  const User = this;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  // if user exists, compare password using bcrpyt
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// pre will happen before chosen eveny happens
userSchema.pre("save", async function (next) {
  // should be a function declaration so we can use this
  // this will be the document being saved
  const user = this;

  if (user.isModified("password")) {
    // has the password if its modified
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// delete user tasks before user gets deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ userId: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
