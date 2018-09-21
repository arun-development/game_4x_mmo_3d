var SHOW_DEBUG = true;
var TIME_DELAY = 3;

ErrorMsg = {};
ErrorMsg.CustomActionResultErrorView = "CustomActionResultErrorView";
ErrorMsg.NotEquals = "NotEquals";
ErrorMsg.LessMin = "LessMin";
ErrorMsg.NoData = "NoData";
ErrorMsg.IsEmpty = "IsEmpty";
ErrorMsg.HasBeenDeactivated = "HasBeenDeactivated";
ErrorMsg.MaxLimitAwait = "MaxLimitAwait";
 
ErrorMsg.ErrorInUpdateDb = "ErrorInUpdateDb";
ErrorMsg.InputDataIncorrect = "InputDataIncorrect";
ErrorMsg.ChestNotExist = "ChestNotExist";
ErrorMsg.CatalogNotExist = "CatalogNotExist";
ErrorMsg.UploadedImageNotSetInInstance = "UploadedImageNotSetInInstance";

ErrorMsg.TimeDelation = "TimeDelation";
ErrorMsg.NotEnoughCc = "NotEnoughCc";
ErrorMsg.NotEnoughResources = "NotEnoughResources";
ErrorMsg.ProductNotFound = "ProductNotFound";
ErrorMsg.CcCountNotExsist = "CcCountNotExsist";
ErrorMsg.CanNotCreateCcCount = "CanNotCreateCcCount";
ErrorMsg.TransactionCcFailed = "TransactionCcFailed";
ErrorMsg.PremiumActivatedFail = "PremiumActivatedFail";
ErrorMsg.NotAutorized = "NotAutorized";
ErrorMsg.DbError = "DbError";
ErrorMsg.PremiumNotExsist = "PremiumNotExsist";
ErrorMsg.PlanetNotExsist = "PlanetNotExsist";
ErrorMsg.PlanetNameNotExsist = "PlanetNameNotExsist";
ErrorMsg.PlanetNameNotUnic = "PlanetNameNotUnic";
ErrorMsg.TaskNotExist = "TaskNotExist";
ErrorMsg.TaskNotForThisUser = "TaskNotForThisUser";
ErrorMsg.TaskTargetPlanetNotExist = "TaskTargetPlanetNotExist";
ErrorMsg.BuildUpgradeTimeNotOver = "BuildUpgradeTimeNotOverr";
ErrorMsg.PremiumPriceNotSet = "PremiumPriceNotSet";
ErrorMsg.PremiumDurationNotSet = "PremiumDurationNotSet";
ErrorMsg.UnitNameNotExist = "UnitNameNotExist";
ErrorMsg.PlanetChangeOwner = "PlanetChangeOwner";
ErrorMsg.PlanetNotSetInInstance = "PlanetNotSetInInstance";
ErrorMsg.UserIdNotSetInInstance = "UserIdNotSetInInstance";
ErrorMsg.UserResourceNotSetInInstance = "UserResourceNotSetInInstance";
ErrorMsg.TargetOwnerIsYou = "TargetOwnerIsYou";
ErrorMsg.TargetUserIsYou = "TargetUserIsYou";
ErrorMsg.ProportionNotSetInModel = "ProportionNotSetInModel";
ErrorMsg.ServerTimeIsWrong = "ServerTimeIsWrong";
ErrorMsg.ResourceNameIsWrong = "ResourceNameIsWrong";
ErrorMsg.TargetResourceIsFull = "TargetResourceIsFull";
ErrorMsg.MathError = "MathError";
ErrorMsg.DataIsOldRepeatRequest = "DataIsOldRepeatRequest";
ErrorMsg.TimeNotEnd = "TimeNotEnd";
ErrorMsg.JumpMotherInProgress = "JumpMotherInProgress";
ErrorMsg.JupmMotherIsCurrentSystem = "JupmMotherIsCurrentSystem";
ErrorMsg.TaskCompleted = "TaskCompleted";
ErrorMsg.OverMaxLength = "OverMaxLength";
ErrorMsg.SystemIdNotSet = "SystemIdNotSet";
ErrorMsg.AllianceNotExist = "AllianceNotExist";
ErrorMsg.AllianceUserNotExist = "AllianceUserNotExist";
ErrorMsg.NotPermitted = "NotPermitted";
ErrorMsg.YouAreBlockedInThisChannel = "YouAreBlockedInThisChannel";
ErrorMsg.YouCantLeftNpcAlliance = "YouCantLeftNpcAlliance";
ErrorMsg.AllianceActionInBlockedState = "AllianceActionInBlockedState";
ErrorMsg.AllianceNameNotValid = "AllianceNameNotValid";
ErrorMsg.AllianceNameNotUnic = "AllianceNameNotUnic";
ErrorMsg.YouInAlliance = "YouInAlliance";
ErrorMsg.UserInAlliance = "UserInAlliance";
ErrorMsg.AllianceRoleNotChanged = "AllianceRoleNotChanged";
ErrorMsg.IsNotCurrentUser = "IsNotCurrentUser";
ErrorMsg.UserNotHasHubGroup = "UserNotHasHubGroup";
ErrorMsg.UserNameNotExsist = "UserNameNotExsist";
ErrorMsg.UserConnectionNotUnic = "UserConnectionNotUnic";
ErrorMsg.PasswordIncorrect = "PasswordIncorrect";
ErrorMsg.ChannelNotExist = "ChannelNotExist";
ErrorMsg.BookMarkLimitDone = "BookMarkLimitDone";
ErrorMsg.BookmarkIsExist = "BookmarkIsExist";
ErrorMsg.NotUsedServerMethod = "NotUsedServerMethod";
ErrorMsg.Deprecated = "Deprecated";
ErrorMsg.ChannelNameNotValid = "ChannelNameNotValid";
ErrorMsg.InvalidFormat = "InvalidFormat";
ErrorMsg.IsEqual = "IsEqual";
ErrorMsg.ChannelNotDeleted = "ChannelNotDeleted";
ErrorMsg.PasswordNotUpdated = "PasswordNotUpdated";
ErrorMsg.MaxChannelsLimit = "MaxChannelsLimit";
ErrorMsg.Locked = "Locked";
ErrorMsg.Canceled = "Canceled";
//vote
ErrorMsg.CantRegisterCandidatNotEnoughPvP = "CantRegisterCandidatNotEnoughPvP";
ErrorMsg.CantRegisterCandidatAlreadyExist = "CantRegisterCandidatAlreadyExist";
ErrorMsg.TimeVotingIsOver = "TimeVotingIsOver";
ErrorMsg.TimeVotingIsNotOver = "TimeVotingIsNotOver";  
ErrorMsg.IsNotVotePeriod = "IsNotVotePeriod";          
ErrorMsg.UserHasAlreadyCastVote = "UserHasAlreadyCastVote";
ErrorMsg.OfficerIsAlreadyExist = "OfficerIsAlreadyExist";
ErrorMsg.VotingRunnerVoteIsStartedBefore = "VotingRunnerVoteIsStartedBefore";
ErrorMsg.VotingRunnerVoteIsFinishedBefore = "VotingRunnerVoteIsFinishedBefore";
ErrorMsg.VotingRunnerStartedNotRunned = "VotingRunnerStartedNotRunned";
ErrorMsg.VotingRunnerEndedNotFinished = "VotingRunnerEndedNotFinished";
ErrorMsg.VotingRunnerStartedErrorInRun = "VotingRunnerStartedErrorInRun";
ErrorMsg.VotingRunnerEndedErrorInFinished = "VotingRunnerEndedErrorInFinished"; 
ErrorMsg.VotingRunnerStartInProgress = "VotingRunnerStartInProgress";
ErrorMsg.VotingRunnerEndInProgress = "VotingRunnerEndInProgress";
ErrorMsg.VotingRunnerTryErrorMaxLimit = "VotingRunnerTryErrorMaxLimit";

//tech
ErrorMsg.TechDisabled = "TechDisabled";
ErrorMsg.TechInProgress = "TechInProgress";
Object.freeze(ErrorMsg);
                               
function Errors(params) {
    var _params = params;

    var _detailErrors = true;
    var _detailErrorList = {};
    var _simpleErrorList = {};

    function execute() {
        if (null == params) return false;
        function setTypedError(errorDic) {
            _.forEach(errorDic, function (value, errKey) {
                if (_params === errKey) {
                    errorDic[errKey]();
                }
            });
        }
        // uchitivaet imia kontrollera
        if (_detailErrors) setTypedError(_detailErrorList);
            // ne uchitivaet imia kontrollera
        else setTypedError(_simpleErrorList);

        // ReSharper disable once NotAllPathsReturnValue
    };

    function showError(message) {
        $("#payment_form_information").find(".error").css("display", "block");
        $("#payment_form_information_error").css("display", "block").text(message);
    }

    function dataNotFound() {
        alert("dataNotFound");
    }

    function productItemNotFound() {
        console.log("Errors object, productItemNotFound");

        return "productItemNotFound";
    }

    function storeNotFound() {
        console.log("Errors object, storeNotFound");

        return "storeNotFound";
    }

    function serverError() {
        console.log("Errors object, serverError");

        return "serverError";
    }

    function buyTransactionSgFailed(errMessage) {
        showError(errMessage);
    }

    function timeDelation() {
        console.log("Errors object, timeDelation");

        return "timeDelation";
    }

    this.error = function () {
        execute();
    };

    _detailErrorList = {
        "ProductItem - data not found": productItemNotFound,
        "Store - data not found": storeNotFound,
        "Store - Server error": serverError,
        "Store - Timing delation": timeDelation,

        "Buy -Transaction Sg Failed": buyTransactionSgFailed,
        "Buy - Server error": serverError,
        "Buy - Timing delation": timeDelation,
        "Timing delation": timeDelation
    };

    _simpleErrorList = {
        "data not found": dataNotFound,
        "Server error": serverError,
        "Timing delation": timeDelation
    };






}

Errors.GetMessage = function (err) {
    if (err && err.hasOwnProperty("responseJSON")
        && err.responseJSON.hasOwnProperty("exceptionMessage") &&
        err.responseJSON.exceptionMessage) {
        return err.responseJSON.exceptionMessage;
    }
    return "";
};
Errors.$defaultErrorResponce = function (errorAnswer) {
    var msg = Errors.GetMessage(errorAnswer);
    console.log("errorAnswer", {
        errorAnswer: errorAnswer,
        msg: msg
    });
}

Errors.GetHubMessage = function (err) {
    var msg = "";
    if (err && err.hasOwnProperty("message")) {
        msg = err.message;
    } else if (typeof err === "string") {
        msg = err;
    }

    return msg;

    //if (err && err.hasOwnProperty("responseJSON") && err.responseJSON.hasOwnProperty("exceptionMessage") && err.responseJSON.exceptionMessage) {
    //    return err.responseJSON.exceptionMessage;
    //}
    return "";
};
Errors.Exception = function (exceptionTypeName, data, innerMessage, innerException) {
    var ex = {
        ExceptionData:data,
        ExceptionType:exceptionTypeName||"Exception",
        InnerMessage:innerMessage,
        InnerException:innerException  
    };
    Utils.Console.Error(ex.InnerMessage, ex);
    return ex;
};
Errors.ClientNotImplementedException = function (data, innerMessage, innerException) {
    Errors.Exception("ClientNotImplementedException", data, innerMessage, innerException);
};

/**
 * 
 * @param {} data 
 * @param {} argumentName 
 * @param {} source 
 * @param {} innerMessage 
 * @param {} innerException 
 * @returns {} 
 */
Errors.ClientNullReferenceException = function (data, argumentName, source, innerMessage, innerException) {
    return Errors.Exception("ClientNullReferenceException", {
        data: data,
        argumentName: argumentName,
        source: source
    }, innerMessage || "is required", innerException);
};
Errors.ClientTypeErrorException = function (data, argEx, targetType, source, innerMessage) {
    return Errors.Exception("ClientTypeErrorException", {
        data: data,
        argType: typeof argEx,
        argConstructorName: argEx ? argEx.constructor.name : "",
        targetType: targetType,
        source: source
    }, innerMessage || "is required", innerMessage);
};
Errors.ClientDeprecatedException = function (data, innerMessage, innerException) {
    return Errors.Exception("ClientDeprecatedException", data, innerMessage, innerException);
};
Errors.ClientNotEqualException = function (data, innerMessage, innerException) {
    return Errors.Exception("ClientNotEqualException", data, innerMessage, innerException);
};
Errors.ClientInvalidDataException = function (data, source, argName, innerMessage, innerException) {
    return Errors.Exception("InvalidDataException", {
        data: data,
        source: source,
        argName: argName
    }, innerMessage, innerException);
};

 


