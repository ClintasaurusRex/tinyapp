const urlDatabase = require("../data/url_Database");
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
  // const userID = req.session.user_id;
  return users[req.session.user_id] || null;
};

// Helper Function to find a user by email
const getUserByEmail = function(email, database = users) {
  if (!users || typeof users !== 'object') {
    return null;
  }
  return Object.values(database).find(user => user.email === email);

};
const urlsForUser = (id) => {
  const userURLs = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userURLs[urlId] = urlDatabase[urlId];
    }

  }
  return userURLs;
};


module.exports = { generateRandomString, getUserFromCookie, getUserByEmail, urlsForUser };