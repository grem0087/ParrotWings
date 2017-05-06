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