angular
.module('app')
.directive('checkAvailability', checkAvailabilityFunc)
.run(serverMock);

function checkAvailabilityFunc($http, $q, $timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            // fetch the call address from directives 'checkIfAvailable' attribute
            var serverAddr = attr.checkAvailability;

            ngModel.$asyncValidators.invalidUsername = function (modelValue, viewValue) {
                var username = viewValue;
                var deferred = $q.defer();

                // ask the server if this username exists
                $http.get(serverAddr, { data: username }).then(
                  function (response) {
                      // simulate a server response delay of half a second
                      $timeout(function () {
                          if (response.data.exists) {
                              deferred.reject();
                          } else {
                              deferred.resolve();
                          }
                      }, 500);
                  });

                // return the promise of the asynchronous validator
                return deferred.promise;
            }
        }
    }
}

function serverMock($httpBackend) {
    var occupiedUsernames = ["Joe", "Joee", "Rogers", "Kim"];

    // mock the server GET username availability request
    $httpBackend.whenGET("localhost:3000/users/").respond(
      function (method, url, data) {
          var username = data;
          var exists = occupiedUsernames.indexOf(username) > -1; // 'true' if username is in array

          return [200, { exists: exists }, {}];
      }
    );
}