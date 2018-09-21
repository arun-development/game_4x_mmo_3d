Utils.CoreApp.gameApp.service("uploadHelper", ["Upload", "mainHelper", "$timeout", function (Upload, mainHelper, $timeout) {
    //crop http://jsbin.com/qosowa/1/edit?html,js,output
    //https://github.com/CrackerakiUA/ui-cropper/wiki/Options
    //http://codepen.io/Crackeraki/pen/jWgmYB
    //http://jsbin.com/fovovu/1/edit?js,output

    function getProgress(evt, fileUploadModel) {
        var fileName = evt.config.data.file.name;
        if (!fileUploadModel.progreses[fileName]) {
            fileUploadModel.progreses[fileName] = {
                loaded: 0,
                total: 0,
                progress: 0,
                addProgress: function (loaded, total) {
                    this.loaded = loaded;
                    this.total = total;
                    this.progress = 100.0 * evt.loaded / evt.total;
                }
            };
        }
        fileUploadModel.progreses[fileName].addProgress(evt.loaded, evt.total);
        var progress = {
            loaded: 0,
            total: 0,
            progress: 0
        };

        _.forEach(fileUploadModel.progreses, function (proces, key) {
            progress.progress += proces.progress;
            progress.loaded += proces.loaded;
            progress.total += proces.total;
        });
        fileUploadModel.onProgress(evt, progress, fileUploadModel);
    }

    function loadFile(file, fileUploadModel) {
        if (!file.$error) {
            Upload.upload({ url: fileUploadModel.url, data: { file: file } })
                .then(function (resp) {
                    if (fileUploadModel.onResponse instanceof Function) fileUploadModel.onResponse(resp.data, resp);
                }, function (errorResponse) {
                    if (fileUploadModel.onError instanceof Function) {
                        fileUploadModel.onError(errorResponse);
                    }
                }, function (evt) {
                    if (fileUploadModel.onProgress instanceof Function) {
                        getProgress(evt, fileUploadModel);
                    }
                });
        }
    }

    function loadFileGroup(fileUploadModel) {
        if (fileUploadModel.files.length) {
            for (var i = 0; i < fileUploadModel.files.length; i++) loadFile(fileUploadModel.files[i], fileUploadModel);
        }
    }

    this.upload = function (fileUploadModel) {
        if (!fileUploadModel) return;
        if (!fileUploadModel.files) return;
        if (typeof fileUploadModel.files === "object" && typeof fileUploadModel.files.name === "string") loadFile(fileUploadModel.files, fileUploadModel);
        else loadFileGroup(fileUploadModel);
    }

    /**
     * 
     * @param {string} base64File 
     * @param {string} ext 
     * @param {function} request  hub deffered
     * @returns {object} hub deffered 
     */
    this.loadBase64FileByHub = function (base64File, ext, fileUploadModel) {
        if (!fileUploadModel) {
            var m1 = "uploadHelper.loadBase64FileByHub file model not Set in instance arg: fileUploadModel";
            console.log(m1, {
                fileUploadModel: fileUploadModel
            });
            throw new Error(m1);
        }
        if (!fileUploadModel.hasOwnProperty("request") || !(fileUploadModel.request instanceof Function)) {
            var m2 = "uploadHelper.loadBase64FileByHub fileUploadModel.request not Set in instance";
            console.log(m2, {
                fileUploadModel: fileUploadModel
            });
            throw new Error(m2);
        }

        var fileModel = Utils.ModelFactory.Base64ImageOut(base64File, ext);
  
        return fileUploadModel.request(fileModel).then(fileUploadModel.onResponse, fileUploadModel.onError);
    };

    this.getFileUploadModel = function (url, files, request) {
        return {
            files: files || null,
            url: url || "",
            request: request,
            onProgress: null,
            onResponse: null,
            onError: null,
            progreses: {}
        };
    }

    this.setScopeCorpImageModel = function (scope, upload, onCancel) {
        if (!scope.imageSize) {
            scope.imageSize = 260;
        }
        scope.$$uploadInProgess = false;
        scope.file = null;
        scope.corpImg = "";
        scope.corpImgBlob = "";
        scope.corpLocalLoaded = false;
        scope.corpedLocalLoaded = false;
        scope.corpedOnLoadDone = function () {
            scope.corpedLocalLoaded = true;
        };
        scope.upload = function () {
            if (scope.$$uploadInProgess) return;
            scope.$$uploadInProgess = true;
            upload.apply(this, arguments);     
        };
        scope.imageSaved = false;
        scope.$watch("file", function () {
            if (scope.file) {
                Upload.base64DataUrl(scope.file).then(function (dataStringImg) {
                    scope.corpImg = dataStringImg;
                    scope.corpLocalLoaded = true;
                    console.log("setScopeModel.scope.$watch.file.Upload.base64DataUrl", scope);
                });

            }
        });
        scope.$watch('$$childTail.$$childHead.urlBlob', function (newValue, oldValue) {
            if (newValue !== oldValue) scope.corpImgBlob = newValue;
        });
        scope.cancel = function () {
            if (scope.$$uploadInProgess) return;
            mainHelper.applyTimeout(function () {
                scope.corpLocalLoaded = false;
                scope.corpedLocalLoaded = false;
                scope.corpImg = "";
                scope.corpImgBlob = null;

                if (onCancel instanceof Function) onCancel();
                $timeout(function () { 
                    scope.$destroy();
                });
            });  
        }
    }

}]);

