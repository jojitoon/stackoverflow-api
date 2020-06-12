const tokenGen = require("../utils/tokenGen");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({
      status: "error",
      message: "Unauthorized access.",
    });
  }

  try {
    const decoded = tokenGen.decrypt(token);
    req.currentUserId = decoded._id;
    return next();
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Server error!. Please try again later",
    });
  }
};
