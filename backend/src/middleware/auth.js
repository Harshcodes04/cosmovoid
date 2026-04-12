const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  req.user = user;
  next();
};

module.exports = authMiddleware;
