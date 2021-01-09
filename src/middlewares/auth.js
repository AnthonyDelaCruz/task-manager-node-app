// 3rd party
const jwt = require("jsonwebtoken");
// models
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  //   console.log("Auth middleware");
  try {
    // get token from authorization header
    const header = req.header("Authorization");
    const jwtToken = header.replace("Bearer ", "");
    const decodedToken = jwt.decode(jwtToken, process.env.JWT_SECRET);
    const userFormToken = await User.findOne({
      _id: decodedToken._id,
      "tokens.token": jwtToken,
    });

    if (!userFormToken) {
      // throw an error to run the catch block
      throw new Error();
    }

    // add prop  to request
    req.user = userFormToken;
    req.token = jwtToken;
    next();
  } catch (error) {
    console.log("error", error);
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authMiddleware;
