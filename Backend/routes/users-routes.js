const express = require("express");
const { storage } = require('../cloudinary/index');
const multer = require('multer');
const upload = multer({storage});

const users = require("../controllers/users-controller");
const catchAsync = require("../util/catchAsync");
const { validateUser, isValidId } = require("../middleware/validate");
const { isLoggedIn, isUser } = require('../middleware/checkAuth');

const router = express.Router();

// <<< --- GET list of all Users --- >>>
router.get("/", catchAsync(users.getUsersList));
// <<< --- SIGNUP & LOGIN User --- >>>
router.post("/signup", upload.single('image'), validateUser, catchAsync(users.signupUser));
// <<< --- LOGIN user --- >>>
router.post("/login", catchAsync(users.loginUser));
// <<< --- DELETE USER --- >>>
router.delete("/:uid", isLoggedIn, isValidId, isUser, catchAsync(users.deleteUser));
module.exports = router;
