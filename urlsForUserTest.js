
const urlDatabase = require("./data/url_Database");


const urlsForUser = (id) => {
  const userURLs = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userURLs[urlId] = urlDatabase[urlId];
    }

  }
  return userURLs;
};


module.exports = { urlsForUser };
