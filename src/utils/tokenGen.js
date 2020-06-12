const jwt = require("jsonwebtoken");

const tokenGen = {
  encypt: (payload) => jwt.sign(payload, process.env.JWT_SECRET),
  decrypt: (token) => jwt.verify(token, process.env.JWT_SECRET),
};

module.exports = tokenGen;
