// angular.module('authenticateModule', [])
//    .factory('message', function() {
//       const message = {loggedin: false, userid: -1};
//
//       message.put = function(li, ui) {
//          message = {loggedin: li, userid: ui};
//       }
//
//       return message;
//    });

angular.module('authenticateModule', [])
   .factory('MessageFactory', function() {
      var message = {loggedin: false, userid: -1};

      message.put = function(li, ui) {
         message = {loggedin: li, userid: ui};
      }

      return message;
   })
   .controller('AuthenticateController', ['MessageFactory','$scope', '$http' , '$window', AuthenticateController]);

function AuthenticateController(MessageFactory,$scope,$http,$window) {
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
             MessageFactory.put(true, response.data.userid);
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
