(function (angular) {
    "use strict";

angular.module("user")
    .controller("SignoutCtrl", ["$scope", "authService", "$location",
        function ($scope, authService, $location) {
            authService.logOut();
            $location.path('/signin');
        }]);
})(angular);