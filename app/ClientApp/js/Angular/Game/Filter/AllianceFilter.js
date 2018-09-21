Utils.CoreApp.gameApp.filter("allianceFilter", function () {
    return function (inputCollection, value) {
        return _.filter(inputCollection, function (o) {
            var name = o.Name.toLowerCase();
            var leaderName = o.LeaderName.toLowerCase();

            return (value === undefined
                || name.indexOf(value.toLowerCase()) !== -1
//                || o.Pilots.indexOf(value) !== -1
                || o.PvpPoint >= value
//                || o.ControlledPlanet.indexOf(value) !== -1
                || leaderName.indexOf(value.toLowerCase()) !== -1
            );
        });
    };
});
Utils.CoreApp.gameApp.filter("allianceMember", function () {

    var lastVal = null;
    var lastOnline = null;
    var lstCol = null;

    return function (inputCollection, value, onlineOnly, updateMembers) {
        if (!updateMembers && lastOnline === onlineOnly && lastVal === value) return lstCol;
        if (updateMembers) {
            lastVal = "";
            lastOnline = false;
            return inputCollection;
        }
        lastVal = value;
        lastOnline = onlineOnly;

        if (typeof onlineOnly === "boolean") {
            lastOnline = onlineOnly;
            if (onlineOnly) {
                lstCol = inputCollection = _.filter(inputCollection, function (o) {
                    return (o.OnlineStatus === true);
                });
            }

        }

        return lstCol =_.filter(inputCollection, function (o) {
            var name = o.UserName.toLowerCase();
            var roleName = o.Role && o.Role.hasOwnProperty("RoleName") ? o.Role.RoleName.toLowerCase() : "";
            var pvp = o.UserPvp;
            if (value === "" || value === undefined) return true;
            if (Utils.IsNumeric(value)) {
                return pvp >= _.toInteger(value);
            } 
            value = value.toLowerCase();
            return name.indexOf(value) !== -1 || roleName.indexOf(value) !== -1;
        });
    };
});