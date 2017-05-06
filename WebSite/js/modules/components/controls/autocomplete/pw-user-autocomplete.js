(function (angular) {
    "use strict";

    angular.module("components")
        .directive("pwUserAutocomplete", function () {
            return {
                scope: {
                    label: "@",
                    required: "@",
                    pattern: "@",
                    type: "@",
                    maxlength: "@"
                },
                restrict: "E",
                templateUrl: "/js/modules/components/controls/autocomplete/pw-user-autocomplete.tpl.html",
                require: "ngModel",
                link: function ($scope, $element, $attrs, ngModel) {
                    ngModel.$render = function () {
                        $scope.inputString = ngModel.$viewValue;
                        if ($scope.inputString) {
                            $scope.getValuesFromServer($scope.inputString);
                        } else {
                            $scope.onRemove(undefined, true);
                        }
                    };
                    $scope.$watch("inputString", function (value) {
                        if (value && value.length > 2) {
                            $scope.getValuesFromServer(value);
                        }
                    });

                    $scope.setTouched = function () {
                        ngModel.$setTouched();
                    };
                },
                controller: ["$scope", "constants", "$http",
                    function ($scope, constants, $http) {
                        $scope.showItems = true;

                        $scope.selectItem = function (item) {
                            $scope.inputString = item.name;
                            $scope.showItems = false;
                        };

                        $scope.onRemove = function () {

                        };

                        $scope.getValuesFromServer = function (input) {                            
                            $http.get(constants.controls.urls.userAutocomplete + "?input=" + input )
                                .then(function (response) {                                    
                                    $scope.Items = response.data.data;
                                    $scope.showItems = true;
                                });
                        }                                        
                    }]        
            };
        });
})(angular);