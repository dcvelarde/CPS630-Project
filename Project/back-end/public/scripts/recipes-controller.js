angular.module('recipeModule', ['ngMaterial', 'ngMessages'])
    .controller('RecipeController', ['$rootScope', '$scope', '$http', '$window', RecipeController]);
    function RecipeController($rootScope,$scope,$http,$window) {
        var vm = this;
        var hostIP = "54.86.83.49";
        $rootScope.recipeAverageRatings = {};
        $rootScope.recipeIDs = {};
        $scope.recipeHeading = "Foodgether";
        $scope.searchForRecipes = searchForRecipes;
        $scope.orderByPopRatings = orderByPopRatings;
        $scope.goToMostPopPage = goToMostPopPage;
        $scope.couldNotFindAnyResults = false;
        $scope.findWithinArea = false;
        $rootScope.doneGettingAvgRatings = true;
        $rootScope.listOfRecipes = [];
        $rootScope.savedList = [];
        $scope.dietFilters = [];
        $scope.healthFilters = [];
        $scope.dishTypeFilters = [];
        $scope.dietFilterOptions = ["balanced","high-protein","high-fiber","low-fat","low-carb",
        "low-sodium"];
        $scope.dishTypeOptions = ["Breakfast","Lunch","Dinner","Dessert"];
        $scope.cuisineTypeOptions = ["American","British","Canadian","Chinese",
        "Indian","Japanese","Korean","Thai"];
    $scope.healthFilterOptions = ["vegan",
        "vegetarian", "paleo", "dairy-free", "gluten-free", "wheat-free", "fat-free", "low-sugar",
        "egg-free", "peanut-free", "tree-nut-free", "soy-free", "fish-free", "shellfish-free"];

    $scope.displayBasedOnLevel = false;

    var appID = "4e6ed2f0";
    var appKey = "2b62e270b8ccede3c8380b07051800a6";

    /* user information stored in login */

    $scope.user = $window.sessionStorage.getItem('activeUserId');
    $scope.level = $window.sessionStorage.getItem('activeUserLevel');
    $scope.firstname = $window.sessionStorage.getItem('activeUser');
    console.log("user: " + $scope.user);
    console.log("level: " + $scope.level);

    $scope.checkiflogin= checkiflogin();

    function checkiflogin(){
        if($window.sessionStorage.length!= 0)
            return  true;
        else
           return  false;
    }

    function searchForRecipes(queryIngredients, dietFilters, healthFilters) {
        $rootScope.doneGettingAvgRatings = false;
        var dishTypeParam = "";
        if($scope.dishTypeValue !== undefined)
          dishTypeParam ="&dishType="+$scope.dishTypeValue;

        var cuisineTypeParam = "";
        if($scope.cuisineTypeValue !== undefined)
          cuisineTypeParam = "&cuisineType="+$scope.cuisineTypeValue;

        var dietFilterParams = "";
        for (var i = 0; i < dietFilters.length; i++) {
            dietFilterParams = dietFilterParams + "&diet=" + dietFilters[i];
        }

        var healthFilterParams = "";
        for (var i = 0; i < healthFilters.length; i++) {
            healthFilterParams = healthFilterParams + "&health=" + healthFilters[i];
        }
        $http.get("https://api.edamam.com/search?q=" + queryIngredients + dietFilterParams + healthFilterParams +
           dishTypeParam+ cuisineTypeParam +"&app_id=" + appID + "&app_key=" + appKey + "&to=30").then(
            function successCallback(response) {
                $scope.response = response;
                // changing listofrecipes so won't update right away before filtered by level
                $rootScope.listOfRecipes = response.data.hits;
                console.log(response.data.hits);
                populateRecipeIDs();
                if ($rootScope.listOfRecipes.length != 0) {
                    $scope.couldNotFindAnyResults = false;
                    // if displaybasedonlevel is true, only display recipes matching level
                    if ($scope.displayBasedOnLevel)
                        filterRecipesByLevel();
                    if ($scope.displayBasedOnPopRating) {
                        filterRecipesByPopularRating();
                    }
                }
                else{
                  $scope.couldNotFindAnyResults = true;
                  $scope.doneGettingAvgRatings = true;
                }
              },
              function errorCallback(response) {
                console.log("Unable to perform get request");
            }
        );
    }

    function populateRecipeIDs() {
        for (var i = 0; i < $rootScope.listOfRecipes.length; i++) {
            var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
            var recipeObj = $rootScope.listOfRecipes[i];
            var recipeID = recipeObj.recipe.uri.replace(rQueryPartialParam, "");
            $rootScope.recipeIDs[recipeID] = "";
        }
    }
         /* function for filtering recipes based on user level */
         function filterRecipesByLevel() {
            var maxNumIngr;
            var minNumIngr;
            switch($scope.level) {
               case "beginner":
                  minNumIngr = 0;
                  maxNumIngr = 3;
                  break;
               case "intermediate":
                  minNumIngr = 4;
                  maxNumIngr = 6;
                  break;
               case "expert":
                  minNumIngr = 7;
                  maxNumIngr = 50; // basically no max
                  break;
            }
            for(var i=$rootScope.listOfRecipes.length - 1; i >= 0 ; i--){
              var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
              var recipeObj = $scope.listOfRecipes[i];
              var recipeID = recipeObj.recipe.uri.replace(rQueryPartialParam,"");
               var numOfIngr = recipeObj.recipe.ingredientLines.length;
                  if(numOfIngr < minNumIngr || numOfIngr > maxNumIngr){
                     $rootScope.listOfRecipes.splice(i,1)
                     delete $rootScope.recipeIDs[recipeID];
                  }
            }
        }

         function filterRecipesByPopularRating() {
           var dataToSend = {};
           dataToSend.recipeIDs = Object.keys($rootScope.recipeIDs);
           dataToSend.userID = $window.sessionStorage.getItem("activeUserId");
           console.log(dataToSend);
             $http.post("http://localhost:1121/getPopularRatedRecipes", dataToSend).then(
               function successCallback(response) {
                 var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
                 console.log(response);
                 var iDs = response["response"];
                  for(var i = 0; i < $rootScope.listOfRecipes.length;i++) {
                    var recipeObj = $scope.listOfRecipes[i];
                    var recipeID = recipeObj.recipe.uri.replace(rQueryPartialParam,"");
                    if(!iDs.includes(recipeID)){
                     $rootScope.listOfRecipes.splice(i,1);
                    }
                  }
                 },
               function errorCallback(response) {
               }
             );
          }

    // Needed to decide to order recipes by rating
    function orderByPopRatings() {
        if ($scope.displayBasedOnPopRating && $rootScope.doneGettingAvgRatings)
            return "-rating";
        else
            return "";
         }

    function goToMostPopPage() {
      $window.location.href="most-popular.html";
    }
    } // end of RecipeController function

    /* directive for rating stars */
    var dirapp = angular.module('recipeModule');
    dirapp.directive("starRatingDirective", recipeRatings);
    dirapp.directive("recipeAverageRatingDirective",recipeAverageRating);
    dirapp.directive("nutrientsInfoDirective",nutrientsInfo);

    recipeRatings.$inject = ['$http'];
    recipeAverageRating.$inject = ['$http','$rootScope'];
    nutrientsInfo.$inject = ['$http','$rootScope'];

function recipeRatings($http) {
    var directive = {};
    directive.restrict = 'E';
    var hostIP = "54.86.83.49";
    directive.template = "<section ng-repeat=\"star in stars\" ng-click=\"setRating($index)\">" +
        "<ion-icon name=\"restaurant\" ng-class=\"starClass(star, $index)\"></ion-icon>" +
        "</section>";

    directive.link = function (scope, elements, attr) {
        scope.max = 5;
        scope.beenRated;
        scope.retreiveRecipes = function () {
            var recipeUri = scope.recipeObj.recipe.uri;
            var idx = recipeUri.indexOf("#recipe_");
            scope.recipeId = recipeUri.substring(idx + 8);
            var userRecipeId = {
                user: scope.user,
                recipeId: scope.recipeId
            };
            $http.get("http://" + hostIP + ":1121/reciperating/" + JSON.stringify(userRecipeId)).then(
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
        scope.updateStars = function () {
            scope.stars = [];
            for (var idx = 0; idx < scope.max; idx++) {
                scope.stars.push({
                    full: scope.rating > idx
                })
            }
        }
        scope.retreiveRecipes();
        scope.starClass = function (star, idx) {
            var starClass = 'star';
            if (star.full) {
                starClass = 'star full';
            }
            return starClass;
        }
        scope.$watch('rating', function (newValue, oldValue) {
            if (newValue !== null && newValue !== undefined) {
                scope.updateStars();
            }
        });
        scope.setRating = function (idx) {
            // this is where rating is set so get update or insert
            scope.rating = idx + 1;
            var userRecipeRatingArr = [{
                beenRated: scope.beenRated
            }, {
                user: scope.user,
                recipeId: scope.recipeId,
                rating: scope.rating
            }];
            $http.get("http://" + hostIP + ":1121/reciperate/" + JSON.stringify(userRecipeRatingArr)).then(
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

// For retrieving the average rating for each recipe
function recipeAverageRating($http, $rootScope) {
    var hostIP = "54.86.83.49";
    var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
    var directive = {};
    directive.restrict = 'E';

    directive.template = "<p>Average User Ratings: {{averageRating}}/5</p>";

    directive.link = function (scope, elements, attr) {
        scope.retrieveAvgRating = function () {

            var index = $rootScope.listOfRecipes.indexOf(scope.recipeObj);
            var recipeUri = scope.recipeObj.recipe.uri;
            scope.recipeID = recipeUri.replace(rQueryPartialParam, "");
            $http.get("http://" + hostIP + ":1121/getAverageRating/" + scope.recipeID).then(
                function successCallback(response) {
                    var averageRating = response.data.averageRating;
                    if (averageRating != null) {
                        scope.averageRating = averageRating;
                        $rootScope.listOfRecipes[index].rating = averageRating;
                        $rootScope.recipeAverageRatings[scope.recipeID] = averageRating;
                    } else {
                        scope.averageRating = "-";
                        $rootScope.recipeAverageRatings[scope.recipeID] = "-";
                    }

                    if (index == $rootScope.listOfRecipes.length - 1)
                        $rootScope.doneGettingAvgRatings = true;
                },
                function errorCallback(response) {
                    console.log("Unable to perform get request");
                }
            );
        }
        scope.retrieveAvgRating();
    };

          return directive;
    }

        function nutrientsInfo($http,$rootScope) {

          var directive = { };
          directive.restrict = 'E';
          directive.template = "<div id=\"nutrients_graph\"></div>";

          directive.link = function(scope, elements, attr) {
             scope.getNutrients = getNutrients;
             function getNutrients(elements) {
              var graph_container = elements[0].childNodes[0];
                var nutrientsInfo = scope.recipeObj.recipe.totalDaily;
                var servings = scope.recipeObj.recipe.yield;

                var graphLabels = [["Nutrients","% Daily Value"]];
                var dailyValues = [];
                var nutrients = Object.keys(nutrientsInfo);

                for(var i=0;i < nutrients.length;i++) {
                  var data = [];
                  var key = nutrients[i];
                  var nutrient = nutrientsInfo[key];
                  data[0] = nutrient.label;
                  data[1] = Math.round(nutrient.quantity / servings);
                  dailyValues[i] = data;
                }

                var result = graphLabels.concat(dailyValues);
                // console.log("Result: ",result);

                var graphData = google.visualization.arrayToDataTable(result);

                var options = {
                  title: 'Nutrition Facts',
                  legend:'none',
                  chartArea: {width: '50%'},
                  hAxis: {
                    title: 'Nutrients',
                    minValue: 0,
                    maxValue:100
                  },
                  vAxis: {
                    title: '% Daily Value'
                  }
                };
                var chart = new google.visualization.BarChart(graph_container);
                chart.draw(graphData, options);
             }
             scope.getNutrients(elements);
          };

          return directive;
    }
