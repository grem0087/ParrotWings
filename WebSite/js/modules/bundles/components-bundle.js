angular.module("user", []);
angular.module("transactions", []);
angular.module("components", ["ngRoute", "ngStorage", "LocalStorageModule", "ui.bootstrap", "oitozero.ngSweetAlert"]);
angular.module("ParrotWings", ["user", "transactions", "components"]);
(function (angular) {
    "use strict";

    angular.module("components")
        .config(function ($routeProvider, $locationProvider, $httpProvider, appRoutes, $httpParamSerializerJQLikeProvider) {


            $routeProvider.when("/home", {
                controller: "HomeCtrl",
                templateUrl: appRoutes.home
            });

            $routeProvider.when("/transactions", {
                controller: "TransactionsCtrl",
                templateUrl: appRoutes.transactions
            });

            $routeProvider.when("/signin", {
                controller: "SignInCtrl",
                templateUrl: appRoutes.signin
            });

            $routeProvider.when("/register", {
                controller: "RegisterCtrl",
                templateUrl: appRoutes.register
            });

            $routeProvider.when("/notfound", {
                templateUrl: appRoutes.notfound
            });


            $routeProvider.when("/signout", {
                controller: "SignoutCtrl",
                template: "<div ng-controller='SignoutCtrl'></div>"
            });

            $routeProvider.otherwise({ redirectTo: "/signin" });
            $locationProvider.html5Mode(true);

            $httpProvider.interceptors.push('authInterceptorService');
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";         
            $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
        })
        /*.config(function ($httpProvider, $httpParamSerializerJQLikeProvider)
        {
            $httpProvider.defaults.transformRequest.unshift($httpParamSerializerJQLikeProvider.$get());
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
        })*/;
    angular.module("ParrotWings")
        .run(["authService", "$rootScope", "$location", "appRoutes",
            function (authService, $rootScope, $location, appRoutes) {

                authService.fillAuthData();
                
                $rootScope.$on("$routeChangeStart", function (event, next, current) {
                    
                    if (!authService.authentication.isAuth) {
                        if (next.templateUrl != appRoutes.register &&
                            next.templateUrl != appRoutes.home &&
                            next.templateUrl != appRoutes.signin ) {
                            $location.path("/signin");
                        }
                    }
                });
        }]);
})(angular); 
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
(function (angular) {
    "use strict";
    
    angular.module("components")
        .factory("authInterceptorService", ["$q", "$location", "localStorageService", "constants", 
            function ($q, $location, localStorageService) {
                return {
                    request: function (config) {

                        var authData = localStorageService.get("authorizationData");
                        config.headers["Content-Type"] = 'application/x-www-form-urlencoded';                        
                        if (authData) {                            
                            config.headers.Authorization = "Bearer " + authData.token;                         
                        }
                        return config || $q.when(config);
                    },
                    response: function (response) {
                        
                        if (response.status === 401 || response.status === 400) {
                            console.log("response err" + response);
                            //  Redirect user to login page / signup Page.
                        }
                        return response || $q.when(response);
                    },
                    responseError: function (error) {                        
                        console.log(error);
                        if (error.status == -1 || error.status == 400 || error.status == 401) {
                            $location.path('/signout');
                        }

                        if (error.status == 404) {
                            $location.path('/notfound');
                        }
                        error.data = {data:""};
                        return error || $q.when(error);
                    }
                }
            }]);

})(angular);
(function (angular) {
    "use strict";

    angular.module("components")
        .factory("authService", ["$http", "$q", "localStorageService", "constants", function ($http, $q, localStorageService, constants) {

            var authServiceFactory = {};

            var _authentication = {
                isAuth: false,
                userName: "",
                userId : null
            };

            var _saveRegistration = function (registration) {
                _logOut();
                return $http.post(constants.urls.register, registration).then(function (response) {
                    return response;
                });
            };

            var _login = function (loginData) {
                var data = "grant_type=password&email=" + loginData.email + "&password=" + loginData.password;
                var deferred = $q.defer();

                $http.post(constants.urls.signin, { email: loginData.email, password: loginData.password} )
                    .then(function (response) {
                        localStorageService.set("authorizationData", { token: response.data.access_token, userMail: loginData.email, userName: response.data.userName, userId : response.data.userId});
                        _authentication.isAuth = true;
                        _authentication.userName = response.data.userName;
                        _authentication.userId = response.data.userId;
                        deferred.resolve(response);

                    }, function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });

                return deferred.promise;
            };

            var _logOut = function () {
                localStorageService.remove("authorizationData");
                _authentication.isAuth = false;
                _authentication.userName = "";
                _authentication.userId = null;
            };

            var _fillAuthData = function () {

                var authData = localStorageService.get("authorizationData");                
                if (authData) {
                    _authentication.isAuth = true;
                    _authentication.userName = authData.userName;
                    _authentication.userId = authData.userId;
                }
            }

            authServiceFactory.saveRegistration = _saveRegistration;
            authServiceFactory.login = _login;
            authServiceFactory.logOut = _logOut;
            authServiceFactory.fillAuthData = _fillAuthData;
            authServiceFactory.authentication = _authentication;

            return authServiceFactory;
        }]);

})(angular);
(function (angular) {
    "use strict";

    angular.module("components")
        .factory("commonServices", function () {
            var self = this;
            this.Loader = {
                    isLoading: false
                };

            return this;
        });  
})(angular);
(function (angular) {
    "use strict";

    angular.module("components")
        .factory("userService", ["$http", "$q", "localStorageService", "constants", function ($http, $q, localStorageService, constants) {
            var _user = {};

            user.updateBalance = function () {

            };
            return _user;
        }]);    
})(angular);