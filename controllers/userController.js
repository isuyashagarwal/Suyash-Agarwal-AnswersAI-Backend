const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc Create New User
//@route POST /api/users/
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`user created: ${user}`);
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
  res.json({ message: "Register Route" });
});

//@desc Login User
//@route POST /api/auth/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(
      user,
      "accessToken",
      process.env.ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = generateAccessToken(user, "refreshToken", "7d");

    const updateUser = await User.findByIdAndUpdate(
      user._id,
      { refreshToken },
      { new: true }
    );
    res.status(200).json({ accessToken, refreshToken });
  } else {
    res.status(401);
    throw new Error("Invalid email or password!");
  }
  res.json({ message: "Register Route" });
});

//@desc Get current user profile
//@route GET api/users/:userid
//@access public
const userprofile = asyncHandler(async (req, res) => {
  console.log("Here");
  const user = await User.findById(req.params.userid);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }
  res.json({ username: user.username, email: user.email, id: user._id });
});

//@desc Refresh Access Token
//@route POST /api/auth/refresh
//@access public
const refreshToken = asyncHandler(async (req, res) => {
  const refreshtoken = req.body.token;
  if (!refreshtoken) {
    res.status(401);
    throw new Error("Access Denied");
  }
  const user = await User.findOne({ refreshToken: refreshtoken });
  if (!user) {
    res.status(401);
    throw new Error("Access Denied");
  }
  jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401);
      throw new Error("Access Denied");
    }
    let newAccessToken = generateAccessToken(
      user.user,
      "accessToken",
      process.env.ACCESS_TOKEN_EXPIRY
    );
    res.json({ newAccessToken });
  });
});

//@desc Logout User
//@route POST /api/auth/logout
//@access public
const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  if (!user) {
    res.status(401);
    throw new Error("Access Denied");
  }
  user.refreshToken = "";
  await user.save();
  res.json({ message: "Logged Out" });
});

//Function to manage token generation
function generateAccessToken(user, secret, expiry) {
  if (secret === "accessToken") {
    secretKey = process.env.ACCESS_TOKEN_SECRET;
  } else {
    secretKey = process.env.REFRESH_TOKEN_SECRET;
  }
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user._id || user.id,
      },
    },
    secretKey,
    {
      expiresIn: expiry || "15m",
    }
  );
}

module.exports = {
  registerUser,
  loginUser,
  userprofile,
  refreshToken,
  logoutUser,
};
