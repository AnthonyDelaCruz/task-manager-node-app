// 3rd party
const express = require("express");
const multer = require("multer");
// models
const User = require("../models/User");
// middlewares
const authMiddleware = require("../middlewares/auth");
const uploadMiddlware = multer({
  // dest: "avatars", multer no long saves avatar in directory
  limits: {
    fileSize: 1000000, // 1mb
  },
  fileFilter: (req, file, cb) => {
    const { originalname } = file;
    const isImageRegex = new RegExp(/\.(jpg|png)$/, "g");
    const isImage = originalname.match(isImageRegex);
    if (isImage) {
      return cb(undefined, true);
    }
    return cb(new Error("File must only be images"), undefined);
  },
});
// controllers
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/users", userController.createUser);

router.post("/users/login", userController.loginUser);

router.post("/users/logout", authMiddleware, userController.logoutUser);

// logout user out of all sessions
router.post(
  "/users/logoutAll",
  authMiddleware,
  userController.logoutAllUserAccounts
);

// get users
// PATH, MIDDLEWARE, ROUTE HANDLER
router.get("/users/me", authMiddleware, userController.getCurrentUser);

router.patch("/users/me", authMiddleware, userController.updateUser);

router.delete("/users/me", authMiddleware, userController.deleteCurrentUser);

router.post(
  "/users/me/avatar",
  [authMiddleware, uploadMiddlware.single("avatar")],
  userController.uploadUserAvatar,
  (err, req, res, next) => {
    res.status(400).send({ error: err.message }); // custom error message for specific endpoint
  }
);

router.delete(
  "/users/me/avatar",
  authMiddleware,
  userController.deleteUserAvatar
);

router.get("/users/:id/avatar", userController.getUserAvatarById);

module.exports = router;
