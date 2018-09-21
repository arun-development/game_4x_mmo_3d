Utils.CoreApp.gameApp.service("profileService", [
    "mainHelper", "planshetService", "timerHelper", "statisticHelper", "$filter", "translateService", "$q", "gameChestService",
    function (mainHelper, planshetService, timerHelper, statisticHelper, $filter, translateService, $q, gameChestService) {
        var $self = this;
        var prefixApi = "/api/";
        var ctrl = "UserProfile/";
        var profileBodyPrfix = "user_profile_";

        var actionNames = {
            GetProfile: "GetProfile",
            UpdateUserDescription: "UpdateUserDescription",
            GetCurrentUserProfile: "GetCurrentUserProfile"
        };

        // не путать с куррент
        var activeProfileModel;

        var currentUserModelId;
        var currentUserId;
        var currentUserName;

        //#region Helpers

        var lastUserPlanetNames = [];
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });


        function isCurrentModel(uniqueId) {
            if (activeProfileModel && activeProfileModel.UniqueId === uniqueId) return planshetService.isCurrentModel(uniqueId);
            return false;
        }

        function getUrl(actionName) {
            return prefixApi + ctrl + actionName + "/";
        }

        function reqParams() {
            return planshetService.reqParams();
        }

        function request(url, uniqueId, onSuccess, data, onError, ignore, notChangeState, notCache, cacheTime) {
            //console.log("profileService.request", {
            //    url: url,
            //    uniqueId: uniqueId,
            //    onSuccess: onSuccess,
            //    data: data,
            //    onError: onError,
            //    ignore: ignore,
            //    notChangeState: notChangeState,
            //    notCache: notCache,
            //    cacheTime: cacheTime,
            //});
            var params = reqParams();
            params.data = data;
            params.url = url;
            params.onSuccess = onSuccess;
            if (onError && onError instanceof Function) params.onError = onError;
            planshetService.requestHelper(params, uniqueId, ignore, notChangeState, ((typeof cacheTime === "boolean") ? cacheTime : Utils.Time.TIME_CACHE_PROFILE), notCache);
        }

        function getUniqueIdByUserId(userId) {
            return profileBodyPrfix + userId;
        }

        function getData() {
            if (!activeProfileModel) return null;
            return activeProfileModel.Bodys[0].TemplateData;
        }

        function isCurrentModelByUserId(userId) {
            var bId = getUniqueIdByUserId(userId);
            return isCurrentModel(bId);
        }

        function isCurrentModelByUserName(userName) {
            var data = getData();
            if (data && data.Info.Name === userName) return isCurrentModel(getUniqueIdByUserId(data.UserId));
            return false;
        }

        function isCurrentModelByDynamic(userIdOrName) {
            if (typeof userIdOrName === "number") return isCurrentModelByUserId(userIdOrName);
            else if (typeof userIdOrName === "string") return isCurrentModelByUserName(userIdOrName);
            else {
                console.log("userNotSet");
                return false;
            }
        }

        function getModelByUniqueId(uniqueId) {
            return planshetService.getItemById(uniqueId);
        }

        function findPlanshetModel(userIdOrName, planshetModels) {
            if (typeof userIdOrName === "number") {
                var uniqueId = getUniqueIdByUserId(userIdOrName);
                var q = _.find(planshetModels, function (o) {
                    return o.UniqueId === uniqueId;
                });
                //console.log("q", q);
                return q;
            } else if (typeof userIdOrName === "string") {
                return _.find(planshetModels, function (o) {
                    if (o.Bodys && o.Bodys[0] && o.Bodys[0].hasOwnProperty("TemplateData")
                        && o.Bodys[0].TemplateData
                        && o.Bodys[0].TemplateData.hasOwnProperty("Info")
                        && o.Bodys[0].TemplateData.Info.hasOwnProperty("Name")) {
                        if (userIdOrName === o.Bodys[0].TemplateData.Info.Name) {
                            var uId = o.Bodys[0].TemplateData.UserId;
                            if (o.UniqueId === getUniqueIdByUserId(uId)) return true;
                        }
                    }
                    return false;
                });
            } else {
                //console.log("userNotSet");
                return null;
            }

        }  

        function updatePlanshet(setActiveProfile, planshetModel, afterSetPlanshet, updateCacheTime) {
            if (!isCurrentModel(planshetModel.UniqueId)) {
                planshetService.updatePlanshetItemData(planshetModel, updateCacheTime);
                if (setActiveProfile) planshetService.setCurrentModel(planshetModel.UniqueId);
                activeProfileModel = planshetService.getItemById(planshetModel.UniqueId);
            }

            function afterSet() {
                if (afterSetPlanshet instanceof Function) afterSetPlanshet();
            }
            planshetService.updatePlanshet(afterSet, planshetModel.UniqueId, setActiveProfile);
        }


        function setNewProfile(userProfile, isCurrentUser, notSetPlanshet, updateCacheTime) {
            function openPlanshet() {
                planshetService.toggle(userProfile.UniqueId);
            }
            if (isCurrentUser) {
                currentUserModelId = userProfile.UniqueId;
                currentUserId = userProfile.Bodys[0].TemplateData.UserId;
                currentUserName = userProfile.Bodys[0].TemplateData.Info.Name;
 
         
                var deferred = $q.defer();
                deferred.promise.then(function (chestData) {
                    var pm = gameChestService.$getPremiumModelByChestData(chestData);
                    var hasPremium = gameChestService.$hasPremium(pm);
                    if (hasPremium) {
                        userProfile.Bodys[0].TemplateData.Info.HasPremium = hasPremium;
                        userProfile.Bodys[0].TemplateData.Info.PremiumEndTime = gameChestService.$getPremiumEndTime(pm);
                    }
                    userProfile.Bodys[0].TemplateData.Chest.Chest = chestData;
                    updatePlanshet(!notSetPlanshet, userProfile, openPlanshet);
                }, function (errorAnswer) {
                    console.log("setNewProfile", { errorAnswer: errorAnswer });
                });

                var _chestData = gameChestService.getUserChestData();
                if (_chestData) {
                    deferred.resolve(_chestData);
                }
                else {
                    deferred.reject();
                } 
                //serUserChest and premium
            } else updatePlanshet(true, userProfile, openPlanshet, updateCacheTime);

        }

        function checkIsCurrentUserByModelId(userModelUniqueId) {
            return currentUserModelId === userModelUniqueId;
        }

        function checkIsCurrentUser(userIdOrName) {
            if (typeof userIdOrName === "number") return userIdOrName === currentUserId;
            if (typeof userIdOrName === "string") return userIdOrName === currentUserName;
            return false;
        }

        function _getTemplatDataByPlanshetModel(planshetModel) {
            if (planshetModel && planshetModel.Bodys && planshetModel.Bodys[0]
                && planshetModel.Bodys[0].TemplateData) {
                return planshetModel.Bodys[0].TemplateData;
            }
            return null;
        }

        this.checkIsCurrentUser = checkIsCurrentUser;

        //#endregion

        //#region getDataFromProfileModel
        function getDataByModel(planshetProfileModel) {
            if (!planshetProfileModel) return null;
            return planshetProfileModel.Bodys[0].TemplateData;
        }
        function getPersonalInfoByModel(planshetProfileModel) {
            var data = getDataByModel(planshetProfileModel);
            if (data) return data.Info;
            return null;
        }

        function getAllianceByModel(planshetProfileModel) {
            var data = getDataByModel(planshetProfileModel);
            if (data) return data.Alliance;
            return null;
        }

        function getAchievementsByModel(planshetProfileModel) {
            var data = getDataByModel(planshetProfileModel);
            if (data) return data.Achievements;
            return null;
        }

        function getAvatarByModel(planshetProfileModel) {
            var data = getPersonalInfoByModel(planshetProfileModel);
            if (data) return data.Avatar;
            return null;
        }



        //#endregion

        //#region CurrentModelOnly
        function getPersonalInfo() {
            var data = getData();
            if (data) return data.Info;
            return null;
        }

        function getAlliance() {
            var data = getData();
            if (data) {
                //  data.Alliance._profileUserName = data.Info.Name;
                return data.Alliance;
            }
            return null;
        }

        function getAchievements() {
            var data = getData();
            if (data) return data.Achievements;
            return null;
        }


        function getChest() {
            var data = getData();
            if (data && checkIsCurrentUserByModelId(activeProfileModel.UniqueId)) return data.Chest;
            return null;
        }
        function hasCheset() {
            return false;
            if (checkIsCurrentUserByModelId(activeProfileModel.UniqueId)) {
                return !!getChest();
            }
            return false;
        }

        function getPremiumStatus() {
            var data = getPersonalInfo();
            if (data) {
                data.HasPremium = gameChestService.$hasPremium();    
                return data.HasPremium;
            }
            return null;
        }

        function setInitDataCurrentUser(profile, notSetPlanshet) {
            //   console.log("setInitDataCurrentUser", profile);
            timerHelper.timeDelay.UpdateTimer(profile.UniqueId, Utils.Time.TIME_CACHE_PROFILE);
            setNewProfile(profile, true, notSetPlanshet, true);

        }

        this.getPersonalInfo = getPersonalInfo;
        this.getAlliance = getAlliance;
        this.getAchievements = getAchievements;
        this.getChest = getChest;
        this.hasCheset = hasCheset;
        this.getPremiumStatus = getPremiumStatus;

        this.setInitDataCurrentUser = setInitDataCurrentUser;
        this.getActiveUserName = function () {
            var data = getPersonalInfo();
            if (data) return data.Name;
            return null;
        };

        //#endregion

        //#region Other
        function getCurrentUserInfo() {
            return getPersonalInfoByModel(getModelByUniqueId(currentUserModelId));
        }


        function getProfile(userIdOrName) {
            if (checkIsCurrentUser(userIdOrName)) return getModelByUniqueId(currentUserModelId);
            var localData = isCurrentModelByDynamic(userIdOrName);
            if (localData) return activeProfileModel;

            localData = findPlanshetModel(userIdOrName, planshetService.getPlanshetModels());
            console.log("getProfile", {
                localData: localData,
                isCurrentModelByDynamic: isCurrentModelByDynamic(userIdOrName),
                userIdOrName: userIdOrName
            });
            //   console.log("getProfile.isCurrentModelByDynamic", localData);
            if (localData) return localData;

            return null;
        }

        function requestGetProfile(userIdOrName, onSetProfile, updateCacheTime, isCurrentUser, _ignoreLocal,_onError) {
            var isName;
            if (typeof userIdOrName === "string") isName = true;
            else if (typeof userIdOrName === "number") isName = false;
            else throw new Error("argument userIdOrName is wrong");

            var uId = null;
 

            var _isCurrentUser = isCurrentUser || checkIsCurrentUser(userIdOrName);
            if (_isCurrentUser) {
                uId = currentUserModelId;
            }
            else {
                var profile = getProfile(userIdOrName);
                if (profile) uId = profile.UniqueId;
            }


            var opts = planshetService.IHubRequestOptions(function () {
                if (isName) return $self.$hub.personalInfoGetProfileByUserName(userIdOrName);
                else return $self.$hub.personalInfoGetProfileByUserId(userIdOrName);
            }, uId);
            opts.OnSuccsess = function (answer) {
                if (onSetProfile instanceof Function) onSetProfile(answer);
            };
            opts.OnError = function (errorAnswer) { 
                var msg = typeof errorAnswer === "string" ? errorAnswer : Errors.GetHubMessage(errorAnswer);
                if(_onError) _onError(errorAnswer,msg);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg,
                    opts: opts
                }, "profileService.requestGetProfile");
            };

            opts.TryGetLocal =_ignoreLocal?false: true;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = updateCacheTime;
            opts.CacheTime = Utils.Time.TIME_CACHE_PROFILE;

            planshetService.planshetHubRequest(opts);
            //   request(getUrl(actionNames.GetProfile), uId, onSuccess, data, null, ignore, notChangeState);
            //     hubRequestDelegate, onSuccsess, onError, uniqueId, tryGetLocal, setToCurrent, updateCacheTime, cacheTime) {
        }

        function setProfile(userIdOrName, updateCacheTime, isCurrentUser) {
            var _isCurrentUser = isCurrentUser || checkIsCurrentUser(userIdOrName);
            if (_isCurrentUser) {
                var alliance = getAllianceByModel(getModelByUniqueId(currentUserModelId));
                if (!alliance) throw Errors.ClientNullReferenceException({ alliance: alliance, currentUserModelId: currentUserModelId }, "alliance", "profileService.setCurrentUserProfile");
                var oldAlliance = _.cloneDeep(alliance);
                //console.log("setProfile.oldAlliance", { oldAlliance: oldAlliance });
                requestGetProfile(userIdOrName, function (answer) {
                    var data = getDataByModel(answer); 
                    if (!data.Alliance) data.Alliance = oldAlliance;
                    setNewProfile(answer, _isCurrentUser, updateCacheTime);
                }, null, _isCurrentUser);

            }
            else {
                requestGetProfile(userIdOrName, function (answer) {
                    setNewProfile(answer, _isCurrentUser, updateCacheTime);
                }, null, _isCurrentUser);
            }
        }

        function setCurrentUserProfile() {
            setProfile(currentUserId, null, null, true);
        }
        function getCurrentUserAvatar() {
            return getAvatarByModel(getModelByUniqueId(currentUserModelId));
        }

        function rquestUpdateUserDescription(model, newText, onError) {
            if (GameServices.planshetService.getInProgress()) return;
            var oldText = model.PersonalDescription;
            planshetService.setInProgress(true);
            $self.$hub
                .personalInfoUpdateUserDescription(newText)
                .finally(function () {
                    planshetService.setInProgress(false);
                })
                .then(function (answer) {
                    console.log("answer", answer);
                    model.PersonalDescription = answer;
                }, function (errorAnswer) {
                    onError(oldText, Errors.GetHubMessage(errorAnswer), errorAnswer);
                });

        }


        function updateLocalUserAvatar(newAvatar) {
            var user = getCurrentUserInfo();
            mainHelper.applyTimeout(function () {
                user.Avatar = newAvatar;
            });
        }

        function requestUpdateCurrentUserProfile() {
            var deferred = $q.defer();
            requestGetProfile(currentUserId, deferred.resolve, true, true, true, deferred.reject);        
            deferred.promise.then(function(answer) {
                console.log("requestUpdateCurrentUserProfile", answer);
                if(answer) setInitDataCurrentUser(answer, true);
            });
        }

        function _updateAllianceInfo(newAllianceData, profileUniqueId) {
            var activeProfileUniqueId = activeProfileModel.UniqueId;
            var planshetModel = getModelByUniqueId(profileUniqueId);
            var oldAlliance = getAllianceByModel(planshetModel);
            if (oldAlliance) {
                GameServices.allianceService._updateAllianceInfo(oldAlliance, newAllianceData, true);
                if (planshetModel.UniqueId === activeProfileUniqueId) activeProfileModel = planshetModel;
                updatePlanshet(false, planshetModel);
            }

        }

        function updateAllianceInfoInCurrentUserProfile(newAllianceUserData) {
            //todo update on alliance change
            if (newAllianceUserData
                && newAllianceUserData.AllianceMembers
                && newAllianceUserData.AllianceMembers.Members) {
                var curAlUser = _.find(newAllianceUserData.AllianceMembers.Members, function (o) {
                    return o.UserId === currentUserId;
                });
                if (curAlUser) {
                    _updateAllianceInfo(newAllianceUserData, currentUserModelId);
                }
            }


        }

        function _setToCurrentProfileIfOtherOpen() {
            var cId = planshetService.getCurrentUniqueId();
            if (_.startsWith(cId, profileBodyPrfix) && cId !== currentUserModelId) setCurrentUserProfile();
        }

        function _getProfileIdsByAllianceId(allianceId) {
            var models = planshetService.getPlanshetModels();
            var ids = [];
            if (!models) return ids;
            _.filter(models, function (o) {
                if (_.startsWith(o.UniqueId, profileBodyPrfix)) {
                    if (o.Bodys
                        && o.Bodys[0]
                        && o.Bodys[0].hasOwnProperty("TemplateData")
                        && o.Bodys[0].TemplateData
                        && o.Bodys[0].TemplateData.hasOwnProperty("Alliance")
                        && o.Bodys[0].TemplateData.Alliance.hasOwnProperty("Id")
                        && o.Bodys[0].TemplateData.Alliance.Id === allianceId) {
                        ids.push(o.UniqueId);
                        return true;
                    }
                }
                return false;
            });
            return ids;
        }


        function removeProfilesByAllianceId(allianceId) {
            _setToCurrentProfileIfOtherOpen();
            _.remove(planshetService.getPlanshetModels(), function (o) {
                if (_.startsWith(o.UniqueId, profileBodyPrfix)) {
                    if (o.Bodys
                        && o.Bodys[0]
                        && o.Bodys[0].hasOwnProperty("TemplateData")
                        && o.Bodys[0].TemplateData
                        && o.Bodys[0].TemplateData.hasOwnProperty("Alliance")
                        && o.Bodys[0].TemplateData.Alliance.hasOwnProperty("Id")
                        && o.Bodys[0].TemplateData.Alliance.Id === allianceId) {
                        return true;
                    }
                }
                return false;

            });
        }

        function removeOtherProfileByUserId(userId) {
            if (userId !== currentUserId) {
                _setToCurrentProfileIfOtherOpen();
                var removeId = getUniqueIdByUserId(userId);
                _.remove(planshetService.getPlanshetModels(), function (o) {
                    return o.UniqueId === removeId;
                });
                var cId = planshetService.getCurrentUniqueId();
                if (_.startsWith(cId, profileBodyPrfix) && cId !== currentUserModelId) setCurrentUserProfile();
            }
        }

        this.getCurrentUserInfo = getCurrentUserInfo;
        this.setNewProfile = setNewProfile;
        this.setProfile = setProfile;
        this.setCurrentUserProfile = setCurrentUserProfile;
        this.getCurrentUserAvatar = getCurrentUserAvatar;
        this.rquestUpdateUserDescription = rquestUpdateUserDescription;
        this.updateLocalUserAvatar = updateLocalUserAvatar;
        this.requestUpdateCurrentUserProfile = requestUpdateCurrentUserProfile;
        this.updateAllianceInfoInCurrentUserProfile = updateAllianceInfoInCurrentUserProfile;
        this.removeProfilesByAllianceId = removeProfilesByAllianceId;
        this.removeOtherProfileByUserId = removeOtherProfileByUserId;
        this.getCurrentUserName = function () {
            return _.clone(currentUserName);
        }
        this.getCurrentUserId = function () {
            return _.clone(currentUserId);
        }

        this.updateAllianceInfoInProfiles = function (newAllianceData) {
            if (!newAllianceData || !newAllianceData.Id) return;
            var ids = _getProfileIdsByAllianceId(newAllianceData.Id);
            _.forEach(ids, function (uniqueId, idx) {
                _updateAllianceInfo(newAllianceData, uniqueId);
            });


        }



        //#endregion

        //#region SetProfileStats 


        this.setUserInfoProfileModelInScope = function (scope, userProfileInfoModel) {
            var commonTranslate = translateService.getCommon();
            var mapTranslate = translateService.getMapInfo();
            var allianceTranslate = translateService.getAlliance();
            var stats = [
                statisticHelper.createStatItemModel(commonTranslate.name, userProfileInfoModel.Name, null, null, " unique-name "),
                statisticHelper.createStatItemModel(allianceTranslate.pvpPoint, userProfileInfoModel.PvpPoint),
                statisticHelper.createStatItemModel(commonTranslate.topPosition, userProfileInfoModel.TopPosition),
                statisticHelper.createStatItemModel(mapTranslate.planets, userProfileInfoModel.Planets),
                statisticHelper.createStatItemModel(commonTranslate.wins, userProfileInfoModel.Wins),
                statisticHelper.createStatItemModel(commonTranslate.losses, userProfileInfoModel.Loses)
            ];
            var bgImage = statisticHelper.createBgImage("", userProfileInfoModel.Name);
            bgImage.url = userProfileInfoModel.Avatar.Detail;
            bgImage.style = { backgroundImage: Utils.CssHelper.SetUrl(bgImage.url) };
            statisticHelper.resizePictire(bgImage.style, bgImage.url);

            if (userProfileInfoModel.IsCurrentUser) {
                var active = "active";
                var inactive = "inactive";
                var pVal = userProfileInfoModel.HasPremium ? active : inactive;
                stats.push(statisticHelper.createStatItemModel("Premium", pVal));
                bgImage.setTemplate("profile-change-avatar.tmpl");
                if (userProfileInfoModel.PremiumEndTime) {
                    stats.push(statisticHelper.createStatItemModel("Premium End (UTC)", $filter("date")(new Date(userProfileInfoModel.PremiumEndTime), "dd.MM.yyyy")));
                }

            }

            scope.profileInfoStatsModel = statisticHelper.createStatisticModel(stats, bgImage);
        };
        //#region setClickToUser
        this.setOnClickToUser = function (statItemModel, userName) {
            statItemModel.advancedCssVal += " active ";
            statItemModel.hasOnclick = true;
            statItemModel.onClick = function () {
                setProfile(userName);
            };
        };
        //#endregion

        //todo  проверить
        this.onUserUpdateAvatar = function (newAvatar, userId, allianceId) {
            var uId = getUniqueIdByUserId(userId);
            var data = getModelByUniqueId(uId);
            if (data) {
                var tmplData = _getTemplatDataByPlanshetModel(data);
                if (tmplData) tmplData.Info.Avatar = newAvatar;
                if (isCurrentModel(uId)) updatePlanshet(false, data);
            }
        }

    }
]);



