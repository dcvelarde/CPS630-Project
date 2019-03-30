angular.module('authenticateModule', [])
    .controller('AuthenticateController', ['$scope', '$http' , '$window' ,AuthenticateController]);


function AuthenticateController($scope,$http,$window) {
  $scope.findUser = function(username, password) {
  var user = {
    username:username,
    password:password
  }
    $http.post("http://localhost:1121/users/login", JSON.stringify(user)).then(
        function successCallback(response) {
          console.log("Get request success");
          console.log(response);
          $window.location.href = './index.html';
        },
        function errorCallback(response) {
          console.log("Unable to perform get request");
          // display error couldnt login
        }
    );
   }
}
