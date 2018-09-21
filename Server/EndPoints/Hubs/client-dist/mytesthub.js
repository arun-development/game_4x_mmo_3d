(function (signalR,$) {
signalR.createMyTestHub = function (loglevel) {
if (!loglevel) {
loglevel = signalR.LogLevel.Information;
}
var hub = new signalR.HubConnectionBuilder()
.withUrl('/hub/MyTestHub'.toLowerCase())
.configureLogging(loglevel)
    .build(); 
    
hub.server = {};
hub.client = {};

hub.server['onConnectedAsync'] = function() {return hub.invoke.apply(hub, $.merge(['OnConnectedAsync'], $.makeArray(arguments)));};
hub.server['onDisconnectedAsync'] = function(exception) {return hub.invoke.apply(hub, $.merge(['OnDisconnectedAsync'], $.makeArray(arguments)));};
hub.server['sendMessage'] = function(user,message) {return hub.invoke.apply(hub, $.merge(['SendMessage'], $.makeArray(arguments)));};
hub.server['test'] = function(index) {return hub.invoke.apply(hub, $.merge(['Test'], $.makeArray(arguments)));};
hub.server['testService'] = function(clientMessage) {return hub.invoke.apply(hub, $.merge(['TestService'], $.makeArray(arguments)));};
return hub;
}})(signalR,jQuery);
