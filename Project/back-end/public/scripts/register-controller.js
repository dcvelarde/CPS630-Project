angular.module('registerModule', ['ngMaterial', 'ngMessages'])
    .controller('RegisterController', ['$scope', '$http' , '$window' ,RegisterController]);

function RegisterController($scope,$http,$window) {
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
           $window.location.href = './login.html';
         },
         function errorCallback(response) {
           console.log("Unable to perform get request");
           // display error couldnt create account
         }
      );
   }
}
