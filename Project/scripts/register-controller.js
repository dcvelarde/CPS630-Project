
var express=require("express");
var connection = require('./../back-end/app');

module.exports.register=function(req,res){
    var users={
        //"name":req.body.name,
        //"location":req.body.location,
        "Username":req.body.Username,
        "Password":req.body.Password,
        //"level":req.body.level
    }
    connection.query('INSERT INTO UserCredentials SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
        return res.redirect('./../login.html');
      }
    });
}
