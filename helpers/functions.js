
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
  const userID = req.session.user_id;
  return users[req.session.user_id] || null;
};

// Helper Function to find a user by email
const getUserByEmail = function(email) {
  return Object.values(users).find(user => user.email === email);

};

// // URLs for user
// //defien the function
// const urlsForUSer = function(id) {
//   //init an MT object
//   const userURLs = {};

//   //Iterate through each url in the urlDatabase
//   for (const urlId in urlDatabase)  {
//     // Check if the current URL belongs to the user with given ID
//     if (urlDatabase[urlId].userID === id) {
//       // IF it does add this URL to the userURLs object
//       // The key is the urlId, and the value is the entire URL obj
//       userURLs[urlId] = urlDatabase[urlId];
//     }
//   }
//   return userURLs;
// };

// Picture a big box (urlDatabase) full of smaller boxes (URLs).
// We're given a special number (id) to find our own boxes.
// We grab an empty basket (userURLs) to collect our boxes.
// We look at each small box in the big box, one by one.
// If a small box has our special number on it, we put it in our basket.
// We keep doing this until we've checked all the boxes.
// Finally, we hand over our basket full of our boxes.

module.exports = { generateRandomString, getUserFromCookie, getUserByEmail, };