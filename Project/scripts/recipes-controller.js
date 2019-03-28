angular.module('recipeModule', ['recipeModule.directives'])
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

        /* placeholder code for variables i need for user ratings */
        $scope.user = 1;

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

    /* directive for rating stars */
    var dirapp = angular.module('recipeModule.directives', []);
    dirapp.directive("starRatingDirective", recipeRatings);

    recipeRatings.$inject = ['$http'];

    function recipeRatings($http) {
          var directive = { };
          directive.restrict = 'E';

          directive.template = "<section ng-repeat=\"star in stars\" ng-click=\"setRating($index)\">" +
          "<ion-icon name=\"restaurant\" ng-class=\"starClass(star, $index)\"></ion-icon>" +
          "</section>";

          directive.link = function(scope, elements, attr) {
             scope.max = 5;
             scope.beenRated;
             scope.retreiveRecipes = function() {
                var recipeUri = scope.recipeObj.recipe.uri;
                var idx = recipeUri.indexOf("#recipe_");
                scope.recipeId = recipeUri.substring(idx+8);
                var userRecipeId = {user: scope.user, recipeId: scope.recipeId};
                $http.get("http://localhost:1121/reciperating/" + JSON.stringify(userRecipeId)).then(
                     function successCallback(response) {
                       scope.rating = response.data.rating;
                       if (scope.rating == 0) {
                         scope.beenRated = false;
                       } else {
                         scope.beenRated = true;
                       }
                     },
                     function errorCallback(response) {
                       console.log("Unable to perform get request");
                     }
                );
             }
             scope.updateStars = function() {
                scope.stars = [];
                for (var idx = 0; idx < scope.max; idx++) {
                   scope.stars.push({full:scope.rating > idx})
                }
             }
             scope.retreiveRecipes();
             scope.starClass = function(star, idx) {
                var starClass = 'star';
                if (star.full) {
                   starClass = 'star full';
                }
                return starClass;
             }
             scope.$watch('rating', function(newValue, oldValue) {
                if (newValue !== null && newValue !== undefined) {
                   scope.updateStars();
                }
             });
             scope.setRating = function(idx) {
                // this is where rating is set so get update or insert
                scope.rating = idx + 1;
                var userRecipeRatingArr = [{beenRated: scope.beenRated},{user: scope.user, recipeId: scope.recipeId, rating: scope.rating}];
                $http.get("http://localhost:1121/reciperate/" + JSON.stringify(userRecipeRatingArr)).then(
                     function successCallback(response) {
                       console.log("got response");
                       console.log(response);
                     },
                     function errorCallback(response) {
                       console.log("Unable to perform get request");
                     }
                );
             }
          };

          return directive;
    }
