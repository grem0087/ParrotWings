(function (angular) {
    "use strict";

    angular.module("transactions")
        .controller("MakeTransactionCtrl", ["$scope", "$http", "constants", "authService", "SweetAlert", "$location", "commonServices",
            function ($scope, $http, constants, authService, sweetAlert, $location, commonServices) {
                $scope.Loader = commonServices.Loader;
                $scope.model = {};
                if ($scope.loadedTransaction) {
                    $scope.Recipient = $scope.loadedTransaction.Recipient.name;
                    $scope.model.Amount = $scope.loadedTransaction.Amount;
                    $scope.model.RecipientId = $scope.loadedTransaction.Recipient.id;
                }

                $scope.cancel = function () {
                    $scope.transactionsPage.page = "index";
                };

                $scope.makeTransaction = function () {                    
                    $scope.model.PayeeId = $scope.user.Id;
                    $scope.Loader.isLoading = true;

                    $http.post(constants.urls.makeTransaction, $scope.model)
                        .then(function (results) {
                            $scope.Loader.isLoading = false;

                            if (results.data.isSuccess) {
                                sweetAlert.success("Success!", "Transaction successful completed!", function () {
                                    $scope.transactionsPage.page = "";
                                });
                            } else {
                                sweetAlert.error("Error!", results.data)
                            }
                    });
                };

                $scope.onSelect = function ($item) {
                    $scope.model.RecipientId = $item.id;
                };

                $scope.getUsers = function (input) {
                    return $http.get(constants.controls.urls.userAutocomplete, { params: { input: input }})
                        .then(function (response) {
                            return response.data.data.map(function (item) {                                
                                return item;
                            });
                        });
                };

            }]);
})(angular);