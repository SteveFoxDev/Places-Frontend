const Joi = require("joi");

module.exports.placeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required().min(5),
  // image: Joi.string(),
  address: Joi.string().required(),
  creator: Joi.string().required(),
});

module.exports.updatePlaceSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required().min(5),
});

module.exports.userSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  name: Joi.string().required(),
  password: Joi.string().required().min(8),
});
