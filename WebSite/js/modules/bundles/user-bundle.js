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
(function (angular) {
    "use strict";

    angular.module("user")
        .controller("SignInCtrl", ["$scope", "$http", "constants", "authService", "$location",
            function ($scope, $http, constants, authService, $location) {

                $scope.validate = {};
                
                $scope.save = function () {
                    if ($scope.registerForm.$valid != true) {
                        $scope.registerForm.submited = true;
                        return;
                    }
                    $scope.isLoading = true;
                    authService.login({ email: $scope.form.Email, password: $scope.form.Password })
                        .then(function (response) {
                            
                            if (response.status == 200) {
                                $location.path("/transactions");
                            } else {
                                $scope.validate.errorMessage = response.data.message;
                            }
                        }, function (err) {
                            $scope.validate.errorMessage = "Unknown user or password";

                        });
                };

            }]);
})(angular);
(function (angular) {
    "use strict";

angular.module("user")
    .controller("SignoutCtrl", ["$scope", "authService", "$location",
        function ($scope, authService, $location) {
            authService.logOut();
            $location.path('/signin');
        }]);
})(angular);