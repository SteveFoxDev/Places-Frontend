const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary/index.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ExpressError = require("../models/ExpressError");
const User = require("../models/user");
const Place = require("../models/place.js");

// <<< --- GET USERS --- >>>
module.exports.getUsersList = async (req, res, next) => {
  const users = await User.find({}, '-password');
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};
// <<< --- CREATE USER --- >>>
module.exports.signupUser = async (req, res, next) => {
  const {name, email, password} = req.body;
  const { path: url, filename } = req.file;
  const hashedPassword = await bcrypt.hash(password, 12);
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    await cloudinary.uploader.destroy(filename);
    return next(new ExpressError("That email is already in use", 422));
  }
  const user = new User({ email, name, password: hashedPassword });
  user.image = { url, filename };
  await user.save();
  const token = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  res.json({ userId: user._id, emai: user.email, token: token });
};
// <<< --- LOGIN USER --- >>>
module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new ExpressError("Invalid email or password", 401));
  };
  const isValidPassword = await bcrypt.compare(password, user.password);
  if(!isValidPassword) {
    return next(new ExpressError("Invalid email or password", 401));
  };
  const token = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  res.json({ userId: user._id, emai: user.email, token: token });
};
// <<< --- DELETE USER --- >>>
module.exports.deleteUser = async (req, res, next) => {
  const userId = req.params.uid;
  // <<< --- Start Transacation --- >>>
  const session = await mongoose.startSession();
  session.startTransaction();
  const deletedUser = await User.findByIdAndDelete(userId).session(session);
  for(let place of deletedUser.places){
    const deletedPlace = await Place.findByIdAndDelete(place._id).session(session);
    await cloudinary.uploader.destroy(deletedPlace.image.filename);
  };
  const imageName = deletedUser.image.filename;
  await cloudinary.uploader.destroy(imageName);
  await session.commitTransaction();
  session.endSession();
  // <<< --- End Transaction --- >>>
  res.json({ message: "Deleted User" });
};
