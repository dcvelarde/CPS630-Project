angular.module('recipeModule', [])
    .controller('RecipeController', ['$scope', '$http' ,RecipeController]);

    function RecipeController($scope,$http) {
        var vm = this;
        $scope.recipeHeading = "Recipes App";
        $scope.change = false;
        $scope.changeRecipeHeading = changeRecipeHeading;
        $scope.searchForRecipes = searchForRecipes;
        $scope.listOfRecipes = [];
        var appID = "4e6ed2f0";
        var appKey = "2b62e270b8ccede3c8380b07051800a6";
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

        function searchForRecipes(queryIngredients) {
            console.log(queryIngredients);
            console.log("Get first 10 recipes for a given ingredient");
            $http.get("https://api.edamam.com/search?q="+queryIngredients+"&app_id="+appID+"&app_key="+appKey+"&to=10").then(
              function successCallback(response) {
                $scope.response = response;
                console.log(response);
                $scope.listOfRecipes = response.data.hits;
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
              }
            );
        }

    }