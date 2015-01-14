# angular-seed  plus angular dreamfactory SDK module with build options


## Getting Started
 
 Run npm install
 
 Run bower install ( i've included the necessary files for now if you dont have node)
 
Modify the services.js to point to your DSP.

controllers.js has the $scope.buildSDK method. Pass no params for all services, or pass an array of endpoints.


```javascript
        //Build All
        Swagger.buildSDK();
        //Build one or more
        //Swagger.buildSDK(['db', 'system']);
        
        //Listen for the service you need, if you passed no params, listen for api:system:ready
        $scope.$on("api:db:ready", function(){
        console.log("db ready");
        })


```
