const jwt = require("jsonwebtoken");

const ExpressError = require("../models/ExpressError");
const Place = require("../models/place");
const User = require("../models/user");

module.exports.isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer Token'
    if (!token) {
      return next(new ExpressError("Auth Failed"));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new ExpressError("Authentication Failed!", 401));
  }
};

module.exports.isOwner = async (req, res, next) => {
  const placeId = req.params.pid;
  const place = await Place.findById(placeId);
  if (!place){
    return next(new ExpressError('That place does NOT exist.', 404));
  }
  const userId = place.creator.toString();
  if (userId !== req.userData.userId) {
    return next(new ExpressError('You do NOT have permission to do that'));
  }
  next();
};

module.exports.isUser = async (req, res, next) => {
  const { uid } = req.params;
  const user = await User.findById(uid);
  if (!user){
    return next(new ExpressError('That User does NOT exist.', 404));
  }
  const userId = user._id.toString();
  if (userId !== req.userData.userId) {
    return next(new ExpressError('You do NOT have permission to do that'));
  }
  next();
};
