Utils.CoreApp.gameApp.directive("profileSection", ["profileService", "allianceService","maxLenghtConsts","baseDialogHelper", "mainHelper" ,
    function (profileService, allianceService, maxLenghtConsts, baseDialogHelper, mainHelper) {
        var template = "<div>" +
                             "<h2 class=profile-head><span ng-bind=dataTitle><span/></h2>" +
                             "<div class=profile-section-body ng-include=bodyTemplate></div>" +
                        "</div>";
        var lang = _.upperFirst(LANG.toLowerCase());

        var profileTypes = {
            info: "info",
            aliance: "aliance",
            achievement: "achievement",
            chest: "chest"
        };


        //var editor = new MediumEditor('.editable');
        //editor.subscribe('editableInput', function (event, editable) {
        //    // Do some work
        //});
        //console.log("editor", editor);
        function errorOverMaxLength($event, currentMessageLenght) {
            return baseDialogHelper.errorOverMaxLength($event, currentMessageLenght, maxLenghtConsts.PersonalInfoDescription);
        }



        function setAlianceModel(scope, model) {
            allianceService.setAllianceStatsModelInScope(scope, model, true);
            scope.description = {};
            if (!model.AllianceDescription) model.AllianceDescription = "";
            scope.description.text = allianceService.getAllianceItemDescription(model.AllianceDescription);
            //    console.log("setAlianceModel", { scope: scope, model: model });
        }

        function broadCastMe(scope, mediumBindOptions, disableEditing) {
            mediumBindOptions.disableEditing = disableEditing;
            if (disableEditing) mediumBindOptions.toolbar = false;
                //else mediumBindOptions.toolbar = { buttons: ["removeFormat", "bold", "italic", "underline", "h1", "h2", "h3"] };
            else mediumBindOptions.toolbar = {
                buttons: ["bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "subscript",
                    "superscript",
                    "anchor",
                    "image",
                    "quote",
                    "pre",
                    "orderedlist",
                    "unorderedlist",
                    "indent",
                    "outdent",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "removeFormat",
                    "html"
                ]
            };
            scope.$broadcast("mediumEditor:update-option", mediumBindOptions);
        }

        function setUserInfoModel(scope, model) {
            //  console.log("setUserInfoModel", model);
            profileService.setUserInfoProfileModelInScope(scope, model);

            scope.description = {};
            if (typeof model.PersonalDescription !== "string") model.PersonalDescription = "";

            scope.description.text = model.PersonalDescription;

            scope.description.activateEdit = false;
            scope.description.setActivate = function (avtivate) {
                scope.description.activateEdit = avtivate;
                scope.description.mediumBindOptions.disableEditing = !avtivate;
                broadCastMe(scope, scope.description.mediumBindOptions, scope.description.mediumBindOptions.disableEditing);

            }
            scope.description.mediumBindOptions = {
                toolbar: false,
                disableEditing: true,
                placeholder: false
            }

            if (model.IsCurrentUser) {
                scope.description.resetDescription = function () {
                    EM.Audio.GameSounds.defaultButtonClose.play(); 
                    mainHelper.applyTimeout(function () {
                        scope.description.text = model.PersonalDescription;
                        scope.description.setActivate(false);
                    });

                };
                scope.description.sendDescription = function (params, element, attrs, $scope, $event) {
         
                    console.log("scope.description.sendDescription", {
                        params: params,
                        element: element,
                        attrs: attrs,
                        $scope: $scope,
                        $event: $event,
                    });
                    if (GameServices.planshetService.getInProgress()) return;
                    var hasChange = typeof scope.description.text === "string" && model.PersonalDescription !== scope.description.text;
                    if (hasChange) {
                        if (scope.description.text.length <= maxLenghtConsts.PersonalInfoDescription) {
                            profileService.rquestUpdateUserDescription(model, scope.description.text, function (oldText, errorMsg,errorAnswer) {
                                scope.description.text = oldText;
                                broadCastMe(scope, scope.description.mediumBindOptions, false);
                                if (errorMsg === ErrorMsg.OverMaxLength) {
                                    errorOverMaxLength($event, scope.description.text.length);  
                                }
                   
                            });
                        }
                        else {
                            errorOverMaxLength($event, scope.description.text.length);  
                        }
     
                    }
                    scope.description.setActivate(false);
                    EM.Audio.GameSounds.defaultButtonClose.play(); 
                }

                model.Buttons.edit.Method = function () {
                    if (GameServices.planshetService.getInProgress()) return;   
                    EM.Audio.GameSounds.defaultButtonClick.play();
                    mainHelper.applyTimeout(function () {
                        scope.description.setActivate(true);
                        broadCastMe(scope, scope.description.mediumBindOptions, false);
                    });
                   
                };
                model.Buttons.send.Method = scope.description.sendDescription;
                model.Buttons.cancel.Method = scope.description.resetDescription;
            }



        }

        function setAdvancedData(scope, model, profileType) {
            if (profileType === profileTypes.info) {
                setUserInfoModel(scope, model);

            } else if (profileType === profileTypes.aliance) {
                setAlianceModel(scope, model);
                scope.$on("$destroy", function () {
                    scope.allianceStatsModel = null;
                    scope.description = null;
                    delete scope.allianceStatsModel;
                    delete scope.description;
                });
            } else if (profileType === profileTypes.achievement) {
            } else if (profileType === profileTypes.chest) { }
        }


        function setScopeModel(scope, method, profileType) {
            var model = profileService[method]();
            setAdvancedData(scope, model, profileType);

            scope.dataTitle = (model.hasOwnProperty("Title") && model.Title) ? model.Title[lang] : "create title model";
            scope.bodyData = model;
            scope.bodyTemplate = model.Template;
        }


        function link($scope, element, attrs, ctrl) {
            setScopeModel($scope, attrs.method, attrs.type);
            $scope.$on("planshet:update", function (e) {
                setScopeModel($scope, attrs.method, attrs.type);
            });

            if (attrs.type === profileTypes.info) {
                $scope.$on("user:avatar-updated", function (e) {
                    setScopeModel($scope, attrs.method, attrs.type);
                });
            }
            if (attrs.type === profileTypes.aliance) {
                $scope.$on("alliance:label-updated", function (e) {
                    setScopeModel($scope, attrs.method, attrs.type);
                });
            }
        }

        return {
            restrict: "E",
            template: template,
            replace: true,
            link: link,
            scope: {}
        };
    }
]);

