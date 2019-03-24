const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var mysql = require("mysql");

var dbHost = "138.197.151.127";
var dbUsername = "root";
var dbPass = "2019cps630";
var dbSchema = "cps630";
var authToken = "RecipeProject2019";

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MySQL database connection
const connection = mysql.createConnection({
    host:dbHost,
    user: dbUsername,
    password: dbPass,
    database: dbSchema
  });

function authenticateAPI(token) {
  return token == authToken;
}

app.get("/",function(req,res) {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
});


// ******* Login API *******
app.post("/login",function(req,res) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query("SELECT * FROM UserCredentials WHERE Username='"+username
    +"' AND Password='"+password+"'", function(err, rows, fields) {
    if(rows.length === 1)
      res.json({"token":authToken});
    else{
      res.status(401);
      res.json({"response":"Incorrect username/password"});
    }
  });
});

// ******* Get User Information by UserID *******
app.get("/user/:id", function(req,res) {
  // Check for auth token
  if(!authenticateAPI(req.headers.authtoken)) {
    res.status(401);
    res.json({"response":"User not authenticated"});
  }
  else {
    const id = parseInt(req.params.id, 10);
    connection.query("SELECT * FROM UsersInfo WHERE UserID="+id, function(err, rows, fields) {
      if(rows !== undefined)
        res.json(rows[0]);
      else{
        res.status(404);
        res.json({"response":"No user exists with UserID: "+id});
      }
    });
  }
});

app.listen(1121,function() {
  console.log("Server is up and listening on port 1121...");
});
