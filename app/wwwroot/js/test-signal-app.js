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

(function ($) {

    $(document).ready(function () {

        var colors = ["red", "green", "blue"];
        var index = 0;

        function nextIndicator(i) {
            index = i;
            if (index > 2) {
                index = 0;
            }
            $("body").css("background-color", colors[index]);

        }

        //can also be ServerSentEvents or LongPolling
        //var logger = new signalR.ConsoleLogger(signalR.LogLevel.Information);
        //var connection = new signalR.HttpConnection(document.location.origin + "/MyTestHub", { transport: transportType, logger: logger });


        var hub = signalR.createMyTestHub();
        console.log({
            hub: hub,
        });



        hub.start().then(c => {
            hub.server.test(index + 1).then(e => {
                console.log({ e: e });
            });
        }, e => { });

        hub.on('TestSended', (i) => {
            nextIndicator(i);
            console.log('received message', { message: i });
        });


        hub.on('TestServiceSended', function (i) {
            nextIndicator(index + 1);
            console.log('received message', { data: i });
        });

        window.q = hub;


    });
})(jQuery);

//XSRF test
(function ($) {
    $.ajax({
        url: "/api/home/TestConvertToHtmlString",
        headers: {
            "X-XSRF-TOKEN": $("input[name=X-XSRF-TOKEN]").val()
        }
    }).then(function (e) {
        console.log("get data with XSRF ok", e)
    }, function (e) {
        console.error("get data with XSR error", e)
    });

    $.ajax({
        url: "/api/home/TestConvertToHtmlString"
    }).then(function (e) {
        console.error("get data without  XSRF ok, it is error")
    }, function (e) {
        console.log("get data without  XSRF is error   => all ok", e)
    });



})(jQuery);