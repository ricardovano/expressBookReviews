const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn]))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const name = req.params.author
  filteredBooks = []

  let i = 1
  while (books[i] != undefined){
    if (books[i].author === name){
      filteredBooks.push(books[i])
    }
    i++
  }
  return res.json(filteredBooks)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const name = req.params.title
  filteredBooks = []
  let i = 1
  while (books[i] != undefined){
    if (books[i].title === name){
      filteredBooks.push(books[i])
    }
    i++
  }
  return res.json(filteredBooks)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
