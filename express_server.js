
const express = require("express");
const cookieParser = require('cookie-parser');
const users = require('./data/userData');
const {
  generateRandomString,
  getUserByEmail,
  getUserFromCookie,
} = require('./helpers/functions');

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
  if (!user) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars);
});
// Creates a new short URL and adds it to the urlDatabase
app.post("/urls", (req, res) => {
  const user = getUserFromCookie(req);
  if (!user) {
    return res.status(403).send("must be logged in\n");
  }


  const shortURL = generateRandomString();
  const dataURL = req.body.longURL;
  urlDatabase[shortURL] = {
    longURL: dataURL,
    userID: user.id,
  };

  res.redirect(`/urls/${shortURL}`);

  // res.redirect('/urls')
});


// Route to display a specific URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const dataURL = urlDatabase[id];
  const user = getUserFromCookie(req); // Get user from cookie
  if (!dataURL) {
    return res.status(404).send("URL not found"); // Return 404 if URL not found
  }
  const templateVars = {
    id: id,
    longURL: dataURL.longURL,
    user: user,
  };
  res.render("urls_show", templateVars); // Render the URL details page
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


// create a get /login endpoint that respons with new template
app.get("/login", (req, res) => {
  const user = getUserFromCookie(req);
  if (user) {
    return res.redirect("./urls");
  }
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
  if (user.password !== password) {
    return res.status(403).send("Incorrect password");
  }

  res.cookie('user_id', user.id);
  res.redirect('/urls');
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// Make a registration
app.get("/register", (req, res) => {
  const user = getUserFromCookie(req);
  // check if user is logged in and redirect
  if (user) {
    return res.redirect("./urls");
  }
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

  users[id] = { id, email, password };

  // console.log("Updated Users Object: ", users);

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

