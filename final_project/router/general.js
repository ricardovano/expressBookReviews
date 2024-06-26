const axios = require('axios')
const express = require('express')
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"})
    } else {
      return res.status(404).json({message: "User already exists!"})
    }
  }
  return res.status(404).json({message: "Unable to register user."})
});

//Get all books using async
public_users.get('/async/',async function (req, res) {

    try {
      const response = await axios.get("http://localhost:5001/");
      return res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve books' })
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN using async
public_users.get('/async/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  try {
    const response = await axios.get(`http://localhost:5001/isbn/${isbn}`)
    return res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books' })
  }
});

//Get book details based on ISBN using promise callbacks
public_users.get('/promise/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5001/isbn/${isbn}`)
    .then(response => {
      return res.json(response.data)
    })
    .catch(error => {
      return res.status(500).json({ message: 'Failed to retrieve books' })
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn]))
 });

 public_users.get('/async/author/:author', async function (req, res) {
  const name = req.params.author
  try {
    const response = await axios.get(`http://localhost:5001/author/${name}`)
    return res.json(response.data)
  }  
  catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books' })
  }
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

//Get book details based on title using async
public_users.get('/async/title/:title', async function(req, res){
  const title = req.params.title
  try {
    const response = await axios.get(`http://localhost:5001/title/${title}`)
    return res.json(response.data)
  }
  catch (error) {
    res.status(500).json({ message: 'Failed to retrieve books' })
  }
})

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

  const isbn = req.params.isbn
  let reviews = books[req.params.isbn].reviews
  return res.json(reviews)

});

module.exports.general = public_users;
