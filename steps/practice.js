app.post("/register", (req, res) => {
  // This line sets up a POST route handler for the "/register" endpoint
  // It takes two parameters: the request (req) and response (res) objects

  const { email, password } = req.body;
  // Destructure the email and password from the request body
  // This assumes the client sent these fields in the request

  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty");
  }
  // Check if email or password is empty
  // If either is empty, send a 400 status with an error message and end the request

  // Check if email already exists
  const existingUser = Object.values(users).find(user => user.email === email);
  // Search the users object for a user with the given email
  // Object.values(users) creates an array of all user objects
  // .find() method returns the first user object where the email matches, or undefined if not found

  if (existingUser) {
    return res.status(400).send("Email already registered");
  }
  // If a user with this email already exists, send a 400 status with an error message and end the request

  const id = generateRandomString();
  // Generate a random string to use as the user's ID
  // This assumes there's a function called generateRandomString() defined elsewhere

  users[id] = { id, email, password };
  // Create a new user object with the generated id, email, and password
  // Add this new user object to the users object, using the id as the key

  console.log("Updated users object:", users);  // For testing
  // Log the updated users object to the console
  // This is likely for debugging purposes and should be removed in production

  res.cookie('user_id', id);
  // Set a cookie in the response named 'user_id' with the value of the new user's id

  res.redirect('/urls');
  // Redirect the client to the '/urls' page
});


// NUmber two---------------------------
/*
// Import the Express framework
const express = require("express");
// Import the cookie-parser middleware for handling cookies
const cookieParser = require('cookie-parser');

// Import custom helper functions from a local file
const {
  generateRandomString, // Function to generate a random string (likely for short URLs)
  getUserByEmail,       // Function to retrieve a user by their email
  getUserFromCookie,    // Function to get user information from a cookie
} = require('./helpers/functions');

// Create an instance of the Express application
const app = express();
// Set the port number for the server to listen on
const PORT = 8080;

// Set the view engine to EJS (Embedded JavaScript) for rendering dynamic HTML
app.set("view engine", "ejs");

// Middleware setup
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Use cookie-parser middleware to parse cookies from the request
app.use(cookieParser());

// Define an object to store URL mappings (short URL to long URL)
const urlDatabase = {
  b2xVn2: "http//:www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Define an object to store user information
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

// Route handler for the main URLs page
app.get("/urls", (req, res) => {
  const user = getUserFromCookie(req); // Get user info from cookie
  const templateVars = {
    urls: urlDatabase, // Pass the URL database to the template
    user: user,        // Pass the user info to the template
  };
  res.render("urls_index", templateVars); // Render the urls_index template with the variables
});

// Route handler for the page to create a new short URL
app.get("/urls/new", (req, res) => {
  const user = getUserFromCookie(req); // Get user info from cookie
  const templateVars = {
    user: user, // Pass the user info to the template
  };
  res.render("urls_new", templateVars); // Render the urls_new template with the user info
});

// Route handler to display information about a specific short URL
app.get("/urls/:id", (req, res) => {
  const id = req.params.id; // Get the short URL id from the request parameters
  const longURL = urlDatabase[id]; // Look up the corresponding long URL

  const templateVars = {
    id: id,           // Pass the short URL id to the template
    longURL: longURL, // Pass the long URL to the template
  };
  res.render("urls_show", templateVars); // Render the urls_show template with the URL info
});

// Route handler to redirect from a short URL to its corresponding long URL
app.get("/u/:id", (req, res) => {
  const shortURL = req.params.id; // Get the short URL from the request parameters
  const longURL = urlDatabase[shortURL]; // Look up the corresponding long URL

  if (longURL) {
    res.redirect(longURL); // Redirect to the long URL if it exists
  } else {
    res.status(404).send("ShortURL not found"); // Send a 404 error if the short URL doesn't exist
  }
});

// Route handler to create a new short URL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(); // Generate a new short URL
  const longURL = req.body.longURL; // Get the long URL from the request body
  urlDatabase[shortURL] = longURL; // Add the new mapping to the URL database
  res.redirect(`/urls/${shortURL}`); // Redirect to the page for the new short URL
});

// Route handler for user login
app.post('/login', (req, res) => {
  const username = req.body.username; // Get the username from the request body
  console.log('Received username:', username); // Log the received username (for debugging)
  res.cookie('username', username); // Set a cookie with the username
  res.redirect('/urls'); // Redirect to the main URLs page
});

// Route handler for user logout
app.post('/logout', (req, res) => {
  res.clearCookie('username'); // Clear the username cookie
  res.redirect('/urls'); // Redirect to the main URLs page
});

// Route handler to display the registration form
app.get("/register", (req, res) => {
  const user = getUserFromCookie(req); // Get user info from cookie
  const templateVars = {
    user: user, // Pass the user info to the template
  };
  res.render("register", templateVars); // Render the registration template
});

// Route handler to process user registration
app.post("/register", (req, res) => {
  const { email, password } = req.body; // Get email and password from request body
  const existingUser = getUserByEmail(email); // Check if a user with this email already exists

  if (!email || !password)  {
    return res.status(400).send("Email and password cannot be empty"); // Return error if email or password is empty
  }

  if (existingUser) {
    return res.status(400).send("Email exists already"); // Return error if email is already registered
  }

  const id = generateRandomString(); // Generate a new user ID
  users[id] = { id, email, password }; // Create a new user object and add it to the users database

  console.log("Updated Users Object: ", users); // Log the updated users object (for debugging)

  res.cookie('user_id', id); // Set a cookie with the new user's ID
  res.redirect("/urls"); // Redirect to the main URLs page
});

// Route handler to display the edit form for a URL
app.get("/urls/:id/edit", (req, res) => {
  const editId = req.params.id; // Get the URL ID to edit from the request parameters

  const templateVars = {
    editId: editId, // Pass the URL ID to the template
    urlDatabase: urlDatabase[editId], // Pass the current long URL to the template
  };
  res.render("edit-form", templateVars); // Render the edit form template
});

// Route handler to update a URL
app.post("/urls/:id", (req, res) => {
  const updateId = req.params.id; // Get the URL ID to update from the request parameters
  const newURL = req.body.longURL; // Get the new long URL from the request body
  urlDatabase[updateId] = newURL; // Update the URL in the database
  res.redirect("/urls"); // Redirect to the main URLs page
});

// Route handler to delete a URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id; // Get the URL ID to delete from the request parameters
  delete urlDatabase[id]; // Remove the URL from the database
  res.redirect('/urls'); // Redirect to the main URLs page
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}!`); // Log a message when the server starts
});

// Route handler to return the URL database as JSON (likely for debugging or API purposes)
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // Send the URL database as a JSON response
});

*/