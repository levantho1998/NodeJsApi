const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.CLIENT_ID;
// Middleware để kiểm tra AccessToken

const verifyAccessToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }

  jwt.verify(token, jwtSecretKey, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

const middleware = { verifyAccessToken, jwtSecretKey };

module.exports = middleware;
