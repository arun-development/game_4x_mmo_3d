Utils.CoreApp.gameApp.factory("hubFactory", ["$rootScope",
  function ($rootScope) {  
      return function (hubName,logLevel) {
          var createProp = "create" + hubName;
          if (signalR && signalR.hasOwnProperty(createProp) && signalR[createProp] instanceof Function) {
             
              var hub = signalR[createProp](logLevel);
 
              hub.$apply = function (action, responce) {
                  $rootScope.$apply(function () {
                      if (action instanceof Function) action(responce);
                  });
              }
              return { hub: hub, $$rootScope: $rootScope };
          } else {
              var msg = "SignalR: hab not exist, hub name: " + hubName;
              throw new Error(msg);
          };

      }
  }]);