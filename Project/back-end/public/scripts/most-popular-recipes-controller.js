angular.module('recipeModule', ['ngMaterial', 'ngMessages'])
    .controller('MostPopRecipeController', ['$rootScope', '$scope', '$http', '$window', MostPopRecipeController]);
    function MostPopRecipeController($rootScope,$scope,$http,$window) {
        $scope.recipeHeading = "Foodgether";
        $scope.listOfPopRecipesLocal = [];
        $scope.listOfPopRecipes = [];
        $scope.userLocation = $window.sessionStorage.getItem('activeUserCity');
        $scope.getMostPopRecipes = getMostPopRecipes();
        $scope.goToSavedRecipes = goToSavedRecipes;
        $scope.checkiflogin= checkiflogin();

        $scope.getRecipeInfo = getRecipeInfo;
        /* user information stored in login */
        $scope.user = $window.sessionStorage.getItem('activeUserId');
        $scope.firstname = $window.sessionStorage.getItem('activeUser');
        $scope.appID = "4e6ed2f0";
        $scope.appKey = "2b62e270b8ccede3c8380b07051800a6";

        function checkiflogin(){
            if($window.sessionStorage.length!= 0)
                return  true;
            else
               return  false;
        }
        

        function getMostPopRecipes() {
            var hostIP = "54.86.83.49";
            $http.get("http://"+hostIP+":1121/getMostPopularRecipes/"+$scope.userLocation).then(
                function successCallback(response) {
                    // console.log(response);
                    $scope.listOfPopRecipesLocal = response.data.response;

                    // call edamam API for recipes
                    if(response.data.response.length !== 0)
                        $scope.getRecipeInfo();
                },
                function errorCallback(response) {
                    console.log("Unable to perform get request");
                }
            );
        }
        
        function goToSavedRecipes() {
      $window.location.href="saved.html";
    }
        

        function getRecipeInfo() {
            var partialURI = "http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_";
            console.log("get recipe info from edamam");

            var rParam = "";

            for(var i=0; i < $scope.listOfPopRecipesLocal.length; i++) {
                if(i !== 0)
                    rParam = rParam+"&";
                var recipeObj = $scope.listOfPopRecipesLocal[i];
                rParam = rParam+"r="+partialURI+recipeObj.RecipeID
            }
            console.log(rParam);
            // make HTTP request
            $http.get("https://api.edamam.com/search?" + rParam  
                + "&app_id=" + $scope.appID + "&app_key=" + $scope.appKey + "&to=20").then(
                function success(response){
                    // console.log(response);
                    var results = response.data;
                    for(var i=0; i < results.length;i++) {
                        results[i].rating = $scope.listOfPopRecipesLocal[i].averageRating;
                        results[i].numOfUsers = $scope.listOfPopRecipesLocal[i].NumOfUsers;
                    }


                    console.log(results);
                    $scope.listOfPopRecipes = results;
                },
                function err(response){});
        }

    } // end of controller function

var dirapp = angular.module('recipeModule');
dirapp.directive("nutrientsInfoDirective",nutrientsInfo);

nutrientsInfo.$inject = ['$http','$rootScope'];


        function nutrientsInfo($http,$rootScope) {

          var directive = { };
          directive.restrict = 'E';
          directive.template = "<div id=\"nutrients_graph\"></div>";

          directive.link = function(scope, elements, attr) {
             scope.getNutrients = getNutrients;
             function getNutrients(elements) {
              var graph_container = elements[0].childNodes[0];
                var nutrientsInfo = scope.recipeObj.totalDaily;
                var servings = scope.recipeObj.yield;

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