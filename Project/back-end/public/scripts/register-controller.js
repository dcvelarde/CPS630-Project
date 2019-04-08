angular.module('registerModule', ['ngMaterial', 'ngMessages'])
    .controller('RegisterController', ['$scope', '$http' , '$window' ,RegisterController]);

function RegisterController($scope,$http,$window) {
   $scope.cities = ["Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton",
      "London", "Markham", "Vaughan", "Kitchener", "Windsor"];
    $scope.levels = ["beginner","intermediate","expert"];
    $scope.recipeHeading="Foodgether";
   $scope.createUser = function(name, city, password, username, level) {
      var user = {
        name: name,
        city:city,
        password:password,
        username:username,
        level:level
      }
      if (user.name != undefined && user.city != undefined && user.password != undefined && user.username != undefined && user.level != undefined) {
         $http.post("http://localhost:1121/users/post", JSON.stringify(user)).then(
            function successCallback(response) {
               console.log(response);
              if (response.data.response == "user not created") {
                console.log("Unable to perform get request");
                alert("Username already exists");
             }
             else {
                console.log("Post request success");
                $window.location.href = './index.html';
             }
            },
            function errorCallback(response) {
               console.log(response);
              console.log("Unable to perform get request");
              // display error couldnt create account
            }
         );
      }
      else {
         var str;
         if (user.name == undefined) {
            str = "Name";
         }
         else if (user.username == undefined) {
            str = "Username";
         }
         else if (user.password == undefined) {
            str = "Password";
         }
         else if (user.city == undefined) {
            str = "City";
         }
         else if (user.level == undefined) {
            str = "Level";
         }
         alert(str + " field needs to be filled.")
      }

   }
}
