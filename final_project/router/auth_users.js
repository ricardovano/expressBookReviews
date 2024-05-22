const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {"username":"ricardo","password":"123temp"},
];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if (username && password) {
    if (authenticatedUser(username,password)) {
      let token = jwt.sign({data: password}, 'fingerprint_customer', { expiresIn: 60 * 60 });
      req.session.user = { token, username}
      return res.status(200).send("User successfully logged in");
    }
  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 
  const isbn = req.params.isbn
  const text = req.body.review

  username = req.session.user.username
  const newReview = { "username": username, "review": text, "date": new Date() }

  const book = books[req.params.isbn]
  if (book) {
    const reviews = books[req.params.isbn].reviews

    //TO FIX
    if (reviews != undefined) {

      const oldReview = reviews.filter((r) => r.username === username)
      if (oldReview.length > 0) {
        reviews[reviews.indexOf(oldReview[0])] = newReview
      }
    }
    else{
      reviews.push(newReview)
    }
    
  }
  else {
    return res.status(404).json({message: "Book not found"});
  }
  
  return res.status(200).json({message: "Review successfully added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const book = books[req.params.isbn]
  username = req.session.authorization.username
  book.reviews.filter((r) => r.username === username).remove()
  return res.status(200).json({message: "Review successfully deleted"});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
