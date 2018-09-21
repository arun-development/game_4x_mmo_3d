Utils.CoreApp.gameApp.service("npcHelper", [function () {

    this.isNpc = function (npcNameOrAlliane) {
        if (!npcNameOrAlliane) return false;  
        var name = npcNameOrAlliane.toUpperCase();   
        switch(name) {
            case this.NPC_NATIVE_NAMES.SKAGRY:
            return true;
            case this.NPC_NATIVE_NAMES.CONFEDERATION:
            return true;
        default:
            return false;
        }
    };
    this.isNpcUser = function (intUserId) {
        if (!intUserId) return false;
        if (_.isInteger(intUserId)) return false;
        switch (intUserId) {
            case this.NPC_USER_IDS.SKAGRY:
                return true;
            case this.NPC_USER_IDS.CONFEDERATION:
                return true;
            default:
                return false;

        }

    };
    this.isNpcAllianceId = function (intAllianceId) {
        if (!intAllianceId) return false;
        if (_.isInteger(intAllianceId)) return false;
 
        switch (intAllianceId) {
            case this.NPC_ALIANCE_IDS.SKAGRY:
                return true;
            case this.NPC_ALIANCE_IDS.CONFEDERATION:
                return true;
            default:
                return false;

        }
    };

    this.NPC_NATIVE_NAMES = {
        SKAGRY: "SKAGRY",
        CONFEDERATION: "CONFEDERATION"
    };
    this.NPC_USER_IDS = {
        SKAGRY: 1,
        CONFEDERATION: 2
    };
    this.NPC_ALIANCE_IDS = {
        SKAGRY: 1,
        CONFEDERATION: 2
    };

    Object.freeze(this.NPC_USER_IDS);
    Object.freeze(this.npcNativeNames);
}]);
