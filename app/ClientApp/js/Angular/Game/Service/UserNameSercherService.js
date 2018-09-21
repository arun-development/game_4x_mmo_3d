Utils.CoreApp.gameApp.service("userNameSercherService", ["$q", "npcHelper", function ($q, npcHelper) {
    var $self = this;
    var localNames = [];


    function addToLocal(newCol) {
        localNames = _.unionBy(localNames, newCol, "Id");
    };

    var npcIds = npcHelper.NPC_USER_IDS;
    var npcNamesArr = [npcHelper.NPC_NATIVE_NAMES.SKAGRY, npcHelper.NPC_NATIVE_NAMES.SKAGRY];


    this.filter = function (query, collection) {
        var _qwery = query.toLowerCase();
        return _.filter(collection, function (o) {
            return o.Name.toLowerCase().indexOf(_qwery) !== -1;
        });


    }; 
    var inProgress = false;
    this.filterAsync = function (queryName) {
        queryName = queryName.trim();
        var deferred = $q.defer();
        if (inProgress) {
            deferred.resolve([]);
            return deferred.promise;
        }

        var local = queryName.length === 0 ? localNames : $self.filter(queryName, localNames);
        console.log("local", { local: local });
        if (local.length !== 0) {
            deferred.resolve(local);
            return deferred.promise;
        }
        inProgress = true;
        GameServices.mainGameHubService.sercherGetUserNames(queryName).finally(function () {
            inProgress = false;
        }).then(function (answer) {

            addToLocal(answer);
            local = $self.filter(queryName, localNames);
            deferred.resolve(local);
            console.log("userNameSercherService.answer", {
                queryName: queryName,
                answer: answer,
                local: local,
                localNames: localNames,

            });
        }, function (errorAnswer) {
            var msg = Errors.GetHubMessage(errorAnswer);
            deferred.reject(errorAnswer, msg);
            console.log("userNameSercherService.filterAsync", {
                queryName: queryName,
                errorAnswer: errorAnswer,
                msg: msg
            });
        });
        return deferred.promise;

    };

    this.ignoreNpcPredicate = function (o) {
        if (o.Id === npcIds.SKAGRY) {
            return false;
        }
        if (o.Id === npcIds.CONFEDERATION) {
            return false;
        }
        return true;   
    };
    this.ignoreNpcAndUserIdPredicate = function (o, userId) {
        if (o.Id === userId) {
            return false;
        }
        if ($self.ignoreNpcPredicate(o)) {
            return false;
        }

        return true;
    };
    this.ignoreNpcFilter = function (collection) {
        return _.filter(collection, this.ignoreNpcPredicate);
    };

    this.ignoreNpcAndUserId = function (collection, userId) {
        return _.filter(collection, function (o) {
            return $self.ignoreNpcAndUserIdPredicate(o, userId);
        });
    };
    this.createIgnoreNamesWithNpc = function(names) {   
        return _.concat(npcNamesArr, names).join("|").toLowerCase().split("|");
 
    };
    this.filterByIgnoreNames = function (collection, ignoreUserNames) {
        if (!ignoreUserNames || !ignoreUserNames.length) {
            return collection;
        }
        return _.filter(collection, function (o) {
            var name = o.Name.toLowerCase();
            var ignore = _.includes(ignoreUserNames, name);  
            return !ignore;
        });
    };

}
]);