const express = require("express");
const { storage } = require('../cloudinary/index');
const multer = require('multer');
const upload = multer({storage});

const places = require("../controllers/places-controller");
const catchAsync = require("../util/catchAsync");
const { isLoggedIn, isOwner } = require("../middleware/checkAuth");
const {
    validatePlace,
    validateUpdatedPlace,
    isValidId,
  } = require("../middleware/validate");

const router = express.Router();

// <<< --- GET PLACES by UserID --- >>>
router.get("/user/:uid", isValidId, catchAsync(places.getPlacesByUserId));
// <<< --- GET place by ID --- >>>
router.get("/:pid", isValidId, catchAsync(places.getPlaceById));
// <<< --- CREATE PLACE --- >>>
router.post("/", upload.single('image'), isLoggedIn, validatePlace, catchAsync(places.createNewPlace));
// <<< --- UPDATE PLACE --- >>>
router.patch(
  "/:pid",
  isLoggedIn,
  isValidId,
  isOwner, 
  validateUpdatedPlace,
  catchAsync(places.updatePlace)
);
// <<< --- DELETE PLACE --- >>>
router.delete("/:pid", isLoggedIn, isValidId, isOwner, catchAsync(places.deletePlace));

module.exports = router;
