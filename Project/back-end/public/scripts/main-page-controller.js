angular.module('recipeModule')
    .controller('MainPageController', ['$rootScope','$scope', '$http','$window' ,MainPageController]);

    function MainPageController($rootScope,$scope,$http,$window) {
        $scope.firstname = $window.sessionStorage.getItem("activeUser");
        $scope.logout = logout;
        $scope.mainPage = mainPage;

        function logout() {
            $window.sessionStorage.clear();
            $window.location.href = './login.html'
        }

        function mainPage() {
            $window.location.href = 'main.html';
        }

    } //end of MainPageController




