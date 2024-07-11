// Import required modules
const express = require("express"); // Import Express framework
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware
const users = require('./data/userData'); // Import user data
const {
  generateRandomString,
  getUserByEmail,
  getUserFromCookie,
} = require('./helpers/functions'); // Import helper functions

// Create an Express application
const app = express(); // Initialize Express app
const PORT = 8080; // Set the port number

// Set the view engine to EJS
app.set("view engine", "ejs"); // Configure EJS as the template engine

// Set up middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Define the initial URL databaseb
const urlDatabase = {
  b2xVn2: "http//:www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Route to display all URLs
app.get("/urls", (req, res) => {
  const user = getUserFromCookie(req); // Get user from cookie
  const templateVars = {
    urls: urlDatabase,
    user: user,
  };
  res.render("urls_index", templateVars); // Render the URLs index page
});

// Route to display the form for creating a new short URL
app.get("/urls/new", (req, res) => {
  const user = getUserFromCookie(req); // Get user from cookie
  if (!user) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }
  const templateVars = {
    user: user,
  };
  res.render("urls_new", templateVars); // Render the new URL form
});

// Route to handle the creation of a new short URL
app.post("/urls", (req, res) => {
  const user = getUserFromCookie(req); // Get user from cookie
  if (!user) {
    return res.status(403).send("must be logged in\n"); // Return error if not logged in
  }
  const shortURL = generateRandomString(); // Generate a new short URL
  const dataURL = req.body.longURL;
  urlDatabase[shortURL] = {
    dataURL: dataURL.longURL,
    userID: user.id,
  };
  res.redirect(`/urls/${shortURL}`); // Redirect to the new short URL page
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

// Route to redirect to the long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL); // Redirect to the long URL
  } else {
    res.status(404).send("ShortURL not found"); // Return 404 if short URL not found
  }
});

// Route to display the login page
app.get("/login", (req, res) => {
  const user = getUserFromCookie(req); // Get user from cookie
  if (user) {
    return res.redirect("./urls"); // Redirect to URLs if already logged in
  }
  const templateVars = {
    user: user,
  };
  res.render("login", templateVars); // Render the login page
});

// Route to handle user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserByEmail(email); // Get user by email

  if (!user) {
    return res.status(403).send("Invalid Email"); // Return error if email not found
  }
  if (user.password !== password) {
    return res.status(403).send("Incorrect password"); // Return error if password incorrect
  }
  res.cookie('user_id', user.id); // Set user_id cookie
  res.redirect('/urls'); // Redirect to URLs page
});

// Route to handle user logout
app.post('/logout', (req, res) => {
  res.clearCookie('user_id'); // Clear user_id cookie
  res.redirect('/urls'); // Redirect to URLs page
});

// Route to display the registration page
app.get("/register", (req, res) => {
  const user = getUserFromCookie(req); // Get user from cookie
  if (user) {
    return res.redirect("./urls"); // Redirect to URLs if already logged in
  }
  const templateVars = {
    user: user,
  };
  res.render("register", templateVars); // Render the registration page
});

// Route to handle user registration
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const existingUser = getUserByEmail(email); // Check if user already exists
  if (!email || !password)  {
    return res.status(403).send("Email and password cannot be empty"); // Return error if fields are empty
  }
  if (existingUser) {
    return res.status(403).send("Email exists already"); // Return error if email already registered
  }
  const id = generateRandomString(); // Generate new user ID
  users[id] = { id, email, password }; // Add new user to users object
  console.log("Updated Users Object: ", users);
  res.cookie('user_id', id); // Set user_id cookie
  res.redirect("/urls"); // Redirect to URLs page
});

// Route to display the edit form for a URL
app.get("/urls/:id/edit", (req, res) => {
  const editId = req.params.id;
  const templateVars = {
    editId: editId,
    urlDatabase: urlDatabase[editId],
  };
  res.render("edit-form", templateVars); // Render the edit form
});

// Route to handle URL updates
app.post("/urls/:id", (req, res) => {
  const updateId = req.params.id;
  const newURL = req.body.longURL;
  urlDatabase[updateId] = newURL; // Update the URL in the database
  res.redirect("/urls"); // Redirect to URLs page
});

// Route to handle URL deletion
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id]; // Delete the URL from the database
  res.redirect('/urls'); // Redirect to URLs page
});

// Start the server
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`); // Log server start
});

// Route to return the URL database as JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // Send the URL database as JSON
});
