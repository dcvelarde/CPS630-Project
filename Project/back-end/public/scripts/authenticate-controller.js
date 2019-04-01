angular.module('authenticateModule', [])
    .controller('AuthenticateController', ['$scope', '$http' , '$window' ,AuthenticateController]);


function AuthenticateController($scope,$http,$window) {
   $scope.loginIsCorrect = true;
  $scope.findUser = function(username, password) {
     var user = {
       username:username,
       password:password
     }
    $http.post("http://localhost:1121/users/login", JSON.stringify(user)).then(
        function successCallback(response) {
           console.log(response.data.userid);
          if (response.data.userid > 0) {
             $window.location.href = './index2.html';
          }
          else {
             loginError();
          }
        },
        function errorCallback(response) {
          loginError();
        }
    );
   }
   function loginError() {
        $scope.loginIsCorrect = false;
   }
}
