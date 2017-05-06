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