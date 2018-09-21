Utils.CoreApp.gameApp.controller("uploadImageCtrl", ["$scope",
    "$mdDialog",
    "uploadHelper",
function ($scope, $mdDialog, uploadHelper) {
    var $self = this;
    console.log("uploadImageCtrl", {
        _self: $self,
        $scope: $scope
    });
    if (!$self._locals._request || !($self._locals._request instanceof Function)) throw new Error("uploadImageCtrl no requests in instance");
   

    function upload() { 
        if (!$scope.corpedOnLoadDone) return;  
        if (GameServices.planshetService.getInProgress()) return; 
        var model = uploadHelper.getFileUploadModel(null, null, $self._locals._request);
        model.onResponse = function (data) {  
            GameServices.planshetService.setInProgress(false);
            $scope.$$uploadInProgess = false;
            $mdDialog.hide(data);
        };
        model.onError = function (errorAnswer) {  
            GameServices.planshetService.setInProgress(false);
            $scope.$$uploadInProgess = false;
            if ($self._locals._onError) $self._locals._onError(errorAnswer);
            console.log("uploadImageCtrl.upload.onError.errorAnswer", { errorAnswer: errorAnswer });

        }
        if (!$scope.$$childTail.corpedImg) {
            model.onError(ErrorMsg.UploadedImageNotSetInInstance);
            return;
        }
        uploadHelper.loadBase64FileByHub($scope.$$childTail.corpedImg, null, model);
    }  

    if ($self._locals._imageSize) {
        $scope.imageSize = $self._locals._imageSize;
    }
    if ($self._locals._cssDialogContainer) {
        $scope.cssDialogContainer = $self._locals._cssDialogContainer;
    }
    uploadHelper.setScopeCorpImageModel($scope, upload, $mdDialog.cancel);
}]);