Address Book for AngularJS
==========================

This repo contains a sample address book application for AngularJS that demonstrates how to use the DreamFactory REST API. It includes new user registration, user login, and CRUD for related tables.

#Getting DreamFactory on your local machine

To download and install DreamFactory, follow the instructions [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/Usage-Options). Alternatively, you can create a [free hosted developer account](http://www.dreamfactory.com) at www.dreamfactory.com if you don't want to install DreamFactory locally.

#Configuring your DreamFactory instance to run the app

- Enable [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for development purposes.
    - In the admin console, navigate to the Config tab and click on CORS in the left sidebar.
    - Click Add.
    - Set Origin, Paths, and Headers to *.
    - Set Max Age to 0.
    - Allow all HTTP verbs and check the Enabled box.
    - Click update when you are done.
    - More info on setting up CORS is available [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/CORs-Configuration).

- Create a default role for new users and enable open registration
    - In the admin console, click the Roles tab then click Create in the left sidebar.
    - Enter a name for the role and check the Active box.
    - Go to the Access tab.
    - Add a new entry under Service Access (you can make it more restrictive later).
        - set Service = All
        - set Component = *
        - check all HTTP verbs under Access
        - set Requester = API
    - Click Create Role.
    - Click the Services tab, then edit the user service. Go to Config and enable Allow Open Registration.
    - Set the Open Reg Role Id to the name of the role you just created.
    - Make sure Open Reg Email Service Id is blank, so that new users can register without email confirmation.
    - Save changes.

- Import the package file for the app.
    - From the Apps tab in the admin console, click Import and click 'Address Book for AngularJS' in the list of sample apps. The Address Book package contains the application description, source code, schemas, and sample data.
    - Leave storage service and folder blank. It will use the default local file service named 'files'.
    - Click the Import button. If successful, your app will appear on the Apps tab. You may have to refresh the page to see your new app in the list.
    
- Decide if you're going to run the app locally or load it from the instance.
    - For running locally you clone the repo to your machine and open index.html in the browser. If running locally you need to set the URL for your instance so the app can make the API calls. Go to your local repo and edit app.js. Set the constant INSTANCE_URL to point to your DreamFactory instance such as http://localhost:8080.
    - For running from the instance you launch the app directly from the Apps tab in the admin console.  Leave INSTANCE_URL set to empty string.

- If running from instance make your app files public.
    - Figure out where your app files are stored. If you used the default storage settings to import the app, it'll be the default local file service named 'files'.
    - Go to the Files tab in the admin console. Find your file service. Double click and find the folder for your app, e.g., 'AddressBookForAngularJS'.
    - Go to the Services tab in the admin console and click the 'files' service. Click the Config tab and add the app folder name 'AddressBookForAngularJS' as a public path. Now select the relevant container from the Container drop down.If you used the default storage settings to import the app then select "local" from the drop down list. Save your changes.

- Edit your app API key
    - If you are running from instance use the file manager to edit app.js and set APP_API_KEY to the key for your new app. The API key is shown on the app details in the Apps tab of the admin console.
    - If you are running locally edit app.js in your local repo.
    
- Make sure you have a SQL database service named 'db'. Most DreamFactory instances have a default 'db' service for SQLite. You can add one by going to the Services tab in the admin console and creating a new SQL service. Make sure you set the name to 'db'.

#Running the Address Book app

You can launch the app from the Apps tab in the admin console, or by opening your local index.html in your browser.

When the app starts up you can register a new user, or log in as an existing user. Currently the app does not support registering and logging in admin users.

#Example API calls

The DreamFactory Address Book for AngularJS uses $resource and $http to make API calls. The code has been organized in a modular fashion. Hence every module is composed of its own JS, html and css file. Every module has a resource factory defined to interact with DreamFactory API.
 
 The general form of a DreamFactory REST API call is:

`<rest-verb> http[s]://<server-name>/api/v2/[<service-api-name>]/[<resource-path>][?<param-name>=<param-value>]`

Use interceptors for prepend instance_url to every api call instead of prepending it everywhere. For more information on interceptors check [official documentation](https://docs.angularjs.org/api/ng/service/$http#interceptors). 

```javascript
angular.module('your-app', [
    //dependencies
])

.config([
    '$httpProvider',

    function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }
])


// Interceptor: Called before making the ajax request. This can be a global place to handle error
// or handle errors etc.

.factory('httpInterceptor', [
    function () {
        return {
            request: function (config) {
                
                // Append instance url before every api call
                if (config.url.indexOf('/api/v2') > -1) {
                    config.url = INSTANCE_URL + config.url;
                };

                return config;
            }
        }
    }
])
```

Now there are two approaches to make an api call. The first one can be done using [$http](https://docs.angularjs.org/api/ng/service/$http) service. Example:

```javascript
angular.module('your-app', [])

.controller('ModelViewController', [
    '$scope', '$http',

    function ($scope, $http) {
        $http({
            method: 'GET',
            url: '/api/v2/_table/Model',
            params: {
                // query params
            }
        }).then(function (result) {
            $scope.data = result.data.resource;
        }, function (error) {
            // handle error
        })
    }
])
```

If you are using angular-resource package, which is a wrapper around $http, you can make a factory for each model. Example:

```javascript
angular.module('your-app', [ 'ngResource' ])

.factory('Model', [
    '$resource',

    function ($resource) {
        return $resource('/api/v2/_table/Model', {
            query: {
                method: 'GET',
                isArray: false // true if response is an array
            },
            create: {
                method: 'POST',
                // url: '/api/v2/Model/create' // You can provide different urls for different CRUD operations
            },
            update: {
                method: 'PUT'
            },
            remove: {
                method: 'DELETE'
            }
        })
    }
])

.controller('ModelViewController', [
    '$scope', 'Model',

    function ($scope, Model) {
        Model.query({ 
            // query params
        })
        .$promise.then(function (result) {
            // success
            $scope.list = result.resource
        }, function (error) {
            // handle error
        });
    }
]);
```

##Example of login and registration


Recommened approach is to create a service which handles login and registration. This service will take care of handling the response after api calls and storing session token. Example:

```javascript
angular.module('your-app', [ 'ngCookies' ])

.service('AccountService', [
    '$http', '$q', '$cookies', '$window',

    function ($http, $q, $cookies, $window) {

        // Handle response from DreamFactory for login and register
        var handleResult = function (result) {
            // set header X-DreamFactory-Session-Token for all api calls
            $http.defaults.headers.common['X-DreamFactory-Session-Token'] = result.data.session_token;
            $cookies.session_token = result.data.session_token

            //set user in localStorage and $rootScope for future use. 
            $rootScope.user = result.data;
            try {
                $window.localStorage.user = JSON.parse(result.data);
            } catch (e) { } 
        }

        // Login
        this.login = function (creds) {

            var deferred = $q.defer();

            $http.post('/api/v2/user/session', creds).then(function (result) {
                handleResult(result);
                deferred.resolve(result.data);
            }, deferred.reject);
        };

        // Register

        this.register = function (options) {
            var deferred = $q.defer();
            
            $http.post('/api/v2/user/register?login=true', options).then(function (result) {
                handleResult(result)
                deferred.resolve(result.data);
            }, deferred.reject);

            return deferred.promise;
        };
    }
])
```
The API request will return a session token when the (optional) login=true parameter is appended to the register url. So with this parameter appended, the new registered user doesn't have to login to get a session token. And then from your view controller these methods can be called which returns a promise object. Upon success you can redirect them to application dashboard.


##Example of fetching records

####all records in table using $http:

```javascript
$http.get('/api/v2/_table/Contact', {
    // query params
}).then(function (result) {
    // success
}, function () {
    // error
});
```

####all records in table using $resource factory as mentioned in previous examples:

```javascript
.controller('ViewController', [
    '$scope', 'Contact',

    function ($scope, Contact) {
        $scope.contacts = Contact.query({
            // query params    
        });

        // $scope.contacts will be populated with data when call is done. 
        // You can also have success and error callback on the same object.
        $scpoe.contacts.$promise.then(function () {
            // success    
        }, function () {
            // error
        });
    }
])
```

####with fields

Pass query params for api calls in above example for specific fields. An example with $http service will be like:

```javascript
// Only need id, first_name and last_name in list.
$http.get('/api/v2/_table/contact', {
    fields: [ 'id', 'first_name', 'last_name' ]
}).then(function (result) {
    // success
})
```

####with filter

```javascript
// Get contact with id 2.
$http.get('/api/v2/_table', {
    filter: 'id=2'
}).then(function (result) {
    // success
})
```

##Example of creating a record

####single record: 

```javascript
var group = {
    name: 'My Group'
};

$http.post('/api/v2/_table/contact_group', group).then(function (result) {
    // success
}, function () {
    // error    
})
```

or using angular-resource (Assuming a factory is defined as mentioned in previous examples)

```javascript
.controller([
    '$scope', 'Group',

    function ($scope, Group) {
        $scope.newGroup = { name: 'My Group' };
        Group.create($scope.newGroup).$promise.then(function (result) {
            // success
        }, function () {
            // error    
        }) 
    }
]);
```

##Example of deleting records

####with a single id:

```javascript
// delete group with id 2
$http.delete('/api/v2/table/contact_group', {
    params: {
        filter: 'id=2'
    }
});
```

####with multiple ids

```javascript
// delete group with id 2,3 and 4
$http.delete('/api/v2/table/contact_group', {
    params: {
        filter: 'id=2,3,4'
    }
});
```

####with fields

```javascript
// delete contact with first_name 'Andy'
$http.delete('/api/v2/table/contact', {
    params: {
        filter: 'first_name=Andy'
    }
});
```


#Additional Resources

More detailed information on the DreamFactory REST API is available [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/REST-API).

The live API documentation included in the admin console is a great way to learn how the DreamFactory REST API works.
Check out how to use the live API docs [here](https://github.com/dreamfactorysoftware/dsp-core/wiki/API-Docs).
