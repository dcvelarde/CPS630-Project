angular.module('recipeModule',['ngMaterial', 'ngMessages'])
    .controller('ProfileController', ['$rootScope','$scope', '$http' , '$window',ProfileController]);


function ProfileController($rootScope,$scope,$http,$window) {
   $scope.cities = ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton",
      "London", "Markham", "Vaughan", "Kitchener", "Windsor"];
   $scope.levels = ["beginner", "intermediate", "expert"];
   $scope.recipeHeading="Foodgether";

   $scope.user = $window.sessionStorage.getItem('activeUserId');
   $scope.username = $window.sessionStorage.getItem('activeUserName');
   $scope.userlevel = $window.sessionStorage.getItem('activeUserLevel');
   $scope.name = $window.sessionStorage.getItem('activeUser');
   $scope.usercity = $window.sessionStorage.getItem('activeUserCity');

   $scope.changeRes = "";

   $scope.updateUser = function(name, city, level) {
      var hostIP = "54.86.83.49";

      var newUserInfo = {userid: $scope.user, name: name, city: city, level: level};

      $window.sessionStorage.setItem('activeUserName',$scope.name);
      $window.sessionStorage.setItem('activeUserCity',$scope.city);
      $window.sessionStorage.setItem('activeUserLevel',$scope.level);

      console.log(newUserInfo.level);

     $http.put("http://localhost:1121/updateuser", JSON.stringify(newUserInfo)).then(
         function successCallback(response) {
           console.log(response);
           alert("Changes successful!");
         },
         function errorCallback(response) {
           console.log(response);
           alert("Changes unsuccessful.");
         }
     );
   }
}
