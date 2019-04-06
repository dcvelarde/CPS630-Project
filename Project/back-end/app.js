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
  // check if this is ok
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
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

// app.get("/",function(req,res) {
//   console.log("Responding to root route");
//   res.send("Hello from ROOT");
// });

// ******* Register user *******
app.post("/users/post",function(req,res) {
   var userCredentials = req.body;
   var sqlInsert = "INSERT INTO Users(Username, Password, FirstName, Location, Level) VALUES (" +
      "'" + userCredentials['username'] + "', '" + userCredentials['password'] + "', " +
      "'" + userCredentials['name'] + "', '" + userCredentials['city'] + "', " +
      "'" + userCredentials['level'] + "')";
   connection.query(sqlInsert, function (error, results, fields) {
   if(error) {
      console.log("user not created");
      res.json({response: "user not created"});
   }
   else {
      console.log("user created");
      res.json({response: "user created"});
   }
   });
});

// ******* Login user *******
app.post("/users/login",function(req,res) {
   var userCredentials = req.body;
   var sqlSelect = "SELECT * FROM Users WHERE Username = '" + userCredentials['username'] + "'";
   connection.query(sqlSelect, function (error, results, fields) {
      if(results == undefined) {
         console.log("user not found");
         res.json({userid: -1,
                   username: '',
                   name: '',
                   city: 'Toronto',
                   level: 'expert'});
      }
      else if (results !== undefined && results.length > 0){
          if(userCredentials['password']==results[0]['Password']){
                 console.log("correct password");
                 res.json({userid: results[0]['UserID'],
                           username: results[0]['Username'],
                           name: results[0]['FirstName'],
                           city: results[0]['Location'],
                           level: results[0]['Level']});
          }
          else{
              console.log("incorrect password");
              res.json({userid: -1,
                        username: '',
                        name: '',
                        city: 'Toronto',
                        level: 'expert'});
           }
       }
   });
});

// ******* Update user information *******
app.put("/updateuser",function(req,res) {
   var newUserInfo = req.body;
   var sqlUpdate = "UPDATE Users SET FirstName='" + newUserInfo['name'] + "'" +
   ", Location='" + newUserInfo['city'] + "'" + ", Level='" + newUserInfo['level'] + "'" +
   " WHERE UserID=" + newUserInfo['userid'];

   connection.query(sqlUpdate, function(err, result) {
      if(err) {
         res.json({response: "userinfo was not updated"});
      }
      else {
         res.json({response: "userinfo was updated"});
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

// ******* User add to saved recipes page *******
app.post("/users/saved",function(req,res) {
  var userSaved = req.body;
  var sqlInsert = "INSERT INTO UsersSavedRecipes(UserID, RecipeID) VALUES (" + userSaved['userid'] + ", '" +
   userSaved['recipeid'] + "')";
   connection.query(sqlInsert, function (error, results, fields) {
   if(error) {
      console.log("recipe not saved");
      res.json({response: "recipe not saved"});
   }
   else {
      console.log("recipe saved");
      res.json({response: "recipe saved"});
   }
   });
});

app.post("/users/deleted",function(req,res) {
  var userDeleted = req.body;
  var sqlDelete = "DELETE FROM UsersSavedRecipes WHERE UserID=" +  userDeleted['userid'] + " AND RecipeID=\"" + userDeleted['recipeid'] + "\"";
   connection.query(sqlDelete, function (error, results, fields) {
   if(error) {
      console.log("recipe not deleted");
      res.json({response: "recipe not deleted"});
   }
   else {
      console.log("recipe deleted");
      res.json({response: "recipe deleted"});
   }
   });
});

// ******* getting user saved recipes *******
app.post("/getSavedRecipes", function(req,res) {
    var body = req.body;
    var userID = body.userID;
    var query = "SELECT DISTINCT RecipeID FROM UsersSavedRecipes WHERE UserID= " + userID;
    connection.query(query, function (error, results, fields) {
       if(error) {
         res.json({response:[]});
       }
       else {
         var savedRecipeIDs = [];
         for(var i=0; i <results.length; i++) {
           var recipeID = results[i]["RecipeID"];
           savedRecipeIDs[i] = recipeID;
         }
         console.log(savedRecipeIDs);
         res.json({response:savedRecipeIDs})
       }
    });
});

// ******* Get User Ratings by UserID and RecipeIDs *******
app.get("/reciperating/:userrecipeid", function(req,res) {
   var userRecipeId = JSON.parse(req.params['userrecipeid']);

   var sqlselect = "SELECT rating FROM UserRecipeRatings WHERE UserID=" + userRecipeId['user'] + " AND RecipeID=\"" + userRecipeId['recipeId'] + "\"";
   // var sqlselect = "SELECT rating FROM UserRecipeRatings WHERE UserID=" + userRecipeId['user'] + " AND RecipeID=\"009b4b56200185865b1cd4b74480367b\"";
   connection.query(sqlselect, function(err, rows, fields) {
      if(rows !== undefined && rows.length > 0) {
         res.json({rating: rows[0]['rating']});
      }
      else {
         res.json({rating: 0});
      }
   });
});

// ******* Insert or Update User Ratings *******
app.get("/reciperate/:userreciperating", function(req,res) {
   var userRecipeRatingArr = JSON.parse(req.params['userreciperating']);
   var userRecipeRating = userRecipeRatingArr[1];
   var beenRated = userRecipeRatingArr[0]['beenRated'];
   var sql;
   if (!beenRated) {
      sql = "INSERT INTO UserRecipeRatings(UserID, RecipeID, Rating) VALUES (" +
         userRecipeRating['user'] + ", '" + userRecipeRating['recipeId'] + "', " +
         userRecipeRating['rating'] + ")";
   } else {
      sql = "UPDATE UserRecipeRatings SET Rating=" + userRecipeRating['rating'] +
      " WHERE UserID=" + userRecipeRating['user'] + " AND RecipeID=\"" + userRecipeRating['recipeId'] + "\"";
   }
   connection.query(sql, function(err, result) {
      if(err) {
         res.json({response: "rating was not updated"});
      }
      else {
         res.json({response: "rating was updated"});
      }
   });
});

// ******* Get Average Ratings by Recipe ID *******
app.get("/getAverageRating/:id", function(req,res) {
    const id = req.params.id;
    var query = "SELECT Round(AVG(Rating),2) AS averageRating FROM UserRecipeRatings WHERE RecipeID='"+id+"'";
    connection.query(query, function(err, rows, fields) {
      if(rows !== undefined)
        res.json(rows[0]);
      else{
        res.json({"averageRating":"-"});
      }
    });
});



// ******* Get List of Recipe IDs within current user's area *******
app.post("/getPopularRatedRecipes",function(req,res) {
   var body = req.body;
   // console.log(body);
   var userID = body.userID;
   var recipeIDs = body.recipeIDs;
   var recipeIDString = "'"+recipeIDs.join("','")+"'";
   var sqlSelect = "SELECT DISTINCT uRR.RecipeID"
   +" FROM UserRecipeRatings uRR JOIN "
   +"(SELECT * FROM Users) AS SelectedUsers"
   +" ON uRR.UserID = SelectedUsers.UserID"
   +" WHERE RecipeID IN("+recipeIDString+") AND "
   +"SelectedUsers.Location = (SELECT Location FROM Users WHERE UserID="+userID+")";
   connection.query(sqlSelect, function (error, results, fields) {
      if(error) {
        res.json({response:[]});
      }
      else {
        var resultRecipeIDs = [];
        for(var i=0; i <results.length;i++) {
          var recipeID = results[i]["RecipeID"];
          resultRecipeIDs[i] = recipeID;
        }
        res.json({response:resultRecipeIDs})
      }
   });
});

app.use(express.static('./public'));
app.get('*', (req, res) => {
    res.sendfile(path.resolve(__dirname, 'public/index2.html'));
});

app.listen(1121,function() {
  console.log("Server is up and listening on port 1121...");
});
module.exports = connection;
