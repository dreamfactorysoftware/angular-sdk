'use strict';


angular.module('login', [
	'ngRoute',
	'ngResource',
	'ngCookies'
])


.run([
	'$rootScope',

	function ($rootScope) {
		try {
			$rootScope.user = JSON.parse(window.localStorage.user)
		} catch (e) {}
	}
])

.config([

	'$routeProvider', 

	function ($routeProvider) {
		$routeProvider
			.when('/login', {
				title		: 'Login',
				controller	: 'LoginCtrl',
				templateUrl	:  'app/login/login.html'
			})

			.when('/register', {
				title		: 'Register',
				controller	: 'RegisterController',
				templateUrl	:  'app/login/register.html'
			});
	}
])

.service('LoginHelper', [
	'$http', '$q', '$cookies', '$rootScope',

	function ($http, $q, $cookies, $rootScope) {
		this.initiate = function (options) {
			var deferred = $q.defer();
			
			$http.post('/api/v2/user/session/', options).then(function (result) {
				$http.defaults.headers.common['X-DreamFactory-Session-Token'] = result.data.session_token;
				$cookies.session_token = result.data.session_token;
				
				$rootScope.user = result.data;

				try {
					window.localStorage.user = JSON.stringify(result.data);
				} catch (e) { }

 				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;
		};

		this.register = function (options) {
			var deferred = $q.defer();
			
			$http.post('/api/v2/user/register?login=true', options).then(function (result) {
				console.log(result);
 				deferred.resolve();
			}, deferred.reject);

			return deferred.promise;
		};
	}
])

.controller('LoginCtrl', [
	'$scope', 'LoginHelper', '$location', '$rootScope',

	function ($scope, LoginHelper, $location, $rootScope) {
		$rootScope.isLoggedIn = false;
		$scope.submit = function () {
			LoginHelper.initiate({
				email: $scope.username,
				password: $scope.password
			}).then(function () {
				$rootScope.isLoggedIn = true;
				$location.path('/contacts');
			});
		};

		$scope.register = function () {
			$location.path('/register');
		};
	}
])


.controller('RegisterController', [
	'$scope', 'LoginHelper', '$location', '$rootScope',

	function ($scope, LoginHelper, $location, $rootScope) {
		$rootScope.isLoggedIn = false;
		$scope.register = function () {
			LoginHelper.register({
				email: $scope.username,
				password: $scope.password,
				first_name: $scope.firstName || 'Address',
				last_name: $scope.lastName || 'Book'
			}).then(function () {
				$location.path('/login');
			});
		};
	}
])