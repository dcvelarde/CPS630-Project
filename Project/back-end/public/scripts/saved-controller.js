angular.module('recipeModule')
    .controller('SavedController', ['$rootScope','$scope', '$http' , '$window',SavedController]);

function SavedController($rootScope,$scope,$http,$window) {
        $rootScope.savedList = [];
        var appID = "4e6ed2f0";
        var appKey = "2b62e270b8ccede3c8380b07051800a6";

        /* adding user saved recipes */
        $scope.addToSaved = function(recipeObj){
          var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
          var userSaved = {
            userid: sessionStorage.getItem("activeUserId"),
            recipeid: recipeObj.recipe.uri.replace(rQueryPartialParam,"")
          }
          $http.post("http://localhost:1121/users/saved", JSON.stringify(userSaved)).then(
               function successCallback(response) {
                 console.log("saved successfully");
               },
               function errorCallback(response) {
                 console.log("unable to save");
               }
            );
        }
        /* putting saved recipes into list*/
        $scope.populateSavedList = function(){
          $rootScope.savedList = [];
          var dataToSend = {};
          dataToSend.userID = $window.sessionStorage.getItem("activeUserId");
          $http.post("http://localhost:1121/getSavedRecipes", dataToSend).then(
            function successCallback(response) {
              var iDs = response.data.response;
              for (var a = 0; a< iDs.length; a++) {
                $http.get("https://api.edamam.com/search?r=http%3A%2F%2Fwww.edamam.com%2Fontologies%2Fedamam.owl%23recipe_" +
                 iDs[a]+"&app_id="+appID+"&app_key="+appKey).then(
                  function successCallback(response) {
                    $rootScope.savedList.push(response.data);
                  },
                  function errorCallback(response) {
                    console.log("unable to retrieve recipe");
                  }
                )
              }
             },
             function errorCallback(response) {
               console.log("unable to get list");
             }
          );
        }

        /* delete recipe from saved list*/
        $scope.removeFromSaved = function(recipeObj) {
          var rQueryPartialParam = "http://www.edamam.com/ontologies/edamam.owl#recipe_";
          var userDelete = {
            userid: sessionStorage.getItem("activeUserId"),
            recipeid: recipeObj[0].uri.replace(rQueryPartialParam,"")
          }
          $http.post("http://localhost:1121/users/deleted", JSON.stringify(userDelete)).then(
               function successCallback(response) {
                 for(var i=$rootScope.savedList.length - 1; i >= 0; i--) {
                   if(recipeObj[0].uri == $rootScope.savedList[i][0].uri) {
                     $rootScope.savedList.splice(i,1);
                     console.log("was removed: " + recipeObj[0].label);
                   }
                 }
                 console.log($rootScope.savedList);
                 console.log("deleted successfully");
               },
               function errorCallback(response) {
                 console.log("unable to delete");
               }
            );
        }
}
