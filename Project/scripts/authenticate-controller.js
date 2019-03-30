angular.module('authenticateModule', [])
    .controller('AuthenticateController', ['$scope', '$http' ,AuthenticateController]);


function AuthenticateController($scope,$http) {
  $scope.findUser = function(username, password) {
  var user = {
    username:username,
    password:password
  }
    $http.get("http://localhost:1121/users/post", JSON.stringify(user)).then(
        function successCallback(response) {
          console.log("Get request success");
          console.log(response);
        },
        function errorCallback(response) {
          console.log("Unable to perform get request");
          // display error couldnt login
        }
    );
   }
}
