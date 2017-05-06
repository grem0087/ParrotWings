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