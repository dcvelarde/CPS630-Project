angular.module('recipeModule')
    .controller('MostPopularRecipesController', ['$rootScope','$scope', '$http','$window' ,MostPopularRecipesController]);

    function MostPopularRecipesController($rootScope,$scope,$http,$window) {
        $scope.getMostPopularRecipes = getMostPopularRecipes;
        var hostIP = "localhost";
        $scope.popRatedRecipes = [];

        $scope.appID="4e6ed2f0";
        $scope.appKey = "2b62e270b8ccede3c8380b07051800a6";
        getMostPopularRecipes();
        
        function getMostPopularRecipes() {
            // TODO: Make HTTP Recipe GET API call
            $http.get("http://"+hostIP+":1121/getMostPopularRecipes/").then(
                function success(response){
                    $scope.popRatedRecipes = response.data.response;
                    console.log($scope.popRatedRecipes);
                },function err(response){});
        }

    } // end of controller

var dirapp = angular.module('recipeModule');
dirapp.directive("popRecipeDirective", popRecipeDirective);

popRecipeDirective.$inject = ['$http','$rootScope'];

function popRecipeDirective($http,$rootScope) {
    var directive = { };
    directive.restrict = 'E';
    var hostIP = "localhost";
    directive.template = "<p>{{recipe.name}}</p>";

    directive.link = function(scope, elements, attr) {
        // console.log(scope.recipe);
    }
    return directive;
}