import axios from 'axios';
const express = require('express');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const API_BASE_URL = 'http://localhost:3000'; 

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


const bookService = {
  
  async getAllBooks() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error.response?.data || error.message);
      throw error;
    }
  },

  async getBookByISBN(isbn) {
    try {
      const response = await api.get(`/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.response?.data || error.message);
      throw error;
    }
  },


  async getBooksByAuthor(author) {
    try {
      const response = await api.get(`/author/${author}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching books by author ${author}:`, error.response?.data || error.message);
      throw error;
    }
  },


  async getBooksByTitle(title) {
    try {
      const response = await api.get(`/title/${title}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching books with title ${title}:`, error.response?.data || error.message);
      throw error;
    }
  },


  async getBookReviews(isbn) {
    try {
      const response = await api.get(`/review/${isbn}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for book with ISBN ${isbn}:`, error.response?.data || error.message);
      throw error;
    }
  }
};


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const searchTerm = author.toLowerCase();
  
  // Create an array to store the results
  const results = [];
  
  // Iterate through the books object
  for (const id in books) {
    const book = books[id];
    
    // Check if the author name matches (case-insensitive)
    if (book.author.toLowerCase().includes(searchTerm)) {
      // Add the book to the results, including its ID
      results.push({
        id: id,
        ...book
      });
    }
  }
  
  return res.status(300).json(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const searchTerm = title.toLowerCase();
  
  // Create an array to store the results
  const results = [];
  
  // Iterate through the books object
  for (const id in books) {
    const book = books[id];
    
    // Check if the author name matches (case-insensitive)
    if (book.title.toLowerCase().includes(searchTerm)) {
      // Add the book to the results, including its ID
      results.push({
        id: id,
        ...book
      });
    }
  }
  
  return res.status(300).json(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json({reviews: books[isbn].reviews});
});

public_users.put("/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if(book) {
    let review = req.body.reviews;
    if(review) book["reviews"] = review;
    
      books[isbn] = book;
      res.send(books[isbn]);
  } else {
    res.send("Unable to find book.")
  }
});

public_users.delete("/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(isbn) delete books[isbn].reviews;

  res.send(books[isbn])
});

module.exports.general = public_users;


