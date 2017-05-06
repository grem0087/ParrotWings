angular.module("user", []);
angular.module("transactions", []);
angular.module("components", ["ngRoute", "ngStorage", "LocalStorageModule", "ui.bootstrap", "oitozero.ngSweetAlert"]);
angular.module("ParrotWings", ["user", "transactions", "components"]);