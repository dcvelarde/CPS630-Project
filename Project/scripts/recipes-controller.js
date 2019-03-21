angular.module('recipeModule', [])
    .controller('RecipeController', ['$scope', '$http' ,RecipeController]);

    function RecipeController($scope,$http) {
        var vm = this;
        $scope.recipeHeading = "Recipes App";
        $scope.change = false;
        $scope.changeRecipeHeading = changeRecipeHeading;

        function changeRecipeHeading() {
            $scope.change = !$scope.change;
            if($scope.change)
                $scope.recipeHeading = "CPS630 Recipe Project";
            else
                $scope.recipeHeading = "Recipes App";
        }

        $scope.getRequest = function() {
            console.log("I've been pressed!");
            $http.get("http://localhost:1121/users").then(
              function successCallback(response) {
                $scope.response = response;
                console.log(response);
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
              }
            );
          };
    }