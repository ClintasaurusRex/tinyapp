
// const users = require('../data/userData');
// Helper Function to find a user by email
const getUserByEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
  return undefined;
};


module.exports = { getUserByEmail };