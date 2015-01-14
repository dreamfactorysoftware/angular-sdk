'use strict';

angular.module('dfswag.controllers', [])
    .controller('SwaggerCtrl', ['$scope', 'Swagger', function ($scope, Swagger) {
        Swagger.buildSDK();
        //Swagger.buildSDK(['db', 'system']);
        $scope.$on("api:db:ready", function(){
        console.log("db ready");
        })


    }]);

