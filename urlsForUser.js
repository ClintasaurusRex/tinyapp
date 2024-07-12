const urlDatabase = require("./data/urldataBase");

const urlsForUser = (id) => {
  if (Object.keys(urlDatabase).length === 0) {
    return {};
  }

  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};