Utils.CoreApp.gameApp.service("mainHelper", ["$q", "$timeout",
    function ($q, $timeout) {
        this.$q = $q;
        this.$timeout = $timeout;
        this.applyTimeout = function (action, delay) {
            var promise = $timeout(action, delay);
            return promise;
        };  
        this.applyAsync = function (onSucsess) {
            if (!(onSucsess instanceof Function)) throw new Error("applySync action not set in param");
            var deferred = $q.defer();
            deferred.promise.then(onSucsess, angular.noop);
            deferred.resolve();
            //console.log("mainHelper", {
            //    deferred: deferred
            //});
            return deferred.promise;
        }

    }
]);