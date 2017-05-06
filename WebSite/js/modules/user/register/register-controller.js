(function (angular) {
    "use strict";

    angular.module("user")
        .controller("RegisterCtrl", ["$scope", "$http", "constants", "$location",
            function ($scope, $http, constants, $location) {
                $scope.validate = {};
                $scope.model = {};
                $scope.save = function () {

                    if ($scope.registerForm.$valid != true) {
                        $scope.registerForm.submited = true;
                        return;
                    }

                    $scope.model.Password = $scope.model.password1;

                    $http.post(constants.urls.register, $scope.model)
                        .then( function (response) {
                            if (response.data.isSuccess == true) {
                                $location.path("/signin");
                            } else {
                                $scope.validate.errorMessage = response.data.data
                            }
                        });

                };
            }]);
})(angular);