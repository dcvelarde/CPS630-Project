
angular.module('authenticateModule', [])
.controller('AuthenticateController', ['$rootScope','$scope', '$http' , '$window' ,AuthenticateController]);


function AuthenticateController($rootScope,$scope,$http,$window) {
$scope.loginIsCorrect = true;
$scope.findUser = function(username, password) {
 var user = {
   username:username,
   password:password
 }

$http.post("http://localhost:1121/users/login", JSON.stringify(user)).then(
    function successCallback(response) {
       //console.log(response.data);
      if (response.data.userid > 0) {
        sessionStorage.setItem('activeUserId',response.data.userid);
        sessionStorage.setItem('activeUser',response.data.name);
        sessionStorage.setItem('activeUserLocation',response.data.location);
        sessionStorage.setItem('activeUserLevel',response.data.level);
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
