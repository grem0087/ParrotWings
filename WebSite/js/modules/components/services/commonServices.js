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