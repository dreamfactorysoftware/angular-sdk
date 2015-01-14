'use strict';

angular.module('dfswag.controllers', [])
    .controller('SwaggerCtrl', ['$scope', 'Swagger', function ($scope, Swagger) {ß
        Swagger.buildSDK(['db', 'system']);
        $scope.$on("api:system:ready", function(){
        $scope.df.db.getRecords({table:'todo'});
        })


    }]);


