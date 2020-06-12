const bcrypt = require("bcrypt");
const passwordHash = {
  hash: (password) => bcrypt.hashSync(password, 10),
  compare: (password, hash) => bcrypt.compareSync(password, hash),
};

module.exports = passwordHash;
