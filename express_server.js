
const express = require("express");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080;


app.set("view engine", "ejs");
// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


const urlDatabase = {
  b2xVn2: "http//:www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Generate random string
const generateRandomString = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Users object
const users = {
  userRandomID: {
    id:       "user@FBI.com",
    email:    "hannibal@FBI.com",
    password: "i-eat-people",
  },
  user2RandomID: {
    id:       "ashWilliamsID",
    email:    "boomStick@evilDead.com",
    password: "boomstick",
  }
};

const getUserFromCookie = function(req) {
  const userID = req.cookies["user_id"];
  return users[userID] || null;
};


app.get("/urls", (req, res) => {
  const user = getUserFromCookie(req);
  const templateVars = {
    urls: urlDatabase,
    user: user,
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

// Renders the page for a specific short URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  const templateVars = {
    id: id,
    longURL: longURL,
  };
  res.render("urls_show", templateVars);
});

// Redirects to the long URL associated with the given short URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];

  if (longURL) {
    res.redirect(longURL);
  } else {
    res.status(404).send("ShortURL not found");
  }
});


// Creates a new short URL and adds it to the urlDatabase
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);

  // res.redirect('/urls')
});

// add a Login Route
app.post('/login', (req, res) => {
  const username = req.body.username;

  console.log('Received username:', username);
  res.cookie('username', username);
  res.redirect('/urls');
});
// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
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


  if (!email || !password)  {
    return res.status(404).send("Email and password cannot be MT");
  }

  const existingUser = Object.values(users).find(user => user.email === email);


  if (existingUser) {
    return res.status(400).send("Email exists already");
  }

  const id = generateRandomString();

  users[id] = { id, email, password };

  console.log("Updated Users Object: ", users);

  res.cookie('user_id', id);
  res.redirect("/urls");

});


// Adding the edit route
app.get("/urls/:id/edit", (req, res) => {
  const editId = req.params.id;

  const templateVars = {
    editId: editId,
    urlDatabase: urlDatabase[editId],
  };
  res.render("edit-form", templateVars);
});

// adding route to update URL
app.post("/urls/:id", (req, res) => {
  const updateId = req.params.id;
  const newURL = req.body.longURL;
  urlDatabase[updateId] = newURL;
  res.redirect("/urls");
});


// Add a delete route
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];
  res.redirect('/urls');
});


// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

