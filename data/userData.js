const bcrypt = require("bcryptjs");
// Users object
const users = {
  "user@FBI.com": {
    id:       "user@FBI.com",
    email:    "hannibal@FBI.com",
    password: bcrypt.hashSync("i-eat-people",10),
  },
  "ashWilliamsID": {
    id:       "ashWilliamsID",
    email:    "boomStick@evilDead.com",
    password: bcrypt.hashSync("boomstick", 10),
  }
};

module.exports = users;