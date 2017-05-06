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