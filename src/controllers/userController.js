// 3rd party
const sharp = require("sharp");
// models
const User = require("../models/User");
//services
const emailService = require("../services/emailAccountService");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // generate token after saving user
    const token = await user.generateAuthToken();
    // semd welcome email
    emailService.sendWelcomeEmail(user);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

/**
 * @param  {} req
 * @param  {} res
 * METHOD patch
 * URL /users/me
 * This will update current logged in user info
 */
const updateUser = async (req, res) => {
  try {
    const fieldsToBeUpdated = Object.keys(req.body);

    fieldsToBeUpdated.forEach((field) => (req.user[field] = req.body[field]));
    // save the user
    // doing it this way will ensure middleware will run
    // read about problems with findOneAndUpdate with the mongoose save middleware
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
};

const uploadUserAvatar = async (req, res) => {
  try {
    // const avatarBuffer = req.file.buffer;
    // convert image to use sharp response
    // .png() will transform any image to png format
    // .resize({width: , height: }) will resize programatically
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();

    const user = req.user;
    // save buffer to user document
    user.avatar = buffer;
    await user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const deleteUserAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const getUserAvatarById = async (req, res) => {
  const { id } = req.params;

  try {
    // find user by id
    const user = await User.findById(id);

    if (!user || !user.avatar) {
      return res.status(404).send();
    }

    // send back data as jpeg
    // set response header content type
    res.set("Content-Type", "image/png");

    res.send(user.avatar);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    if (user) {
      res.send({ user, token });
    } else {
      res.status(404).send("No such user exists. Please create an account.");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    // filter out specific token from multiple devices
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const logoutAllUserAccounts = async (req, res) => {
  try {
    // remove all tokens from user that is currently logged in
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

const getCurrentUser = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    await req.user.remove();
    emailService.sendCancellationEmail(req.user);
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createUser,
  updateUser,
  uploadUserAvatar,
  deleteUserAvatar,
  getUserAvatarById,
  loginUser,
  logoutUser,
  logoutAllUserAccounts,
  getCurrentUser,
  deleteCurrentUser,
};
