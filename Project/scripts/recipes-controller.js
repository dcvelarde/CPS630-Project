angular.module('recipeModule', [])
    .controller('RecipeController', ['$scope', '$http' ,RecipeController]);

    function RecipeController($scope,$http) {
        var vm = this;
        $scope.recipeHeading = "Foodgether";
        $scope.searchForRecipes = searchForRecipes;
        $scope.couldNotFindAnyResults = false;
        $scope.listOfRecipes = [];
        $scope.dietFilters = [];
        $scope.healthFilters = [];
        $scope.dietFilterOptions = ["balanced","high-protein","high-fiber","low-fat","low-carb",
        "low-sodium"];
        $scope.healthFilterOptions = ["vegan",
        "vegetarian","paleo","dairy-free","gluten-free","wheat-free","fat-free","low-sugar",
        "egg-free","peanut-free","tree-nut-free","soy-free","fish-free","shellfish-free"];

        var appID = "4e6ed2f0";
        var appKey = "2b62e270b8ccede3c8380b07051800a6";

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

        function searchForRecipes(queryIngredients, dietFilters, healthFilters) {
            console.log(queryIngredients);
            var dietFilterParams = "";
            for(var i = 0; i <dietFilters.length; i++){
              dietFilterParams = dietFilterParams+"&diet="+dietFilters[i];
            }

            var healthFilterParams = "";
            for(var i = 0; i <healthFilters.length; i++){
              healthFilterParams = healthFilterParams+"&health="+healthFilters[i];
            }
            console.log("Get first 10 recipes for given ingredient(s)");
            $http.get("https://api.edamam.com/search?q="+queryIngredients+dietFilterParams+healthFilterParams
              +"&app_id="+appID+"&app_key="+appKey+"&to=10").then(
              function successCallback(response) {
                $scope.response = response;
                console.log(response);
                $scope.listOfRecipes = response.data.hits;
                if($scope.listOfRecipes.length != 0)
                  $scope.couldNotFindAnyResults = false;
                else
                  $scope.couldNotFindAnyResults = true;
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
              }
            );
        }

    }