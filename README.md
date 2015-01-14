# angular-seed  plus angular dreamfactory SDK module with build options


## Getting Started
 
 Run npm install
 
 Run bower install ( i've included the necessary files for now if you dont have node)
 
Modify the services.js to point to your DSP.

controllers.js has the $scope.buildSDK method. Pass an array of endpoints, and listen for the last one called, or the one you need on init..


```javascript
        
       'use strict';

      angular.module('dfswag.controllers', [])
        .controller('SwaggerCtrl', ['$scope', 'Swagger', function ($scope, Swagger) {ß
        Swagger.buildSDK(['db', 'system']);
        $scope.$on("api:system:ready", function(){
        $scope.df.db.getRecords({table:'todo'});
        })


    }]);



```
