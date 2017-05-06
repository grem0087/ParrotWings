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
(function (angular) {
    "use strict";

    angular.module("transactions")
        .controller("TransactionsCtrl", ["$scope", "$http", "constants", "authService", "commonServices",
            function ($scope, $http, constants, authService, commonServices) {
                $scope.transactionsPage = { page: null };
                $scope.Loader = commonServices.Loader;
                
                $scope.Items = [];
                
                $scope.user = {
                    Name: authService.authentication.userName,
                    Id: authService.authentication.userId,
                };

                var userId = $scope.user.Id;

                getLastTransactions();
                $http.get(constants.urls.getBalance, { params: { userId: userId } })
                    .then(function (results) {                    
                    $scope.user.balance = results.data.data;
                });

                $scope.repeatTransaction = function (recipient, amount) {
                    $scope.loadedTransaction = {
                        Recipient : recipient,
                        Amount: amount
                    };

                    $scope.transactionsPage.page = "makeTransaction";
                };

                $scope.openTransactionPage = function () {
                    delete $scope.loadedTransaction;
                    $scope.transactionsPage.page = "makeTransaction";
                };
                
                function getLastTransactions() {
                    $scope.Loader.isLoading = true;
                    $http.get(constants.urls.getLastTransactions, { params: { userId: userId } })
                        .then(function (results) {
                            $scope.Items = results.data.data.transactions;
                            $scope.Loader.isLoading = false;
                        });
                }
            }]);
})(angular);