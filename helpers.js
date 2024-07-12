
// Helper Function to find a user by email
const getUserByEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
  return undefined;
};

const urlsForUser = (id, urlDatabase) => {
  if (Object.keys(urlDatabase).length === 0) {
    return {};
  }

  const userURLs = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userId === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }
  return userURLs;
};

module.exports = { getUserByEmail, urlsForUser };