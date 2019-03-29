var connection = require('./../back-end/app');
module.exports.authenticate=function(req,res){
    var Username=req.body.Username;
    var Password=req.body.Password;


    connection.query('SELECT * FROM UserCredentials WHERE Username = ?',[Username], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{

        if(results.length >0){
            if(Password==results[0].Password){
              console.log("Logged in!");
              res.redirect('./../login.html');
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
                 });
            }

        }
        else{
          res.json({
              status:false,
            message:"Email does not exits"
          });
        }
      }
    });
}
