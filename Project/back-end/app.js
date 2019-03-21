const express = require('express');
const app = express();
const morgan = require('morgan');
var mysql = require("mysql");

app.use(morgan('combined'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//Database connection
// app.use(function(req, res, next){
//   res.locals.connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'danica21',
//     database : 'cps630'
//   });
//   res.locals.connect();
//   next();
// });

app.get("/",function(req,res) {
  console.log("Responding to root route");
  res.send("Hello from ROOT");
});


app.get("/users", function(req,res) {
  var user1 = {firstName:"Stephen", lastName:"Curry"};
  var user2 = {firstName:"Kevin", lastName:"Durant"};
  res.json([user1,user2]);
});


app.get('/recipes',function(req,res) {
  console.log("Fetching all recipes");

  const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'danica21',
    database: 'cps630'
  });

  connection.query("SELECT * FROM Recipes", function(err, rows, fields) {
    console.log("I think we fetched Recipes successfully");
    res.json(rows);
  });

  // res.end();
});

app.listen(1121,function() {
  console.log("Server is up and listening on port 1121...");
});


// app.use('/api/v1/recipes',recipes);
// router.get('/', function(req, res, next) {
//   res.locals.connection.query('SELECT * from recipes', function (error, results, fields) {
//     if (error) throw error;
//     res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
//   });
// });
