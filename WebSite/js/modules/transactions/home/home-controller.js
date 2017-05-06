(function (angular) {
    "use strict";

    angular.module("transactions")
        .controller("HomeCtrl", ["$scope", "$location", "authService", "commonServices",
            function ($scope, $location, authService, commonServices) {
                
                $scope.Loader = commonServices.Loader;
                
                $scope.logOut = function () {
                    $location.path('/signout');
                }

                $scope.authentication = authService.authentication;
                if ($scope.authentication.isAuth) {
                    $location.path('/transactions');
                }
            }]);
})(angular);
