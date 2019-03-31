angular.module('recipeModule', [])
    .controller('RecipeController', ['$scope', '$http' ,RecipeController]);

    function RecipeController($scope,$http) {
        var vm = this;
        $scope.recipeHeading = "Foodgether";
        $scope.searchForRecipes = searchForRecipes;
        $scope.getAllRatings = getAllRatings;
        $scope.generate = generate;
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
        // Used for getting a recipe by ID
        var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";

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
              +"&app_id="+appID+"&app_key="+appKey+"&to=100").then(
              function successCallback(response) {
                $scope.response = response;
                // console.log(response);
                var listOfRecipes = response.data.hits;
                $scope.listOfRecipes = listOfRecipes;
                // console.log($scope.listOfRecipes);
                if($scope.listOfRecipes.length != 0){
                  $scope.couldNotFindAnyResults = false;
                }
                else
                  $scope.couldNotFindAnyResults = true;

                getAllRatings();
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
              }
            );

        }

        function getAllRatings() {
          console.log("called getAllRatings");
          console.log($scope.listOfRecipes);
          var listOfRecipes = $scope.listOfRecipes;
          for(var i=0; i < listOfRecipes.length; i++) {
            var recipeObj = listOfRecipes[i];
            var recipeID = recipeObj.recipe.uri.replace(rQueryPartialParam,"");
            getAverageRating(recipeID).then(function success(response) {
              console.log("Response",response);
              // if(response.rating !== null){
              //   recipeObj.recipe.rating = response.rating;
              // }
              // else{
              //   console.log("rating was null");
              //   recipeObj.recipe.rating = "-";
              // }
              console.log(recipeObj);
              listOfRecipes[i] = recipeObj;
              }, function error(response) {
                console.log("error");
              });
          }
          // return listOfRecipes;
        }

        function getAverageRating(recipeID) {
          var rating = "-";
          var result = $http.get("http://localhost:1121/getAverageRating/"+recipeID).then(
              function successCallback(response) {
                // console.log(response.data.averageRating);
                rating = response.data.averageRating;
                return {"rating":rating, "error":0};
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
                rating = "-";
                return {"rating":rating, "error":0};
              }
            );
          return result;
        }

        function generate() {
          console.log("called generate function!");
          for(var i = 0; i < $scope.listOfRecipes.length; i++) {
            var recipe = $scope.listOfRecipes[i].recipe;
            var recipeID = recipe.uri.replace(rQueryPartialParam,"");
            var recipeJSON = {"recipeID":recipeID};
            console.log(recipeJSON);

            $http.post("http://localhost:1121/generate",recipeJSON).then(
              function successCallback(response) {
                console.log(response);
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
              }
            );
          }
        }

    }