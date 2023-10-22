const jwt = require("jsonwebtoken");
require("dotenv").config();

// Thay thế bằng khóa bí mật thực tế
const { jwtSecretKey } = require("../middleware");

const generateAccessToken = (user) => {
  return jwt.sign(user, jwtSecretKey, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, jwtSecretKey, { expiresIn: "7d" });
};

const token = { generateAccessToken, generateRefreshToken, jwtSecretKey };

module.exports = token;
