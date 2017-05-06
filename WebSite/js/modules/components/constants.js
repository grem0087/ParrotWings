(function (angular) {
    "use strict";

    angular.module("components")
        .constant("constants", {
            urls: {
                signin: "http://localhost:63967/api/users/signin",
                register: "http://localhost:63967/api/users/register",
                getBalance: "http://localhost:63967/api/transaction/GetBalance",
                getLastTransactions: "http://localhost:63967/api/transaction/GetTransactionsList",
                makeTransaction: "http://localhost:63967/api/transaction/MakeTransaction",
            },
            controls: {
                urls: {
                    userAutocomplete: "http://localhost:63967/api/users/GetUsers"
                },
                autocompleteMinCharacters: 3
            }
        })
        .constant("appRoutes", {
            signin: "./views/signin.html",
            register: "./views/register.html",
            home: "./views/home.html",
            transactions: "./views/transactionsIndex.html",
            notfound: "./views/notfound.html",
        });
})(angular);