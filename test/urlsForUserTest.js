const { assert } = require('chai');
const { urlsForUser } = require('../helpers.js');
const { urlDatabase } = require('../data/url_Database.js');
// Assume that urlsForUser is already implemented and imported
// const { urlsForUser } = require('./path_to_helper_function'); // Uncomment and adjust path as necessary

describe('urlsForUser', function() {
  it('should return urls that belong to the specified user', function() {
    // Define test data
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userId: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };

    // Define expected output
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };

    // Call the function with userId 'user1'
    const result = urlsForUser('user1', urlDatabase);

    // Assert that the result matches the expected output
    assert.deepEqual(result, expectedOutput);
  });
  it("should return an empty object if the user has no urls", function() {
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userId: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };
    const result = urlsForUser('user3', urlDatabase);

    assert.deepEqual(result, {});
  });
  it("should return an empty object if there are no urls in the urlDatabase", function() {
    const emptyDatabase = {};
    const result = urlsForUser('user4', urlDatabase);
    assert.deepEqual(result, {});
  });
  it('should not return urls that dont belong to the specified user', function() {
    const urlDatabase = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "9sm5xK": { longURL: "http://www.google.com", userId: "user2" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "a1b2c3": { longURL: "http://www.example.com", userId: "user1" }
    };
    const result = urlsForUser('user1', urlDatabase);
    assert.deepEqual(result, expectedOutput);
  });
});