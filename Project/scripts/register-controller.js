angular.module('registerModule', [])
    .controller('RegisterController', ['$scope', '$http' ,RegisterController]);

function RegisterController($scope,$http) {
   $scope.createUser = function(firstname, location, password, username, level) {
      var user = {
        firstname: firstname,
        location:location,
        password:password,
        username:username,
        level:level
      }
      $http.post("http://localhost:1121/users/post", JSON.stringify(user)).then(
         function successCallback(response) {
           console.log("Post request success");
           console.log(response);
           return res.redirect('./../login.html');
         },
         function errorCallback(response) {
           console.log("Unable to perform get request");
           // display error couldnt create account
         }
      );
   }
}
