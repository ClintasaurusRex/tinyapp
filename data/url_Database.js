const urlDatabase = {
  b2xVn2: {
    longURL: "http//:www.lighthouselabs.ca",
    userID:  "user@FBI.com",
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID:  "ashWilliamsID",
  }
};

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

module.exports = { urlDatabase, urlsForUser };