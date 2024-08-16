const mongoose = require("mongoose");
const { cloudinary } = require('../cloudinary/index.js');

const ExpressError = require("../models/ExpressError");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

// <<< --- SHOW PLACE  --- >>>
module.exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const place = await Place.findById(placeId);
  !place
    ? next(new ExpressError("No place found with that id!", 404))
    : res.json({ place: place.toObject({ getters: true }) });
};
// <<< --- SHOW PLACES by USER --- >>>
module.exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  const places = await Place.find({ creator: userId });
  !places 
    ? next(new ExpressError("No places found for that user id!", 404))
    : res.json({
        places: places.map((place) => place.toObject({ getters: true })),
      });
};
// <<< --- CREATE PLACE --- >>>
module.exports.createNewPlace = async (req, res, next) => {
  const newPlace = req.body;
  const { path: url, filename } = req.file;
  const coordinates = await getCoordsForAddress(newPlace.address);
  const user = await User.findById(req.body.creator);
  const place = new Place(newPlace);
  place.image = { url, filename }
  place.location = coordinates;
  // <<< --- Start Transaction --- >>>
  const session = await mongoose.startSession();
  session.startTransaction();
  await place.save({ session: session });
  user.places.push(place);
  await user.save({ session: session });
  await session.commitTransaction();
  session.endSession();
  // <<< --- END Transaction --- >>>
  res.json(place);
};
// <<< --- UPDATE PLACE --- >>>
module.exports.updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;
  const updatedPlace = await Place.findByIdAndUpdate(placeId, {
    $set: { title, description },
  });
  res.json(updatedPlace);
};
// <<< --- DELETE PLACE --- >>>
module.exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // <<< --- Start Transacation --- >>>
  const session = await mongoose.startSession();
  session.startTransaction();
  const deletedPlace = await Place.findByIdAndDelete(placeId).session(session);
  const imageName = deletedPlace.image.filename;
  await cloudinary.uploader.destroy(imageName);
  await User.findByIdAndUpdate(
    deletedPlace.creator,
    {
      $pull: { places: placeId },
    },
    { session }
  );
  await session.commitTransaction();
  session.endSession();
  // <<< --- End Transaction --- >>>
  res.json({ message: "Deleted Place" });
};
