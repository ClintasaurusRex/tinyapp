
const express = require("express");
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const users = require('./data/userData');
// const urlDatabase = require("./data/url_Database");
const {
  generateRandomString,
  getUserByEmail,
  getUserFromCookie,
} = require('./helpers/helper');

const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ["Hello"]
}));

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
  const userURLs = {};
  for (const urlId in urlDatabase) {
    if (urlDatabase[urlId].userID === id) {
      userURLs[urlId] = urlDatabase[urlId];
    }

  }
  return userURLs;
};


app.get("/urls", (req, res) => {
  const user = getUserFromCookie(req);


  if (!user) {
    return res.status(403).send("Please log in or register to view URLs.!!!!!!!!!!");
  }

  const userURLs = urlsForUser(user.id);
  const templateVars = {
    urls: userURLs,
    user: user
  };
  res.render("urls_index", templateVars);
});

// Renders the form to create a new short URL
app.get("/urls/new", (req, res) => {
  const user = getUserFromCookie(req);
  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars);
});


// Renders the page for a specific short URL-----------------------------------*
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  // const { longURL } = req.body;
  const urlEntry = urlDatabase[id];
  const user = getUserFromCookie(req);

  if (!user) {
    return res.status(403).send("Please log in to view this URL");
  }

  if (!urlEntry) {
    return res.status(404).send("URL NOT FOUND");
  }

  if (urlEntry.userID !== user.id) {
    return res.send(403).send("This URL doesnt belong to you!");
  }

  const templateVars = {
    id: id,
    longURL: urlEntry.longURL,
    user: user
  };
  // urlDatabase[id].longURL = longURL;
  res.render("urls_show", templateVars);
});

// Redirects to the long URL associated with the given short URL=============
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const urlEntry = urlDatabase[shortURL];

  if (urlEntry) {
    res.redirect(urlEntry.longURL);
  } else {
    res.status(404).send("ShortURL not found");
  }
});

// Creates a new short URL and adds it to the urlDatabase===================
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  const user = getUserFromCookie(req);

  if (user) {
    urlDatabase[shortURL] = {
      longURL: longURL,
      userID: user.id
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(403).send("You must be logged in to create new URLs.");
  }
});

// create a get /login endpoint that respons with new template
app.get("/login", (req, res) => {
  const user = getUserFromCookie(req);
  const templateVars = {
    user: user,
  };
  res.render("login", templateVars);
});

// add a Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // find email
  const user = getUserByEmail(email);
  //check it user and passwords match
  if (!user) {
    return res.status(403).send("Invalid Email");
  }
  if (!bcrypt.compareSync(password, user.password)) {//======================
    return res.status(403).send("Incorrect password");
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// Make a registration
app.get("/register", (req, res) => {
  const user = getUserFromCookie(req);
  const templateVars = {
    user: user,
  };
  res.render("register", templateVars);
});

// register
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const existingUser = getUserByEmail(email);

  // check if user doesnt fill in the fields
  if (!email || !password)  {
    return res.status(403).send("Email and password cannot be empty");
  }
  // check if the user already exists
  if (existingUser) {
    return res.status(403).send("Email exists already");
  }

  const id = generateRandomString();
  // Hast the password
  const hashedPass = bcrypt.hashSync(password, 10);//=========

  users[id] = { id, email, password: hashedPass };//===========

  // console.log("Updated Users Object: ", users);

  req.session.user_id = id;
  res.redirect("/urls");

});


// Adding the edit route===========================================
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const { longURL } = req.body;
  const urlEntry = urlDatabase[id];
  const user = getUserFromCookie(req);

  if (!user) {
    return res.status(403).send("Please log in to edit URLs.");
  }

  if (!urlEntry) {
    return res.status(404).send("URL not found.");
  }

  if (urlEntry.userID !== user.id) {
    return res.status(403).send("You can only edit your own URLs.");
  }

  urlDatabase[id].longURL = longURL;
  res.redirect("/urls");
});


// Add a delete route
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const urlEntry = urlDatabase[id];
  const user = getUserFromCookie(req);

  if (!user) {
    return res.status(403).send("Please log in to delete URLs.");
  }

  if (!urlEntry) {
    return res.status(404).send("URL not found.");
  }

  if (urlEntry.userID !== user.id) {
    return res.status(403).send("You can only delete your own URLs.");
  }

  delete urlDatabase[id];
  res.redirect("/urls");
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

