
const users = require('../data/userData');

// Generate random string
const generateRandomString = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getUserFromCookie = function(req) {
  const userID = req.cookies["user_id"];
  return users[userID] || null;
};

// Helper Function to find a user by email
const getUserByEmail = function(email) {
  return Object.values(users).find(user => user.email === email);

};






module.exports = { generateRandomString, getUserFromCookie, getUserByEmail };