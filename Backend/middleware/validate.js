const mongoose = require("mongoose");

const { placeSchema, updatePlaceSchema, userSchema } = require("../joiSchemas");
const ExpressError = require("../models/ExpressError");

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };
};

module.exports.validatePlace = validateSchema(placeSchema);

module.exports.validateUpdatedPlace = validateSchema(updatePlaceSchema);

module.exports.validateUser = validateSchema(userSchema);

module.exports.isValidId = (req, res, next) => {
  req.params.pid ? ({ pid: id } = req.params) : null;
  req.params.uid ? ({ uid: id } = req.params) : null;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("No place found with that Id", 404));
  }
  next();
};
