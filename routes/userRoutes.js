const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  userprofile,
  refreshToken,
  logoutUser,
} = require("../controllers/userController");

router.post("/users", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/refresh", refreshToken);
router.get("/users/:userid", userprofile);
module.exports = router;
