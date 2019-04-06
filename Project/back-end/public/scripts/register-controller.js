angular.module('registerModule', [])
    .controller('RegisterController', ['$scope', '$http' , '$window' ,RegisterController]);

function RegisterController($scope,$http,$window) {
   $scope.cities = ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton",
      "London", "Markham", "Vaughan", "Kitchener", "Windsor"];
   $scope.createUser = function(name, city, password, username, level) {
      var user = {
        name: name,
        city:city,
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
