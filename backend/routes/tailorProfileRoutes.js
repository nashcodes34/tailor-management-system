const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  uploadLogo,
  changePassword,
} = require("../controllers/tailorProfileController");

router.use(protect);

router.get("/", getProfile);

router.put("/", updateProfile);

router.put("/logo", upload.single("logo"), uploadLogo);

router.put("/password", changePassword);

module.exports = router;
