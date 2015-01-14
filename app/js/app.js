'use strict';


// Declare app level module which depends on filters, and services
angular.module('dfswag', [
  'ngRoute',
  'ngSwagger',
  'dfswag.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'SwaggerCtrl'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
