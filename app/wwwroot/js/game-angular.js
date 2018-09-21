(function (module) {
    "use strict";
    module.directive("jsonCombiner", [
    function() {
        return {
            restrict:"A",
            scope:{
                saveData:"=",
                jsonCombiner:"@"
            },
            link:function($scope, element, attrs) {
                $scope.saveData(JSON.parse($scope.jsonCombiner));
            }
        }
    }
    ]);

    module.service("compileHelper", [
        "$compile", "$rootScope", function($compile, $rootScope) {
         //   console.log("compileHelper", this);
            this.$compileItem = function(html) {
                return $compile(html)($rootScope.$new());
            };
            this.$appendHtml = function(appendDom, html) {
                $(appendDom).append(this.$compileItem(html));
            };
            /**
         * 
         * @param {string||object} dom  jqueryDom|| element|| or jquery selector
         * @param {string} html string 
         * @returns {void}  none
         */
            this.$replaceWith = function(dom, html) {
                $(dom).replaceWith(this.$compileItem(html));
            };
        }
    ]);

    module.service("chestService", ["$q", function($q) { 
            var $self = this;
            this.CHEST_KEY = "UserChest";
            this.$userChestData = null;

            this.getProductType = function(chestItem) {

            };


            this.$defaultError = function(errorAnswer) {
                var msg = Errors.GetMessage(errorAnswer);
                console.log("errorAnswer", {
                    errorAnswer:errorAnswer,
                    msg:msg
                });
            };

            this.updateChestFromServer = function(onUpdated) {
                var deferred = $q.defer();
                $.ajax({
                    url: "/api/userChest/init/",
                    headers: Utils.XSRF.HeadersGetApiTokenObj(),
                    method:"GET",
                    type:"json"
                }).then(deferred.resolve, deferred.reject);
                deferred.promise.then(function(answer) {
                    $self.$setInitChestData(answer);
                    if(onUpdated instanceof Function) {
                        onUpdated($self.$userChestData);
                    }

                }, $self.$defaultError);
            };

            this.$rebuildChestData = function(chestData) {
                if($self.$userChestData) {
                    Utils.UpdateObjData($self.$userChestData, chestData);
                }
                else {
                    $self.$userChestData = chestData;
                }
                return $self.$userChestData;

            };

            this.cleanChestData = function() {
                $self.$userChestData = null;
            };


            this.getUserChestData = function() {
                if(!$self.$userChestData) {
                    console.log("!$self.$userChestData chest data nit exist", {
                        $self:$self
                    });
                }
                return $self.$userChestData;
            };

            function IProductTypes() {
                this.Account = null;
                this.Premium = null;
                this.Booster = null;
                this.Skins = null;
                this.Cc = null;
            };


            IProductTypes.prototype.getKeys = function() {
                return Object.keys(this);
            };

            this.ProductTypes = (function() {
                function IProductType(id, nativeName, langSimpleProps) {
                    this.LangSimpleProps = langSimpleProps;
                    _.extend(this, Utils.ModelFactory.INameIdModel(id, nativeName));
                }

                IProductType.prototype.convertToKv = function(baseProps) {
                    if(this.LangSimpleProps&&this.LangSimpleProps.convertToKv) {
                        return this.LangSimpleProps.convertToKv(baseProps);
                    }
                    return [];
                };

                function IPropertyes() {
                }

                IPropertyes.prototype.convertToKv = function(properties) {
                    var result = [];
                    if(!properties) {
                        return result;
                    }
                    _.forEach(this, function(val, nativeName) {
                        console.log("IPropertyes", {
                            val:val,
                            nativeName:nativeName,
                            properties:properties,
                            "properties[nativeName]":properties[nativeName],
                            "val.convertToKv":val.convertToKv,
                            "val.convertToKv(properties[nativeName])":val.convertToKv(properties[nativeName]),
                            "typeof properties[nativeName]":typeof properties[nativeName]
                        });
                        if(val.convertToKv&&properties[nativeName]&&typeof properties[nativeName]!=="object") {
                            result.push(val.convertToKv(properties[nativeName]));
                        }
                    });
                    return result;
                };

                function IPropertyItem(nativeName, langSimple, dataViewConverter) {
                    var $$Self = this;
                    this.NativeName = nativeName;
                    this.LangSimple = langSimple;
                    this.setKVConverter(function(itemValue) {
                        var viewVal = dataViewConverter ? dataViewConverter(itemValue) : itemValue;
                        return Utils.ModelFactory.KeyVal($$Self.LangSimple.getCurrent(), viewVal);
                    });
                };


                IPropertyItem.prototype.setKVConverter = function(kvConverter) {
                    this.convertToKv = kvConverter;
                };

                function setTranslateProp(iPropertyItem, nativePropName, langSimple, dataViewConverter) {
                    iPropertyItem[nativePropName] = new IPropertyItem(nativePropName, langSimple, dataViewConverter);
                }

                //en, es, ru
                var ls = Utils.LangSimple;
                var pt = new IProductTypes();
                                                           
                var acTranslate = new IPropertyes();
                //    setTranslateProp(acTranslate, "", lf());     
                pt.Account = new IProductType(1, "Account", acTranslate);

                var pTranslate = new IPropertyes();
                setTranslateProp(pTranslate, "Duration", ls("EN Duration", "ES Duration", "RU Duration"), Utils.Time.Seconds2Time);
                setTranslateProp(pTranslate, "PremiumBookmarkMod", ls("EN PremiumBookmarkMod", "ES PremiumBookmarkMod", "RU PremiumBookmarkMod"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "PremiumNavigationMod", ls("EN PremiumBookmarkMod", "ES PremiumBookmarkMod", "RU PremiumBookmarkMod"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "ResourseMaxStorable", ls("EN ResourseMaxStorable", "ES ResourseMaxStorable", "RU ResourseMaxStorable"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "ResourseProduction", ls("EN ResourseProduction", "ES ResourseProduction", "RU ResourseProduction"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "TimeBuildUpdate", ls("EN TimeBuildUpdate", "ES TimeBuildUpdate", "RU TimeBuildUpdate"), function(val) {
                    return val;
                });
                setTranslateProp(pTranslate, "TimeUnitProduction", ls("EN TimeUnitProduction", "ES TimeUnitProduction", "RU TimeUnitProduction"), function(val) {
                    return val;
                });

                pt.Premium = new IProductType(2, "Premium", pTranslate, function(val) {
                    return val;
                });

                var bTranslate = new IPropertyes();
                setTranslateProp(bTranslate, "Duration", ls("EN Duration", "ES Duration", "RU Duration"), Utils.Time.Seconds2Time);
                setTranslateProp(bTranslate, "Attack", ls("EN Attack", "ES Attack", "RU Attack"), function(val) {
                    return val;
                });
                setTranslateProp(bTranslate, "Hp", ls("EN Hp", "ES Hp", "RU Hp"), function(val) {
                    return val;
                });

                pt.Booster = new IProductType(3, "Booster", bTranslate);
                var sTranslate = new IPropertyes();
                //    setTranslateProp(bTranslate, "", lf());
                pt.Skins = new IProductType(4, "Skins", sTranslate);

                var ccTranslate = new IPropertyes();
                // setTranslateProp(ccTranslate, "", lf());
                pt.Cc = new IProductType(5, "Cc", ccTranslate);
                Utils.FreezeDeep(pt);
                return pt;
            })();

            this.$getTypeByTypeId = function(productTypeId) {
                return _.find($self.ProductTypes, function(typeVal, typeName) {
                    return typeVal.Id===productTypeId;
                });
            };

            this.createChestItemKVPropertiesView = function(chestItem) {
                var pType = $self.$getTypeByTypeId(chestItem.ProductTypeId);
                if(pType&&pType.convertToKv) {
                    return pType.convertToKv(chestItem.ProductItemProperty.Property);
                }
                return [];
            };


            this.getActiveDataByTypeId = function(typeId) {
                var chest = $self.getUserChestData();
                if(!chest||!chest.ActivatedItemsView) return null;
                return _.find(chest.ActivatedItemsView, function(o) {
                    return o.ProductTypeId===typeId;
                });
            }

            this.getBalanceCcModel = function() {
                var item = $self.getActiveDataByTypeId($self.ProductTypes.Cc.Id);
                if(!item||!item.Data) return null;
                return item.Data.BalanceCc;
            };
            this.getPremiumModel = function() {
                var item = $self.getActiveDataByTypeId($self.ProductTypes.Premium.Id);
                if(!item||!item.Data) return null;
                return item.Data.Premium;
            };

        }
    ]);

    module.service("pageHelper", [function () {
        console.log("pageHelper", this);
        this.pageName = $("body").data("page-name");
        this.pageNames = {
            home: "start-page",
            store: "store-page",
            account: "account-page",
            manage: "manage-page",
            adminStore: "admin-store-page"
        };
        this.isPage = function (pageName) {
            if (!this.pageName) {
                return false;
            }
            return this.pageName === pageName;
        };
        this.$homeInitialized = false;
        this.initHome = function () {
            if (!this.$homeInitialized && this.isPage(this.pageNames.home)) {
                HomeScroller.Init();
                HomeResaizer();
                Utils.Response.HomeVideo.Init();
                HomeCarousel();
                $("iframe").youtubeControl();
                this.$homeInitialized = true;
            }
        };
        this.isOtherPage = function () {
            var pages = this.pageNames;
            var pageName = this.pageName;
            if (!pageName) {
                return true;
            }
            var isOtherPage = true;
            _.forEach(pages, function (value, key) {
                if (value === pageName) {
                    isOtherPage = false;
                    return false;
                }
            });
            return isOtherPage;
        };
        if (this.isPage(this.pageNames.home)) {
            this.initHome();
        }

    }]);
    module.service("appVarsSerivce", ["$rootScope", function ($rootScope) {
        this._data = null;
        this.save = function (data) {
            if(this._data!== null) {
                this._data = _.extend(this._data, data);
            }
            else {
                this._data = data;
            }
            return this;
        };
        this.getVars = function () {
            var data = this._data;
            console.log("getVars",
                {
                    data: data
                });
            return this._data;
        };
        this.add = function(key, val) {
            if(!key) return this;
            if(this._data===null) {
                this._data = {};
            }
            this._data[key] = val;
            return this;
        };
        this.remove = function(key) {
            if (!this._data || !this._data[key]) {
                return;
            }
            this._data[key] = null;
            delete this._data[key];
            return this;
        };

        this.update = function(newAppVars) {
            Utils.UpdateObjData(this._data, newAppVars);
        
            $rootScope.$broadcast("appVarsSerivce:update", { appVars: this._data });
 
            return this;
        };


    }]);
    module.directive("appVars",["appVarsSerivce",
            function (appVarsSerivce) {
                return { 
                        restrict:"A",
                        scope:{appVars: "@"},
                        link:function($scope, element, attrs) {  
                            appVarsSerivce.save(JSON.parse($scope.appVars));
                          element.remove();
                            console.log("appVars saved",{
                                $scope: $scope
                            });
                        }
                    }
            }
        ]);

})(angular.module("angularAppCommon", []));
/*global MediumEditor */
angular.module('angular-medium-editor', []).directive('mediumEditor', function () {
      'use strict';

      function toInnerText(value) {
          var tempEl = document.createElement("div");
          tempEl.innerHTML = value;
          var text = tempEl.textContent || "";
          return text.trim();
      }

      function updateEditor(scope, iElement, iAttrs, ngModel) {
          angular.element(iElement).addClass("angular-medium-editor");
          // Global MediumEditor
          ngModel.editor = new MediumEditor(iElement, scope.bindOptions);
          ngModel.$render = function () {
              ngModel.editor.setContent(ngModel.$viewValue || "");
              var placeholder = ngModel.editor.getExtensionByName("placeholder");
              if (placeholder) {
                  placeholder.updatePlaceholder(iElement[0]);
              }
          };

          ngModel.editor.subscribe("editableInput", function (event, editable) {
              ngModel.$setViewValue(editable.innerHTML.trim());
          });
      }


      return {
          require: "ngModel",
          restrict: "AE",
          scope: { bindOptions: "=" },
          link: function (scope, iElement, iAttrs, ngModel) {
              updateEditor(scope, iElement, iAttrs, ngModel);

              ngModel.$isEmpty = function (value) {
                  if (/[<>]/.test(value)) {
                      return toInnerText(value).length === 0;
                  } else if (value) {
                      return value.length === 0;
                  } else {
                      return true;
                  }
              };
              scope.$on('mediumEditor:update-option', function (e, bindOptions) {
                  ngModel.editor.destroy();
                  scope.bindOptions = bindOptions;
                  updateEditor(scope, iElement, iAttrs, ngModel);
                 // console.log("mediumEditor:update-option", { ngModel: ngModel, bindOptions: bindOptions });
                  // ngModel.editor.init(iElement, bindOptions);
              });
     
              scope.$watch("bindOptions", function (bindOptions) {
                  ngModel.editor.init(iElement, bindOptions);
              });
              scope.$on("$destroy", function () {
                  ngModel.editor.destroy();
              });
          }
      };

  });
Utils.CoreApp.gameAppExtensions = {
    HubAlliance: null,
    HubBookmark: null,
    HubPersonalInfo: null,
    HubWorld: null,
    HubEstate: null,
    HubJournal: null,
    HubUserChannels: null,
    HubConfederation: null,
    ConfederationOfficers: null,
    ConfederationElection: null,
    ConfederationRating: null,
    UserChannelsAlliance: null,
    UserChannelsGroup: null,
    UserChannelsPrivate: null

};
Utils.CoreApp.gameAppExtensions.HubAlliance = function (hubService, client, server, allianceService, $$RootScope) {
    // #region Requests to alliance

    /**
	 * 
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceFromAllianceManageAddMessage = function(allianceMessageModelExt) {
        return server.requestAllianceFromAllianceManageAddMessage(allianceMessageModelExt);
    };
    /**
	* 
	* @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	* @returns {void} 
	*/
    client.requestAllianceAddMessageToAllianceManage = function(allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.addNewRequetToAllianceManage(allianceMessageModelExt);
        console.log("otherOnRequestAllianceManageAddMessage", allianceMessageModelExt);
        //todo code heare
    };

    /**
	 * 
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceFromMyAllianceAddMessage = function(allianceMessageModelExt) {
        return server.requestAllianceFromMyAllianceAddMessage(allianceMessageModelExt);

    };

    /**
	 * for my alliance tab
	 * @param {object} allianceMessageModelExt Utils.ModelFactory.AllianceMessageModelExt
	 * @returns {void} 
	 */
    client.requestAllianceAddMessageToMyAlliance = function(allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.addNewRequetToMyAlliance(allianceMessageModelExt);
        console.log("requestAllianceAddMessageToMyAlliance", allianceMessageModelExt);
        //todo code heare
    };

    /**
	 * 
	 * @param {int} toAllianceId
	 * @returns {object} signalR deffered
	 */
    hubService.requestAllianceDeleteRequestForUserToAlliance = function(toAllianceId) {
        return server.requestAllianceDeleteRequestForUserToAlliance(toAllianceId);
    }

    /**
	 * for alliance manage tab
	 * @param {object} fromConnectionUser ConnectionUser Utils.ModelFactory.ConnectionUser
	 * @returns {void} 
	 */
    client.onRequestAllianceDeleteRequestForUserToAlliance = function(requestUserId) {
        hubService._checkCurrentUser();
        allianceService.deleteRequestHistoryFromAllianceManage(requestUserId);
    };

    hubService.requestAllianceConfirmAcceptFromAllianceManage = function(allianceMessageModelExt) {
        return server.requestAllianceConfirmAcceptFromAllianceManage(allianceMessageModelExt);
    };
    client.onRequestAllianceConfirmAcceptFromAllianceManage = function(allianceMessageModelExt, isRequestUser) {
        hubService._checkCurrentUser();
        allianceService.onRequestAllianceConfirmAcceptFromAllianceManage(allianceMessageModelExt, isRequestUser);
    };

    client.onDeleteAllianceRequestsByManager = function(allianceId, removerRequestUserId) {
        hubService._checkCurrentUser();
        allianceService.onDeleteAllianceRequestsByManager(allianceId, removerRequestUserId);
    };


    hubService.requestAllianceRejectRequestToAlliance = function(rejectUserId) {
        console.log("rejectRequestToAlliance", rejectUserId);
        return server.requestAllianceRejectRequestToAlliance(rejectUserId);
    };
    client.onRequestAllianceRejectRequestToAlliance = function(rejectUserId, isRequestUser, allianceMessageModelExt) {
        hubService._checkCurrentUser();
        allianceService.onRequestAllianceRejectRequestToAlliance(rejectUserId, isRequestUser, allianceMessageModelExt);
    };


    hubService.requestAllianceAcceptJoinUserToAlliance = function(toAllianceId) {
        return server.requestAllianceAcceptJoinUserToAlliance(toAllianceId);
    };

    client.allianceAddNewUserToAlliane = function(newAllianceMember) {
        hubService._checkCurrentUser();
        allianceService.allianceAddNewUserToAlliane(newAllianceMember, $$RootScope);
    };

    client.allianceAddNewUsersToAlliane = function(newMembers) {
        hubService._checkCurrentUser();
        allianceService.allianceAddNewUsersToAlliane(newMembers, $$RootScope);
    };

    hubService.allianceLeaveFromUserAlliance = function() {
        return server.allianceLeaveFromUserAlliance();
    }
    client.onAllianceUserLeftAlliance = function(leftUserId, leftAllianceId) {
        hubService._checkCurrentUser();
        allianceService.onAllianceUserLeftAlliance(leftUserId, leftAllianceId, $$RootScope);
    };
    // #endregion


    hubService.allianceDisbandAlliance = function() {
        return server.allianceDisbandAlliance();
    };
    client.onAllianceDisbanded = function(disbandedAlianceId, newConnectionUser, newPlanshetData) {
        hubService._checkCurrentUser();
        if(newConnectionUser) {
            console.log("client.onAllianceDisbanded.is newConnectionUser");
            if(hubService._currentUser.UserId===newConnectionUser.UserId) {
                hubService._updateCurrentUser(newConnectionUser);
                console.log("client.onAllianceDisbanded.allianceService", allianceService);
                allianceService.onAllianceDisbanded(disbandedAlianceId, hubService._currentUser, newPlanshetData);
            }
            else throw new Error("mainGameHubService.client.onAllianceDisbanded.isAllianceGroup");
        }
        else {
            console.log("client.onAllianceDisbanded is other newConnectionUser");
            allianceService.onAllianceDisbanded(disbandedAlianceId);
        }

    }

    hubService.allianceCheckAllianceNameIsUnic = function(checkAllianceName) {
        return server.allianceCheckAllianceNameIsUnic(checkAllianceName);
    }

    hubService.allianceCreateAlliance = function(checkedAllianceName) {
        return server.allianceCreateAlliance(checkedAllianceName);
    }

    client.onAllianceCreateAlliance = function(newAllianceId, newAllianceName) {
        hubService._checkCurrentUser();
        allianceService.addAllianceNameToLocal({Id:newAllianceId, Name:newAllianceName});
    }
    hubService.allianceGetAllActiveAllianceNames = function() {
        return server.allianceGetAllActiveAllianceNames();
    };

    hubService.allianceGetAllianceNamesByPartName = function(partAllianceName) {
        return server.allianceGetAllianceNamesByPartName(partAllianceName);
    };

    hubService.allianceGetAllianceItemById = function(allianceId, tabIdx) {
        return server.allianceGetAllianceItemById(allianceId, tabIdx);
    };
    hubService.allianceGetAllianceItemByMinRating = function(pvpPoint, skip) {
        return server.allianceGetAllianceItemByMinRating(pvpPoint, skip);
    };

    hubService.allianceInfoUpdateLabel = function(newBase64SourceImageModel) {
        return server.allianceInfoUpdateLabel(newBase64SourceImageModel);
    };
    client.onAllianceInfoUpdateLabel = function(newUserImageModel, allianceId) {
        allianceService.onAllianceInfoUpdateLabel(newUserImageModel, allianceId);
    };

    hubService.allianceInfoUpdateDescription = function(newDescription) {
        return server.allianceInfoUpdateDescription(newDescription);
    };
    client.onAllianceInfoUpdateDescription = function(newDescription, allianceId) {
        allianceService.onAllianceInfoUpdateDescription(newDescription, allianceId);
    };

    hubService.allianceInfoUpdateTax = function(newTax) {
        return server.allianceInfoUpdateTax(newTax);
    };
    client.onAllianceInfoUpdateTax = function(newTax, allianceId) {
        allianceService.onAllianceInfoUpdateTax(newTax, allianceId);
    };

    hubService.allianceDropUserFromAlliance = function(targetDropUserId) {
        return server.allianceDropUserFromAlliance(targetDropUserId);
    }
    client.onAllianceUserDroped = function (oldAllianceId, newConnectionUser, newPlanshetData, oldChannelId, newAllianceChannelOutDataModel) {
        hubService._checkCurrentUser();
        if(newConnectionUser) {
            hubService._updateCurrentUser(newConnectionUser);   
            allianceService.onAllianceUserDroped(oldAllianceId, hubService._currentUser, newPlanshetData);
            hubService.$onUserChannelsUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel); 
        }
        else
            throw Errors.ClientNotImplementedException({
                args:arguments,   
                "hubService._currentUser":hubService._currentUser
            }, "mainGameHubService.client.onAllianceUserDroped");
    }


    hubService.allianceUpdateUserRole = function(targetAllianceUserId, targetUserId, targetRoleId) {
        return server.allianceUpdateUserRole(targetAllianceUserId, targetUserId, targetRoleId);
    };
    client.onAllianceUpdateUserRole = function(data) {
        hubService._checkCurrentUser();
        data.$$RootScope = $$RootScope;
        if(data.IsCurrentUser) {
            hubService._updateCurrentUser(data.NewCurrentConnectionUser);
            //console.log(" client.onAllianceUpdateUserRole.newCurrentConnectionUser", {
            //    newCurrentConnectionUser: newCurrentConnectionUser,
            //    "hubService._currentUser": hubService._currentUser
            //});

        }
        //   allianceService.Role.onAllianceUserUpdateRole(allianceId, targetUserId, newRole, $$RootScope);
        allianceService.Role.onAllianceUserUpdateRole(data);

    };

    hubService.allianceUpdateAllianceTech = function (techType) {
        return server.allianceUpdateAllianceTech(techType);
    };
    client.onAllianceTechUpdated = function(updatedTechItem, newAllianceBalanceCc) {
        hubService._checkCurrentUser();
        allianceService.onAllianceTechUpdated(updatedTechItem, newAllianceBalanceCc, $$RootScope);
    };

};
Utils.CoreApp.gameAppExtensions.HubBookmark = function (hubService, client, server) {

    // old BookmarkGetList
    /**
     * 
    * @returns {object} signalR deffered => bool see server  PlanshetViewData
     */
    hubService.bookmarkGetPlanshet = function() {
        return server.bookmarkGetPlanshet();
    };

    /**
     * 
     * @param {object} bookmarkOutModel  see Utils.ModelFactory.BookmarkOut   or server    BookmarkOut  
     * @returns {object}  signalR deffered  => object see server  PlanetInfoOut || StarInfoOut || SectorInfoOut
     */   
    hubService.bookmarkAddBookmark = function (bookmarkOutModel) {
        return server.bookmarkAddBookmark(bookmarkOutModel);
    };

    /**
   * 
   * @param {object} bookmarkOutModel  see Utils.ModelFactory.BookmarkOut   or server    BookmarkOut
   * @returns {object}  signalR deffered => bool
   */
    hubService.bookmarkDeleteItem = function (bookmarkOutModel) {
        return server.bookmarkDeleteItem(bookmarkOutModel);
    };

 

}
Utils.CoreApp.gameAppExtensions.HubBuild = function (hubService, client, server) {

    // #region IPlanshetViewData build collections

    /**
    * Возвращает модель планшета для здания
    * @param {int} planetId   
    * @returns {object}  signalR deffered  see server IPlanshetViewData (planet IndustrialComplex)
    */
    hubService.buildGetIndustrialComplex = function (planetId) {
        return server.buildGetIndustrialComplex(planetId);
    };

    /**
     * Возвращает модель планшета для здания
     * @param {int} planetId   
     * @returns {object}  signalR deffered  see server IPlanshetViewData (planet CommandCenter)
     */
    hubService.buildGetCommandCenter = function (planetId) {
        return server.buildGetCommandCenter(planetId);
    };

    /**
    * Возвращает модель планшета для здания
    * @param {int} planetId   
    * @returns {object}  signalR deffered  see server IPlanshetViewData (planet SpaceShipyard)
    */
    hubService.buildGetSpaceShipyard = function (planetId) {
        return server.buildGetSpaceShipyard(planetId);
    };

    /**
     * Возвращает модель планшета для здания
     * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherIndustrialComplex)
     */
    hubService.buildGetMotherIndustrialComplex = function () {
        return server.buildGetMotherIndustrialComplex();
    };

    /**
    *Возвращает модель планшета для здания 
    * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherSpaceShipyard)
    */
    hubService.buildGetMotherSpaceShipyard = function () {
        return server.buildGetMotherSpaceShipyard();
    };

    /**
    * Возвращает модель планшета для здания
    * @returns {object}  signalR deffered  see server IPlanshetViewData (MotherLaboratory)
    */
    hubService.buildGetMotherLaboratory = function () {
        console.log("hubService.buildGetMotherLaboratory");
        return server.buildGetMotherLaboratory();
    };
    // #endregion


    // #region Build Item Common

    /**
     * planet builds only!
     * @param {object} unitTurnOutDataModel     see server UnitTurnOut or Utils.ModelFactory.UnitTurnOut
     * @param {string} buildItemNativeName    see server   enum.BuildNativeNames  planet names only 
     * @returns {object}  signalR deffered   => bool (true - upgrade added and data was changed) || int => wen buy for cc retturn new result cc
     */
    hubService.buildItemUpgrade = function (unitTurnOutDataModel, buildItemNativeName) {
        return server.buildItemUpgrade(unitTurnOutDataModel, buildItemNativeName);
    };

    /**
     * planet builds only!
     * @param {int} planetId   not 0
     * @param {string} buildItemNativeName     see server   enum.BuildNativeNames planet names only 
     * @returns {object}  signalR deffered   =>  ItemProgress  see server ItemProgress  updated progress for build item 
     */
    hubService.buildItemUpgraded = function (planetId, buildItemNativeName) {
        return server.buildItemUpgraded(planetId, buildItemNativeName);
    };


    // #endregion


    // #region EnergyConverter   
    /**
    *  обменивает ресурс текцщего владения на другой тип ресурса текущего владения, сохраняет изменения в базу
    * @param {object} energyConverterChangeOutDataModel  see server EnergyConverterChangeOut 
    * @returns {object}  signalR deffered => bool
    */
    hubService.buildEnergyConverterExchangeResource = function (energyConverterChangeOutDataModel) {
        return server.buildEnergyConverterExchangeResource(energyConverterChangeOutDataModel);
    };
    // #endregion


    // #region ExtractionModule  
    /**
     * изменяет % добываемых ресурсов, фиксирует ресурсы так чтобы суммарно получалось 100% добычи
     * @param {object} extractionModuleChangeOutDataModel  see server  ExtractionModuleChangeOut
     * @returns {object}   signalR deffered => bool
     */
    hubService.buildExtractionModuleChangeProportion = function (extractionModuleChangeOutDataModel) {
        return server.buildExtractionModuleChangeProportion(extractionModuleChangeOutDataModel);
    };

    // TODO NotImplemented - test data!
    /**
     * 
     * @param {int} ownId   planetId  or 0 for mother
     * @returns {object}  signalR deffered => string test messge
     */
    hubService.buildExtractionModuleStopProduction = function (ownId) {
        return server.buildExtractionModuleStopProduction(ownId);
    };

    // TODO NotImplemented - test data!
    /**
     *  
     * @param {int} ownId    planetId  or 0 for mother
     * @returns {object}   signalR deffered => string test messge
     */
    hubService.buildExtractionModuleStartProduction = function (ownId) {
        return server.buildExtractionModuleStartProduction(ownId);
    };
    // #endregion


    // #region SpaceShipyard 

    //todo   TODO NotImplemented in client is ok 
    /**
     * синхронизирует данные клиента и сервера об обновлении  юнита
     * @param {int} ownId    planetId  or 0 for mother
     * @param {string} unitTypeName       see server  enum.UnitType or 
     * @returns {object}   signalR deffered =>   ItemProgress see server ItemProgress updated unit progress
     */
    hubService.buildSpaceShipyardFixUnitTurn = function (ownId, unitTypeName) {
        return server.buildSpaceShipyardFixUnitTurn(ownId, unitTypeName);
    };


    /**
     * создает и записывает новй объект очереди для юнита
     * @param {object} unitTurnOutDataModel  see server UnitTurnOut   or Utils.ModelFactory.UnitTurnOut
     * @returns {object}   signalR deffered => bool 
     */
    hubService.buildSpaceShipyardSetUnitTurn = function (unitTurnOutDataModel) {
        return server.buildSpaceShipyardSetUnitTurn(unitTurnOutDataModel);
    };


    // #endregion


    // #region Storage

    //todo   TODO NotImplemented in client  is ok
    /**
    * получает все ресурсны для текущего владения 
    * @param {int} ownId    default -0 => mother else must be planetId
    * @returns {object} signalR deffered => ResourcesView see  server ResourcesView or   Utils.ModelFactory.ResourcesView
    */
    hubService.buildStorageGetResourcesView = function (ownId) {
        return server.buildStorageGetResourcesView(ownId);
    };


    /**
     * получает игровые ресурсы переданого владения
     * @param {int} targetOwnId   mother -0 else planetId
     * @returns {object} signalR deffered =>   StorageResources
     */
    hubService.buildStorageGetStorageResources = function (targetOwnId) {
        return server.buildStorageGetStorageResources(targetOwnId);
    };

    /**
     * осузествляет перезапись данных из одного own  в другой
     * @param {object} transferResourceDataModel   see server  TransferResource or      Utils.ModelFactory.TransferResource
     *  @returns {object} signalR deffered =>   bool
     */
    hubService.buildStorageDoTransfer = function (transferResourceDataModel) {
        return server.buildStorageDoTransfer(transferResourceDataModel);
    };


    // #endregion

    // #region Turel
    // no action
    // #endregion

    // #region Laboratory   
    hubService.buildLaboratorySetTechTurn = function (techTurnOutDataModel) {
        return server.buildLaboratorySetTechTurn(techTurnOutDataModel);
    };
    hubService.techItemUpgraded = function(techType) {
        return server.techItemUpgraded(techType);
    };
    // #endregion

}
Utils.CoreApp.gameAppExtensions.HubConfederation = function (hubService, client, server, $confederation, $$RootScope) {

    // #region Common  

    hubService.confederationGetPlanshet = function () {
        return server.confederationGetPlanshet();
    };

    client.onConfederationVoitingStarted = function (activeCandidatesOutList) {
        try {
            hubService._checkCurrentUser();
            $confederation.updateCandidates(activeCandidatesOutList, false, $$RootScope);
            console.log("onConfederationVoitingStarted", { activeCandidatesOutList: activeCandidatesOutList });
        }
        catch(e) {
            return;
        } 
      
       
    };  
    client.onConfederationVoitingFinalized = function (tabElectionData, newListIOfficerOut) {
        try {
            hubService._checkCurrentUser();
            $confederation.onVoteFinalize(tabElectionData, newListIOfficerOut);
        }
        catch(e) {
            return;
        } 
     
    };
    // #endregion


    // #region Officers
    hubService.confederationAddNewOfficer = function (newUserOfficerOutDataModel, presidentOfficerId, presidentUserId) {
        hubService._checkCurrentUser();
        return server.confederationAddNewOfficer(newUserOfficerOutDataModel, presidentOfficerId, presidentUserId);
    };
    client.confederationAddOrUpdateOfficer = function (newUserOfficerOutDataModel) {
        try {
            hubService._checkCurrentUser();
            $confederation.addOrUpdateOfficer(newUserOfficerOutDataModel, $$RootScope);
        }
        catch(e) {
            return;
        } 

    };
    // #endregion

    // #region Rating
    hubService.confederationRatingGetNextPage = function (skip) {
        return server.confederationRatingGetNextPage(skip);
    };

    hubService.confederationRatingGetUser = function (userId) {
        return server.confederationRatingGetUser(userId);
    };

    // #endregion


    // #region Elections Election  and registration
    hubService.confederationAddVote = function (candidateUserId) {
        return server.confederationAddVote(candidateUserId);
    };

    client.onConfederationCandidatesUpdated = function (candidatesOutList, updateVotes) {
        try {
            hubService._checkCurrentUser();
            $confederation.updateCandidates(candidatesOutList, updateVotes, $$RootScope);
        }
        catch(e) {
            return;
        } 
     
    };

 
    hubService.confederationRegistrateCandidate = function() {
        return server.confederationRegistrateCandidate();
    };

    // #endregion


}


Utils.CoreApp.gameAppExtensions.HubEstate = function (hubService, client, server) {
    /**
     * получает синхронизированные данные  ангара по текущему владению 
     * @param {int} bookmarkOutModel  0 mother, else planetId
     * @returns {object}  signalR deffered  => object see server  Dictionary<UnitType, HangarUnitsOut>  or Utils.ModelFactory.UnitList
     */
    hubService.estateGetHangar = function (ownId) {
        return server.estateGetHangar(ownId);
    };
    /**
     *  получает весь список доступных владений пользователя на текущший момент
     * @returns {object} signalR deffered  => object   see server IList<EstateItemOut>    or List<Utils.ModelFactory.EstateListData>
     */
    hubService.estateGetEstateList = function () {
        return server.estateGetEstateList();
    };
    /**
     *  получает  данные для едиственнго эллемента если пользователю принадежит плантеа иначе выбрасывает исключение
     * @param {int} planetId 
     * @returns {object} signalR deffered  => object    EstateListData see server  EstateItemOut or  Utils.ModelFactory.EstateListData
     */
    hubService.estateGetEstateItemByPlanetId = function (planetId) {
        return server.estateGetEstateItemByPlanetId(planetId);
    };

    /**
     * получает синхронизированные данные по переданному владению для всех зданий которые могут принаджать текущему типу владения 
     * @param {int} ownId 0 mother, else planetId 
     * @returns {object} signalR deffered  => object see server Dictionary<string, IPlanshetViewData>   где key - UniqueId :  BuildCollection.BuildPrefixId + moduleId   пример ic:  build-collection-industrial-complex
     */
    hubService.estateGetFullEstate = function (ownId) {
        return server.estateGetFullEstate(ownId);
    };

}
Utils.CoreApp.gameAppExtensions.HubJournal = function (hubService, client, server, $journalService, $$RootScope) {
    // #region Initial

   /**
    * работает только для текущего пользователя
    * Создает для текущего юзера модель планшета 
    * @returns  {object}  signalR deffered =>   IPlanshetViewData (Journal planshet model)
    */
    hubService.journalInitialPlanshet = function () {
        return server.journalInitialPlanshet();
    };
    // #endregion

 
    // #region Task  
    /**
     * работает только для текущего пользователя
     * создает и активирует новую задачу для пользователя (атака или трансфер) 
     * @param {object} taskFleetInputDataModel   see server TaskFleet
     * @returns  {object}  signalR deffered =>   object see server  newTaskId
     */
    hubService.journalCreateTaskItem = function (taskFleetInputDataModel) {
        return server.journalCreateTaskItem(taskFleetInputDataModel);
    };
           
    client.journalOnTaskCreated = function (newTaskItem) {
        console.log("journalOnTaskCreated", { newTaskItem: newTaskItem });
        try {
            hubService._checkCurrentUser();
            $journalService.onTaskCreated(newTaskItem);
        }
        catch (e) {
            console.log({e:e});
            return;
        }  
    };
    client.journalOnTaskFinished = function(notyfyData) {
        console.log("journalOnTaskFinished", {notyfyData:notyfyData});
        try {
            hubService._checkCurrentUser();
            $journalService.onTaskFinished(notyfyData);
        }
        catch(e) {
            console.log({e:e});
            return;
        }

    };


 
    /**
     * работает только для текущего пользователя
     * считает время выполнения задачи  исходя из занданных параметров  и записывает данные во временное хранилище возвращая  гуид для дальнейшего использования
     * @param {int} estateId 
     * @param {string} planetName 
     * @param {int} startSystemId 
     * @returns  {object}  signalR deffered => object => MapDistance модель координат с посчитанным временем  
     */
    hubService.journalGetTaskTime = function (estateId, planetName, startSystemId) {
        return server.journalGetTaskTime(estateId, planetName, startSystemId);
    };

 
    /**
     * работает только для текущего пользователя
     * проверяет завершилась ли задача если нет возвращает модель  с временем до завершения задачи
     * @param {int} taskId 
     * @returns  {object}  signalR deffered =>  object see server TaskFleet   данные для окончания или продолжения задачи
     */
    hubService.journalTaskTimeIsOver = function (taskId) {
        return server.journalTaskTimeIsOver(taskId);
    };


    // #endregion

    //todo not impl!
    // #region Report

 
    /**
     * работает только для текущего пользователя
     * получает эллемент коллекции вкладки репорт
     * @param {int} taskId 
     * @returns  {object}  signalR deffered =>  object see server TabReportOut 
     */
    hubService.journalGetReportItemByTaskId = function (taskId) {
        return server.journalGetReportItemByTaskId(taskId);
    };

    //todo отключен
    /**  
     * @param {string} id 
     * @returns  {object}  signalR deffered =>     object see server TabReportOut 
     */
    hubService.journalCreateReportItem = function (id) {
        return server.journalCreateReportItem(id);
    };

    //todo на клиенте не все впорядке при пересчете макс имемов
    /**
     * работает только для текущего пользователя
     *  получает коллекцию репортов для вкладки репортов для скроллинга с отсчетом от последего репорт ид, если эллементов нет возвращает пустую коллекцию
     * @param {int} lastReportId 
     * @returns  {object}  signalR deffered => Array see server IList<TabReportOut>  
     */
    hubService.journalGetReportItems = function (lastReportId) {
        return server.journalGetReportItems(lastReportId);
    };

    /**
     * работает только для текущего пользователя
     *  удаляет репорт если все ок возвращает тру иначе фальс 
     * @param {int} reportId 
     * @returns  {object}  signalR deffered =>   bool
     */
    hubService.journalDeleteReportItem = function (reportId) {
        return server.journalDeleteReportItem(reportId);
    };


    // #endregion

 
    // #region Spy
 
    /**
     * работает только для текущего пользователя
     * получает коллекцию эллементов вкладки спай для скролинга с отсчетом от последнего спай ид, если  эллементов больше нет возвращает пустую коллекцию 
     * @param {int} lastSpyId 
     * @returns  {object}  signalR deffered => Array see IList<TabSpyOut>
     */
    hubService.journalGetSpyItems = function (lastSpyId) {
        return server.journalGetSpyItems(lastSpyId);
    };


 
    /**
     * работает только для текущего пользователя
     * создает отчет шпионажа для переданной планеты  по переданному ид планеты 
     *  если совпадение найденно оно уникально и планета не пренаджлежит пользователю создает отчет 
     * @param {int} planetId 
     * @returns  {object}  signalR deffered =>  object see server TabSpyOut
     */
    hubService.journalCreateSpyItemByPlanetId = function (planetId) {
        return server.journalCreateSpyItemByPlanetId(planetId);
    };
 

    /**
     * работает только для текущего пользователя
     * создает отчет шпионажа для переданной планеты  по переданному имени планеты
     * ищет в локальном хранилище связку ид и нейм планеты если совпадение найденно оно уникально и планета не пренаджлежит пользователю создает отчет 
     * @param {string} planetName 
     * @returns  {object}  signalR deffered =>    object see server TabSpyOut
     */
    hubService.journalCreateSpyItemByPlanetName = function (planetName) {
        return server.journalCreateSpyItemByPlanetName(planetName);
    };

 

    /**
     * работает только для текущего пользователя 
     * @param {int} spyId 
     * @returns  {object}  signalR deffered =>     bool
     */
    hubService.journalDeleteSpyItem = function (spyId) {
        return server.journalDeleteSpyItem(spyId);
    };


    // #endregion

    //todo not impl!
    // #region MotherJump

 
    /**
     * работает только для текущего пользователя 
     * @param {int} sourceSystemId 
     * @param {int} targetSystemId 
     * @returns  {object}  signalR deffered =>  object see sever MapDistance
     */
    hubService.journalGetMotherJumpTime = function (sourceSystemId, targetSystemId) {
        return server.journalGetMotherJumpTime(sourceSystemId, targetSystemId);
    };

 
    /**
     * работает только для текущего пользователя
     * @param {string} guid 
     * @returns  {object}  signalR deffered =>  objecct see sever IMotherJumpOut
     */
    hubService.journalAddTaskMotherJump = function (guid) {
        return server.journalAddTaskMotherJump(guid);
    };
 
    /**
     * работает только для текущего пользователя 
     * @param {int} jumpId 
     * @returns  {object}  signalR deffered => bool 
     */
    hubService.journalCancelMotherJump = function (jumpId) {
        return server.journalCancelMotherJump(jumpId);
    };

 
    /**
     * работает только для текущего пользователя 
     * @param {int} jumpId 
     * @returns  {object}  signalR deffered =>    object see EstateAdress
     */
    hubService.journalInstMotherJump = function (jumpId) {
        return server.journalInstMotherJump(jumpId);
    };

 
    /**
     * работает только для текущего пользователя 
     * @returns  {object}  signalR deffered =>  int - timeToDone or  EstateAdress of time not done
     */
    hubService.journalIsMotherJumpTimeDone = function () {
        return server.journalIsMotherJumpTimeDone();
    };
 
    hubService.journalRemoveGuid = function (guidLong) {
        return server.journalRemoveGuid(guidLong);
    }

    // #endregion

                                                                                         
}
Utils.CoreApp.gameAppExtensions.HubUserChannels = function (hubService, client, server, $uChannelsService, $$RootScope) {

    // #region Common

    /**
    * получает все данные всего планшета со всеми сообщениями для инициализации или глобальных событий обновления
    * @returns {object}   signalR deffered =>  object object see server IPlanshetViewData (UserChannelsPlanshetOut model) 
    */
    hubService.userChannelsGetPlanshet = function () {
        return server.userChannelsGetPlanshet();
    };
    /**
     * модель с базовыми данными для отправки
     * @param {object} channelMessageTransferDataModel see server ChannelMessageTransfer  or Utils.ModelFactory.IChannelMessageTransfer 
     * @returns {object}   signalR deffered =>  bool 
     */
    hubService.userChannelsSendMessage = function (channelMessageTransferDataModel) {
        return server.userChannelsSendMessage(channelMessageTransferDataModel);
    };
    /**
     * 
     * @param {object} channelMessageTransferDataModel  see server ChannelMessageTransfer  or Utils.ModelFactory.IChannelMessageTransfer
     * @returns {void} 
     */
    client.onUserChannelsSended = function (channelMessageTransferDataModel) {
        hubService._checkCurrentUser();
        $uChannelsService.onMessageSended(channelMessageTransferDataModel, $$RootScope);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelType 
     * @param {} skip 
     * @returns {} 
     */
    hubService.userChannelsGetNextMessagesPage = function (channelId, channelType, skip) {
        return server.userChannelsGetNextMessagesPage(channelId, channelType, skip);
    };
    // #endregion




    // #region Private

    /**
    *
    * @param {object} iChannelMessageCreateModel   see server  ChannelMessageCreateModel  or Utils.ModelFactory.IChannelMessageCreateModel
    * @returns  {object}  signalR deffered =>  bool 
    */
    hubService.userChannelsCreatePrivateChannel = function (iChannelMessageCreateModel) {
        return server.userChannelsCreatePrivateChannel(iChannelMessageCreateModel);
    };



    /**
     * событие оповещение пользователей приватного канала
     * @param {object} privateChannelOutDataModel  see  server PrivateChannelOut
     * @returns {void} 
     */
    client.onUserChannelsCreatedPrivateChannel = function (privateChannelOutDataModel, iHubGroupItem) {
        hubService._checkCurrentUser();
        if (iHubGroupItem) {
            hubService._addHubGroupForCr(iHubGroupItem);
        }
        $uChannelsService.onPrivateChannelCreated(privateChannelOutDataModel, $$RootScope);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} userId 
     * @returns {} 
     */
    hubService.userChannelsClosePrivateChannel = function (channelId, userId) {
        return server.userChannelsClosePrivateChannel(channelId, userId);
    };

    /**
     * 
     * @param {} hubName 
     * @returns {} 
     */
    hubService.userChannelsIsAvailableChannelName = function (hubName) {
        return server.userChannelsIsAvailableChannelName(hubName);
    };

    // #endregion


    // #region Group

    /**
     * 
     * @param {} iChannelDataModel 
     * @returns {} 
     */
    hubService.userChannelsCreateGroupChannel = function (iChannelDataModel) {
        return server.userChannelsCreateGroupChannel(iChannelDataModel);
    };
    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    hubService.userChannelsDeleteGroupChannelByOwner = function (channelId) {
        return server.userChannelsDeleteGroupChannelByOwner(channelId);
    };
    /**
     * 
     * @param {} channelId 
     * @param {} removeMeta 
     * @returns {} 
     */
    client.userChannelsGroupDropChannel = function (channelId, removeMeta, hubGroupName) {
        hubService._checkCurrentUser();
        if (hubGroupName) {
            hubService._removeHubGroupForCr(hubGroupName);
        }

        $uChannelsService.deleteGroupChannelFromLoclal(channelId, removeMeta);
    };
    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    client.userChannelsRemoveGroupSerchChannelItem = function (channelId) {
        hubService._checkCurrentUser();
        $uChannelsService.removeGroupSerchChannelItem(channelId);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} isPublic 
     * @returns {} 
     */
    client.userChannelsAddOrUpdateGroupSerchChannelItem = function (channelId, channelName, isPublic) {
        hubService._checkCurrentUser();
        $uChannelsService.addOrUpdateGroupSerchChannelItem(channelId, channelName, isPublic);
    };
    /**
     * 
     * @param {} partChannelName 
     * @returns {} 
     */
    hubService.userChannelsSerchGroupChannelNames = function (partChannelName) {
        return server.userChannelsSerchGroupChannelNames(partChannelName);
    };
    /**
     * 
     * @param {} intChannelId 
     * @param {} password 
     * @returns {} 
     */
    hubService.userChannelsJoinToGroupChannel = function (intChannelId, password) {
        return server.userChannelsJoinToGroupChannel(intChannelId, password);
    };
    /**
     * 
     * @param {} channelId 
     * @param {} newPassword 
     * @returns {} 
     */
    hubService.userChannelsUpdatePassword = function (channelId, newPassword) {
        return server.userChannelsUpdatePassword(channelId, newPassword);
    };

    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    hubService.userChannelsUnsubscribeUserFromGroupChannel = function (channelId) {
        return server.userChannelsUnsubscribeUserFromGroupChannel(channelId);
    };
    /**
     * 
     * @param {} channelAdminUsrId 
     * @param {} channelConnectionDataModel 
     * @returns {} 
     */
    client.onUserChannelsGroupUserUnsubscribe = function (channelAdminUsrId, iChannelConnectionUserOut) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupUserUnsubscribe(channelAdminUsrId, iChannelConnectionUserOut, $$RootScope);
    };
    client.onUserChannelsGroupUserSubscribe = function (channelAdminUsrId, iChannelConnectionUserOut) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupUserSubscribe(channelAdminUsrId, iChannelConnectionUserOut, $$RootScope);

    };


    hubService.userChannelsDeepDeleteOtherGroupChannels = function () {
        return server.userChannelsDeepDeleteOtherGroupChannels();
    };
    client.userChannelsAddOrUpdateGroupChannel = function (groupChannelOutDataModel, iHubGroupItem) {
        hubService._checkCurrentUser();
        if (iHubGroupItem) {
            hubService._addHubGroupForCr(iHubGroupItem);
        }
        $uChannelsService.addOrReplaceGroupChannelLocal(groupChannelOutDataModel);
    };

    /**
     * 
     * @param {object} tragetUserChannelConnectionUserOutDataModel 
     * @param {bool} updatePasswordByChannel 
     * @param {int} channelAdminUserId 
     * @returns {} 
     */
    hubService.userChannelsGroupUpdateUser = function (tragetUserChannelConnectionUserOutDataModel, updatePasswordByChannel, channelAdminUserId) {

        return server.userChannelsGroupUpdateUser(tragetUserChannelConnectionUserOutDataModel, updatePasswordByChannel, channelAdminUserId);
    };


    client.onUserChannelsCrUserGroupUpdatedPermition = function (iChannelConnectionUserOutCurrentUserDataModel) {
        hubService._checkCurrentUser();
        if (hubService._currentUser.UserId === iChannelConnectionUserOutCurrentUserDataModel.UserId) {
            $uChannelsService.onCrUserGroupUpdatedPermition(iChannelConnectionUserOutCurrentUserDataModel, $$RootScope);
        }
    };

    hubService.userChannelsGroupUploadIcon = function (newBase64SourceImageModel, channelId) {
        return server.userChannelsGroupUploadIcon(newBase64SourceImageModel, channelId);
    };


    client.onUserChannelsGroupIconUploaded = function (newIconUrl, channelId) {
        hubService._checkCurrentUser();
        $uChannelsService.onGroupIconUploaded(newIconUrl, channelId, $$RootScope);
    };



    // #endregion

     // #region alliance

    hubService.$onUserChannelsUserChangeAlliance = function (oldChannelId, newAllianceChannelOutDataModel) {
        $uChannelsService.onUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel, $$RootScope);
    };
    client.onUserChannelsUserChangeAlliance = function (oldChannelId,newAllianceChannelOutDataModel, newCrConnectionUser) {
        hubService._checkCurrentUser();
        if (newCrConnectionUser) {
            hubService._updateCurrentUser(newCrConnectionUser);
        }
        hubService.$onUserChannelsUserChangeAlliance(oldChannelId, newAllianceChannelOutDataModel);
    };

    // #endregion




}



Utils.CoreApp.gameAppExtensions.HubPersonalInfo = function (hubService, client, server, allianceService, profileService) {
    /**
     * 
     * @param {object} newBase64SourceImageModel see server  Base64ImageOut or  Utils.ModelFactory.Base64ImageOut
     * @returns {object}  signalR deffered => UserImageModel see  server UserImageModel or Utils.ModelFactory.IUserImageModel
     */
    hubService.personalInfoUpdateAvatar = function (newBase64SourceImageModel) { 
        return server.personalInfoUpdateAvatar(newBase64SourceImageModel);
    };
    /**
     * 
     * @param {} newUserImageModel  see  server UserImageModel or Utils.ModelFactory.IUserImageModel
     * @param {int} userId 
     * @param {int} allianceId 
     * @returns {void}
     */
    client.onPersonalInfoUserUpdateAvatar = function (newUserImageModel, userId, allianceId) {
        allianceService.onUserUpdateAvatar(newUserImageModel, userId, allianceId);
        profileService.onUserUpdateAvatar(newUserImageModel, userId, allianceId);
        console.log("onPersonalInfoUserUpdateAvatar.data", {
            newUserImageModel: newUserImageModel,
            userId: userId,
            allianceId: allianceId
        });
    };

    /**
     * 
     * @param {string} newDescriptionText 
     * @returns {object} signalR deffered  => string updated description
     */
    hubService.personalInfoUpdateUserDescription = function (newDescriptionText) {
        return server.personalInfoUpdateUserDescription(newDescriptionText);
    };
    /**
     * 
     * @param {string} userName 
     * @returns {object}   signalR deffered => object see server IPlanshetViewData (personal info)
     */
    hubService.personalInfoGetProfileByUserName = function (userName) {
        return server.personalInfoGetProfileByUserName(userName);
    };
    /**
     * 
     * @param {int} userId 
     * @returns {object} signalR deffered => object see server IPlanshetViewData (personal info)
     */
    hubService.personalInfoGetProfileByUserId = function (userId) {
        return server.personalInfoGetProfileByUserId(userId);
    };

}
Utils.CoreApp.gameAppExtensions.HubWorld = function (hubService, client, server) {
    /**
     * 
     * @returns {object}  signalR deffered   => see server IList<Sector>
     */
    hubService.worldGetSectors = function () {
        return server.worldGetSectors();
    };

    /**
     * 
     * @param {int} sectorId 
     * @returns {object}   signalR deffered    => see server IList<SystemsView>
     */
    hubService.worldGetSystems = function (sectorId) {
        return server.worldGetSystems(sectorId);
    };

    /**
     * 
     * @param {int} systemId 
     * @returns {}   signalR deffered      => see server Planetoids
     */
    hubService.worldGetSystemGeometry = function (systemId) {
        return server.worldGetSystemGeometry(systemId);
    };

    /**
     * 
     * @param {int} galaxyId 
     * @returns {object}    signalR deffered    => see server IPlanshetViewData (single GalaxyInfo)
     */
    hubService.worldGetGalaxyInfo = function (galaxyId) {
        return server.worldGetGalaxyInfo(galaxyId);
    };
    /**
     * 
     * @param {} sectorId 
     * @returns {object}    signalR deffered     => see server IPlanshetViewData (single SectorInfo)
     */
    hubService.worldGetSectorInfo = function (sectorId) {
        return server.worldGetSectorInfo(sectorId);
    };
    /**
     * 
     * @param {int} starId 
     * @returns {object}   signalR deffered     => see server IPlanshetViewData (single StarInfo)
     */
    hubService.worldGetStarInfo = function (starId) {
        return server.worldGetStarInfo(starId);
    };
    /**
     * 
     * @param {int} planetId 
     * @returns {object}  signalR deffered    => see server IPlanshetViewData  (single PlanetInfo)
     */
    hubService.worldGetPlanetInfo = function (planetId) {
        return server.worldGetPlanetInfo(planetId);
    };
    /**
     * 
     * @param {int} moonId 
     * @returns {object}    signalR deffered     => see server IPlanshetViewData    (single MoonInfo)
     */
    hubService.worldGetMoonInfo = function (moonId) {
        return server.worldGetMoonInfo(moonId);
    };

    /**
     * 
     * @param {string} planetName 
     * @param {numeric} serchPlanetType  (byte)
     * @returns {object}  signalR deffered     => see server IList<string> - planet names
     */
    hubService.worldSerchPlanetNames = function (planetName, serchPlanetType) {
        return server.worldSerchPlanetNames(planetName, serchPlanetType);
    };
};
Utils.CoreApp.gameAppExtensions.UserChannelsAlliance = function (service) {
 
    //service.getAllianceMenuConfig = function () {
    //    var btn = service.$btnHelper.ButtonsView();
    //    btn.ConstructorSizeBtn();
    //    service.$btnHelper.buttonPartialView();
    //};
    service.onUserChangeAlliance = function (oldChannelId, newAllianceChannelOutDataModel, $$RootScope) {
        service.deleteLocalChannelItem(service.ChannelTypes.Alliance, oldChannelId);
        service.addOrReplaceLocalChannelItem(newAllianceChannelOutDataModel);
        console.log("UserChannelsAlliance.onUserChangeAlliance", {service:service});
    };
};
Utils.CoreApp.gameAppExtensions.UserChannelsGroup = function (service) {
    var channelSerchContainer = {};
    var lock = false;

    function _filter(query, collection) {
        var _qwery = query.toLowerCase();
        return _.filter(collection, function (o) {
            return o.Name.toLowerCase().indexOf(_qwery) !== -1;
        });
    };

    function _filterByPublic(query, collection, isPuplic) {
        var _qwery = query.toLowerCase();
        return _.filter(collection, function (o) {
            return o.IsPublic === isPuplic && o.Name.toLowerCase().indexOf(_qwery) !== -1;
        });
    }


    function _filterByType(queryName, channelSerchTypes) {
        var local;
        if (queryName.length === 0) {
            local = channelSerchContainer;
        } else if (channelSerchTypes === service.ChannelSerchTypes.OnlyPublic) {
            local = _filterByPublic(queryName, channelSerchContainer, true);
        }
        else if (channelSerchTypes === service.ChannelSerchTypes.OnlyPrivate) {
            local = _filterByPublic(queryName, channelSerchContainer, false);
        }
        else {
            local = _filter(queryName, channelSerchContainer);
        }
        return local;
    }

    function _addSerchItems(collection) {
        _.forEach(collection, function (item, idxOrId) {
            service.addOrUpdateGroupSerchChannelItem(item.Id, item.Name, item.IsPublic);
        });
    }



    function _getUserChannel() {
        var crData = service.$currentUserInfo;
        var chats = service.getCollectionByChannelType(service.ChannelTypes.Group);
        if (!chats) return false;
        return _.find(chats, { CreatorId: crData.userId });

    };

    function _getGroupLimitModel() {
        var count = 0;
        var group = service.Group;
        if (group.Collection) {
            count = _.size(group.Collection);
        }
        return { count: count, max: group.MaxChannelsLimit };

    }

    service.getGroupLimitModel = _getGroupLimitModel;

    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.createGroupChannelControls = function (channelItem) {
        var createChannelBtn = service.$btnHelper.ButtonsView();
        createChannelBtn.ConstructorSizeBtn(3, true, "Create", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;

            var userChannel = _getUserChannel();
            if (userChannel) {
                service.$ucdH.openDialogUserHasChannel($event, userChannel.ChannelName)
                    .finally(function () {
                        lock = false;
                    });
            }
            else {
                var limit = _getGroupLimitModel();
                if (limit.count + 1 > limit.max) {
                    var translateTabName = service.getTabTranslateNameByChannelType(service.bodyIdx.Group);
                    service.$ucdH.openDialogChannelMaxLimit($event, translateTabName, limit.max).finally(function () {
                        lock = false;
                    });
                }
                else {
                    service.$ucdH.$mdDialog.show({
                        templateUrl: "dialog-channels-group-create-channel.tmpl",
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        fullscreen: true,
                        controller: "dialogCreateGroupChannelCtrl",
                        controllerAs: "dcgmCtrl"

                    }).then(function (ctrlScope) {
                        //create(ed)   
                        ctrlScope.$destroy();
                        lock = false;

                    }, function (ctrlScope) {
                        //cancel
                        ctrlScope.$destroy();
                        lock = false;
                    });
                    console.log("createGroupChannelControls.click", {
                        params: params,
                        $scope: $scope,
                        channelItem: channelItem
                    });
                }



            }
        });

        var joinToChannelBtn = service.$btnHelper.ButtonsView();
        joinToChannelBtn.ConstructorSizeBtn(3, true, "Join", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;
            var limit = _getGroupLimitModel();
            if (limit.count + 1 > limit.max) {
                var translateTabName = service.getTabTranslateNameByChannelType(service.bodyIdx.Group);
                service.$ucdH.openDialogChannelMaxLimit($event, translateTabName, limit.max).finally(function () {
                    lock = false;
                });
            }
            else {
                service.$ucdH.$mdDialog.show({
                    templateUrl: "dialog-channels-group-join.tmpl",
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    fullscreen: true,
                    controller: "dialogChannelsGroupJoinToChannel",
                    controllerAs: "jCtrl"

                }).then(function (ctrlScope) {
                    //create
                    ctrlScope.$destroy();
                    lock = false;
                }, function (ctrlScope) {
                    //cancel
                    lock = false;
                    ctrlScope.$destroy();
                });
            }


        });
        var deepDeleteBtn = service.$btnHelper.ButtonsView();
        deepDeleteBtn.ConstructorSizeBtn(3, true, "Delete all", function (params, $element, $attrs, $scope, $event) {
            if (lock) return;
            lock = true;
            service.$ucdH.openDialogDeepDeleteOtherGroupChannels($event)
                .then(function () {
                    //confirm
                    service.$hub.userChannelsDeepDeleteOtherGroupChannels()
                        .then(function (answer) {
                            var userChannel = _getUserChannel();
                            if (userChannel) {
                                _.forEach(service.Group.Collection, function (channel, channelId) {
                                    if (channel.ChannelId !== userChannel.ChannelId) {
                                        delete service.Group.Collection[channelId];
                                    }
                                });
                            }
                            else {
                                _.forEach(service.Group.Collection, function (channel, channelId) {
                                    delete service.Group.Collection[channelId];
                                });
                            }
                            lock = false;

                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            console.log("userChannelsService.groupSerchChannelItemsFilterAsync", {
                                errorAnswer: errorAnswer,
                                msg: msg
                            });
                            lock = false;
                        });


                }, function () {
                    //cancel
                    lock = false;
                });
        });
        return {
            buttons: [createChannelBtn, joinToChannelBtn, deepDeleteBtn]
        }

    };
    /**
     * 
     * @returns {} 
     */
    service.getSerchTypesView = function () {

        var all = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.All);
        all.Translate = Utils.CreateLangSimple("All", "Todas", "Все");
        all.Name = all.Translate.getCurrent();

        var onlyPublic = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.OnlyPublic);
        onlyPublic.Translate = Utils.CreateLangSimple("Public", "Abierto", "Открытые");
        onlyPublic.Name = onlyPublic.Translate.getCurrent();

        var onlyPrivate = Utils.ModelFactory.INameIdModel(service.ChannelSerchTypes.OnlyPrivate);
        onlyPrivate.Translate = Utils.CreateLangSimple("Protected", "Protegido", "Защищенныe");
        onlyPrivate.Name = onlyPrivate.Translate.getCurrent();


        return [all, onlyPublic, onlyPrivate];
    };

    /**
     * 
     * @param {} channelId 
     * @returns {} 
     */
    service.removeGroupSerchChannelItem = function (channelId) {
        if (channelSerchContainer[channelId]) {
            delete channelSerchContainer[channelId];
        }
    };
    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} isPublic 
     * @returns {} 
     */
    service.addOrUpdateGroupSerchChannelItem = function (channelId, channelName, isPublic) {
        channelSerchContainer[channelId] = Utils.ModelFactory.IChannelSerchItem(channelId, channelName, isPublic);
    };



    /**
     * 
     * @returns {} 
     */
    service.getGroupExistChannelNames = function () {
        var col = service.Group.Collection;
        if (!col) return [];
        return _.map(col, function (o) {
            return o.ChannelName.toLowerCase();
        });
    };
    /**
     * 
     * @param {} collection 
     * @param {} ignoreChannelNames 
     * @returns {} 
     */
    service.filterGroupByIgnoreNames = function (collection, ignoreChannelNames) {
        if (!ignoreChannelNames || !ignoreChannelNames.length) {
            return collection;
        }
        return _.filter(collection, function (o) {
            var name = o.Name.toLowerCase();
            var ignore = _.includes(ignoreChannelNames, name);
            return !ignore;
        });
    };

    /**
     * 
     * @param {} newGroupChannelOut 
     * @returns {} 
     */
    service.addOrReplaceGroupChannelLocal = function (newGroupChannelOut) {
        newGroupChannelOut.ComplexButtonView.IsNewItem = true;
        service.addOrUpdateGroupSerchChannelItem(newGroupChannelOut.ChannelId, newGroupChannelOut.ChannelName, newGroupChannelOut.IsPublic);
        service.addOrReplaceLocalChannelItem(newGroupChannelOut);
    };

    var serchInProgress = false;
    /**
     * 
     * @param {} queryName 
     * @param {} channelSerchTypes 
     * @returns {} 
     */
    service.groupSerchChannelItemsFilterAsync = function (queryName, channelSerchTypes, ignoreLocal) {
        queryName = queryName.trim();
        var deferred = service.$q.defer();
        if (serchInProgress) {
            deferred.resolve([]);
            return deferred.promise;
        }

        var local;
        if (!ignoreLocal) {
            local = _filterByType(queryName, channelSerchTypes);
            if (local.length !== 0) {
                deferred.resolve({ items: local ,fromLocal:true});
                return deferred.promise;
            }

        }

        serchInProgress = true;
        service.$hub.userChannelsSerchGroupChannelNames(queryName)
            .finally(function () {
                serchInProgress = false;
            }).then(function (answer) {
                console.log("groupSerchChannelItemsFilterAsync.answer", {
                    answer: answer
                });
                _addSerchItems(answer);
                local = _filterByType(queryName, channelSerchTypes);
                deferred.resolve({ items: local, fromLocal: false });

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                deferred.reject(errorAnswer, msg);
                console.log("userChannelsService.groupSerchChannelItemsFilterAsync", {
                    queryName: queryName,
                    errorAnswer: errorAnswer,
                    msg: msg
                });
            });
        return deferred.promise;

    };
    /**
     * 
     * @param {} iChannelDataModel 
     * @param {} onDone 
     * @param {} onError 
     * @returns {} 
     */
    service.createGroupChannel = function (iChannelDataModel, onDone, onError) {
        service.$hub.userChannelsCreateGroupChannel(iChannelDataModel)
            .then(function (newGroupChannelOut) {
                service.addOrReplaceGroupChannelLocal(newGroupChannelOut);
                if (onDone instanceof Function) onDone();
            }, onError);
    };


    /**
     * 
     * @param {} channelId 
     * @param {} $event 
     * @param {} onFinally 
     * @returns {} 
     */
    service.$deleteGroupChannelByOwner = function (channelId, $event, onFinally) {
        service.$hub
            .userChannelsDeleteGroupChannelByOwner(channelId)
            .then(function (answer) {
                onFinally();
                service.deleteGroupChannelFromLoclal(channelId, true);

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                if (msg === ErrorMsg.NotPermitted) {
                    service.$ucdH.openDialogNotPermitted($event).finally(onFinally);
                }
                else {
                    onFinally();
                    throw Errors.ClientNotEqualException({
                        errorAnswer: errorAnswer,
                        msg: msg
                    });
                }
            });
    };
    /**
     * 
     * @param {} channelId 
     * @param {} removeMeta 
     * @returns {} 
     */
    service.deleteGroupChannelFromLoclal = function (channelId, removeMeta) {
        if (removeMeta) {
            service.removeGroupSerchChannelItem(channelId);
        }

        service.deleteLocalChannelItem(service.ChannelTypes.Group, channelId);
    };

    /**
     * 
     * @param {} channelId 
     * @param {} channelName 
     * @param {} $event 
     * @returns {} 
     */
    service.unsubscribeFromGroupChannel = function (channelId, channelName, $event) {
        if (lock) return;
        lock = true;
        console.log("confunsubscribeFromGroupChannelirm", {
            channelId: channelId,
            channelName: channelName,
            $event: $event
        });
        service.$ucdH.openDialogUnsubscribeFromGroupChannel($event, channelName).then(function () {
            //confirm                       
            service.$hub.userChannelsUnsubscribeUserFromGroupChannel(channelId)
                .then(function (answer) {
                    service.deleteGroupChannelFromLoclal(channelId, false);
                    lock = false;
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.IsEmpty) {
                        service.deleteGroupChannelFromLoclal(channelId, false);
                        lock = false;
                    }
                    else {
                        lock = false;
                        throw Errors.ClientNotImplementedException({
                            errorAnswer: errorAnswer,
                            msg: msg,
                            channelId: channelId,
                            channelName: channelName,
                            channel: service.Group.Collection[channelId]
                        });
                    }
                });




        }, function () {
            //cancel
            console.log("cancel");
            lock = false;
        });

    };


    service.addOrUpdateGroupUserToLocalAdminUsers = function (iChannelConnectionUserOut) {
        var channel = service.getChannelByChannelType(iChannelConnectionUserOut.ChannelType, iChannelConnectionUserOut.ChannelId);
        if (channel) {
            if (!channel.Users) {
                channel.Users = {};
            }
            channel.Users[iChannelConnectionUserOut.Id] = iChannelConnectionUserOut;
            return channel;
        }
    };
    service.deleteGroupUserFromLocalAdminUsers = function (iChannelConnectionUserOut) {
        var channel = service.getChannelByChannelType(iChannelConnectionUserOut.ChannelType, iChannelConnectionUserOut.ChannelId);
        if (channel && channel.Users && channel.Users[iChannelConnectionUserOut.Id]) {
            delete channel.Users[iChannelConnectionUserOut.Id];
        }
        return channel;

    };
    service.setIncorrectPwToToLocalAdminUsers = function (channelId) {
        var channel = service.getChannelByChannelType(service.ChannelTypes.Group, channelId);
        if (channel && channel.Users) {
            _.forEach(channel.Users, function (o) {
                o.HasCorrectPassword = false;
            });
        }
    };

    /**
     * 
     * @param {} channelAdminUsrId 
     * @param {} channelConnectionDataModel 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onGroupUserUnsubscribe = function (channelAdminUserId, iChannelConnectionUserOut, $$RootScope) {
        if (channelAdminUserId === service.$currentUserInfo.userId) {
            console.log("onGroupUserUnsubscribe", {
                channelAdminUserId: channelAdminUserId,
                iChannelConnectionUserOut: iChannelConnectionUserOut,
                $$RootScope: $$RootScope,
            });
            var channel = service.deleteGroupUserFromLocalAdminUsers(iChannelConnectionUserOut);
            if (channel) {
                $$RootScope.$broadcast("user-channels-group-:user-unsubscribe", {
                    // is not userId    is ChannelConnection.Id
                    ChannelConnectionUserOut: iChannelConnectionUserOut,
                    channel: channel
                });
            }

        }

        //todo code heare
    };

    /**
     * 
     * @param {} channelAdminUserId 
     * @param {} iChannelConnectionUserOut 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onGroupUserSubscribe = function (channelAdminUserId, iChannelConnectionUserOut, $$RootScope) {
        if (channelAdminUserId === service.$currentUserInfo.userId) {
            var channel = service.addOrUpdateGroupUserToLocalAdminUsers(iChannelConnectionUserOut);
            if (channel) {
                $$RootScope.$broadcast("user-channels-group-:user-subscribe", {
                    // is not userId    is ChannelConnection.Id
                    ChannelConnectionUserOutId: iChannelConnectionUserOut.Id,
                    channel: channel
                });
            }
        }
    };


    service.onCrUserGroupUpdatedPermition = function (iChannelConnectionUserOutCurrentUserDataModel, $$RootScope) {  
        var data = iChannelConnectionUserOutCurrentUserDataModel;
        if (service.$currentUserInfo.userId !== data.UserId) return;
        var channel = service.getChannelByChannelType(data.ChannelType, data.ChannelId);
        if (channel) {
            channel.MessageSend = data.MessageSend;
            $$RootScope.$broadcast("channelItem:update-permition", {
                channel: channel
            });
        }
    };

    service.onGroupIconUploaded = function (newIconUrl, channelId, $$RootScope) {
        var channel = service.getChannelByChannelType(service.ChannelTypes.Group, channelId);
        if (channel) {
            var cb = service.getCbButtonByIdx(0, channel);
            if (cb && cb.Data) {
                cb.Data.ImagePathOrCss = newIconUrl;
                $$RootScope.$broadcast("user-channels-group-:channel-icon-updated", {
                    channel: channel
                });
            }            

        }   

    };

};
Utils.CoreApp.gameAppExtensions.UserChannelsPrivate = function (service) {

    service.getPriavateLeftRightCbName = function (nativeName, cbView) {
        if (cbView && cbView.$leftName) {
            return {
                leftName: cbView.$leftName,
                rightName: cbView.$rightName
            };
        }
        var names = _.split(nativeName, "<==>");
        var leftName = names[0].trim();
        var rightName = names[1].trim();
        if (cbView) {
            if (!cbView.$leftName || cbView.$leftName !== leftName) {
                cbView.$leftName = leftName;
            }

            if (!cbView.$rightName || cbView.$rightName !== rightName) {
                cbView.$rightName = rightName;
            }
        }

        return {
            leftName: leftName,
            rightName: rightName
        };
    };
    service.getPriavateCbHeadHtml = function (leftRight) {
        return "<div class=html-content>" + Utils.SetSpanText(leftRight.leftName) + Utils.SetSpanText(leftRight.rightName) + "</div>";
    };


    var lock = false;
    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.createPrivateChannelControls = function (channelItem) {
        return {
            buttons: [service.$btnHelper.ButtonsView().ConstructorSizeBtn(1, true, "Create private channel", function (params, $element, $attrs, $scope, $event) {
                if (lock) return;
                lock = true;

                function $destroy(ctrlScope) {
                    ctrlScope.$destroy();
                    lock = false;
                }

                service.$ucdH.$mdDialog.show({
                    templateUrl:"dialog-channel-private-create-channel.tmpl",
                    parent:angular.element(document.body),
                    targetEvent:$event,
                    clickOutsideToClose:false,
                    fullscreen:true,
                    controller:"dialogCreatePrivateChannelCtrl",
                    controllerAs:"dcpmCtrl"
                }).then($destroy, $destroy);
            })]
        };
    };
    /**
     * 
     * @param {} privateChannelOutDataModel 
     * @param {} $$RootScope 
     * @returns {} 
     */
    service.onPrivateChannelCreated = function (privateChannelOutDataModel, $$RootScope) {
        privateChannelOutDataModel.ComplexButtonView.IsNewItem = true;
        service.checkPrivateHead(privateChannelOutDataModel);
        service.addOrReplaceLocalChannelItem(privateChannelOutDataModel);  
    };
    /**
     * 
     * @param {} channelId 
     * @param {} channelType 
     * @param {} $event 
     * @returns {} 
     */
    service.deletePrivateChannel = function (channelId, channelType, $event) {
        if (lock) return;
        try {
            lock = true;
            var channel = service.getChannelByChannelType(channelType, channelId);
            var cr = service.$currentUserInfo;
            var cbV = channel.ComplexButtonView;
            var targetUserName = cbV.$rightName;
            if (channel.CreatorId !== cr.userId) targetUserName = cbV.$leftName;

            service.$ucdH.openDialogConfirmDeletePrivateChannel($event, targetUserName)
                .then(function () {
                    //confirm
                    service.$hub.userChannelsClosePrivateChannel(channelId, cr.userId)
                        .finally(function () {
                            lock = false;
                        })
                        .then(function (answer) {
                            service.deleteLocalChannelItem(channelType, channelId);
                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                errorAnswer: errorAnswer,
                                msg: msg
                            }, "userChannelsService.sendMessage");
                        });


                }, function () {
                    console.log("openDialogConfirmDeletePrivateChannel.cancel");
                    //cancel
                    lock = false;
                });

        }
        catch (e) {
            lock = false;
            throw Errors.ClientNotImplementedException({ channelId: channelId, channelType: channelType, $event: $event }, "throw.deletePrivateChannel", e);
        }


    };
    /**
     * 
     * @param {} channelItem 
     * @returns {} 
     */
    service.checkPrivateHead = function (channelItem) {
        if (channelItem.ChannelType === service.ChannelTypes.Private) {
            var cbData = channelItem.ComplexButtonView.Collection[1].Data;
            if (!cbData.$headNative) {
                var native = cbData.Head;
                var leftRight = service.getPriavateLeftRightCbName(native, channelItem.ComplexButtonView);
                cbData.Head = service.getPriavateCbHeadHtml(leftRight);
                cbData.$headNative = native;
            }
        }
    };
    /**
     * 
     * @param {} setToLower 
     * @returns {} 
     */
    service.getPrivateExistChannelNames = function (setToLower) {
        var col = service.Private.Collection;
        if (!col) return [];
        var names = [];
        _.forEach(col, function (item, channelId) {
            var lf = service.getPriavateLeftRightCbName(item.ChannelName, col.ComplexButtonView);
            names.push(lf.leftName, lf.rightName);
        });
        names = _.uniq(names);
        if (setToLower) {
            names = names.join("|").toLowerCase().split("|");
        }
        return names;
    };

};


Utils.CoreApp.gameAppExtensions.ConfederationOfficers = function (service) {
    var lock = false;
    service.getPresidentOfficerFromOfficerList = function (listOfficers) {
        return _.find(listOfficers, function (o) {
            return o.Type === service.OfficerTypes.President;
        });
    };

    service.officerOpenFormSetOfficer = function ($event, emptyUserOfficerOutDataModel, presidentUserOfficer, currentUserShortInfo, postName) {
        if (lock || currentUserShortInfo.userId !== presidentUserOfficer.UserId) return;
        lock = true;
        service.$cdH.$mdDialog.show({
            templateUrl: "dialog-set-officer.tmpl",
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            fullscreen: true,
            bindToController: true,
            _locals: {
                postName: postName,
                presidentOfficer: presidentUserOfficer,
                targetOficer: emptyUserOfficerOutDataModel
            },
            controller: "dialogSetOfficerCtrl",
            controllerAs: "soCtrl"

        }).then(function (ctrlScope) {
            //create(ed)   
            ctrlScope.$destroy();
            lock = false;

        }, function (ctrlScope) {
            //cancel
            ctrlScope.$destroy();
            lock = false;
        });
        console.log("createGroupChannelControls.click", {
            emptyUserOfficerOutDataModel: emptyUserOfficerOutDataModel,
        });


    };

    service.addOrUpdateOfficer = function (newUserOfficerOutDataModel, $$RootScope) {
        var oficers = service.Officers.Officers;
        if (newUserOfficerOutDataModel && oficers) {
            //todo code heare
            var type = newUserOfficerOutDataModel.Type;
            var elected = newUserOfficerOutDataModel.Elected;
            // колекция упорядочена по типу - можно обращаться по индексу
            var idx = type - 1;
            var item = oficers[idx];
            var userOficer = elected ? item.Elected : item.Appointed;
            if (userOficer.Type !== type || userOficer.Elected !== elected) {
                throw Errors.ClientNotImplementedException({
                    newUserOfficerOutDataModel: newUserOfficerOutDataModel,
                    oficers: oficers
                }, "userOficer.Type !== type || userOficer.Elected !== elected");
            }
            Utils.UpdateObjData(userOficer, newUserOfficerOutDataModel);
            // данных обновлять по скоупу не требуется можно выходить
            console.log("addOrUpdateOfficer && service.Officers.Officers", {
                newUserOfficerOutDataModel: newUserOfficerOutDataModel,
                LocalOficers: oficers,
                $$RootScope: $$RootScope,
            });
        }
        else {
            console.log("addOrUpdateOfficer.error no Data", {
                LocalOficers: oficers,
                newUserOfficerOutDataModel: newUserOfficerOutDataModel

            });
        }

    };

    service.getIUserOfficerOutListFromOfficers = function () {
        var result = [];
        _.forEach(service.Officers.Officers, function (val, idx) {
            if (val) {
                if (val.Elected) {
                    result.push(val.Elected);
                } if (val.Appointed) {
                    result.push(val.Appointed);
                }
            }
        });
        return result;
    };
    service.officerGetExistOfficerNames = function (setToLower) {
        var col = service.getIUserOfficerOutListFromOfficers();
        if (!col) return [];
        var names = [];
        _.forEach(col, function (item, idx) {
            if (item.UserName && item.UserName.length > 3 && item.UserName !== "None") {
                names.push(item.UserName);
            }
        });

        if (setToLower) {
            names = names.join("|").toLowerCase().split("|");
        }
        return names;
    };

    service.getOfficerBonusForCurrentUser = function () {
        var result = Utils.ModelFactory.IBattleStats();
        var crInfo = service.$currentUserInfo;
        var crAllianceId = crInfo.AllianceId;

        if (GameServices.npcHelper.isNpcAllianceId(crAllianceId)) {
            return result;
        }   
        var list = service.getIUserOfficerOutListFromOfficers();
        if (_.isEmpty(list)) {
            return result;
        }
        //todo code heare
        return result;
    };

};
Utils.CoreApp.gameAppExtensions.ConfederationRating = function (service) {

    service.ratingGetNextPage = function (ratingData, onDone, onError) {
        function _onError(errorAnswer) {
            var msg = Errors.GetHubMessage(errorAnswer);
            var errorData = {
                msg: msg,
                errorAnswer: errorAnswer,
                onDone: onDone
            };
            onError(errorAnswer, msg, errorData);
            throw Errors.ClientNotImplementedException(errorData, "ConfederationRating.ratingGetNextPage");
        }
        var skip = ratingData.Users.length;
        service.$hub.confederationRatingGetNextPage(skip)
            .then(function (answer) {
                _.forEach(answer, function (item, idx) {
                    ratingData.Users.push(item);
                });
                onDone(answer);
            }, _onError);
    };
    service.ratingAddAndTakeLocalUsers = function (dataUsers, targetArr, take) {
        if (!_.isInteger(take)) return;
        var skip = targetArr.length;

        var max = skip + take;
        if (!dataUsers[max]) {
            max = dataUsers.length;
        }
        _.forEach(dataUsers, function (item, idx) {
            if (idx >= skip && idx < max) {
                targetArr.push(item);
            }
        });
    }

    service.ratingAddUserItemsToOld = function (oldUsers, newUsers) {
        var newLenght = newUsers.length;
        for (var i = 0; i < newLenght; i++) {
            oldUsers.push(newUsers[i]);
        }
    };
    /**
     * 
     * @param {object} ctrl  must contain   "users" property  - array
     * @returns {} 
     */
    service.ratingCheckAndFixUniqe = function (ctrl) {
        if (!ctrl.users) return;
        var beforeLenght = ctrl.users.length;
        var unic = _.uniqBy(ctrl.users, "UserId");
        if (beforeLenght !== unic.length) {
            service.Rating.Users = _.uniqBy(service.Rating.Users, "UserId");
            ctrl.users = [];
            service.ratingAddAndTakeLocalUsers(service.Rating.Users, ctrl.users, beforeLenght);
            if (service.Rating.$totalCount) {
                service.Rating.$totalCount = null;
            }
        }
    };

    var _userInlock = false;

    service.ratingGetUserItem = function (userId, users, onDone, onError) {    
        if (_userInlock) {
            onError({}, ErrorMsg.Locked, {});
            return;
        }
       
        _userInlock = true;
        var item = _.find(users, function (o) {
            return o.UserId === userId;
        });
        if (item) {
            try {
                onDone(item);
                _userInlock = false;
            }
            catch (e) {
                _userInlock = false;
                throw console.log("retingGetUserItem.local", { e: e });
            }


        }
        else {  
            if (GameServices.planshetService.getInProgress()) {
                onError({}, ErrorMsg.Locked, {});
                return;;
            }

            GameServices.planshetService.setInProgress(true);
            service.$hub.confederationRatingGetUser(userId).finally(function () {
                    GameServices.planshetService.setInProgress(false);
                })
                .then(function (answer) {
                    try {
                        onDone(answer);
                        _userInlock = false;
                    }
                    catch (e) {
                        _userInlock = false;  
                        throw console.log("retingGetUserItem.answer", { e: e });
                    }

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    var errorData = {
                        msg: msg,
                        userId: userId,
                        users: users,
                        errorAnswer: errorAnswer,
                        onDone: onDone,
                        onError: onError
                    };
                    if (onError instanceof Function) {
                        onError(errorAnswer, msg, errorData);
                    }
                    _userInlock = false;
                    throw Errors.ClientNotImplementedException(errorData, "ConfederationRating.ratingGetNextPage");

                });
        }

    };

};


Utils.CoreApp.gameAppExtensions.ConfederationElection = function (service) {
    var $lsFvKey = Utils.RepoKeys.LsKeys.FloatVoteParams;
    var $lsRegKey = Utils.RepoKeys.LsKeys.VoteRegistredData;
    var $ls = Utils.LocalStorage;           
    function _addVoteView(onDone) { 
        setTimeout(function () {
            var container = $("#skagry-container");
            if (!container || !container.length) {    
                _addVoteView(onDone);
                return;
            }
            else {
                var existContainer = $("#float-vote-container");
                if (!existContainer || !existContainer.length) {
                    service.$compileHelper.$appendHtml(container, "<float-vote/>");
                    if (onDone) {
                        onDone();
                    }
                }

            }
      
            
        });

    };

    function _getFromLsVoteParams() {
        return $ls.GetFromStorage($lsFvKey, true);
    }


    function _getDefaultVoteParams() {
        return {
            position: { top: 185, left: 105 },    // for floate vote
            show: true, // in vote float state opened or not    
            voiceSendedInWeek: false,
            startDay: 5,
            endDay: 7,
            startEndHour: 20
        };
    };


    service.updateCandidates = function (candidatesOutList, updateVotes, $$RootScope) {
        if(_.isEqual(service.Election.Candidates, candidatesOutList)) {
            console.log("service.updateCandidates.isEqual", {
                candidatesOutList:candidatesOutList,
                updateVotes:updateVotes,
                service:service
            });
            return;
        }  
        if (updateVotes &&  service.Election.Candidates &&  candidatesOutList.length === service.Election.Candidates.length) {
            var current = _.map(service.Election.Candidates, function (o) {
                return o.Id;
            });
            var target = _.map(candidatesOutList, function (o) {
                return o.Id;
            });
            if (_.isEqual(current, target)) {
                Utils.UpdateObjData(service.Election.Candidates, candidatesOutList);
            }
            else {
                service.Election.Candidates = candidatesOutList;
            }

        }
        else {
            service.Election.Candidates = candidatesOutList;       
        }
        $$RootScope.$broadcast("election:update-candidates", { Candidates: service.Election.Candidates, updateVotes: updateVotes });

        //console.log("service.updateCandidates", {
        //    candidatesOutList: candidatesOutList,
        //    updateVotes: updateVotes,
        //    $$RootScope: $$RootScope,
        //});
    };

    var _lockCheckAndRunOrDestroyVoteView = false;
    service.$checkAndRunOrDestroyVoteView = function (election) {
        if (_lockCheckAndRunOrDestroyVoteView) {
            return;
        }
        _lockCheckAndRunOrDestroyVoteView = true;

        function _unlock()
        {
            _lockCheckAndRunOrDestroyVoteView = false;
        }
        var isRegisterPeriod =election.IsRegisterPeriod;
        var existContainer = $("#float-vote-container");
        if (!isRegisterPeriod) {
            if (existContainer && existContainer.length) {
                _unlock();
                return;
            }
            var candidates = election.Candidates;
            if (!candidates || !candidates.length) {
                //console.log("$checkAndRunOrDestroyVoteView: !isRegisterPeriod !candidates || !candidates.length");
                var dom = $("#float-vote-container");
                if (dom && dom.length) {
                    dom.remove(); 
                }
                _unlock();
               return;
            }
            var gameScope = $("#Game").scope();
            if (gameScope.gameCtrl.skagryLoaded) {
                console.log("$checkAndRunOrDestroyVoteView: if gameScope.gameCtrl.skagryLoaded");
                _addVoteView(_unlock);
            }
            else {
                //console.log("$checkAndRunOrDestroyVoteView: else : skagry not loaded");
                var clearWatch = gameScope.$watch("gameCtrl.skagryLoaded", function (newVal, oldVal) {
                    console.log("$checkAndRunOrDestroyVoteView: clearWatch");
                    if (newVal) {
                       // console.log("$checkAndRunOrDestroyVoteView: clearWatch newVal");
                        _lockCheckAndRunOrDestroyVoteView = true;
                        _addVoteView(function() {
                            _unlock();
                            clearWatch();
                        });  
              
                    } else {
                        _unlock();
                    }
                });

            }
        }
        else {
            //console.log("$checkAndRunOrDestroyVoteView: else :  isRegisterPeriod");
            if (existContainer && existContainer.length) {
                existContainer.remove();
            }
            _unlock();

        }
    }
    service.$saveToLsVoteParams = function (voteParams) {
        $ls.SaveInStorage($lsFvKey, voteParams, true);
    };

    service.$isVotePeriod = function (election) {
        var cutrTime = Utils.Time.GetUtcNow();
        return cutrTime >= election.StartVoteTime && cutrTime <= election.EndVoteTime;
    };
    service.$checkAndUpdateHasVoice = function (voteParams) {
        if (!voteParams.voiceSendedInWeek) return;
        var cutrTimeMs = Utils.Time.GetUtcNow(true);
        var curTimeDt = Utils.Time.GetUtcDateTimeFromMsUtc(cutrTimeMs);
        var curDay = curTimeDt.getDay();
        var currFixedDay = curDay === 0 ? 7 : curDay;

        if (currFixedDay < voteParams.startDay) {
            voteParams.voiceSendedInWeek = false;
            service.$saveToLsVoteParams(voteParams);
            return;
        }

        var currHour = curTimeDt.getHours();
        if (voteParams.startDay === curDay && currHour < voteParams.startEndHour || voteParams.endDay === curDay && currHour >= voteParams.startEndHour) {
            voteParams.voiceSendedInWeek = false;
            service.$saveToLsVoteParams(voteParams);
            return;
        }
    };

    var _addVoteInProgress = false;
    service.addVoiceToOfficer = function ($event, candidat, voteParams, onDone, onError, $rootScope) {
        //console.log("ConfederationElection.addVoiceToOfficer", {
        //    $event: $event,
        //    candidat: candidat,
        //    voteParams: voteParams,
        //    onDone: onDone,
        //    onError: onError,
        //    $rootScope: $rootScope,
        //});

        if (_addVoteInProgress) {
            onError(ErrorMsg.Locked);
          //  console.log("addVoiceToOfficer:addVoteInProgress");
            return;
        }
        if (!candidat || !voteParams || !candidat.UserId) {
            onError(ErrorMsg.InputDataIncorrect);
          //  console.log("addVoiceToOfficer:!candidat || !voteParams || !candidat.UserId");
            return;
        }
        if (voteParams.voiceSendedInWeek) {
            service.$cdH.openDialogUserHasAlreadyCastVote($event);
            //todo open dialog you already hasVote  
            onError(ErrorMsg.UserHasAlreadyCastVote);
            return;
        }
        _addVoteInProgress = true;

        service.$cdH.openDialogConfirmSendVote($event, candidat.UserName).then(function () {
            service.$hub.confederationAddVote(candidat.UserId).then(function (answerOk) {
                voteParams.voiceSendedInWeek = true;
                service.$saveToLsVoteParams(voteParams);
                _addVoteInProgress = false;
                onDone();
                $rootScope.$broadcast("election:cr-user-voice-added", {
                    params: voteParams
                });
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    msg: msg,
                    candidat: candidat,
                    voteParams: voteParams,
                    errorAnswer: errorAnswer,
                    onDone: onDone,
                    onError: onError
                };

                if (msg === ErrorMsg.UserHasAlreadyCastVote) {
                    service.$cdH.openDialogUserHasAlreadyCastVote($event);
                    voteParams.voiceSendedInWeek = true;
                    service.$saveToLsVoteParams(voteParams);

                } else if (msg === ErrorMsg.TimeVotingIsOver) {
                    service.$cdH.openDialogTimeVotingIsOver($event);
                    voteParams.voiceSendedInWeek = false;
                    // voteParams.show = false;
                    service.$saveToLsVoteParams(voteParams);

                    //$rootScope.$broadcast("election:finished", {
                    //    Officers: service.Officers.Officers,
                    //    election: service.Election
                    //});

                }

                if (onError instanceof Function) {
                    onError(msg);
                }
                _addVoteInProgress = false;

                throw Errors.ClientNotImplementedException(errorData, "addVoiceToOfficer.ratingGetNextPage");
            });
        }, function () {
            onError("cancel");
        });

    };


    var _registrateOfficerInProgress = false;
    service.$registrateOfficer = function (params, $element, $attrs, $scope, $event) {
        if (_registrateOfficerInProgress) return;
        _registrateOfficerInProgress = true;
        var election = service.getElectionData();
        var userInfo = service.$currentUserInfo;
        if (!election.IsRegisterPeriod) {
            service.$cdH.openDialogTimeRegistrationIsOver($event).finally(function () {
                election.RegistrBtn = null;
                $element.remove();
                _registrateOfficerInProgress = false;
            });

        }
        else {
            var $rs = GameServices.resourceService;
            var ccPrice = election.RegistrCcPrice;
            var isEnoughCc = $rs.isEnoughCc(ccPrice);
            if (!isEnoughCc) {
                service.$cdH.openDialogRegistrationNotEnoughCc($event, ccPrice, $rs.getCcCount()).finally(function () {
                    _registrateOfficerInProgress = false;
                });
            }
            else {
                service.$hub.confederationRegistrateCandidate().then(function (answer) {
                    $rs.setCc(answer);
                    _registrateOfficerInProgress = false;

                }, function (errorAnswer) {

                    var msg = Errors.GetHubMessage(errorAnswer);

                    if (msg === ErrorMsg.NotEnoughCc) {
                        var newCc = $rs.setBalanceFromErrorAnswerNotEnoughCc(errorAnswer);
                        service.$cdH.openDialogRegistrationNotEnoughCc($event, ccPrice, newCc).finally(function () {
                            _registrateOfficerInProgress = false;
                        });
                    }

                    _registrateOfficerInProgress = false;
                    var errorData = {
                        msg: msg,
                        errorAnswer: errorAnswer,
                    }
                    console.log("$registrateOfficer.errorAnswer", errorData);
                    throw errorData;
                });


            }
        }


        //console.log("ConfederationElection.$registrateOfficer", {
        //    params: params,
        //    $element: $element,
        //    $attrs: $attrs,
        //    $scope: $scope,
        //    $event: $event,
        //});
    };
    service.$saveRegistredToLsByElection = function (election, registred) {
        $ls.SaveInStorage($lsRegKey, {
            Registred: registred,
            StartVoteTime: election.StartVoteTime,
            StartRegistrationTime: election.StartRegistrationTime,
            EndVoteTime: election.EndVoteTime
        }, true);
    };
    service.getElectionData = function () {
        var election = service.Election;
        var $isRegistredPeriod = !service.$isVotePeriod(election);
        if (election.IsRegisterPeriod !== $isRegistredPeriod) {
            election.IsRegisterPeriod = $isRegistredPeriod;
        }
        var curTime = Utils.Time.GetUtcNow();
        var lsData = $ls.GetFromStorage($lsRegKey, true);
        if (election.IsRegisterPeriod) {
            //data
            if (!election.Registred) {
                if (!lsData || curTime > lsData.StartVoteTime) {
                    service.$saveRegistredToLsByElection(election, false);
                }
                else if (lsData.Registred) {
                    if (Math.abs(lsData.StartVoteTime - election.StartVoteTime) < 10) {
                        election.Registred = lsData.Registred;
                    } else {
                        service.$saveRegistredToLsByElection(election, false);
                    }


                }

            }
            else if (election.Registred && (!lsData || !lsData.Registred)) {
                service.$saveRegistredToLsByElection(election, true);
            }

            //btn
            if (election.Registred && election.RegistrBtn) {
                election.RegistrBtn = null;
            }
            else if (!election.Registred && !election.RegistrBtn) {
                election.RegistrBtn = service.$btnHelper.ButtonsView()
                    .ConstructorSizeBtn(1, true, "Registrate (" + election.RegistrCcPrice + " CC)", service.$registrateOfficer);
            }


        }
        else {
            if (election.RegistrBtn) {
                election.RegistrBtn = null;
            }
            if (lsData) {
                $ls.RemoveItem($lsRegKey);
            }
            if (election.Registred) {
                election.Registred = false;
            }
        }


        if (!election.$params) {
            election.$params = _getFromLsVoteParams();
            if (!election.$params) {
                election.$params = _getDefaultVoteParams();
                service.$saveToLsVoteParams(election.$params);
            }
        }
        service.$checkAndUpdateHasVoice(election.$params);
        service.$checkAndRunOrDestroyVoteView(election);
        return election;


    };
               
    service.onVoteFinalize = function (tabElectionData, newListIOfficerOut, $$RootScope) {
        service.Officers.Officers = newListIOfficerOut;
        service.Election = tabElectionData;    
        service.getElectionData();
        if (tabElectionData) {
            $$RootScope.$broadcast("election:finished", {
                newListIOfficerOut: service.Officers.Officers,
                election: service.Election
            });
        }
        //console.log({
        //    newListIOfficerOut: newListIOfficerOut,
        //    tabElectionData: tabElectionData,
        //    $$RootScope: $$RootScope
        //});
    };
};

// прототипное наследование http://rav.pw/angularjs-inheritance/
var GameServices = {
    buildReqHelper: {},
    buildService: {},
    commandCenterService: {},
    industrialComplexService: {},
    laboratoryService: {},
    spaceShipyardService: {},

    //#region Hub
    mainGameHubService: {},
    //#endregion
    userChannelsService:{},
    allianceService: {},

    bookmarkService: {},
    confederationService: {},
    estateService: {},
    gameChestService: {},
    hangarService: {},
    journalService: {},
    mapInfoService: {},

    planshetService: {},
    profileService: {},
    resourceService: {},
    tabService: {},
    translateService: {},
    unitDialogService: {},

 
    controlDiskHelper: {},
    controlPanelSwicherHelper: {},
    dropableElementHelper: {},
    journalHelper: {},
    mainHelper: {},
    mapControlHelper: {},
    mapInfoHelper: {},
    npcHelper: {},
    paralaxButtonHelper: {},
    planshetHelper: {},
    scrollerHelper: {},
    statisticHelper: {},
    techTreeHelper: {},
    timerHelper: {},
    uploadHelper: {},
    _updatePlanshet: null,
    Init: function (services) {
        $.extend(this, services);
    }
};
 
Utils.CoreApp.gameApp = angular.module("gameApp", ["ngMaterial",
    "ngSanitize",
    "infinite-scroll",
    "angular-medium-editor",
    "ngMessages",
    "svgAssetsCache",
    "angularFileUpload",
    "ngFileUpload",
    "ngImgCrop",
    "uiCropper",
    "angularAppCommon"]);
Utils.CoreApp.gameApp.config(["$mdThemingProvider", function ($mdThemingProvider) {
    $mdThemingProvider.disableTheming();
    //$mdThemingProvider.theme("default_dialog");
    // $mdThemingProvider.theme("default");
    // $mdThemingProvider.theme("default").dark();
    //$mdThemingProvider.definePalette("mother_dialog", {
    //    '50': "ffebee",
    //    '100': "ffcdd2",
    //    '200': "ef9a9a",
    //    '300': "e57373",
    //    '400': "ef5350",
    //    '500': "f44336",
    //    '600': "e53935",
    //    '700': "d32f2f",
    //    '800': "c62828",
    //    '900': "b71c1c",
    //    'A100': "ff8a80",
    //    'A200': "ff5252",
    //    'A400': "ff1744",
    //    'A700': "d50000",
    //    'contrastDefaultColor': "light", // whether, by default, text (contrast)
    //    // on this palette should be dark or light

    //    'contrastDarkColors': [
    //        "50", "100", //hues which contrast should be 'dark' by default
    //        "200", "300", "400", "A100"
    //    ],
    //    'contrastLightColors': undefined // could also specify this if default was 'dark'
    //});

    //$mdThemingProvider.theme("default")
    //    .primaryPalette("mother_dialog");

}]);
Utils.CoreApp.gameApp.config(["$mdIconProvider", function ($mdIconProvider) {
    var ext = ".svg";
    var svgSection = "/_svg/";
    function setAchievement() {
        var prefix = "achievement-";
        var dir = svgSection+"achievement/" + prefix;

        var defaultSize = 100;
        for (var i = 1; i <= 12; i++) {
            //console.log("setAchievement", {
            //    path: dir + i + ext,
            //    id: prefix + i
            //});
            $mdIconProvider.icon(prefix + i, dir + i + ext);
        }

    }

    function setPlanshetArrow() {
        $mdIconProvider.icon("planshet-arrow", "/Content/images/home/arrow.svg", 50);
        $mdIconProvider.icon("select-container-cursor", "/_svg/select-container-cursor.svg",30);
    }

    function setInterface() {
        var names = {
            //res
            "0": "interface-icon-cc",
            "1": "interface-icon-e", 
            "2": "interface-icon-ir",
            "3": "interface-icon-dm",
            "4": "interface-icon-cc-body",
            "5": "interface-icon-e-body",
            "6": "interface-icon-ir-body",
            "7": "interface-icon-dm-body",

            //left menu
            "8": "interface-icon-confederation",
            "9": "interface-icon-alliance", 
            "10": "interface-icon-journal",
            "11": "interface-icon-message",

            "12": "interface-icon-hangar-toggle", //controll menu

            "13": "interface-icon-galaxy-info",
            "14": "interface-icon-sector-info",
            "15": "interface-icon-star-info",
            "16": "interface-icon-planet-info",
       

            "17": "interface-icon-jump-to-galaxy",
            "18": "interface-icon-jump-to-sector", 
            "19": "interface-icon-jump-to-star", 
            "20": "interface-icon-jump-to-mother",    
            "21": "interface-icon-jump-to-user-planet",

            "22": "interface-icon-jump-to-galaxy-body",
            "23": "interface-icon-jump-to-sector-body", 
            "24": "interface-icon-jump-to-star-body", 
            "25": "interface-icon-jump-to-mother-body", 
            "26": "interface-icon-jump-to-user-planet-body",

            "27": "interface-icon-jump-to-planetoid",
            "28": "interface-icon-open-bookmarks",
 
        }
 
        var dir = svgSection + "interface/";
        _.forEach(names, function (name, key) {
            var url = dir + name + ext;
         //  console.log({ url: url, name: name});
            $mdIconProvider.icon(name, url);
        });
    }

    function init() {
        setInterface();
        setAchievement();
        setPlanshetArrow();
    }

    init();

}]);
angular.module("infinite-scroll").value("THROTTLE_MILLISECONDS", 250);

//app.value('$helloWorld', { greating: 'Hello' });

//// или

//app.provider('$helloWorld', function () {
//    return {
//        $get: function () {
//            return { greating: 'Hello' };
//        }
//    }
//});

// или

Utils.CoreApp.gameApp.constant("maxLenghtConsts", {
    AllianceDescription: 3000,
    PersonalInfoDescription: 3000,
    DbDescriptionMax: 4000,
    DescriptionLangDescriptionMax: 1000,
    DescriptionLangNameMax: 50,
    ChannelMessage: 3000,
    UniqueName: 14,
    ChannelPassword: 14,
    ChannelNameDbMax : 50,
    ChannelNamePrivate : 50,
    ChannelName : 14,
    UserImagesDbMax: 1000,
    PropertyName: 50,
    GroupChannelsLimit: 20,
    MaxOfficerCandidates :10
});
Utils.CoreApp.gameApp.constant("minLenghtConsts", {
    GameUserName: 4,
    UserPassword: 6,
    ChannelPassword: 4,
    AllianceName: 4,
    ChannelName: 4,
    PlaneetName: 3,
    SerchChannelName:3
});
Utils.CoreApp.gameApp.value("$regExp", {
    channelName: new RegExp("^[A-Z]{1,}[A-Z0-9_-]{2,}[A-Z0-9]$"),
    channelPassword: new RegExp("^[A-Z]{1,}[A-Z0-9_-]{2,}[A-Z0-9]$", "i")
});

// example inject
(function () {
    // закрываю в функцию чтобы небыло вызова
    function exampleInject() {
        function ParentCtrl($mdDialog) {
            this.cancel = function (data) {
                return $mdDialog.cancel(data);
            }
        } 
        function myCtrl($scope, $mdDialog) {
            ParentCtrl.call(this, $mdDialog);
            // ctrl code heare
            // can run this.cancel({data:0});

        }
        myCtrl.prototype = Object.create(ParentCtrl.prototype);
        myCtrl.$inject = ["$scope", "$mdDialog"];
        app.controller("myCtrl", myCtrl);
    }
})();

//console.log("app loaded");

Utils.CoreApp.gameApp.controller("userChannelsCtrl", [
    function () {
    }
]);
Utils.CoreApp.gameApp.controller("userChannelsPrivateCtrl", ["$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        if (!$ucs.Private.channelControls) {
            $ucs.Private.channelControls = $ucs.createPrivateChannelControls();
        }
        var $self = _.extend(this, $ucs.Private);


    }
]);

Utils.CoreApp.gameApp.controller("userChannelsGroupCtrl", ["$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        var $self = this;
        if (!$ucs.Group.channelControls) {
            $ucs.Group.channelControls = $ucs.createGroupChannelControls();
        }
        _.extend($self, $ucs.Group);
    }
]);

Utils.CoreApp.gameApp.controller("userChannelsAllianceCtrl", [
    "$scope",
    "userChannelsService",
    function ($scope, $ucs) {
        var $self = this;
        function load() {
            $self.channel = $ucs.Alliance.Collection[Object.keys($ucs.Alliance.Collection)[0]];
            if (!$self.channel.dropElementFreeze) {
                $self.channel.dropElementFreeze = true;
            }

            if (!$self.channel._btnIds) {
                $ucs.createBtnIds($self.channel);
            }
            if (!$self.channel.initTargetDropable) {
               // console.log("initTargetDropable", _.cloneDeep($self.channel));
                $self.channel.initTargetDropable = $self.channel._btnIds.MessagesId;
            }
            if (!$self.channel.cbClick) {

            }

        }

        load();

    }
]);



(function () {
    "use strict";
    var $icons = {
        checked: "fa-check",
        warn: "fa-exclamation",
        show: "fa-eye",
        notShow: "fa-eye-slash",
        locked: "fa-expeditedssl",
        unLocked: "fa-unlock"
    };

    function _autocompleteBase(ctrl, querySearch) {
        ctrl.serchInputId = Utils.Guid.CreateGuid();
        ctrl.searchText = null;
        ctrl.onTextChange = function (text, advancedAction) {
            if (!ctrl.model.To || !ctrl.model.To.Name) return;
            if (text === ctrl.model.To.Name) return;
            if (text.toLowerCase() === ctrl.model.To.Name.toLowerCase()) {
                ctrl.searchText = ctrl.model.To.Name;
            };
            if (advancedAction instanceof Function) {
                advancedAction();
            }
        };


        ctrl.querySearch = querySearch;
        var messages = {
            required: "This is a required field",
            serchRequireMmatch: "This requireMmatch.",
            serchNotFounded: "not founded"
        };

        if (ctrl.$messages) {
            _.extend(ctrl.$messages, messages);
        }
        else {
            ctrl.$messages = messages;
        }


    }


    Utils.CoreApp.gameApp.controller("dialogCreatePrivateChannelCtrl", ["$scope", "$mdDialog", "userNameSercherService", "userChannelsService", function ($scope, $mdDialog, $uSercher, $ucs) {
        var $self = this;  
        var crData = $ucs.$currentUserInfo;
        var maxLenght = $ucs.$ucdH.maxLenghtConsts;
        var model = Utils.ModelFactory.IChannelMessageTransfer();

        model.UserId = crData.userId;
        model.UserName = crData.userName;
        model.$messageMaxLenght = maxLenght.ChannelMessage;
        model.$userNameMaxLenght = maxLenght.UniqueName;
        model.Message = "";
        model.UserIcon = crData.userAvatar.Icon;
        model.ChannelType = $ucs.ChannelTypes.Private;
        model.$title = "Create private channel";
        this.model = model;



        var existChannelNames = $ucs.getPrivateExistChannelNames();
        var ignoreNames = $uSercher.createIgnoreNamesWithNpc(existChannelNames);

        this.serchInLock = false;
        _autocompleteBase($self, function (query) {
            var deferred = $ucs.$q.defer();
            if ($self.serchInLock) {
                deferred.reject();
            }
            $self.serchInLock =true;
            $uSercher.filterAsync(query).then(function (items) {
                var cleanItems = $uSercher.filterByIgnoreNames(items, ignoreNames);
                deferred.resolve(cleanItems);
                $self.serchInLock = false;
            }, function () {
                $self.serchInLock = false;
            });
            return deferred.promise;
        });

        this.messages = _.extend(this.$messages, {
            serchMaxlength: "The user name must be less than " + model.$userNameMaxLenght + " characters long.",
            messageMaxlength: "The description must be less than " + model.$messageMaxLenght + " characters long."
        });

        //serch user



        //md-dialog actions
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };

        var _sendInProgress = false;
        this.send = function () {
            var data = Utils.ModelFactory.IChannelMessageCreateModel(model);
            if (_sendInProgress) return;
            _sendInProgress = true;
            $ucs.$hub.userChannelsCreatePrivateChannel(data)
                .then(function (answer) {
                    _sendInProgress = false;
                    console.log("createMessageChannelInBlockedState.answer", { answer: answer, data: data });
                    $mdDialog.hide($scope);
                }, function (errorAnswer) {
                    _sendInProgress = false;
                    var msg = Errors.GetHubMessage(errorAnswer);
                    Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer,
                        model: model,
                        data: data
                    }, "dialogCreatePrivateChannelCtrl.send.errorAnswer");
                    $self.cancel();
                });

        };

    }]);

    function ProtoChannelPassword($ucs, $minLenght, $regExp) {
        var $self = this;
        this.$maxLenght = $ucs.$ucdH.maxLenghtConsts;

        var model = {
            isLocked: false,
            password: "",
            showPassword: false,
            inputPsswordType: "password",
            $passwordMinLenght: $minLenght.ChannelPassword,
            $passwordMaxLenght: $ucs.$ucdH.maxLenghtConsts.ChannelName,
            $title: ""
        };
        this.$openChannelLabel = "Open channel";
        this.$lockedChannelLabel = "Locked channel";
        Object.defineProperty(model, "$lockedLabel", {
            get: function () {
                if (model.isLocked) {
                    return $self.$lockedChannelLabel;
                }
                return $self.$openChannelLabel;
            }
        });
        Object.defineProperty(this, "cssIconLock", {
            get: function () {
                if (model.isLocked) return $icons.locked;
                return $icons.unLocked;
            }
        });
        this.showPasswordToggle = function () {
            model.showPassword = !model.showPassword;
            if (model.showPassword) model.inputPsswordType = "text";
            else model.inputPsswordType = "password";
        };
        Object.defineProperty(this, "cssIconShowPassword", {
            get: function () {
                if (model.showPassword) return $icons.show;
                return $icons.notShow;
            }
        });
        this.passwordPattern = $regExp.channelPassword;
        this.$model = model;
        this.$messages = {
            required: "This is a required field",
            passwodMinLength: "Password must be longer than " + model.$passwordMinLenght + " characters",
            passwodMaxLength: "Password must be less than " + model.$passwordMaxLenght + " characters",
            passwordPattern: "Password It contains invalid characters.<br>" + Utils.SetSpanText("<b>Available symbols : 'a-z', 'A-Z', '0-9', '-', '_'<br> Password must be contain latin only symbols,<br> Beginning  with  'a-z' or 'A-Z' <br>   Ends with  'a-z' or 'A-Z' or '0-9' </b>", "base-color"),
            noMatch: "No match!"
        };

        this.$toggleLock = function () {
            model.password = "";
            model.isLocked = !model.isLocked;
        };
    }


    function ProtoChannelPasswordForm($ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPassword.call($self, $ucs, $minLenght, $regExp);
        var model = _.extend(this.$model, {
            confirmPassword: "",
            passwordVerifed: false,
        });

        this.toggleLock = function () {
            this.$toggleLock();
            model.confirmPassword = "";

        };

        this.messages = _.extend(this.$messages, {
            noMatch: "No match!"
        });


    };
    ProtoChannelPasswordForm.prototype = Object.create(ProtoChannelPassword.prototype);

    function dialogCreateGroupChannelCtrl($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPasswordForm.call($self, $ucs, $minLenght, $regExp);
        var crData = $ucs.$currentUserInfo;
        var model = _.extend(this.$model, {
            channelName: "",
            isValidName: false,
            channelNameIsUnique: false,
            $title: "Create group channel",
            $enterChannelNameLabel: "Channel name",
            $channelNameMinLenght: $minLenght.ChannelName,
            $channelNameMaxLenght: this.$maxLenght.UniqueName,
            UserId: crData.userId,
            UserName: crData.userName,
            ChannelType: $ucs.ChannelTypes.Group
        });


        this.onChannelNameChange = function ($event) {
            model.isValidName = $self.form.channelName.$valid;
            //console.log("$self.form", {
            //    "form": $self.form,
            //    self: $self,

            //});

        };

        this.checkNameIsUnique = function () {
            model.channelNameIsUnique = !model.channelNameIsUnique;
        };
        this.onNameValidate = function () {
            model.isValidName = true;

        };
        this.onNameInvalidate = function () {
            model.isValidName = false;
        };
        this.model = model;


        Object.defineProperty($self, "cssIconChannelName", {
            get: function () {
                if (model.isValidName) return $icons.checked;
                return $icons.warn;
            }
        });


        //md-dialog actions
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
        var _sendInProgress = false;
        this.send = function () {
            if (_sendInProgress) return;
            _sendInProgress = true;
            var createModel = Utils.ModelFactory.IChannelDataModel();
            createModel.ChannelName = model.channelName;
            createModel.Password = model.password;
            createModel.ChannelIcon = crData.userAvatar.Icon;

            if ($self.form.$valid) {
                $ucs.createGroupChannel(createModel, function () {
                    _sendInProgress = false;
                    $mdDialog.hide($scope);
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.MaxChannelsLimit) {
                        $self.form.$setValidity("maxChannelsLimit", false);
                        _sendInProgress = false;
                    }
                    else {
                        _sendInProgress = false;
                        Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer,
                            createModel: createModel,
                            $scope: $scope
                        }, "dialogCreateGroupChannelCtrl.send.errorAnswer");
                        $self.cancel();
                    }

                });
            }
            else {
                console.log("dialogCreateGroupChannelCtrl.form.$invalid");
            }

        };

        this.channelNamePattern = $regExp.channelName;
        this.messages = _.extend(this.$messages, {
            nameMinLength: "Channel name must be longer than " + model.$channelNameMinLenght + " characters",
            nameMaxLength: "The Channel name must be less than  " + model.$channelNameMaxLenght + " characters long.",
            namePattern: "Channel name contains invalid characters.<br>" + Utils.SetSpanText("<b>Available symbols : 'A-Z', '0-9', '-','_' <br> Name must be contain latin only  symbols <br>In uppercase.<br> Beginning  with 'A-Z' <br>Ends with  'A-Z'  or '0-9'</b>", "base-color"),
            isAvailableName: "Name not Unique"
        });
        Object.defineProperty(this.messages, "maxChannelsLimit", {
            get: function () {
                var limit = $ucs.getGroupLimitModel();
                var translateTabName = $ucs.getTabTranslateNameByChannelType($ucs.bodyIdx.Group);
                return $ucs.$ucdH.getTextOpenDialogChannelMaxLimit(translateTabName, limit.max);
            }
        });

    };
    dialogCreateGroupChannelCtrl.prototype = Object.create(ProtoChannelPasswordForm.prototype);
    Utils.CoreApp.gameApp.controller("dialogCreateGroupChannelCtrl", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogCreateGroupChannelCtrl]);

    function dialogChannelsGroupUpdatePassword($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        var $channel = $self._locals.channel;
        ProtoChannelPasswordForm.call(this, $ucs, $minLenght, $regExp);
        this.model = _.extend(this.$model, { $title: "Update password" });
        this.model.isLocked = !$channel.IsPublic;
        this.cancel = function () {
            $mdDialog.cancel($scope);
        };
        var sendInProgress = false;
        this.send = function () {
            if (sendInProgress) return;
            sendInProgress = true;
            if ($channel.IsPublic && !$self.model.isLocked) {
                $self.cancel();
            }
            var newIsPublic = !$self.model.isLocked;
            var password = newIsPublic ? "" : $self.model.password;
            var promise = $ucs.$hub.userChannelsUpdatePassword($channel.ChannelId, password);
            promise.then(function (answer) {
                if (!answer) {
                    $self.cancel();
                }
                else {
                    $channel.IsPublic = newIsPublic;
                    $ucs.addOrUpdateGroupSerchChannelItem($channel.ChannelId, $channel.ChannelName, newIsPublic);
                    $ucs.setIncorrectPwToToLocalAdminUsers($channel.ChannelId);   
                    $mdDialog.hide($scope);
                }

            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                console.log("dialogChannelsGroupUpdatePassword", {
                    errorAnswer: errorAnswer,
                    msg: msg,
                    $self: $self
                });
                $self.cancel();
            });

            console.log("dialogChannelsGroupUpdatePassword", {
                $scope: $scope
            });

            return;


            // todo send password to server and drop other user
            $mdDialog.hide($scope);
        };
    }
    dialogChannelsGroupUpdatePassword.prototype = Object.create(ProtoChannelPasswordForm.prototype);

    Utils.CoreApp.gameApp.controller("dialogChannelsGroupUpdatePasswordCtrl", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogChannelsGroupUpdatePassword]);

    function dialogChannelsGroupJoinToChannel($scope, $mdDialog, $ucs, $minLenght, $regExp) {
        var $self = this;
        ProtoChannelPassword.call($self, $ucs, $minLenght, $regExp);


        var ignoreNames = $ucs.getGroupExistChannelNames();

        this.model = _.extend(this.$model, {
            $minSerchChannelName: $minLenght.SerchChannelName,
            $channelNameMinLenght: $minLenght.ChannelName,
            $channelNameMaxLenght: $self.$maxLenght.ChannelName,
            $title: "Join to channel",
            serchTypesView: $ucs.getSerchTypesView(),
            lockForm: false
        });
        this.model.selecctedSerchTypeView = this.model.serchTypesView[0];

        var _lastQuery;
        var _lastItems;
        var _lastSerchType;
        this.serchInLock = false;
        _autocompleteBase($self, function (query) {
            if ($self.serchInLock) return [];
            $self.serchInLock = true;

            if (_lastQuery && _lastQuery === query && _lastItems && _lastSerchType === $self.model.selecctedSerchTypeView.Id) {
                console.log("_autocompleteBase.cahce", { $self: $self, query: query, _lastItems: _lastItems });
                $self.serchInLock = false;
                return _lastItems;
            }   
            var deferred = $ucs.$q.defer();
            _lastSerchType = $self.model.selecctedSerchTypeView.Id;
            function onDone(items) {
                _lastQuery = query;
                if(items && items.length>0) {
                    _lastItems = items; 
                }
                else {
                    _lastItems = [];
                }
                deferred.resolve(_lastItems);
                $self.serchInLock = false;
            }

            $ucs.groupSerchChannelItemsFilterAsync(query, _lastSerchType).then(function (data) {
                var cleanItems = $ucs.filterGroupByIgnoreNames(data.items, ignoreNames);
                if (data.items.length === 0 && !data.fromLocal) {
                    onDone();
                    return;
                }
                else if (data.items.length > 0 && data.fromLocal && !cleanItems.length) {
                    $ucs.groupSerchChannelItemsFilterAsync(query, _lastSerchType, true)
                      .then(function (t2Data) {
                          var t2CleanItems = $ucs.filterGroupByIgnoreNames(t2Data.items, ignoreNames);
                          if (t2Data.items.length > 0 && t2CleanItems.length === 0) {
                              $self.form.toName.$error.channelExistLocal = true;
                          }
                          else {
                              $self.form.toName.$error.channelExistLocal = false;
                          }
                          onDone(t2CleanItems);
                          return;
                      });
                }
                else {
                    if (data.items.length > 0 && cleanItems.length === 0) {
                        $self.form.toName.$error.channelExistLocal = true;
                    }
                    else {
                        $self.form.toName.$error.channelExistLocal = false;
                    }
                    onDone(cleanItems);
                }
            }); 
            return deferred.promise;


        });


        //md-dialog actions

        var maxWrong = 5;
        var sendCount = 0;
        function _getMaxPasswordTryCountText() {
            var count = maxWrong - sendCount;
            if (count < 0) count = 0;
            return " " + count + "/" + maxWrong + " ";
        }
        this.messages = _.extend(this.$messages, {
            channelExistLocal: "Вы уже подключенны к этому каналу",
            passwordWrongMax: "Вы ввели неверный пароль слишком много раз, попробуйте позднее",
            youAreBlockedInThisChannel: "Вы были заблокированны на этом канале попробуйте связатсья с администратором канала",

        });

        this.showChannelChannelOwnerInfo = false;
        this.ChannelOwner = null;
        Object.defineProperty(this.messages, "passwordWrongCount", {
            get: function () {
                return "Пароль не верный, у вас  осталось попыток " + _getMaxPasswordTryCountText();
            }
        });
        Object.defineProperty(this.messages, "maxChannelsLimit", {
            get: function () {
                var limit = $ucs.getGroupLimitModel();
                var translateTabName = $ucs.getTabTranslateNameByChannelType($ucs.bodyIdx.Group);
                return $ucs.$ucdH.getTextOpenDialogChannelMaxLimit(translateTabName, limit.max);
            }
        });



        this.cancel = function () {
            $mdDialog.cancel($scope);
        };

        var _lastChannelId;
        var _sendInProgress = false;
        this.send = function () {
            if (_sendInProgress) return;
            _sendInProgress = true;
            if (_lastChannelId !== $self.model.To.Id) {
                sendCount = 0;
                $self.ChannelOwner = null;
                $self.showChannelChannelOwnerInfo = false;
                _lastChannelId = $self.model.To.Id;

            }
            sendCount++;
            if (sendCount > maxWrong + 1) {
                $self.cancel();
                return;
            }

            $ucs.$hub.userChannelsJoinToGroupChannel($self.model.To.Id, $self.model.password)
            .then(function (answer) {
                $ucs.addOrReplaceGroupChannelLocal(answer);
                _sendInProgress = false;
                $mdDialog.hide($scope);

            }, function (errorAnswer) {
                console.log("errorAnswer", { errorAnswer: errorAnswer });
                var msg = Errors.GetHubMessage(errorAnswer);

                if (msg === ErrorMsg.YouAreBlockedInThisChannel) {
                    $self.ChannelOwner = errorAnswer.data.ChannelOwner;
                    $self.showChannelChannelOwnerInfo = true;
                    $self.form.$setValidity("youAreBlockedInThisChannel", false);
                }
                else if (msg === ErrorMsg.MaxChannelsLimit) {
                    $self.form.$setValidity("maxChannelsLimit", false);
                }
                else if (msg === ErrorMsg.NotPermitted) {
                    $self.ChannelOwner = errorAnswer.data.ChannelOwner;
                    $self.showChannelChannelOwnerInfo = true;
                    $self.form.password.$setValidity("passwordWrongCount", false);
                    if (sendCount === maxWrong) {
                        $self.form.password.$setValidity("passwordWrongMax", false);

                    }
                    _sendInProgress = false;
                }
                else {
                    _sendInProgress = false;
                    Errors.ClientNotImplementedException({
                        $self: $self,
                        sendCount: sendCount,
                        maxWrong: maxWrong
                    }, "dialogChannelsGroupJoinToChannel.send");
                    $self.cancel();

                }
            });


            //  $mdDialog.hide($self.model);
        };
        this.onSlectedChannelChanged = function (item) {
            if (!item) {
                $self.model.isLocked = false;
            }
            else if ($self.model.isLocked !== !item.IsPublic) {
                $self.model.isLocked = !item.IsPublic;
            }

        };
        this.onPasswordChanged = function () {
            console.log("onPasswordChanged", { q: $self.form.password });
            if ($self.form.password.$error.passwordWrongCount) {
                $self.form.password.$setValidity("passwordWrongCount", true);
            }
        }
    }
    dialogChannelsGroupJoinToChannel.prototype = Object.create(ProtoChannelPassword.prototype);

    Utils.CoreApp.gameApp.controller("dialogChannelsGroupJoinToChannel", ["$scope", "$mdDialog", "userChannelsService", "minLenghtConsts", "$regExp", dialogChannelsGroupJoinToChannel]);


    Utils.CoreApp.gameApp.controller("dialogChannelsGroupUpdateUser", [
        "$scope", "$mdDialog", "userChannelsService", function ($scope, $mdDialog, $ucs) {

            var $self = this;
            this.model = _.extend(_.cloneDeep(this._locals.$updateUser));
            this.$title = "Update user: " + this._locals.$updateUser.UserName + " ";
            this.css = this._locals.$css;

            this.labels = {};
            Object.defineProperty(this.labels, "read", {
                get: function () {
                    if ($self.model.MessageRead) {
                        return "Can Read";
                    }
                    else {
                        return "Can't Read";
                    }
                }
            });
            Object.defineProperty(this.labels, "write", {
                get: function () {
                    if ($self.model.MessageSend) {
                        return "Can Write";
                    }
                    else {
                        return "Can't Write";
                    }
                }
            });
            Object.defineProperty(this.labels, "pw", {
                get: function () {
                    if ($self.updateFromChannel) {
                        return "Update password";
                    }
                    else {
                        return "Don't Update password";
                    }
                }
            });

            var _sendInProgress = false;

            this.toggleCanRead = function () {
                this.model.MessageRead = !this.model.MessageRead;
                if (!this.model.MessageRead) {
                    $self.model.MessageSend = false;
                    $self.updateFromChannel = false;
                }

            };
            this.toggleCanWrite = function () {
                if (this.model.MessageRead) {
                    this.model.MessageSend = !this.model.MessageSend;
                }

            };



            Object.defineProperty(this, "showUpdatePassword", {
                get: function () {
                    return !$self._locals.$updateUser.HasCorrectPassword && $self.model.MessageRead;
                }
            });
            this.updateFromChannel = false;
            this.toggleUpdatePasswordFromChannel = function () {
                this.updateFromChannel = !this.updateFromChannel;
            };

            this.send = function () {
                if (_sendInProgress) return;
                _sendInProgress = true;
                console.log("send", {
                    $scope: $scope,
                    $self: $self
                });
                if (!_.isEqual($self.model, $self._locals.$updateUser) || $self.updateFromChannel) {
                    $ucs.$hub.userChannelsGroupUpdateUser($self.model, $self.updateFromChannel, $self._locals.$channelAdminUserId)
                        .then(function (answer) {
                            $ucs.addOrUpdateGroupUserToLocalAdminUsers(answer);
                            $self._locals.$onUserUpdated(answer);
                            $mdDialog.hide($scope);
                        }, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.NotPermitted) {
                                var channel = $ucs.Group[$self.model.ChannelId];
                                channel.Users = null;
                                channel.CreatorConnection = null;
                                console.log("dialogChannelsGroupUpdateUser.send.error.NotPermitted", {
                                    $self: $self,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                });
                                $self.cancel();
                            }
                            else {
                                console.log("dialogChannelsGroupUpdateUser.send.error", {
                                    $self: $self,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                });
                                $self.cancel();
                            }

                        });




                }
                else {
                    $self.cancel();
                }


            };
            this.cancel = function () {
                console.log("cancel", {
                    $scope: $scope,
                    $self: $self
                });
                $mdDialog.cancel($scope);
            };   
            $scope.$on("user-channels-group-:user-unsubscribe", function ($event, data) {
                //todo checkIsCurrentUser   
                if (data.ChannelConnectionUserOut.Id === $self.model.Id) {
                    console.log("dialogChannelsGroupUpdateUser.user-channels-group-:user-unsubscribe", {
                        $scope: $scope,
                        data: data,
                        unsubscibedUser: data.ChannelConnectionUserOut,
                    });
                }

            });
        }]);

})();


Utils.CoreApp.gameApp.controller("achievementCtrl", ["$scope", function ($scope) {
    function getTab(count, svg, content, contentHead) {
        return {
            contentHead: contentHead,
            count: count,
            title: _.random(0, 99999999),
            content: content,
            svgName: svg
        }
    }

    function setDemoTabs(tabList) {
        var tabs = [getTab()];
        var firstIcon = "https://localhost:44328/Content/images/upload/Game/Default/LabelIcon.svg";
        var secondIcon = "https://localhost:44328/Content/images/home/theGame/skagry.svg";
        var threedIcon = "https://localhost:44328/Content/images/home/theGame/confederation.svg";
        var firstText = "Tabs will become paginated if <br> there isn't enough room for them." +
            " Tabs will become paginated if there isn't enough room for them. Tabs will become paginated if there isn't enough room for them. Tabs will become paginated if there isn't enough room for them. Tabs will become paginated if there isn't enough room for them.";
        var secondText = "Short";


        var threedText = "You can swipe left and right on a mobile device to change tabs.";


        var tCount = 12;
        var lCount = 0;
        for (var i = 0; i < tCount; i++) {
            var num = i + 1;
            if (lCount === 0) {
                tabList.push(getTab(_.random(0, 5), firstIcon, firstText, "head: " + num));
            } else if (lCount === 1) {
                tabList.push(getTab(_.random(0, 5), secondIcon, secondText, "head: " + num));
            } else if (lCount === 2) {
                tabList.push(getTab(_.random(0, 5), threedIcon, threedText, "head: " + num));
            }
            lCount++;
            if (lCount > 2) lCount = 0;
        }
    }

    function prepareTabs() {
        var tabList = [];
        _.forEach($scope.bodyData.Meeds, function (obj, idx) {
            if (obj.Id + "" === idx) {
                //console.log("forEach", {
                //    obj: obj,
                //    idx: idx
                //});
                
                var translate = obj.Translate[_.upperFirst(LANG.toLowerCase())];
                tabList.push(getTab(obj.Count, obj.SvgName, translate.Description, translate.Name));
                //tabList.push(getTab(obj.Count, obj.Svg, translate.Description, translate.Name));
            }

        });
        $scope.achievementCtrl.tabs = tabList;
    };

    var selected = 0;
    var previous = 0;

    // setDemoTabs(tabs);

    prepareTabs();
    this.selectedIndex = 0;
    $scope.$on("planshet:update", function (current, old) {
        if (current.targetScope.hasOwnProperty("planshetModel") &&
             current.targetScope.planshetModel.Bodys
            && current.targetScope.planshetModel.Bodys[0]
            && current.targetScope.planshetModel.Bodys[0].TemplateData
            && current.targetScope.planshetModel.Bodys[0].TemplateData.hasOwnProperty("Achievements")
            && current.targetScope.planshetModel.Bodys[0].TemplateData.Achievements.hasOwnProperty("Meeds")) {
            _.forEach($scope.achievementCtrl.tabs, function (tab, tabkey) {
                var meeds = current.targetScope.planshetModel.Bodys[0].TemplateData.Achievements.Meeds;
                var meed = _.find(meeds, function (o) {
                    return o.SvgName === tab.svgName;
                });
                if (meed) tab.count = meed.Count;
                else tab.count = 0;
            });
        }

    });
    $scope.$watch("achievementCtrl.selectedIndex", function (current, old) {
        previous = selected;
        selected = $scope.achievementCtrl.tabs[current];

        if (current !== old) {
            console.log("achievementCtrl.selectedIndex");
            EM.Audio.GameSounds.defaultButtonClick.play();
        }

    });

    this.onHover = function() {
        EM.Audio.GameSounds.defaultHover.play();
    };
}]);

Utils.CoreApp.gameApp.controller("allianceCtrl", [
    "$scope", "allianceService", "translateService",
    function ($scope, allianceService, translateService) {
        var $self = this;
        $self.translations = translateService.getAlliance();
        //  this.allianceList = allianceService.getAllianceList;

        Object.defineProperty($self, "allianceList", {
            get: function () {
                return allianceService.getAllianceList();
            }
        });

        $self.getAllianceItemCompexBtnConfig = function (allianceId) {
            return allianceService.getAllianceItemCompexBtnConfig(allianceId);
        };
        $self.canCreateAlliance = allianceService.canCreateAlliance();

        $self.getMyAllianceId = allianceService.getMyAllianceId;
        //this.getMyAllianceData = allianceService.getMyAllianceData; 
        Object.defineProperty($self, "MyAllianceData", {
            get: function () {
                return allianceService.getMyAllianceData();
            }
        });


        // this.getAllianceStatisticByAllianceItem = allianceService.getAllianceStatisticByAllianceItem;
        $self.hasRequestsInMyAlliance = allianceService.hasRequestsInMyAlliance();




        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) {

                $self.canCreateAlliance = allianceService.canCreateAlliance();
                $self.hasRequestsInMyAlliance = allianceService.hasRequestsInMyAlliance();
            }

        });
        $scope.$on("allianceCtrl:initializeScrollSerch", function (e, bodyElement, scrollerId) {
            //console.log("$scope.$on initializeScroll", { e: e, bodyElement: typeof bodyElement });
            if (scrollerId === "alliance-serch") {
                e.stopPropagation();
                allianceService.initializeScroll(bodyElement);
            }

        });

        //$scope.$on("", function () {

        //});

    }
]);

Utils.CoreApp.gameApp.controller("allianceCreateCtrl", [
    "$scope", "allianceService", "resourceService", "paralaxButtonHelper", "$mdDialog", "$q",
    function ($scope, allianceService, resourceService, paralaxButtonHelper, $mdDialog, $q) {
        var self = this;
        var msg = allianceService.allianceCreateMessages();
        var cb = paralaxButtonHelper.ComplexButtonView();
        cb.SimpleCentr(null, msg.trCreateAlliance.getCurrent());

        var balance = resourceService.getCcCount();
        var canBuy = balance >= msg.allianceCreatePrice;

        var chekNameIcon = "fa-check-circle-o succsess ";
        var notChekedIcon = "fa-question-circle-o check-undefined ";
        var invalidNameIcon = "fa-exclamation-circle error ";

        var nameIsUnic = false;
        var nameIsValid = false;

        function checkNameValid() {
            var errors = $scope.formCreateAlliance.allianceName.$error;
            if (!errors) return true;
            else if (errors.required || errors.minlength || errors.maxlength || errors.pattern) return false;
            else return true;
        }

        function checkAlianceName() {
            if (self.disabled) return;
            if (!nameIsValid) return;
            if (nameIsUnic) return;
            self.disabled = true;
            var chName = self.allianceName;
            var aNameForm = $scope.formCreateAlliance.allianceName;
            var deferred = $q.defer();
            allianceService.checkNameIsUnic(chName, deferred.resolve, deferred.reject);
            deferred.promise
                .then(function (isUnic) {
                    nameIsUnic = isUnic;
                    self.allianceName = chName.toUpperCase();
                    self.nameIcon = nameIsUnic ? chekNameIcon : invalidNameIcon;
                    aNameForm.$setValidity("notUnic", nameIsUnic);
                    aNameForm.$setValidity("notCeked", true);
                    self.disabled = false;
                },
                    function (errorAnswer) {
                        self.disabled = false;
                        if (errorAnswer === ErrorMsg.AllianceNameNotValid) $scope.formCreateAlliance.allianceName.$setValidity("pattern", false);
                    });


        }

        var checkBtn = paralaxButtonHelper.ButtonsView();
        checkBtn.ConstructorSizeBtn(4, true, msg.trCheck.getCurrent(), checkAlianceName);

        function onNameChange() {
            var alNameForm = $scope.formCreateAlliance.allianceName;
            nameIsValid = checkNameValid();
            nameIsUnic = false;
            self.nameIcon = nameIsValid ? notChekedIcon : invalidNameIcon;
            alNameForm.$setValidity("notCeked", false);
            alNameForm.$setValidity("notUnic", true);
        }

        function showConfirm(params, element, attrs, scope, $event) {
            if (!nameIsUnic) return;
            var aName = self.allianceName.toUpperCase();
            var confirm = $mdDialog.confirm()
                .title(msg.trConfirm.trTitle.getCurrent() + aName)
                .textContent(msg.trConfirm.trTextContent.getCurrent())
                .ariaLabel("default-dialog")
                .targetEvent($event)
                .ok(msg.trConfirm.trConfirm.getCurrent())
                .cancel(msg.trConfirm.trCancel.getCurrent());

            $mdDialog.show(confirm)
                .then(function () {
                    //confirm
                    allianceService.createAlliance(aName, true, function () {
                        //sucsses
                        $mdDialog.show(
                            $mdDialog.alert()
                            .title(msg.trConfirmGc.trTitle.getCurrent())
                            .ariaLabel("default-dialog")
                            .clickOutsideToClose(true)
                            .htmlContent(msg.trConfirmGc.trHtmlContent(aName))
                            .ok("Ok"));
                    },
                        function (errorMsg) {
                            //error
                            if (errorMsg === ErrorMsg.YouInAlliance) {
                                //   allianceService.updateAlliancePlanshet();
                                return;
                            }
                            if (errorMsg === ErrorMsg.AllianceNameNotValid) {
                                $scope.formCreateAlliance.allianceName.$setValidity("pattern", false);
                                return;
                            }
                            if (errorMsg === ErrorMsg.NotEnoughCc) {
                                self.canBuy = false;
                                return;
                            }
                            if (errorMsg === ErrorMsg.AllianceNameNotUnic) $scope.formCreateAlliance.allianceName.$setValidity("notUnic", false);

                            console.log("$mdDialog.sho", errorMsg);
                        }, resourceService);

                }, function () {
                    //cancel
                });
        }

        var sendBtn = paralaxButtonHelper.ButtonsView();
        sendBtn.ConstructorSizeBtn(1, true, msg.trCreate.getCurrent(), showConfirm);

        this.canBuy = canBuy;
        this.msgCanBuy = msg.trMsgCanBuy.trCanBuy.getCurrent();
        this.msgCantBuy = msg.trMsgCanBuy.trError.getCurrent();

        this.allianceName = "";
        this.disabled = false;
        this.nameIcon = notChekedIcon;
        this.complexButtonView = cb;
        this.createAllianceTitlle = msg.trAllianceTitlle.getCurrent();
        this.errorMsg = msg.trErrorMsg;
        this.checkBtn = checkBtn;
        this.onNameChange = onNameChange;
        this.sendBtn = sendBtn;


    }
]);

Utils.CoreApp.gameApp.controller("allianceMembersCtrl", [
    "$rootScope", "$scope", "allianceService", "dropableElementHelper", "translateService", "paralaxButtonHelper", "mainHelper", "profileService", "allianceDialogHelper",
    function ($rootScope, $scope, allianceService, dropableElementHelper, translateService, paralaxButtonHelper, mainHelper, profileService, allianceDialogHelper) {
        "user strict";
        var $self = this;
        var btnsFull = [paralaxButtonHelper.ButtonsView(), paralaxButtonHelper.ButtonsView()];
        $self._rolesView = {};
        $self._updateMembers = true;
        var creatorName = allianceService.getMyAllianceData().LeaderName;

        function deleteUser(params, element, attrs, scope, $event) {
            var member = params.member;
            var curRole = $self.crMemberRole;
            /*
             * кнопки быть не должно но так исторически сложилось что метод уже есть.
             */
            if (!curRole.Role.DeleteMembers) {
                allianceDialogHelper.openDialogNotPermitted($event);
                return;
            }
            if (curRole.UserId === member.UserId) return;// кнопки бытьне должно доп обработка не трубуется

            allianceService.dropUserFromAlliance(member.UserName, member.UserId, $event);
        }

        function updateUserRole(params, element, attrs, scope, $event) {
            var member = params.member;
            var curRole = $self.crMemberRole;
            var targetUserName = member.UserName;
            if (!curRole.Role.CanManagePermition) return;// не должна была загрузиться вью  доп обработка не трубуется
            if (member.UserId === curRole.UserId) return;// кнопки быть не должно   доп обработка не трубуется
            if (member.UserName === creatorName && member.Role.Id === allianceService.Role.roleNativeNames.CreatorId) return;   // кнопки быть не должно   доп обработка не трубуется

            var selectedRole = $self.selectedRoleModel;
            var roleTranslateNameToCSet = selectedRole.TranslateName;
            if (selectedRole.Id === member.Role.Id) {
                allianceDialogHelper.openDialogRoleNotChanged(targetUserName, roleTranslateNameToCSet, $event);
                return;
            }

            var roleTranslateNameBefore = $self.getTranslateRoleName(member.Role.RoleName);

            allianceDialogHelper
                .openDialogChangeRole(roleTranslateNameBefore, targetUserName, roleTranslateNameToCSet, $event)
                .then(function () {
                    //on confirm   
                    console.log("update user role", {
                        member: member,
                        selectedRole: selectedRole,
                        "selectRole": _.cloneDeep($self.allianceMembers.Roles[selectedRole.Id]),
                        roles: $self.selectRoles
                    });
                    allianceService.Role.requestUpdateUserRole(member.AllianceUserId, targetUserName, member.UserId, selectedRole.Id, roleTranslateNameToCSet, $event, $rootScope);
                },
                    function () {
                        console.log("Cancel");
                        //on Cancel
                    });

            console.log("updateUserRole", { member: member, selectRole: selectedRole, curRole: curRole });
        }

        function deleteUserBtn(member, size) {
            btnsFull[0].ConstructorSizeBtn(size, true, "deleteUserBtn", deleteUser, { member: member });
            return btnsFull[0];
        };

        function updateUserBtn(member, size) {
            btnsFull[1].ConstructorSizeBtn(size, true, "updateUserRoleBtn", updateUserRole, { member: member });
            return btnsFull[1];
        }

        function getManageBtns(member) {
            var role = $self.crMemberRole.Role;
            if (member.UserId === $self.crMemberRole.UserId) return [];
            else if (member.UserName === creatorName && role.Id !== allianceService.Role.roleNativeNames.CreatorId) return [];
            else if (role.DeleteMembers && role.CanManagePermition) return [deleteUserBtn(member, 3), updateUserBtn(member, 3)];
            else if (role.DeleteMembers) return [deleteUserBtn(member, 1)];
            else if (role.CanManagePermition) return [updateUserBtn(member, 1)];
            else return [];
        }

        Object.defineProperty($self, "updateMembers", {
            get: function () {
                if ($self._updateMembers) {
                    $self._updateMembers = false;
                    return true;
                }
                return false;
            }
        });

        $self.getProfileInfo = function (userId) {
            profileService.setProfile(userId);
        };
        $self.onLinkHover = function() {
            EM.Audio.GameSounds.defaultHover.play();
        };

        $self.getRolePropsView = function (roleId) {
            return $self._rolesView[roleId];
        };
        $self.getManageBtns = getManageBtns;


        function load() {
            mainHelper.applyTimeout(function () {
                $self.allianceMembers = allianceService.getMyAllianceMembers();
                $self.members = $self.allianceMembers.Members;

                var membersCount = _.size($self.members);
                if (!$self.memberCount || $self.memberCount !== membersCount) {
                    $self.memberCount = membersCount;
                    $self._updateMembers = true;
                }
                var trRoles = $self.allianceMembers.TranslateRoleNames;

                $self.crMemberRole = allianceService.getCurrentUserMemberFromMembers($self.members);

                $self.getTranslateRoleName = function (roleName) {
                    return allianceService.Role.getTranslateRoleName(trRoles, roleName);
                };

                $self.selectRoles = allianceService.Role.createSelectRoles(trRoles);

                $self.selectedRoleModel = null;
                $self.setInitialSelectedRole = function (roleId) {
                    $self.selectedRoleModel = _.find($self.selectRoles, function (o) {
                        return o.Id === roleId;
                    });
                };


                $self.roleDescription = "";
                $self.memberSettingToggle = function (member) {
                    if (!member.hasOwnProperty("setting")) member.setting = dropableElementHelper.create();
                    if (!$self.selectedRoleModel || $self.selectedRoleModel.Id !== member.Role.Id) $self.setInitialSelectedRole(member.Role.Id);
                    member.setting.toggle();
                    $self.roleDescription = $self.allianceMembers.Roles[member.Role.Id].translateRoleHtmlDescription;

                };

                allianceService.Role.initRolesView($self._rolesView, $self.allianceMembers.Roles);

                $self.onselectedRoleChange = function (roleId) {
                    $self.roleDescription = $self.allianceMembers.Roles[$self.selectedRoleModel.Id].translateRoleHtmlDescription;

                }


            });

        }

        load();

        $scope.$watch("amCtrl.serchMemberRequest", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                //    console.log(" $scope.$watch(amCtrl.serchMemberRequest");
                $scope.$emit("dropElementContainer:changeHeight");
            }
        });
        $scope.$watch("amCtrl.onlyOnline", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                // console.log(" $scope.$watch(amCtrl.onlyOnline");
                $scope.$emit("dropElementContainer:changeHeight");

            }
        });

        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
            }
        });



        $scope.$on("alliance:user-left-from-alliance", function (event, data) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
                var leftAllianceId = data.leftAllianceId;
                var leftUserId = data.leftUserId;
            }

        });

        $scope.$on("alliance:user-join-to-alliance", function (e, t) {
            if (allianceService.isCurrentModel()) {
                $self._updateMembers = true;
                load();
            }

        });

        $scope.$on("$destroy", function () {
            $scope.amCtrl = null;
            delete $scope.amCtrl;
        });
    }
]);

Utils.CoreApp.gameApp.controller("allianceTechCtrl", ["$scope", "allianceService",
function ($scope, allianceService) {
    "user strict";
    var $self = this;
    this.$data = allianceService.getMyAllianceData();  
    this.BalanceCCTitle = "Alliance balance CC : ";
    this.TechList = allianceService.prepareTechList(this.$data);
   // console.log("allianceTechCtrl", $scope);
    $scope.$on("alliance:tech-updated", function (event,data) {
        $self.$data = data.myAllianceData;
        $self.TechList = allianceService.prepareTechList($self.$data);
    });
}
]);


Utils.CoreApp.gameApp.controller("allianceManageCtrl", ["$scope", "allianceService", "mainHelper",
    function ($scope, allianceService, mainHelper) {
        var $self = this;
        $self.notPermitted = true;
        $self.canDeleteAlliance = false;
        function load(am) {
            var allianceMembers = allianceService.getMyAllianceMembers();
            var menageTabData = allianceService.getManageTabData();
            if (!menageTabData || !allianceMembers || !allianceMembers.Members) return;
            if (am && $self._crAm && $self._crAm.AllianceUserId !== am.AllianceUserId) return;
            var currentAllianceUser = $self._crAm = am || allianceService.getCurrentUserMemberFromMembers(allianceMembers.Members);
            var role = currentAllianceUser.Role;
            mainHelper.applyTimeout(function () {
                //  this.getManageCompexBtn = allianceService.getManageCompexBtn;
                $self.permitions = role;
                $self.notPermitted = !(role.AcceptNewMembers || role.EditAllianceInfo || role.SetTech);
                //delete allaince
                $self.canDeleteAlliance = menageTabData.CanDeleteAlliance;
                if (menageTabData.CanDeleteAlliance) $self.disbandAlliance = menageTabData.DisbandAllianceBtn;

            });

        }
        load();

        $scope.$on("alliance:user-role-updated", function (event, data) {
            if (allianceService.isCurrentModel()) load(data.allianceMember);
        });

        $scope.$on("planshet:update", function (evt) {
            if (allianceService.isCurrentModel()) load();
        });
        $scope.$on("$destroy", function () {
            $scope.alManage = null;
            delete $scope.alManage;
        });

    }
]);


//http://codepen.io/kuhnroyal/pen/gPvdPp
Utils.CoreApp.gameApp.controller("allianceManageRequestCtrl", [
    "$scope", "allianceService", "dropableElementHelper", "profileService", "$timeout",
    function ($scope, allianceService, dropableElementHelper, profileService, $timeout) {
        var $self = this;
        function load() {
            var curUserData = allianceService.$currentUserInfo;
            var manageTabData = allianceService.getManageTabData();
            var allianceUserRequests = manageTabData.AllianceUserRequests;
            var skipParent = 4;
            $self.auRequestsLoaded = false;
            $self.requests = allianceUserRequests.Requests;
            $self.complexButtonView = allianceUserRequests.ComplexButtonView;

            $self.onClickCbRequests = function ($event) {
                $scope.dropElementonClickByDropable(skipParent);
            }
            $self.currentAllianceName = curUserData.allianceName;

            $self.getProfileInfo = function (userId) {
                profileService.setProfile(userId);
            };

            $self.requestToggle = function (request) {
                var hasBv = request.hasOwnProperty("ButtonsView");
                //|| request.AllianceAccepted
                if (!hasBv) {
                    allianceService.createAllianceManageRequestBtns(request);
                    $timeout(function () {
                        request.dropable.toggle(function () {
                            $scope.$emit("dropElementContainer:changeHeight");
                        });
                    }, 50);
                }
                else {
                    request.dropable.toggle(function () {
                        $scope.$emit("dropElementContainer:changeHeight");
                    });
                }
            }

        }

        load();
        $scope.$on("alliance:user-role-updated", function (event, data) {
            if (!data.IsCurrentUser || !data.allianceMember.Role.AcceptNewMembers) return;
            if (allianceService.isCurrentModel()) load();
        });


    }
]);

Utils.CoreApp.gameApp.controller("allianceRequestSendMsgCtrl", [
    "$scope", "$mdDialog",
    function ($scope, $mdDialog) {
        var $self = this;
        this.title = $self._title || "Create Message";
        this.from = $self._fromName;
        this.to = $self._toName;
        this.message = $self._message;
        this.messageMaxLength = $self._maxLength || 1000;
        this.messageMinLength = $self._minLength || 5;
        this.send = function () {
            $mdDialog.hide($self.message);
        }
        this.cancel = function () {
            $mdDialog.cancel();
        }
    }
]);

Utils.CoreApp.gameApp.controller("allianceUserRequestsCtrl", [
    "$scope", "allianceService", "$timeout",
    function ($scope, allianceService, $timeout) {
        var data = allianceService.getRequestsFromMyAlliance();
        var curUserData = allianceService.$currentUserInfo;
        this.currentUserName = curUserData.userName;
        this.data = data;
        this.requests = data.Requests;
        this.requestToggle = function (request) {
            var hasBv = request.hasOwnProperty("ButtonsView") && request.ButtonsView;
            //|| request.AllianceAccepted
            if (!hasBv) {
                allianceService.createMyAllianceRequestBtns(request);
                $timeout(function () {
                    request.dropable.toggle(function () {
                        $scope.$emit("dropElementContainer:changeHeight");
                    });
                }, 50);
            }
            else {
                request.dropable.toggle(function () {
                    $scope.$emit("dropElementContainer:changeHeight");
                });
            }

        }
        // #endregion


    }
]);

Utils.CoreApp.gameApp.controller("allianceEditInfoCtrl", ["$scope", "allianceService", "mainHelper", function ($scope, allianceService, mainHelper) {
    var $self = this;
    var skipParent = 4;
    function load(evt) {
        allianceService.setEditAllianceInfoModelToScope($self, $scope, skipParent);
        //mainHelper.applyAsync(function () {

        //});  
    }
    load();
    $scope.$on("planshet:update", function (evt) {
        if (allianceService.isCurrentModel()) load(evt);
    });
    $scope.$on("$destroy", function () {
        $scope.aeiCtrl = null;
        delete $scope.alManage;
    });

}]);


//https://docs.angularjs.org/guide/di

(function () {
    "use strict";
    function ProtoAutocomplete($q, getData, getPlaceholder, onTextChange, onSelected) {
        var showDebug = true;
        this.isDisabled = false;
        var $self = this;
        var inProgress = false;
        this.isValide = false;

        function filter(query, collection) {
            return _.filter(collection, function (o) {
                if (!o.hasOwnProperty("value")) return false;
                return o.value.indexOf(query) !== -1;
            });
        }

        function setItem(newName) {
            var val = null;
            var display = null;
            if (newName) {
                val = newName.toUpperCase();
                display = newName;
            }
            return {
                value: val,
                display: display
            };
        }

        this.querySearch = function (query) {
            if (!query) return null;
            if (query.length === 0) return null;
            if (!(getData instanceof Function)) return null;
            if (inProgress) return null;
            inProgress = true;
            var deferred = $q.defer();
            query = query.toUpperCase();
            getData(query, function (collection) {
                if (!collection) collection = [];
                var results = filter(query, collection.map(function (colItem) {
                    return setItem(colItem);
                }));
                inProgress = false;
                if (!results) return;
                deferred.resolve(results);
            });
            return deferred.promise;
        };

        this.curItem = setItem();

        this.selectedItemChange = function (item) {
            if (item && item.hasOwnProperty("value")) {
                this.curItem = item;
                this.isValide = true;
                if (onSelected instanceof Function) onSelected(this.curItem);
            } else {
                this.isValide = false;
                if (onSelected instanceof Function) onSelected(null);
            }

        };

        this.searchTextChange = function (newText) {
            if (showDebug) console.log("Text changed to", { newText: newText });
            this.curItem = setItem(newText);
            if (onTextChange instanceof Function) {
                onTextChange(newText);
            }
        };

        this.getNotFoundMsg = function () {
            var reqName = "";
            if (this.curItem && this.curItem.hasOwnProperty("display") && this.curItem.display) reqName = this.curItem.display;
            return "Not Found " + reqName;
        };

        if (getPlaceholder instanceof Function) this.getPlaceholder = getPlaceholder;
        else this.getPlaceholder = function () {
            return "Search:";
        };

        function _getCurVal() {
            var item = $self.curItem;
            if (item.hasOwnProperty("value") && typeof item.value === "string") return item.value;
            return null;
        }

        this._getCurVal = _getCurVal;

        this.clear = function (inputId, onClear) {
            var tScope = angular.element("#" + inputId);
            if (tScope) {
                var mdScope = tScope.scope();
                console.log("clear", mdScope);
                if (mdScope && mdScope.$parent && mdScope.$parent.$mdAutocompleteCtrl) mdScope.$parent.$mdAutocompleteCtrl.clear();
            }
            if (onClear instanceof Function) onClear();
        }

    }

    function spyPlanetSerchCtrl($scope, $q, mapInfoService, journalService) {

        var $self = this;
        this.getSpyButtonFromSerch = journalService.getSpyButtonFromSerch;

        ProtoAutocomplete.call(this, $q, function (request, response) {
            mapInfoService.getPlanetNames(request, response, mapInfoService.serchPlanetType.OtherUsers);
        }, function () {
            return "Enter planet name: ";
        });
        this.spySerchInputId = "spy-serch-planet";

        function clear() {
            $self.clear($self.spySerchInputId);
        }

        $scope.clear = clear;

        $scope.getSpyTargetPlanetName = this._getCurVal;

        $scope.$on("gameCtrl:estate-changed", function (event, oItems, t) {
            var newOwnId = oItems.newVal;
            clear();
        });
    }

    spyPlanetSerchCtrl.prototype = Object.create(ProtoAutocomplete.prototype);
    Utils.CoreApp.gameApp.controller("spyPlanetSerchCtrl", ["$scope", "$q", "mapInfoService", "journalService", spyPlanetSerchCtrl]);


    function taskPlanetSerchCtrl($scope, $q, mapInfoService, journalService, journalHelper, hangarService, $timeout) {

        this.showTaskForm = false;
        this.taskTargetPlanetName = null;
        this.getNewTaskButtons = journalService.getNewTaskButtons;
        this.getTaskActionButtons = journalService.getTaskActionButtons;
        this.taskSourceUnits = hangarService.getCloneObjectHangarData();
        this.taskTargetUnits = journalService.getTaskTargetUnits();
        this.taskTransferTypeIsTransfer = false;
        this.transferTypeName = "";
        this.transferTimeName = "";
        var defaultTime = "--:--:--";
        this.transferTimeVal = defaultTime;
        this.activate = false;
        var lastCalculatedPlanetName = null;


        this.unitsIsValid = false;
        this.resultIsValid = false;
        this.minLength = 3;
        var $self = this;
        var animationTime = 500;
        this.setResultIsValid = function (unitsIsValid) {
            $self.unitsIsValid = unitsIsValid;
            $self.resultIsValid = $self.isValide && $self.unitsIsValid;
        };

        function clear() {
            $self.clear("task-serch-planet", function () {
                journalHelper.resetTaskForm($scope);
            });
            //var q = angular.element("#task-serch-planet");
            //if (q) {
            //    var qScope = q.scope();
            //    if (qScope.$mdAutocompleteCtrl) qScope.$mdAutocompleteCtrl.clear();
            //}
            //journalHelper.resetTaskForm($scope);
        }

        this.closeTaskForm = function (updateNow) {
            $self.activate = false;
            clear();
            if (updateNow) {
                $self.showTaskForm = false;
            } else {
                $timeout(function () {
                    $self.showTaskForm = false;
                }, animationTime);
            }

        };


        this.taskErrors = journalHelper.taskErrors;

        this.setTransferType = function (isTransfer) {
            if (isTransfer) this.minLength = 1;
            else this.minLength = 3;
            $self.taskTransferTypeIsTransfer = isTransfer;
            $self.transferTypeName = journalHelper.getTransferTypeName(isTransfer);
            $self.transferTimeName = journalHelper.getTransferTimeName();
            $self.transferTimeVal = defaultTime;
        };

        this.updateShowTaskError = function (errorName, show) {
            if (!errorName) return;
            if ($self.taskErrors.hasOwnProperty(errorName)) {
                $self.taskErrors[errorName].showError = show;
            }
        };

        //searchText

        function onChangeName(planetName, isNewQuery) {
            if (isNewQuery) $self.searchText = planetName;
            $self.isValide = mapInfoService.containPlanetName(journalHelper.getSerchType(), planetName);
            if ($self.isValide) {
                $self.taskTargetPlanetName = planetName;
            } else {
                $self.taskTargetPlanetName = $self._getCurVal();
            }
        }

        var _calcInProgress = false;
        function calcTime(targetPlanetName) {
            var deferred = $q.defer();
            journalHelper.calculateFleetTime(deferred, targetPlanetName);
 
            deferred.promise.then(function (answer) {
                    console.log("taskPlanetSerchCtrl.calcTime");
                    if (targetPlanetName === $self.taskTargetPlanetName) {
                        lastCalculatedPlanetName = targetPlanetName; 
                        $self.transferTimeVal = answer;
                    }
                    else {
                        $self.transferTimeVal = defaultTime;
                        lastCalculatedPlanetName = null;
                    }
                    _calcInProgress = false;

                },
                    function (erorAnswer) {
                        $self.transferTimeVal = defaultTime;
                        lastCalculatedPlanetName = null;
                        _calcInProgress = false;
                        var msg = Errors.GetHubMessage(erorAnswer);
                        throw Errors.ClientNotImplementedException({ $self: $self, msg: msg }, "taskPlanetSerchCtrl.calcTime.error");
                    });
            return deferred.promise;
        }

        $scope.$watch("ctrl.isValide", function (newVal, oldNal) {
            //  console.log("selectedItemChange");
            if (newVal && newVal !== oldNal && !lastCalculatedPlanetName && lastCalculatedPlanetName !== $self.taskTargetPlanetName && !_calcInProgress) {
                _calcInProgress = true;
                calcTime($self.taskTargetPlanetName);
                //            self.transferTimeVal = deferred.promise;

            } else {
                $self.transferTimeVal = defaultTime;
                lastCalculatedPlanetName = null;
            }
        });
        $scope.$on("taskPlanetSerch:showTaskForm", function (e, showTaskForm, planetName, advancedAction) {
            e.stopPropagation();
            $self.taskErrors.resetErrors();
            if (advancedAction instanceof Function) advancedAction($scope);
            if (showTaskForm) {
                $self.showTaskForm = showTaskForm;
                onChangeName(planetName, true);
                $timeout(function () {
                    $self.activate = true;
                }, 150);
            } else $self.closeTaskForm();

        });
        $scope.$on("taskPlanetSerch:changeTransferUnit", function (e, updateTaskHangar, unitName) {
            e.stopPropagation();
            updateTaskHangar(e, unitName);

        });

        $scope.$on("gameCtrl:estate-changed", function (event, oItems) {
            var newOwnId = oItems.newVal;
            $scope.ctrl.closeTaskForm();
            _calcInProgress = false;
        });

        ProtoAutocomplete.call(this, $q, function (request, response) {
            mapInfoService.getPlanetNames(request, response, journalHelper.getSerchType(), true);
        }, function () {
            return "Enter planet name: ";
        }, null, function (newItem) {
            if (newItem) onChangeName(newItem.value, false);
            else onChangeName(null, false);

        });

    }

    taskPlanetSerchCtrl.prototype = Object.create(ProtoAutocomplete.prototype);
    Utils.CoreApp.gameApp.controller("taskPlanetSerchCtrl", ["$scope", "$q", "mapInfoService", "journalService", "journalHelper", "hangarService", "$timeout", taskPlanetSerchCtrl]);



})();

Utils.CoreApp.gameApp.controller("bookmarkCtrl", ["$scope", "bookmarkService",
    function ($scope, bookmarkService) {
        this.planetItems = bookmarkService.getPlanetItems;
        this.systemItems = bookmarkService.getSystemItems;
        this.sectorItems = bookmarkService.getSectorItems;

    }
]);
Utils.CoreApp.gameApp.controller("buildCtrl", ["$scope", "industrialComplexService", "spaceShipyardService",
    function ($scope, industrialComplexService, spaceShipyardService) {
        var $self = this;
        var lastModel;
        this.$buildCollection = null;
        function setBuildCollection() {
            lastModel = $scope.planshetModel;
            $self.$buildCollection = lastModel.Bodys[0].TemplateData;
        }

        setBuildCollection();
        this.getBuildCollection = function () {
            if (!$self.$buildCollection) {
                setBuildCollection();
            }
            return $self.$buildCollection;
        };
        //storage
        this.storageStorableContainer = industrialComplexService.createStorageStorableContainer();
        this.getStorageTargetShowStatus = industrialComplexService.getStorageTargetShowStatus;
        this.registerStorageSlider = industrialComplexService.registerStorageSlider;

        //extraction
        this.extractionContainer = industrialComplexService.getExtractionContainer();
        this.registerExtractionSlider = industrialComplexService.registerExtractionSlider;
        this.getExtractionPowerData = industrialComplexService.getExtractionPowerData;

        //EnergyConverter
        this.getExchangeCourceData = industrialComplexService.getExchangeCourceData;
        this.energyConverterContainer = industrialComplexService.getEnergyConverterContainer();
        this.registerEnergyConverterSlider = industrialComplexService.registerEnergyConverterSlider;
        this.exchangeInputModel = 0;
        this.updateExchangeInputModel = industrialComplexService.updateExchangeInputModel;
        this.checkFloatProperty = function(value) {
            if (Number.isInteger(value)) return value;
            return Math.round(value * 1000) / 1000;
        };


        // unit input
        this.updateUnitInputModel = spaceShipyardService.updateUnitInputModel;

        function updateBuildCollection(newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    setBuildCollection();
                });
            }
        }
        $scope.$watch("planshetModel.UniqueId", updateBuildCollection);
        $scope.$watch("planshetModel.IsMother", updateBuildCollection);
        $scope.$on("planshet:update", function (evt) {
            if (lastModel && evt.targetScope && evt.targetScope.planshetModel && evt.targetScope.planshetModel.UniqueId === lastModel.UniqueId) {
                updateBuildCollection(true, false);
            }
        });
    }
]);
 





Utils.CoreApp.gameApp.controller("confederationCtrl", ["$scope", "confederationService", function ($scope, $cs) {

}
]);
Utils.CoreApp.gameApp.controller("officersCtrl", ["$scope", "confederationService", "profileService", function ($scope, $cs, profileService) {
    var $self = this;
    var langKey = appL10n.getL10NCurrentLanguage();
    var cr = $cs.$currentUserInfo;


    function _update(oficerList) {
        $self.hasOfficers = oficerList && oficerList.length;
        if ($self.hasOfficers) {
            $self.list = oficerList;
            $self.$$president = $cs.getPresidentOfficerFromOfficerList($self.list);
            $self.$$crIsPresident = cr.userId === $self.$$president.Elected.UserId;
        }
    }

    _update($cs.Officers.Officers);

    this.trDesctiption = function (officer) {
        return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        return officer.Translate[langKey].Description;
    };

    this.trName = function (officer, isElected) {
        return officer.Translate[langKey].Name;
    };

    this.getAllianceInfo = function ($event, officer, isElected) {
        var userOfficerOut = isElected ? officer.Elected : officer.Appointed;
        console.log("officersCtrl.getAllianceInfo", {
            officer: officer,
            isElected: isElected,
            data: userOfficerOut,
            $event: $event,
        });
        if (userOfficerOut) {
            if (userOfficerOut.UserId) {
                if (userOfficerOut.AllianceId) {
                    // todo  делаем запрос на фильтр к альянсу   
                }
            }
            else if (!isElected && userOfficerOut.Elected === false && $self.$$crIsPresident) {
                $cs.officerOpenFormSetOfficer($event, userOfficerOut, $self.$$president.Elected, cr, $self.trName(officer));
            }
        }        

    };

    this.getUserInfo = function ($event, officer, isElected) {
        var userOfficerOut = isElected ? officer.Elected : officer.Appointed;
        console.log("officersCtrl.getUserInfo", {
            officer: officer,
            isElected: isElected,
            data: userOfficerOut,
            $event: $event,
        });
        if (userOfficerOut) {
            if (userOfficerOut.UserId) {
                profileService.setProfile(userOfficerOut.UserId);
            }
            else if (!isElected && userOfficerOut.Elected === false && $self.$$crIsPresident) {
                $cs.officerOpenFormSetOfficer($event, userOfficerOut, $self.$$president.Elected, cr, $self.trName(officer));
            }
        }


    };     
    $scope.$on("election:finished", function (data) {
        if (_.isEqual($self.list, data.newListIOfficerOut)) {
            console.log("officersCtrl.election:finished.isEqual");
        }
        else {
            _update(data.newListIOfficerOut);

        }
        console.log("electionCtrl.election:finished", {
            data: data,
            $self: $self
        });
    });

}
]);

Utils.CoreApp.gameApp.controller("dialogSetOfficerCtrl", ["$scope", "$mdDialog", "confederationService", "$q", "userNameSercherService", "maxLenghtConsts",
function ($scope, $mdDialog, $cs, $q, $uSercher,$maxLenght) {
    var $self = this;
    var model = {
        $title: "Set officer", 
        $userNameMaxLenght: $maxLenght.UniqueName,
        postName: $self._locals.postName

    };
    this.model = model;



    var existOffcierNames = $cs.officerGetExistOfficerNames();

    var ignoreNames = $uSercher.createIgnoreNamesWithNpc(existOffcierNames);
    this.lockInfo = true;
    this.serchInputId = Utils.Guid.CreateGuid();
    this.searchText = null;
    this.onTextChange = function (text) {
        console.log("onTextChange", { text: text });
        if (!$self.model.To || !$self.model.To.Name) return;
        if (text === $self.model.To.Name) return;        
        if (text.toLowerCase() === $self.model.To.Name.toLowerCase()) {
            $self.searchText = $self.model.To.Name;
        };
    };

    this.serchInLock = false;
    this.querySearch = function (query) {
        var deferred = $q.defer();
        if ($self.serchInLock) {
            deferred.reject();
        }
        $self.serchInLock = true;
        $uSercher.filterAsync(query).then(function (items) {
            var cleanItems = $uSercher.filterByIgnoreNames(items, ignoreNames);
            deferred.resolve(cleanItems);
            $self.serchInLock = false;
        }, function () {
            $self.serchInLock = false;
        });
        return deferred.promise;

    };
    this.messages = {
        required: "This is a required field",
        serchRequireMmatch: "This requireMmatch.",
        serchNotFounded: "not founded",
        serchMaxlength: "The user name must be less than " + model.$userNameMaxLenght + " characters long.",
    };

    this.onSelectedItemChange = function (item) {
        if (!item || !item.Id) {
            $self.lockInfo = true;
        }
        else {
            $self.lockInfo = false;
        }
        console.log("onSelectedItemChange", { item: item, text: $self.searchText });
    };

    this.getUserInfo = function () {     
        if (!$self.serchInLock && $self.model.To && $self.model.To.Id) {
            GameServices.profileService.setProfile($self.model.To.Id);
        }
       
    };

    this.lockUpdate = false;
    this.send = function () {
        if ($self.lockUpdate) return; 
        if (!model.To || !model.To.Id) {
            console.log("send.validateion.error: no model to", {
                model: model,
                $self: $self
            });
        }
        $self.lockUpdate = true;
        $self.serchInLock = true;

        //UserId
        var userOfficerOut = _.cloneDeep($self._locals.targetOficer);
        userOfficerOut.UserId = model.To.Id;
        var president = $self._locals.presidentOfficer;
        $cs.$hub.confederationAddNewOfficer(userOfficerOut, president.Id, president.UserId)
            .then(function (answerOk) {
                console.log("dialogSetOfficerCtrl.send.ok", {
                    answerOk: answerOk,
                    $self: $self,
                });
                $mdDialog.hide($scope);
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    msg: msg,
                    errorAnswer: errorAnswer,
                    $self: $self
                };
                $self.lockUpdate = false;
                $self.serchInLock = false;
                throw Errors.ClientNotImplementedException(errorData, "dialogSetOfficerCtrl.send.error");
            });

        console.log("dialogSetOfficerCtrl.send", {
            userOfficerOut: userOfficerOut,
            president: president,
            $self: $self
        });

    };
    this.cancel = function () {
        console.log("dialogSetOfficerCtrl.cancel", {
            $self: $self
        });
        $mdDialog.cancel($scope);
    };

}]);


Utils.CoreApp.gameApp.controller("userRatingCtrl", ["$scope", "confederationService", "profileService", "$q", "userNameSercherService", function ($scope, $cs, profileService, $q, $uSercher) {
    var $self = this;
    var $ratting = $cs.Rating;
    var isInit = true;

    this.scrollDataInProgress = false;
    var $scrollDisabled = true;
    Object.defineProperty(this, "scrollDisabled", {
        get: function () {
            return $scrollDisabled || $self.scrollDataInProgress;
        }
    });

    this.useScroll = true;
    var perPage = $ratting.PerPage;
    this.users = [];
    this.loadNextPage = function () {
        if (this.scrollDataInProgress) return;
        if (isInit) {
            $cs.ratingAddAndTakeLocalUsers($ratting.Users, this.users, $ratting.PerPage);
            var size = this.users.length;
            if (size < perPage) {
                $ratting.$totalCount = size;
            }
            isInit = false;
            return;
        }
        if ($ratting.$totalCount && this.users.length === $ratting.$totalCount) return;

        this.scrollDataInProgress = true;

        var startCount = this.users.length;
        if (!startCount) {
            this.scrollDataInProgress = false;
            return;
        }
        if (!$ratting.Users[startCount]) {
            //console.log(" $cs.ratingGetNextPage", { $self: $self });
            //server request
            $cs.ratingGetNextPage($ratting, function (newDataUsers) {
             //   console.log(" ratingGetNextPage.answer", { $self: $self, newDataUsers: newDataUsers });
                var newSize = _.size(newDataUsers);
                if (newSize === 0) {
                    $ratting.$totalCount = $self.users.length;
                }
                else {
                    $cs.ratingAddUserItemsToOld($self.users, newDataUsers);
                    $cs.ratingCheckAndFixUniqe($self);
                }
                $self.scrollDataInProgress = false;

            }, function (errorAnswer, msg, errorData) {
                $self.scrollDataInProgress = false;
            });

            return;
        }
        else {
            //update from local 
            $cs.ratingAddAndTakeLocalUsers($ratting.Users, $self.users, perPage);
            $cs.ratingCheckAndFixUniqe($self);
            $self.scrollDataInProgress = false;
            return;
        }


    };
    //PerPage
    //MaxCacheTime
    this.getUserInfo = function (user) {
        profileService.setProfile(user.UserId);
    };
    this.serchedUser = null;

    // serch user
    this.inLoc = false;
    this.serchPlaceholder = GameServices.translateService.getCommon().serch;

    this.searchText = null;
    this.onTextChange = function (text) {
        if (text === "" || !text) {
            $self.useScroll = true;
            $self.serchedUser = null;
        }
    };
    this.selectedSerchedItem = null;
    this.querySearch = function (query) {
        var deferred = $q.defer();
        $uSercher.filterAsync(query).then(function (items) {
            var cleanItems = $uSercher.ignoreNpcFilter(items);
            deferred.resolve(cleanItems);
        });
        return deferred.promise;
    };
    this.onSelectedItemChanded = function (serchedItem) {
        if (serchedItem) {
            if ($self.useScroll) {
                $self.inLoc = true;
                $cs.ratingGetUserItem(serchedItem.Id, $ratting.Users, function (serchedUserItem) {
                    if (serchedUserItem) {   
                        $self.serchedUser = serchedUserItem;
                        $self.useScroll = false;
                    }
                    $self.inLoc = false;

                }, function (errorAnswer, msg, errorData) {
                    console.log("userRatingCtrl.onSelectedItemChanded.error", { errorAnswer: errorAnswer, msg: msg, errorData: errorData, $self: $self });
                    $self.inLoc = false;
                });
            }
        }
        else {
            $self.useScroll = true;
            $self.serchedUser = null;
        }

    };
    //acCtrl = $scope.$$childHead.$mdAutocompleteCtrl                       S

    $scope.$watch("body.active", function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scrollDisabled = !newVal;
        }
        //console.log("userRatingCtrl", {
        //    body: $scope.body,
        //    $scope: $scope,
        //    newVal: newVal,
        //    oldVal: oldVal,
        //});
    });




}]);

Utils.CoreApp.gameApp.controller("electionCtrl", ["$scope", "$rootScope", "confederationService", "profileService", "$q", "userNameSercherService", function ($scope, $rootScope, $cs, profileService, $q, $uSercher) {
    var $self = this;
    var tmpElectionModel = {
        Candidates: [],
        IsRegisterPeriod: true,
        RegistrBtn: null,
        RegistrCcPrice: 100,
        Registred: false,
        StartVoteTime: 0,
        StartRegistrationTime: 0,
        EndVoteTime: 0

    };

    this.model = $cs.getElectionData();

    this.getUserInfo = function (candidat) {
        profileService.setProfile(candidat.UserId);
    };

    this.lockedAddVoice = false;

    this.addVoice = function ($event, candidat) {
        if ($self.lockedAddVoice) return;
        $self.lockedAddVoice = true;
        $cs.addVoiceToOfficer($event, candidat, $self.model.$params, function () {
            $self.lockedAddVoice = false;
        }, function (msg) {
            $self.lockedAddVoice = false;
            console.log("electionCtrl.addVoice.error", { msg: msg });
        }, $rootScope);
    };


    $scope.$on("election:finished", function ($event, data) {
        // var newListIOfficerOut = data.newListIOfficerOut;
        if (_.isEqual($self.model, data.election)) {
            console.log("isEqual.electionCtrl.election:finished.isEqual");
        }
        else {
            $self.model = data.election;
        }
        console.log("electionCtrl.election:finished", {
            $event: $event,
            data: data,
            $self: $self
        });
    });

    $scope.$on("election:update-candidates", function ($event, data) {
        if (_.isEqual($self.model.Candidates, data.Candidates)) {
            //todo  всегда одинаковые при регистрации - оповещении пользователя(проверенно)
            //todo  всегда олинаковые при полном обновлении кандидатов пользователя(не проверенно)
            console.log("isEqual.electionCtrl.election:update-candidates");
        }
        else {
            $self.model.Candidates = data.Candidates;
        }
        console.log("electionCtrl.election:update-candidates", {
            $event: $event,
            data: data,
            $self: $self,
        });
    });

    $scope.$on("election:cr-user-voice-added", function ($event, data) {
        if (_.isEqual(data.params, $self.params)) {
            console.log("isEqual.electionCtrl.election:cr-user-voice-added");
        }
        else {
            $self.model.$params = data.params;
        }
        console.log("electionCtrl.election:update-candidates", {
            $event: $event,
            data: data,
            $self: $self,
        });
    });



    //setInterval(function () {
    //    $cs.Election.IsRegisterPeriod = !$cs.Election.IsRegisterPeriod;

    //},5000);


}]);
Utils.CoreApp.gameApp.controller("gameCtrl", [
    //#region base
    "$scope", "$rootScope", "$compile",
    //#region Build
    "buildReqHelper",
    "buildService",
    "commandCenterService",
    "industrialComplexService",
    "laboratoryService",
    "spaceShipyardService",
    //#endregion

    //#region Hub
    "mainGameHubService",
    //#endregion

    "allianceService",
    "bookmarkService",
    "confederationService",
    "estateService",
    "gameChestService",
    "hangarService",
    "journalService",
    "mapInfoService",
    "userChannelsService",
    "planshetService",
    "profileService",
    "resourceService",
    "tabService",
    "translateService",
    "unitDialogService",
    //#region Helper

 
    "controlDiskHelper",
    "controlPanelSwicherHelper",
    "dropableElementHelper",
    "journalHelper",
    "mainHelper",
    "mapControlHelper",
    "mapInfoHelper",
    "npcHelper",
    "paralaxButtonHelper",
    "planshetHelper",
    "scrollerHelper",
    "statisticHelper",
    "techTreeHelper",
    "timerHelper",
    "uploadHelper",
    //#endregion
    function (//#region base
        $scope, $rootScope, $compile,
        //#region Build
        buildReqHelper,
        buildService,
        commandCenterService,
        industrialComplexService,
        laboratoryService,
        spaceShipyardService,
        //#endregion

         //#region Hub
        mainGameHubService,
        //#endregion

        allianceService,
        bookmarkService,
        confederationService,
        estateService,
        gameChestService,
        hangarService,
        journalService,
        mapInfoService,
        userChannelsService,
        planshetService,
        profileService,
        resourceService,
        tabService,
        translateService,
        unitDialogService,

        //#region Helper
 
        controlDiskHelper,
        controlPanelSwicherHelper,
        dropableElementHelper,
        journalHelper,
        mainHelper,
        mapControlHelper,
        mapInfoHelper,
        npcHelper,
        paralaxButtonHelper,
        planshetHelper,
        scrollerHelper,
        statisticHelper,
        techTreeHelper,
        timerHelper,
        uploadHelper
        //#endregion
    ) {
        "use strict";

        //#region Core

        //#region Planshet
        $scope.planshetModel = planshetService.getCurrentModel();
        this.isActiveTab = function(item) {
            return tabService.isActiveTab(item);
        };
        this.activateTabByIdx = function(button) {
            tabService.activateTabByIdx(button);
        };

        function updatePlanshet(func) {
            mainHelper.applyTimeout(function () {
                $scope.planshetModel = planshetService.getCurrentModel();
                //console.log("updatePlanshet_______", $scope.planshetModel);
                if (func instanceof Function) func();
                $scope.$broadcast("planshet:update");
            });
        }

        GameServices._updatePlanshet =  $scope.updatePlanshet = updatePlanshet;
        //#endregion


        //#region Init Data
        var services = {
            //#region Build
            buildReqHelper: buildReqHelper,
            buildService: buildService,
            commandCenterService: commandCenterService,
            industrialComplexService: industrialComplexService,
            laboratoryService: laboratoryService,
            spaceShipyardService: spaceShipyardService,
            //#endregion

            //#region Hub
            mainGameHubService: mainGameHubService,
            //#endregion

            allianceService: allianceService,
            bookmarkService: bookmarkService,
            confederationService: confederationService,
            estateService: estateService,
            gameChestService: gameChestService,
            hangarService: hangarService,
            journalService: journalService,
            mapInfoService: mapInfoService,
            userChannelsService: userChannelsService,

            planshetService: planshetService,
            profileService: profileService,
            resourceService: resourceService,
            tabService: tabService,
            translateService: translateService,
            unitDialogService: unitDialogService,

            //#region Helper        
            controlDiskHelper: controlDiskHelper,
            controlPanelSwicherHelper: controlPanelSwicherHelper,
            dropableElementHelper: dropableElementHelper,
            journalHelper: journalHelper,
            mainHelper: mainHelper,
            mapControlHelper: mapControlHelper,
            mapInfoHelper: mapInfoHelper,
            npcHelper: npcHelper,
            paralaxButtonHelper: paralaxButtonHelper,
            planshetHelper: planshetHelper,
            scrollerHelper: scrollerHelper,
            statisticHelper: statisticHelper,
            techTreeHelper: techTreeHelper,
            timerHelper: timerHelper,
            uploadHelper: uploadHelper
            //#endregion

        };
        GameServices.Init(services);
        this.setEstateBuilds = function (data) {
           // console.log("gameCtrl.setEstateBuilds");
            buildReqHelper.addBuildsToPlanshet(data);

        }
        this.setCtrlData = function(data) {
            paralaxButtonHelper.setBaseBtns(data);
            //hide panel
            mapControlHelper.init();
        }

        this.setTranslate = function(data) {
            translateService.init(data);

        }
        this.setPersonalData = function (data) {
            profileService.setInitDataCurrentUser(data);
        };
        this.setResources = function (data) {
           // console.log("gameCtrl.setResources");
            resourceService.init(data);
        }
        this.setServerTime = function (serverTime) {
            Utils.Time.LOCAL_SERVER_DELTA_TIME = 0;
            Utils.Time.LOCAL_SERVER_DELTA_TIME = serverTime - Utils.Time.GetUtcNow(true);
            //Utils.Time.LOCAL_SERVER_DELTA_TIME = serverTime - Math.floor(Time.GetUtcNow(true));
            Object.freeze(Utils.Time);
        }
        this.setInitialAlliance = allianceService.setInitialAlliance;
        this.setAllianceNames = allianceService.setAllianceNames;
        this.setInitialUserChannelsModel = userChannelsService.setInitialUserChannelsModel;
        this.setInitialConfederationsModel = confederationService.setInitialConfederationsModel;
 
        this._$broadcastEstateId = function(newEstateId) {
            $rootScope.$broadcast("gameCtrl:estate-changed", {newVal:newEstateId});
        };

        this.skagryLoaded = false;

        this.loadGame = function (data) {
            estateService.loadGame($scope, data);
        };  

        //#endregion  


        //#region Global Events
 
        $scope.$on("user:join-to-game", function (event,data) {
            var currentUserId = data.CurrentConnectionUser.UserId;
            var connectedUserId = data.ConnectedUserId;
            var allianceId = data.ConnectedAllianceId;
            var onlineTotalCount = data.OnlineTotalCount;
            if (currentUserId !== connectedUserId) {
                allianceService.onOtherUserConnected(connectedUserId, allianceId, onlineTotalCount);
            }

        });
        $scope.$on("user:left-game", function (event, disconnectedConnectionUser) {
            console.log("gameCtrl.$on user:left-game", {
                event: event,
                disconnectedConnectionUser: disconnectedConnectionUser
            });
            allianceService.onUserLeftGame(disconnectedConnectionUser, $rootScope);
        });

        //#endregion

        //#endregion
    }
]);


Utils.CoreApp.gameApp.controller("journalCtrl", ["$scope",
    "planshetService",
    "tabService",
    "journalService",
    "hangarService",
    "journalHelper",
    "mapInfoService",
    "mainHelper",
    function ($scope,
        planshetService,
        tabService,
        journalService,
        hangarService,
        journalHelper,
        mapInfoService,
        mainHelper) {
        var _buttons = {};
        this.getTaskCollection = journalService.getTaskCollection;  
        this.getReportCollection = journalService.getReportCollection;
        this.getReportDeleteBtn = journalService.getReportDeleteBtn; 
        this.getSpyCollection = journalService.getSpyCollection;  
        this.getLocalMotherJump = journalService.getLocalMotherJump;
        this.hasJumpMother = journalService.hasJumpMother;       
        this.updateJScope = function(updateAction) {
            _buttons = {};
            if(updateAction instanceof Function)
                mainHelper.applyTimeout(function(){
                    updateAction($scope);
                });
        };

        this.getProfileInfo = function(userName) {
            GameServices.profileService.setProfile(userName);
        };


        $scope.updateSimpleTimer = journalService.updateSimpleTimer;

        $scope.$on("journalCtrl:initializeScrollReport", function (e, bodyElement, scrollerId) {
            if (scrollerId === "journal-report") {
                e.stopPropagation();
                journalService.initializeReportScroll(bodyElement);
            }
        });

        $scope.$on("journalCtrl:initializeScrollSpy", function (e, bodyElement, scrollerId) {
            if (scrollerId === "journal-spy") {
                e.stopPropagation();
                journalService.initializeSpyScroll(bodyElement);
            }

        });



        this.getReportInfoButtons = function (reportItem) {
            if (reportItem.$btnKey && _buttons[reportItem.$btnKey]) {
                return _buttons[reportItem.$btnKey];
            }
            var btns;
            var isReport = reportItem.IsReport;   
            if (isReport) {
                btns = journalService.getReportInfoButtons(reportItem);
                btns.push(journalService.getReportDeleteBtn(reportItem));
            } else {
                //console.log("IsReport", $scope.info);
                btns = journalService.getSpyInfoButtons(reportItem);
                btns.push(journalService.getSpyAtkBtn(reportItem));
                btns.push(journalService.getSpyDeleteBtn(reportItem));
            }
            reportItem.$btnKey = Utils.Guid.CreateQuickGuid();
            _buttons[reportItem.$btnKey] = btns;
            return btns;


        };

        this.userNameIsSkagry = function (userName) {  
            return GameServices.npcHelper.isNpc(userName);
            //journalCtrl
        };

    }
]);
Utils.CoreApp.gameApp.controller("mapInfoCtrl", ["$scope",
    "mapInfoService", function ($scope, mapInfoService) {
        this.getPlanetoidInfo = mapInfoService.getPlanetoidInfo;

        $scope.$on("planshet:update", function (evt) {
            $scope.$broadcast("mapinfo:planshet:update", { planshetEvent: evt });
        });


    }
]);
Utils.CoreApp.gameApp.controller("profileCtrl", ["$scope", "profileService",
    function ($scope, profileService) {
        this.setProfileModel = profileService.setProfile;
        this.hasCheset = profileService.hasCheset;
        // GameServices.profileService.
        $scope.$on("user:avatar-updated", function (event, args) {
            GameServices._updatePlanshet();
        }); 
    }
]);


Utils.CoreApp.gameApp.controller("techTreeDialogCtrl", [
    "$scope", "$mdDialog", "techTreeData",
    function ($scope, $mdDialog, $ttd) {
        this.$title = "Tech tree";
        this.rows = $ttd.rows;
        EM.Audio.GameSounds.dialogOpen.play();
        this.cancel = function () {
            EM.Audio.GameSounds.dialogClose.play();
            $mdDialog.cancel($scope);
        };

    }
]).directive("techTreeRow", [
    function () {
        var template = "<div class='tech-row' layout='row' layout-align='start center'>" +
                             "<tech-tree-item item='row[0]'></tech-tree-item>" +
                             "<tech-tree-item item='row[1]'></tech-tree-item>" +
                             "<tech-tree-item item='row[2]'></tech-tree-item>" +
                       "</div>";

        return {
            restrict: "E",
            template: template,
            replace: true,
            scope: {
                row: "="
            }
        };
    }
]).directive("techTreeItem", [function () {
    var template = "<div flex='100' layout='column' layout-align='start center'>" +
                         "<div layout='column' layout-align='start center'>" +
                                "<div class='relative'>" +
                                     "<span class='tech-level' ng-bind='item.minLevel' ng-if='item.minLevel'></span>" +
                                     "<border-animation-item border='item.border'></border-animation-item>" +
                                "</div>" +
                                "<div class='tech-name' ng-bind='item.translateTechName'></div>" +
                         "</div>" +
                  "</div>";
    return {
        restrict: "E",
        template: template,
        replace: true,
        scope: {
            item: "="
        }
    };
}]).service("techTreeHelper", ["$mdDialog", "paralaxButtonHelper",
function ($mdDialog, $pbH) {
    var $self = this;

    this.TECH_NAMES = {
        TechWeaponUpgrade: "TechWeaponUpgrade",
        TechDamageControl: "TechDamageControl",
        TechDrone: "TechDrone",
        TechFrigate: "TechFrigate",
        TechBattlecruiser: "TechBattlecruiser",
        TechBattleship: "TechBattleship",
        TechDreadnout: "TechDreadnout"
    };
    Object.freeze(this.TECH_NAMES);

    function ITechConfigItem(nativeName, css, wuMinLevel, dcMinLevel) {
        this.NativeName = nativeName;
        this.CssTechClass = css;
        this.TranslateNames = null;
        this.TechWeaponUpgrade = {
            MinLevel: wuMinLevel
        };
        this.TechDamageControl = {
            MinLevel: dcMinLevel
        };     
    }

    

    function TechConfig() {
        this.TechWeaponUpgrade = new ITechConfigItem($self.TECH_NAMES.TechWeaponUpgrade, "tech-wu", 0, 0);
        this.TechWeaponUpgrade.TranslateNames = Utils.CreateLangSimple("EN WeaponUpgrade", "ES WeaponUpgrade", "RU WeaponUpgrade");

        this.TechDamageControl = new ITechConfigItem($self.TECH_NAMES.TechDamageControl,  "tech-dc", 0, 0);
        this.TechDamageControl.TranslateNames = Utils.CreateLangSimple("EN DamageControl", "ES DamageControl", "RU DamageControl");

        this.TechDrone = new ITechConfigItem($self.TECH_NAMES.TechDrone,  "tech-drone", 0, 0);
        this.TechDrone.TranslateNames = Utils.CreateLangSimple("EN Drone", "ES Drone", "RU Drone");


        this.TechFrigate = new ITechConfigItem($self.TECH_NAMES.TechFrigate,  "tech-frigate", 8, 8);
        this.TechFrigate.TranslateNames = Utils.CreateLangSimple("EN Frigate", "ES Frigate", "RU Frigate");

        this.TechBattlecruiser = new ITechConfigItem($self.TECH_NAMES.TechBattlecruiser,  "tech-battlecruiser", 15, 15);
        this.TechBattlecruiser.TranslateNames = Utils.CreateLangSimple("EN Battlecruiser", "ES Battlecruiser", "RU Battlecruiser");

        this.TechBattleship = new ITechConfigItem($self.TECH_NAMES.TechBattleship,  "tech-battleship", 23, 23);
        this.TechBattleship.TranslateNames = Utils.CreateLangSimple("EN Battleship", "ES Battleship", "RU Battleship");

        this.TechDreadnout = new ITechConfigItem($self.TECH_NAMES.TechDreadnout, "tech-drednout", 35, 35);
        this.TechDreadnout.TranslateNames = Utils.CreateLangSimple("EN Dreadnout", "ES Dreadnout", "RU Dreadnout");
 
    }



    TechConfig.prototype.getUnitTechesArray = function () {
        return [this.TechDrone, this.TechFrigate, this.TechBattlecruiser, this.TechBattleship, this.TechDreadnout];
    };

    TechConfig.prototype.clone = function () {
        return _.cloneDeep(this);
    };

 


    var _techConfig = new TechConfig();
 
    var _unitTechesArr = _techConfig.getUnitTechesArray();
 



    function _createSpriteIcon(cssTechClass,isAlliance) {
        return "sprite_atlas " + (isAlliance ? "alliance" : "user") + "-tech " + cssTechClass + " " + $pbH.BUTTONS_CONSTANTS.M;
    }
    function _createBa(cssTechClass, isAlliance) {
        var data = {
            ImagePathOrCss: _createSpriteIcon(cssTechClass, isAlliance)
        };
        return $pbH.SectionItem().BorderAnimView($pbH.BUTTONS_CONSTANTS.M, false, data);
    }

    function TechItem(border, translateTechName, minLevel) {
        this.border = border;
        this.minLevel = minLevel;
        this.translateTechName = translateTechName;
    }


    function _createRows(sourceIsAlliance) {
        var rows = [];
        for (var i = 0; i < 5; i++) {
               var unit = _unitTechesArr[i];
               var atack = new TechItem(_createBa(_techConfig.TechWeaponUpgrade.CssTechClass, sourceIsAlliance), _techConfig.TechWeaponUpgrade.TranslateNames.getCurrent(), unit.TechWeaponUpgrade.MinLevel);
               var structure = new TechItem(_createBa(_techConfig.TechDamageControl.CssTechClass, sourceIsAlliance), _techConfig.TechDamageControl.TranslateNames.getCurrent(), unit.TechDamageControl.MinLevel);
               var profileUnit = new TechItem(_createBa(unit.CssTechClass, sourceIsAlliance), unit.TranslateNames.getCurrent());
            var row = [atack, structure, profileUnit];
            rows.push(row);
        }
        return rows;
    }
 
    this.createTechTreeDialog = function ($event, sourceIsAlliance) {  
        $mdDialog.show({
            templateUrl: "dialog-tech-tree.tmpl",
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
                techTreeData: {
                    rows: _createRows(sourceIsAlliance)
                }
            },
            //bindToController: true,
            controller: "techTreeDialogCtrl",
            controllerAs: "ttdCtrl"
        }).then(function (ctrlScope) {
            //confirm       
            ctrlScope.$destroy();
        }, function (ctrlScope) {
            //cancel
            ctrlScope.$destroy();
        });
    };
 

    Object.defineProperty(this, "$techConfig", {
        get: function () {
            return _techConfig.clone();
        }
    });
    this.getNativeNames = _techConfig.getNativeNames;



}
]);


//units
Utils.CoreApp.gameApp.controller("unitDetailDialogCtrl",
    ["$scope", "$mdDialog", "unitDialogService", "unitDetailDialogData",
        function ($scope, $mdDialog, $uds, $ud) {
            var $self = _.extend(this, $uds.CreateUnitDetailUnitView($ud.unit));            
            EM.Audio.GameSounds.dialogOpen.play();
            this.cancel = function () {
                EM.Audio.GameSounds.dialogClose.play();
                $mdDialog.cancel();
            };

        }
    ])
    .controller("unitBuyDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "unitBuyDialogData", function ($scope, $mdDialog, $uds, $ubdd) {
        var $self = _.extend(this, $uds.CreateBuyUnitViewData($ubdd));
       
        EM.Audio.GameSounds.dialogOpen.play();
        this.updateUnitInputModel = function ($event) { 
            $self.hasError = $self.$hasError();
            GameServices.spaceShipyardService.updateUnitInputModel($ubdd.dataUnit);
 
        };
        this.cancel = function () {
            EM.Audio.GameSounds.dialogClose.play();
            $mdDialog.cancel();
        };
        this.buy = function ($event) {
            if (this.$hasError()) {
                return;
            }
            var submit = this.Update.Buttons.Submit;
            console.log([this, submit]);

            try {
                submit.Method(submit.Params);
                $mdDialog.hide($scope);
            } catch (e) {

            }



        }; 
        $scope.$watch("ubdCtrl.errorModels.count.isError", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    $self.errorModels.count.isError = newVal;
                });
            }
        });
        $scope.$watch("ubdCtrl.hasError", function (newVal, oldVal) {
            if (newVal !== oldVal) {
                GameServices.mainHelper.applyTimeout(function () {
                    $self.hasError = $self.$hasError();                          
                });
            }
        });

    }]);


//tech
Utils.CoreApp.gameApp.controller("techDetailDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "techDetailDialogData", function ($scope, $mdDialog, $uds, techDetailDialogData) {
    _.extend(this, $uds.CreateTechDetailView(techDetailDialogData));
    EM.Audio.GameSounds.dialogOpen.play();
    this.cancel = function () {
        EM.Audio.GameSounds.dialogClose.play();
        $mdDialog.cancel();
    };
}
]).controller("techBuyDialogCtrl", ["$scope", "$mdDialog", "unitDialogService", "techBuyDialogData", function ($scope, $mdDialog, $uds, techBuyDialogData) {
    var $self = _.extend(this, $uds.CreateBuyTechViewData(techBuyDialogData));   
    EM.Audio.GameSounds.dialogOpen.play();
    this.updateTechInputModel = function ($event) {
        $self.hasError = $self.$hasError(); 
    };
    this.cancel = function () {
        EM.Audio.GameSounds.dialogClose.play();
        $mdDialog.cancel();
    };
    this.buy = function ($event) {
        if (this.$hasError()) {
            return;
        }
        var submit = this.Update.Buttons.Submit;
        try {
            submit.Method(submit.Params);
            $mdDialog.hide($scope);
        } catch (e) {

        }
    };

    $scope.$watch("tbdCtrl.hasError", function (newVal, oldVal) { 
        if (newVal !== oldVal) {
            GameServices.mainHelper.applyTimeout(function () {
                $self.hasError = $self.$hasError();
            });
        }
    });
    }]);
//directive 
Utils.CoreApp.gameApp.directive("unitPriceInDialog", [
    function () {
        function link($scope, element, attrs, ctrl) {
 
        }

        return {
            restrict: "E",
            templateUrl: "unit-price-in-dialog.tmpl",
            scope: {
                priceItem: "=",
                canBuyMultipleItems:"=?",
                onInputDataChange:"="
            },
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("unitErrorsBuyInDialog", [
    function () {
        function link($scope, element, attrs, ctrl) {
            console.log("unitErrorsBuyInDialog", { $scope: $scope });

        }
        return {
            restrict: "E",
            templateUrl: "unit-errors-buy-in-dialog.tmpl",
            scope: {
                priceItem: "="   
            },
            link: link
        };
    }
]);
// service

Utils.CoreApp.gameApp.service("unitDialogService", ["techTreeHelper", "$mdDialog", "baseDialogHelper", function ($ttH, $mdDialog, baseDialogHelper) {
        "use strict";
        var $mf = Utils.ModelFactory;
        function AtackProps(count, unitStat, baseTech, profileTech, allianceBaseTech, allianceProfileTech, officer, boosers) {
            var stat = unitStat.Attack || 0;

            var baseTechPercent = baseTech.Info.Data.Properties.Atack.CurrentValue || 0;
            if (!baseTech.Info.Data.Properties.Level.CurrentValue) {
                baseTechPercent = 0;
            }

            var profilePercent = profileTech.Info.Data.Properties.Atack.CurrentValue || 0;
            if (!profileTech.Info.Data.Properties.Level.CurrentValue) {
                profilePercent = 0;
            }
            var allianceBaseTechPercent = allianceBaseTech.Progress.Advanced.Atack.CurrentValue || 0;
            if (!allianceBaseTech.Progress.Advanced.Level.CurrentValue) {
                allianceBaseTechPercent = 0;
            }

            var allianceProfileTechPercent = allianceProfileTech.Progress.Advanced.Atack.CurrentValue || 0;
            if (!allianceProfileTech.Progress.Advanced.Level.CurrentValue) {
                allianceProfileTechPercent = 0;
            }

            var officerPercent = officer.Attack || 0;
            var booserPercent = boosers.Attack || 0;

            var sumMod = (baseTechPercent + profilePercent + allianceBaseTechPercent + allianceProfileTechPercent + officerPercent + booserPercent) * 0.01;
            var total = stat + (stat * sumMod);
            var stakSum = count * total;

            return [
                $mf.KeyVal(unitStat.AttackName, stat),
                $mf.KeyVal(baseTech.TranslateName, baseTechPercent + "%"),
                $mf.KeyVal(profileTech.TranslateName, profilePercent + "%"),
                $mf.KeyVal(allianceBaseTech.Text.Name, allianceBaseTechPercent + "%"),
                $mf.KeyVal(allianceProfileTech.Text.Name, allianceProfileTechPercent + "%"),
                $mf.KeyVal("AtackBooser", 0 + "%"),
                $mf.KeyVal("Officer (" + unitStat.AttackName + ")", officerPercent + "%"),
                $mf.KeyVal("Sum " + unitStat.AttackName, _.round(total, 2)),
                $mf.KeyVal("Total stack", _.round(stakSum, 2))
            ];
        }

        function StructureProps(count, unitStat, baseTech, profileTech, allianceBaseTech, allianceProfileTech, officer, boosers) {
            var stat = unitStat.Hp || 0;
            var baseTechPercent = baseTech.Info.Data.Properties.Hp.CurrentValue || 0;
            if (!baseTech.Info.Data.Properties.Level.CurrentValue) {
                baseTechPercent = 0;
            }
            var profilePercent = profileTech.Info.Data.Properties.Hp.CurrentValue || 0;
            if (!profileTech.Info.Data.Properties.Level.CurrentValue) {
                profilePercent = 0;
            }

            var allianceBaseTechPercent = allianceBaseTech.Progress.Advanced.Hp.CurrentValue || 0;
            if (!allianceBaseTech.Progress.Advanced.Level.CurrentValue) {
                allianceBaseTechPercent = 0;
            }
            var allianceProfileTechPercent = allianceProfileTech.Progress.Advanced.Hp.CurrentValue || 0;
            if (!allianceProfileTech.Progress.Advanced.Level.CurrentValue) {
                allianceProfileTechPercent = 0;
            }

            var officerPercent = officer.Hp || 0;
            var booserPercent = boosers.Hp || 0;


            var sumMod = (baseTechPercent + profilePercent + allianceBaseTechPercent + allianceProfileTechPercent + officerPercent + booserPercent) * 0.01;
            var total = stat + (stat * sumMod);
            var stakSum = count * total;
            return [
                $mf.KeyVal(unitStat.HpName, stat),
                $mf.KeyVal(baseTech.TranslateName, baseTechPercent + "%"),
                $mf.KeyVal(profileTech.TranslateName, profilePercent + "%"),
                $mf.KeyVal(allianceBaseTech.Text.Name, allianceBaseTechPercent + "%"),
                $mf.KeyVal(allianceProfileTech.Text.Name, 0 + "%"),
                $mf.KeyVal("StructureBooser", booserPercent + "%"),
                $mf.KeyVal("Officer (" + unitStat.HpName + ")", officerPercent + "%"),
                $mf.KeyVal("Sum " + unitStat.HpName, _.round(total, 2)),
                $mf.KeyVal("Total stack", _.round(stakSum, 2))
            ];
        }

        var TECH_NAMES = $ttH.TECH_NAMES;

        var UNIT_NAMES = {
            Drone: "Drone",
            Frigate: "Frigate",
            Battlecruiser: "Battlecruiser",
            Battleship: "Battleship",
            Drednout: "Drednout"
        };
        Object.freeze(UNIT_NAMES);

        function _createUnitTechName(unitNativeName) {
            return "Tech" + unitNativeName;
        }

        function RefUnitToTech() {
            this.Drone = _createUnitTechName(UNIT_NAMES.Drone);
            this.Frigate = _createUnitTechName(UNIT_NAMES.Frigate);
            this.Battlecruiser = _createUnitTechName(UNIT_NAMES.Battlecruiser);
            this.Battleship = _createUnitTechName(UNIT_NAMES.Battleship);
            this.Drednout = _createUnitTechName(UNIT_NAMES.Drednout);
        }
        RefUnitToTech.prototype.getTechName = function (unitNativeName) {
            return this[unitNativeName];
        }

        var refUnitToTechName = new RefUnitToTech();
        Object.freeze(refUnitToTechName);

        function getTechFromTechCollection(techCollection, techNativeName) {
            return _.find(techCollection, function (o) { return o.NativeName === techNativeName; });
        }


        function _getDescriptionTranslateKey(unitNativeName) {
            if (unitNativeName === UNIT_NAMES.Battlecruiser) {
                return "battleCruiserDescription";
            }
            else if (unitNativeName === UNIT_NAMES.Battleship) {
                return "battleShipDescription";
            }
            else {
                return _.lowerFirst(unitNativeName) + "Description";
            }

        }

        function _getUnitStat(shipyandUnits, unitNativeName) {
            var unit = _.find(shipyandUnits, function (o) {
                return o.NativeName === unitNativeName;
            });
            return unit.Info.Data.UnitStats;
        }

        function _getBooserMod() {
            var result = $mf.IBattleStats();
            //todo code heare
            return result;
        }

        function BaseViewItem(title, icon, description) {
            this.Title = title;
            this.Icon = icon;
            this.Description = description;
     
        }

        function UnitView(unitData) {
            console.log("UnitView", { unitData: unitData });
            //unit
            var shipyardUnits = GameServices.spaceShipyardService.getBuildCollection();
            var translateKey = _getDescriptionTranslateKey(unitData.NativeName);
            var translate = GameServices.translateService.getUnit();
            var unitStats = _getUnitStat(shipyardUnits, unitData.NativeName);
            var count = unitData.Progress.Level || 0;

            var profileTechName = refUnitToTechName.getTechName(unitData.NativeName);
            //personal tech
            var teches = GameServices.laboratoryService.getCollection();
            var profileTech = getTechFromTechCollection(teches, profileTechName);
            var atackTech = getTechFromTechCollection(teches, TECH_NAMES.TechWeaponUpgrade);
            var structTech = getTechFromTechCollection(teches, TECH_NAMES.TechDamageControl);

            //allianceTech
            var allianceTechModel = GameServices.allianceService.getAllianceTechModel();
            var allianceTeches = allianceTechModel.Teches;
            var allianceBaseAtakTech = allianceTeches[TECH_NAMES.TechWeaponUpgrade];
            var allianceBaseStructureTech = allianceTeches[TECH_NAMES.TechDamageControl];
            var allianceProfileTech = allianceTeches[profileTechName];

            var officerBonus = GameServices.confederationService.getOfficerBonusForCurrentUser();
            var boosterMods = _getBooserMod();

            //console.log("UnitView", {
            //    teches: teches,
            //    profileTech: profileTech,
            //    atackTech: atackTech,
            //    structTech: structTech,
            //    unitStats: unitStats,
            //    unitData: unitData,
            //});

            _.extend(this, new BaseViewItem(unitData.Name + " (" + count + ")", unitData.SpriteImages.Detail, translate[translateKey]) );
            this.Atack = new AtackProps(count, unitStats, atackTech, profileTech, allianceBaseAtakTech, allianceProfileTech, officerBonus, boosterMods);
            this.Structure = new StructureProps(count, unitStats, structTech, profileTech, allianceBaseStructureTech, allianceProfileTech, officerBonus, boosterMods);
        }

        function _createUnitTechError(minlevel, currentLevel, translateName, errorDescription) {
            function TechError() {
                this.MinLevel = minlevel;
                this.CurrentLevel = currentLevel;
                this.TranslateName = translateName;
                this.Description = errorDescription;
            };
            return new TechError();
        }

        function createUnitTechErrorDescription(techErrorModel) {
            var spt = baseDialogHelper.setSpanText;
            var selectCss = baseDialogHelper.cssSelectName;
            var template = Utils.LangSimple(
                spt("EN: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)),
                spt("ES: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)),
                spt("RU: недостаточный уровень технологии " +
                    spt(techErrorModel.TranslateName, selectCss) +
                    " <br> необходимый уровень: " +
                    spt(techErrorModel.MinLevel, selectCss) +
                    " <br> текущий уровень: " +
                    spt(techErrorModel.CurrentLevel, selectCss)));
            return template.getCurrent();
        }

        function createUnitTechProfileErrorDescription(techErrorModel) {
            var spt = baseDialogHelper.setSpanText;
            var selectCss = baseDialogHelper.cssSelectName;
            var template = Utils.LangSimple(
                spt("EN: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"),
                spt("ES: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"),
                spt("RU: технология " + spt(techErrorModel.TranslateName, selectCss) + " не изучена"));
            return template.getCurrent();
        }

        function _extendDialogBuyErrors(inst, teches, techCondition, profileTech) {
            var weaponKey = TECH_NAMES.TechWeaponUpgrade;
            var dcKey = TECH_NAMES.TechDamageControl;

            inst.errorModels = {
                count: {
                    isError: false
                },
                resource: {
                    e: {
                        isError: false,
                        message:"недостаточно e"
                    },
                    ir: {
                        isError: false,
                        message: "недостаточно ir"
                    },
                    dm: {
                        isError: false,
                        message: "недостаточно dm"
                    },
                    cc: {
                        isError: false,
                        message: "недостаточно cc"
                    }

                }

            };
            inst.errorModels.resource.$resetCcError = function () {
                inst.errorModels.resource.cc.isError = false;
            };
            inst.errorModels.resource.$resetMaterialresourcesErrors = function () {
                var r = inst.errorModels.resource;
                r.e.isError = r.ir.isError = r.dm.isError = false;
            };

            var weaponUpgrade = getTechFromTechCollection(teches, weaponKey);
            var damageControl = getTechFromTechCollection(teches, dcKey);
            var dcLevel = damageControl.Update.Properties[0].CurrentValue;
            var wuLevel = weaponUpgrade.Update.Properties[0].CurrentValue;

            if (techCondition) {
                if (techCondition[dcKey] && techCondition[dcKey] > dcLevel) {
                    var dcError = _createUnitTechError(techCondition[dcKey], dcLevel, damageControl.TranslateName);
                    dcError.Description = createUnitTechErrorDescription(dcError);
                    inst.errorModels[dcKey] = dcError;
                }

                if (techCondition[weaponKey] && techCondition[weaponKey] > wuLevel) {
                    var wuError = _createUnitTechError(techCondition[dcKey], dcLevel, damageControl.TranslateName);
                    wuError.Description = createUnitTechErrorDescription(wuError);
                    inst.errorModels[weaponKey] = wuError;
                }


            }

            if (profileTech) {
                var profileTechLevel = profileTech.Update.Properties[0].CurrentValue; 
                if (profileTechLevel <= 0) {
                    var profileError = _createUnitTechError(1, 0, profileTech.TranslateName);
                    profileError.Description = createUnitTechProfileErrorDescription(profileError);
                    inst.errorModels.ProfileTech = profileError;
                }
            }


            inst.$calcPrice = function (count) {
                var materialResource = Utils.ModelFactory.MaterialResources();
                materialResource.E = inst.Price.E * count;
                materialResource.Ir = inst.Price.Ir * count;
                materialResource.Dm = inst.Price.Dm * count;
                return materialResource;

            };
            inst.hasError = false;
            inst.$hasResources = function () {
                var count = inst.Update.upgradeCount;
                var forCc = inst.Price.forCc;
                if (forCc) {
                    inst.errorModels.resource.$resetMaterialresourcesErrors();
                    var ccPrice = inst.Price.Cc * count;
                    var hasCc = GameServices.resourceService.isEnoughCc(ccPrice);
                    inst.errorModels.resource.cc.isError = !hasCc;
 
                    return hasCc;
                }
                else {
             
                    inst.errorModels.resource.$resetCcError();
                    var calculatedPrice = inst.$calcPrice(count);    
                    var r = inst.errorModels.resource; 
                    var currentResource = GameServices.resourceService.getStorageResources().Current;
                    r.e.isError = currentResource.E < calculatedPrice.E;
                    r.ir.isError = currentResource.Ir < calculatedPrice.Ir;
                    r.dm.isError = currentResource.Dm < calculatedPrice.Dm;
 
                    return !r.e.isError && !r.ir.isError && !r.dm.isError;

                }

            }
            inst.$hasError = function () {
                inst.errorModels.count.isError = inst.Update.upgradeCount < 1;
                var hasError = !inst.$hasResources() ||
                    inst.errorModels.count.isError ||
                    inst.errorModels.ProfileTech ||
                    inst.errorModels[weaponKey] ||
                    inst.errorModels[dcKey];

                inst.hasError = !!hasError; 
                return inst.hasError;
            };
            inst.$hasError();
        }

        function _extendBuyItem(inst,update, translate) {
            inst.Update = update;
            inst.Update.upgradeCount = 1; 
            inst.Price = inst.Update.Price;
            inst.Translate = translate;

        }


        function BuyUnitViewData(data) {
            var dataUnit = data.dataUnit;
            var unitName = dataUnit.NativeName;
            var hangarUnit = data.hangarUnit;
            var $$self = _.extend(this, new BaseViewItem(dataUnit.TranslateName, hangarUnit.SpriteImages.Icon));             
            _extendBuyItem(this, dataUnit.Update, dataUnit.unitTranslate);
            var teches = data.teches;
            var profileTechName = refUnitToTechName.getTechName(unitName);
            var profileTech = getTechFromTechCollection(teches, profileTechName);
            var techCondition = profileTech.AdvancedData.TechOut.Conditions;
            _extendDialogBuyErrors(this, teches, techCondition, profileTech);
        }

        this.CreateBuyUnitViewData = function (data) {
            return new BuyUnitViewData(data);
        };

        this.CreateUnitDetailUnitView = function (unitData) {
            return new UnitView(unitData);
        };

        this.CreateUnitDetailDialog = function ($event, unlock, unitNativeName) {
            var promise = $mdDialog.show({
                templateUrl: "unit-detail-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    unitDetailDialogData: {
                        unit: GameServices.hangarService.getPanelUnitData(unitNativeName),
                        tech: {}
                    }
                },
                controller: "unitDetailDialogCtrl",
                controllerAs: "uddCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };

        this.CreateBuyUnitDialog = function ($event, unlock, spaceShipyardUnitUtemData) {
            var unitName = spaceShipyardUnitUtemData.NativeName;
            var hangarUnit = GameServices.hangarService.getPanelUnitData(unitName);
            var teches = GameServices.laboratoryService.getCollection();
            if (!unitName || !hangarUnit || !teches) {
                unlock();
                console.log("CreateBuyUnitDialog: no data");
                return;
            }

            var promise = $mdDialog.show({
                templateUrl: "unit-buy-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    unitBuyDialogData: {
                        dataUnit: spaceShipyardUnitUtemData,
                        hangarUnit: hangarUnit,
                        teches: teches
                    }
                },
                controller: "unitBuyDialogCtrl",
                controllerAs: "ubdCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };


        //tech
        function TechView(tech, teches) {
           
            var $$self = _.extend(this, new BaseViewItem(tech.TranslateName + " (" + tech.Progress.Level + ")", tech.Info.DropImage, tech.Info.Description));

            this.Stats = [];
            _.forEach(tech.Info.infoStatsModel.stats, function (i, idx) {
                $$self.Stats.push($mf.KeyVal(i.key, i.val));
            }); 
            this.HasConditions = false; 
            this.Conditions = [];
            var conditions = tech.AdvancedData.TechOut.Conditions;
            if (conditions) {
                
                _.forEach(conditions, function (val, techNativeName) {
                    var targetTech = getTechFromTechCollection(teches, techNativeName);
                    var item = $mf.KeyVal(targetTech.TranslateName, val);
                    item.$css = "";  
                    if (targetTech.Progress.Level < val) {
                        item.$css = "red";
                        item.Val = targetTech.Progress.Level + "/" + val
                    }
                    $$self.Conditions.push(item);
                });
                if (this.Conditions.length){
                    this.HasConditions = true;
                }
            }
        }

        function TechBuyViewData(techDetailDialogData) {
            var tech = techDetailDialogData.tech;
            var techCondition = tech.AdvancedData.TechOut.Conditions;

            var $$self = _.extend(this, new BaseViewItem(tech.TranslateName, tech.IconSelf));             
            _extendBuyItem(this, tech.Update, tech.unitTranslate);
            _extendDialogBuyErrors(this, techDetailDialogData.teches, techCondition, null);
        }

        this.CreateTechDetailView = function (techItemData) {
            return new TechView(techItemData.tech, techItemData.teches);
        };

        this.CreateTechDetailDialog = function ($event, unlock, techNativeName) {
            var teches = GameServices.laboratoryService.getCollection();
            var tech = getTechFromTechCollection(teches, techNativeName);
            if (!tech) {
                unlock();
                console.log("CreateTechDetailDialog: no data");
                return;
            } 
            var promise = $mdDialog.show({
                templateUrl: "tech-detail-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    techDetailDialogData: { 
                        tech: tech,
                        teches: teches
                    }
                },
                controller: "techDetailDialogCtrl",
                controllerAs: "tddCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };


        this.CreateBuyTechViewData = function (techBuyDialogData) {
            return new TechBuyViewData(techBuyDialogData);
        };
        this.CreateBuyTechDialog = function ($event, unlock, techNativeName) {
            var teches = GameServices.laboratoryService.getCollection();
            var tech = getTechFromTechCollection(teches, techNativeName);
            if (!tech) {
                unlock();
                console.log("CreateTechDetailDialog: no data");
                return;
            } 

            var promise = $mdDialog.show({
                templateUrl: "tech-buy-dialog.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: {
                    techBuyDialogData: {
                        tech: tech,
                        teches: teches
                    }
                },
                controller: "techBuyDialogCtrl",
                controllerAs: "tbdCtrl"

            });
            promise.then(unlock, unlock);
            return promise;
        };

    }]);

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
Utils.CoreApp.gameApp.service("baseDialogHelper", ["$mdDialog",
    function ($mdDialog) {
        var $self = this;
        var supLangs = $self.supportedLangs = Utils.SupportedLangs();
        var cssSelectName = $self.cssSelectName = " unique-name ";
        var defaultTheme = $self.defaultTheme = "default-dialog";   
        this.$$mdDialog = $mdDialog;
        
        var setSpanText = this.setSpanText = function (data, cssClass) {
            return Utils.SetSpanText(data, cssClass);
        };

        // #region OpenDialogNotPermitted
        var _textOpenDialogNotPermitted; 
        function getTextOpenDialogNotPermitted() {
            if (!_textOpenDialogNotPermitted) {
                _textOpenDialogNotPermitted = Utils.CreateLangSimple("EN У вас недостаточно прав для совержения этого действия",
                    "ES У вас недостаточно прав для совержения этого действия",
                    "RU У вас недостаточно прав для совержения этого действия");
            }
            return setSpanText(_textOpenDialogNotPermitted.getCurrent());
        }

        var _titleOpenDialogNotPermitted;

        function getTitleOpenDialogNotPermitted() {
            if (!_titleOpenDialogNotPermitted) {
                _titleOpenDialogNotPermitted = Utils.CreateLangSimple("EN Not permitted",
                    "ES Not permitted",
                    "RU Not permitted");
            }
            return _titleOpenDialogNotPermitted.getCurrent();
        }

        this.openDialogNotPermitted = function($event) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title(getTitleOpenDialogNotPermitted())
                .targetEvent($event)
                .htmlContent(getTextOpenDialogNotPermitted())
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .ok("Ok!"));

        };

        function getTextErrorOverMaxLength(currentMessageLenght,maxLenght) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов. <br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES  Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов.<br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
            else {
                return setSpanText("EN  Максимальная длинна сообщения не может превышать " + setSpanText(maxLenght, cssSelectName) + " символов. <br> Текущая длинна сообщения составляет " + setSpanText(currentMessageLenght, cssSelectName) + " символов");
            }
        }

        this.errorOverMaxLength = function ($event, currentMessageLenght,maxLenght) {
          return $mdDialog.show(
              $mdDialog.alert()
              .title("Error")
              .targetEvent($event)
              .htmlContent(getTextErrorOverMaxLength(currentMessageLenght, maxLenght))
              .ariaLabel(defaultTheme)
              .clickOutsideToClose(true)
              .ok("Ok!"));
        }

        var _titleImportant;
        this.titleImportant = function () {
            if (!_titleImportant) {
                _titleImportant = Utils.CreateLangSimple("Attention : important message!",
                    "¡Atención : mensaje importante!",
                    "Внимание : Важное сообщение!");
            }
            return _titleImportant.getCurrent();
        }

        // #endregion

    }
]);
Utils.CoreApp.gameApp.service("bookmarkDialogHelper", ["baseDialogHelper",
    function (baseDialogHelper) {
        var $self = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var setSpanText = baseDialogHelper.setSpanText;
        var $mdDialog = this.$mdDialog =baseDialogHelper.$$mdDialog;
    
 
        // #region openDialogDeepDeleteOtherGroupChannels
        var _textOpenDialogBookmarkIsExist;
        function getTextOpenDialogBookmarkIsExist() {
            if (!_textOpenDialogBookmarkIsExist) {
                _textOpenDialogBookmarkIsExist = Utils.CreateLangSimple("EN _textOpenDialogBookmarkIsExist",
                    "ES _textOpenDialogBookmarkIsExist",
                    "RU _textOpenDialogBookmarkIsExist");
            }
            return _textOpenDialogBookmarkIsExist.getCurrent();
        }

        this.openDialogBookmarkIsExist = function () {     
            return $mdDialog.show(
                  $mdDialog.alert()
                  .title("Bookmark: error")      
                  .htmlContent(getTextOpenDialogBookmarkIsExist())
                  .ariaLabel(defaultTheme)
                  .clickOutsideToClose(true)
                  .ok("Ok"));

        };


 
        function getTextOpenDialogBookMarkLimitDone() {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU getTextOpenDialogBookMarkLimitDone");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  getTextOpenDialogBookMarkLimitDone");
            } else {
                return setSpanText("EN  getTextOpenDialogBookMarkLimitDone");
            }
        }

        this.openDialogBookMarkLimitDone = function () {
            return $mdDialog.show(
                  $mdDialog.alert()
                  .title("Bookmark: error")
                  .htmlContent(getTextOpenDialogBookMarkLimitDone())
                  .ariaLabel(defaultTheme)
                  .clickOutsideToClose(true)
                  .ok("Ok"));

        };


        
        // #endregion 
 

    }
]);
Utils.CoreApp.gameApp.service("confederationDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        //todo delete after
        GameServices.$cdH = this;      
 
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = this.$mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;


        // #region OpenDialogTimeVotingIsOver
        var _textOpenDialogTimeVotingIsOver;
        function getTextOpenDialogTimeVotingIsOver() {
            if (!_textOpenDialogTimeVotingIsOver) {
                _textOpenDialogTimeVotingIsOver = Utils.CreateLangSimple("EN Текущий период голосования завершён",
                                                                         "ES Текущий период голосования завершён",
                                                                         "RU Текущий период голосования завершён");
            }
            return _textOpenDialogTimeVotingIsOver.getCurrent();
        }

        this.openDialogTimeVotingIsOver = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title("ELECTION: ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogTimeVotingIsOver())
                      .ok("Ok"));
        };
        // #endregion

        // #region OpenDialogTimeVotingIsOver
        var _textOpenDialogTimeRegistrationIsOver;
        function getTextOpenDialogTimeRegistrationIsOver() {
            if (!_textOpenDialogTimeRegistrationIsOver) {
                _textOpenDialogTimeRegistrationIsOver = Utils.CreateLangSimple("EN Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.",
                                                                         "ES Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.",
                                                                         "RU Текущий период регистрации завершён, регистрация будет открыта после окончания выборов.");
            }
            return _textOpenDialogTimeRegistrationIsOver.getCurrent();
        }

        this.openDialogTimeRegistrationIsOver = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert()
                      .clickOutsideToClose(true)
                      .title("ELECTION: ERROR ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogTimeRegistrationIsOver())
                      .ok("Ok"));
        };
        // #endregion


        // #region OpenDialogTimeVotingIsOver  

        var _openDialogUserHasAlreadyCastVote;
        function getTextOpenDialogUserHasAlreadyCastVote() {
            if (!_openDialogUserHasAlreadyCastVote) {
                _openDialogUserHasAlreadyCastVote = Utils.CreateLangSimple("EN Вы уже голосовали на этой неделе",
                                                                           "ES Вы уже голосовали на этой неделе",
                                                                           "RU Вы уже голосовали на этой неделе");
            }
            return _openDialogUserHasAlreadyCastVote.getCurrent();
        }
        this.openDialogUserHasAlreadyCastVote = function ($event) {
            return $mdDialog.show(
                      $mdDialog.alert() 
                      .clickOutsideToClose(true)
                      .title("ELECTION: ")
                      .targetEvent($event)
                      .ariaLabel(defaultTheme)
                      .htmlContent(getTextOpenDialogUserHasAlreadyCastVote())
                      .ok("Ok"));
        };
        // #endregion

        // #region openDialogConfirmSendVote
        function getTextOpenDialogConfirmSendVote(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");
            } else {
                return setSpanText("EN  Вы действительно хотите отдать свой голос за  " + setSpanText(targetUserName, cssSelectName) + "?");
            }
        }


        this.openDialogConfirmSendVote = function ($event, targetUserName) {
            var confirm = $mdDialog.confirm()
                    .ariaLabel(defaultTheme)
                    .title("ELECTION: Send vote")
                    .htmlContent(getTextOpenDialogConfirmSendVote(targetUserName))
                    .targetEvent($event)
                    .ok("Confirm")
                    .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogRegistrationNotEnoughCc
        function getTextopenDialogRegistrationNotEnoughCc(priceCc,currentBalanceCc) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU На вашем балансе недостаточно СС  для регистрации. "+
                    "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC "+
                    "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC "+
                    "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES На вашем балансе недостаточно СС  для регистрации. " +
                    "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC " +
                    "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC " +
                    "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");
            } else {
                return setSpanText("EN На вашем балансе недостаточно СС  для регистрации. " +
                   "<br> Стоимость регистрации составляет :" + setSpanText(priceCc, cssSelectName) + " CC " +
                   "<br> Ваш текущий баланс: " + setSpanText(currentBalanceCc, cssSelectName) + " CC " +
                   "<br> Вам нехватет " + setSpanText(priceCc - currentBalanceCc, cssSelectName) + " CC ");
            }
        }
        this.openDialogRegistrationNotEnoughCc = function ($event,priceCc, currentBalanceCc) {
            return $mdDialog.show(
                  $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title("ELECTION: Registration - Not enough cc ")
                  .targetEvent($event)
                  .ariaLabel(defaultTheme)
                  .htmlContent(getTextopenDialogRegistrationNotEnoughCc(priceCc,currentBalanceCc))
                  .ok("Ok"));
        };
        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

    }
]);
Utils.CoreApp.gameApp.service("allianceDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        //todo delete after
        GameServices.$adH = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
 
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;

 

        //#region sendRequestJoinToAlliance
        function getTextUserHasAlliance(allianceName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br> " +
                    "запустите процедуру выхода из текущего альянса, <br>" +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("Es Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br>  " +
                    "запустите процедуру выхода из текущего альянса, <br>" +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
            else {
                return setSpanText("En Вы уже состоите в альянсе  " + setSpanText(allianceName, cssSelectName) + "<br>" +
                    "запустите процедуру выхода из текущего альянса, <br> " +
                    "дождитесь  окончания блокировки (не менее 24 часов) ");
            }
        }

        function getTextJoinMessageSended(allianceName) {

            if (LANG === supLangs.Ru) return setSpanText("Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
            else if (LANG === supLangs.Es) return setSpanText("Es Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
            else return setSpanText("En Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " принята ");
        }

        function getTextDeleteUserRequestToAlliance(allianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Ваша заявка в альянс  " + setSpanText(allianceName, cssSelectName) + " и вся переписка будет удалена <br> Хотите подтвердить удаление? ");
            else if (LANG === supLangs.Es) return setSpanText("Es Ваша заявка в альянс   " + setSpanText(allianceName, cssSelectName) + " и вся переписка будет удалена <br> Хотите подтвердить удаление?  ");
            else return setSpanText("En Ваша заявка в альянс   " + setSpanText(allianceName, cssSelectName) + "  и вся переписка будет удалена <br> Хотите подтвердить удаление? ");
        }

        function getTextUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone) {
            if (LANG === supLangs.Ru) return setSpanText("Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
            else return setSpanText("EN Вы не можете принять новую заявку до окончания блокиовки. <br> До окончания блокировки осталость " + setSpanText(dateTimeTimeToDone, cssSelectName));
        }

        function errorUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Join to alliance in block")
                .htmlContent(getTextUserCantJoinToAllianceBecauseInBlockedState(dateTimeTimeToDone))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function errorUserInAlliance(currentAllianceName) {
            $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Error")
                .htmlContent(getTextUserHasAlliance(currentAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function errorJoinToAlliance(errorAnswer, allianceId, toAllianceName, allianceService) {
            console.log("errorJoinToAlliance", {
                allianceName: toAllianceName,
                allianceId: allianceId,
                errorAnswer: errorAnswer,
                allianceService: allianceService
            });
        }

        function openDialogJoinMessageSended(allianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("Sucsess")
                .htmlContent(getTextJoinMessageSended(allianceName))
                .ariaLabel(defaultTheme)
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        function openDialogSendMessage(armModelExt, onSend, updateBlockedState, $event) {
            updateBlockedState(true);
            $mdDialog.show({
                templateUrl: "dialog-alliance-send-msg.tmpl",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                fullscreen: true,
                locals: {
                    _fromName: armModelExt.Model.FromName,
                    _toName: armModelExt.Model.ToName,
                    _maxLength: 1000,
                    _minLength: 2,
                    _title: null,
                    updateBlockedState: updateBlockedState

                },
                controller: "allianceRequestSendMsgCtrl",
                bindToController: true,
                controllerAs: "arsmCtrl"
            })
                .then(function (message) {
                    console.log("message", message);
                    //onOk
                    if (message && message.length > 1000) {
                        console.log("message length > 1000", { message: message });
                        // todo show error message
                        return;
                    }
                    armModelExt.Model.Message = message;
                    onSend();
                    updateBlockedState(false);
                }, function () {
                    //onCancel
                    console.log("createMessageToAlliance onCancel");
                    updateBlockedState(false);
                });
        }

        function openDialogDeleteUserRequestToAlliance(toAllianceName, onSend, updateBlockedState, $event) {
            updateBlockedState(true);
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Confirm")
                .htmlContent(getTextDeleteUserRequestToAlliance(toAllianceName))
                .ok("Confirm")
                .cancel("Cancel")
                .targetEvent($event);

            $mdDialog
                .show(confirm)
                .then(function () {
                    onSend(updateBlockedState);
                }, function () {
                    updateBlockedState(false);
                });
        }

        this.errorUserInAlliance = errorUserInAlliance;
 
        this.openDialogJoinMessageSended = openDialogJoinMessageSended;
        this.errorJoinToAlliance = errorJoinToAlliance;
        this.openDialogSendMessage = openDialogSendMessage;
        this.openDialogDeleteUserRequestToAlliance = openDialogDeleteUserRequestToAlliance;
        this.errorUserCantJoinToAllianceBecauseInBlockedState = errorUserCantJoinToAllianceBecauseInBlockedState;


        var _titleOpenDialogAllianceManageRefuseMemberRequest;

        function getTitleOpenDialogAllianceManageRefuseMemberRequest() {
            if (!_titleOpenDialogAllianceManageRefuseMemberRequest) {
                _titleOpenDialogAllianceManageRefuseMemberRequest = Utils.CreateLangSimple("EN Удаление заявки",
                    "ES Удаление заявки",
                    "RU Удаление заявки");
            }
            return _titleOpenDialogAllianceManageRefuseMemberRequest.getCurrent();
        }

        function getTextopenDialogAllianceManageRefuseMemberRequest(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES  Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }
            else {
                return setSpanText("EN  Заявка от пользователя   -" + setSpanText(targetUserName, cssSelectName) + " будет удалена. <br> Подтвердить действие? ");
            }

        }

        this.openDialogAllianceManageRefuseMemberRequest = function (targetUserName, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleOpenDialogAllianceManageRefuseMemberRequest())
                .htmlContent(getTextopenDialogAllianceManageRefuseMemberRequest(targetUserName))
                .ariaLabel("default-dialog")
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }


        //#endregion

        //#region leaveAlliance

        function getTextLeaveConfirm(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("Es Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
            else return setSpanText("En Вы дейсттвительно хотите выйти из  " + setSpanText(fromAllianceName, cssSelectName));
        }

        function getTextLeaveOnLeave(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
            else if (LANG === supLangs.Es) return setSpanText("es Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
            else return setSpanText("en Вы вышли из альянса " + setSpanText(fromAllianceName, cssSelectName) + "  и вошли в режим блокировки, <br> через 24 часа вы сможете подать новую заявку в альянс ");
        }

        function getTextLeaveLeader(fromAllianceName) {
            if (LANG === supLangs.Ru) return setSpanText("Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
            else if (LANG === supLangs.Es) return setSpanText("es Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
            else return setSpanText("en Вы действующией лидер альянса " + setSpanText(fromAllianceName, cssSelectName) + "<br> Переназначте лидера, или распустите альянс и повторите попытку ");
        }

        function openDialogleaveFromAlliance(fromAllianceName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Confirm")
                .htmlContent(getTextLeaveConfirm(fromAllianceName))
                .ok("Confirm")
                .cancel("Cancel");

            return $mdDialog.show(confirm);
        };

        function openDialogOnLeaveFromUserAlliance(fromAllianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Warn")
                .htmlContent(getTextLeaveOnLeave(fromAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));

        }

        function openDialogLeaveLeader(fromAllianceName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .title("Sucsess")
                .htmlContent(getTextLeaveLeader(fromAllianceName))
                .ok("Ok!")
                .openFrom({
                    width: 1,
                    height: 1
                }));
        }

        this.openDialogleaveFromAlliance = openDialogleaveFromAlliance;
        this.openDialogOnLeaveFromUserAlliance = openDialogOnLeaveFromUserAlliance;
        this.openDialogLeaveLeader = openDialogLeaveLeader;

        //#endregion

        // #region openDialogDropUserFromAlliance

        var _titleDropUserFromAlliance;

        function getTitleDropUserFromAlliance() {
            if (!_titleDropUserFromAlliance) {
                _titleDropUserFromAlliance = Utils.CreateLangSimple("EN Drop user",
                    "ES  Drop user",
                    "RU  Drop user");
            }
            return _titleDropUserFromAlliance.getCurrent();

        }

        function getTextDropUserFromAlliance(targetDropUserName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");
            else if (LANG === supLangs.Es) return setSpanText("ES Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");
            else return setSpanText("EN Вы удаляете пользователя " + setSpanText(targetDropUserName, cssSelectName) + " из состава вашего альянса, подтвердить действие?");

        }

        this.openDialogDropUserFromAlliance = function (targetDropUserName, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleDropUserFromAlliance())
                .htmlContent(getTextDropUserFromAlliance(targetDropUserName))
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogDisbandAlliance

 
        function getTextDisbandAlliance(targetAllianceName) {      
            if (LANG === supLangs.Ru) return setSpanText("EN Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
            else if (LANG === supLangs.Es) return setSpanText("ES Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
            else return setSpanText("EN Вы " + setSpanText("удаляете альянс " + targetAllianceName, cssSelectName) + " <br> после удаления вы не сможете восстановить или создать  альянс с имнем " + setSpanText(targetAllianceName, cssSelectName) + "<br> подтвердить удаление?");
        }

        this.openDialogDisbandAlliance = function (targetAllianceName, $event) {
            var confirm = $mdDialog.confirm()
           .title(baseDialogHelper.titleImportant())
           .htmlContent(getTextDisbandAlliance(targetAllianceName))
           .ariaLabel(defaultTheme)
           .targetEvent($event)
           .ok("Delete --" + targetAllianceName+"--")
           .cancel("Cancel");

            return $mdDialog.show(confirm);
        }

        // #endregion


        //#region RequestJoinToAlliance
        function getTextAllianceManageTargetUserInAlliance(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
            else {
                return setSpanText("EN пользователь " + setSpanText(targetUserName, cssSelectName) + " уже состоит в альянсе. Удалить заявку?");
            }
        }

        /**
         * 
         * @param {string} targetUserName 
         * @returns {object} deferred (angular $q promise)
         */
        function errorAllianceManageTargetUserInAlliance(targetUserName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("User in alliance")
                .htmlContent(getTextAllianceManageTargetUserInAlliance(targetUserName))
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }

        this.errorAllianceManageTargetUserInAlliance = errorAllianceManageTargetUserInAlliance;


        //#endregion

        // #region onRequestAllianceConfirmAcceptToAllianceForUser

        function getTextOnRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
            else if (LANG === supLangs.Es) {
                return setSpanText("ES Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
            else {
                return setSpanText("EN Ваша заявка в альянс " + setSpanText(toAllianceName, cssSelectName) + " рассмотренна и принята. <br> Подтвердить вступление сейчас  или сделать это позднее?");
            }
        }

        function onRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("Accepted")
                .htmlContent(getTextOnRequestAllianceConfirmAcceptToAllianceForUser(toAllianceName))
                .ok("Now")
                .cancel("Late");
            return $mdDialog.show(confirm);
        }

        this.onRequestAllianceConfirmAcceptToAllianceForUser = onRequestAllianceConfirmAcceptToAllianceForUser;
        // #endregion


        // #region changeTax
        var _titleOpenDialogChengeTax;

        function getTitleOpenDialogChengeTax() {
            if (!_titleOpenDialogChengeTax) {
                _titleOpenDialogChengeTax = Utils.CreateLangSimple("EN Change Tax", "ES Change Tax", "RU Change Tax");
            }
            return _titleOpenDialogChengeTax.getCurrent();
        }

        function openDialogChengeTax(currentTax, $event) {
            var confirm = $mdDialog.prompt()
                .title(getTitleOpenDialogChengeTax())
                //.textContent("Bowser is a common name.")
                .placeholder(currentTax)
                .ariaLabel(defaultTheme)
                .initialValue(currentTax)
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        }

        this.openDialogChengeTax = openDialogChengeTax;

        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

        // #region Role

        // #region openDialogChangeRole
        var _titleOpenDialogChangeRole;

        function getTitleOpenDialogChangeRole() {
            if (!_titleOpenDialogChangeRole) {
                _titleOpenDialogChangeRole = Utils.CreateLangSimple("EN Alliance member change Role",
                    "ES Alliance member change Role",
                    "RU Alliance member change Role");
            }

            return _titleOpenDialogChangeRole.getCurrent();
        }

        function getTextOpenDialogChangeRole(roleNameBefore, toUserName, roleNameToCSet) {
            if (LANG === supLangs.Ru) return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
            else if (LANG === supLangs.Es) return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
            else return setSpanText("Обновить текущую роль  -" + setSpanText(roleNameBefore, cssSelectName) + " для пользователя  " + setSpanText(toUserName, cssSelectName) + " на роль - " + setSpanText(roleNameToCSet, cssSelectName) + " ?");
        }

        this.openDialogChangeRole = function (translateRoleNameBefore, toUserName, translateRoleNameToSet, $event) {
            var confirm = $mdDialog.confirm()
                .title(getTitleOpenDialogChangeRole())
                .htmlContent(getTextOpenDialogChangeRole(translateRoleNameBefore, toUserName, translateRoleNameToSet))
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .ok("Ok")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };


        // #endregion

        // #region openDialogRoleNotChanged

        function getTextOpenDialogRoleNotChanged(targetUserName, targetTranslatedRoleName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));
            else return setSpanText("En Пользователю " + setSpanText(targetUserName, cssSelectName) + " уже назначенна роль " + setSpanText(targetTranslatedRoleName, cssSelectName));

        }

        this.openDialogRoleNotChanged = function (targetUserName, targetTranslatedRoleName, $event) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title("Alliance role")
                .targetEvent($event)
                .htmlContent(getTextOpenDialogRoleNotChanged(targetUserName, targetTranslatedRoleName))
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .ok("Ok!"));
        };

        // #endregion  


        // #region openDialogRoleUpdated
        var _titleOpenDialogRoleUpdated;

        function getTitleOpenDialogRoleUpdated() {
            if (!_titleOpenDialogRoleUpdated) {
                _titleOpenDialogRoleUpdated = Utils.CreateLangSimple("EN Alliance member change Role",
                                                                     "ES Alliance member change Role",
                                                                      "RU Alliance member change Role");
            }
            return _titleOpenDialogRoleUpdated.getCurrent();
        }


        function getTextOpenDialogRoleUpdated(targetUserName, newTranslatedRoleName) {
            if (LANG === supLangs.Ru) return setSpanText("RU Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));
            else return setSpanText("EN Польззователю " + setSpanText(targetUserName, cssSelectName) + " назначена новая роль - " + setSpanText(newTranslatedRoleName, cssSelectName));

        }

        this.openDialogRoleUpdated = function (targetUserName, newTranslatedRoleName, $event) {
            return $mdDialog.show($mdDialog
                .alert()
                .title(getTitleOpenDialogRoleUpdated())
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogRoleUpdated(targetUserName, newTranslatedRoleName))
                .ok("Ok"));
        };
        // #endregion



        // #endregion

        // #region errorOverMaxLength
        this.errorDescriptionOverMaxLength = function ($event, currentMessageLenght) {

            return baseDialogHelper.errorOverMaxLength($event, currentMessageLenght, maxLenghtConsts.AllianceDescription);
        }
        // #endregion


        // #region openDiaologConfirmTechUpgrade
        function getTextOpenDiaologConfirmTechUpgrade(targetTranslatedRoleName, newLevel) {
            if (LANG === supLangs.Ru) return setSpanText("RU Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName)  +"?");
            else if (LANG === supLangs.Es) return setSpanText("ES Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName) + "?");
            else return setSpanText("EN  Обновить технологию  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " до уровня " + setSpanText(newLevel, cssSelectName) + "?");

        }

        this.openDiaologConfirmTechUpgrade = function($event, techName, nextLevel) {
            var confirm = $mdDialog.confirm()
               .title("Alliance : update tech")
               .htmlContent(getTextOpenDiaologConfirmTechUpgrade(techName, nextLevel))
               .ariaLabel(defaultTheme)
               .targetEvent($event)
               .ok("Update")
               .cancel("Cancel");
            return $mdDialog.show(confirm);
        };


        // #endregion



        // #region openDiaologConfirmTechUpgrade
        function getTextopenDiaologTechUpgraded(targetTranslatedRoleName, newTechLevel) {
            if (LANG === supLangs.Ru) return setSpanText("RU Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));
            else return setSpanText("EN Технология  " + setSpanText(targetTranslatedRoleName, cssSelectName) + " успешно обновлена до уровня " + setSpanText(newTechLevel, cssSelectName));

        }

        this.openDiaologTechUpgraded = function ($event, techName, newTechLevel) {
            return $mdDialog.show($mdDialog
                .alert()
                .title("Alliance :  tech upgraded")
                .ariaLabel(defaultTheme)
                .targetEvent($event)
                .clickOutsideToClose(true)
                .htmlContent(getTextopenDiaologTechUpgraded(techName, newTechLevel))
                .ok("Ok"));
        };


        // #endregion



    }
]);
Utils.CoreApp.gameApp.service("journalDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper) {
        //todo delete after
        GameServices.$jdH = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;



        // #region MaxLimitSpyItems

        var _titleOpenDialogDialogMaxLimitSpyItems;         
        function getTitleOpenDialogDialogMaxLimitSpyItems() {
            if (!_titleOpenDialogDialogMaxLimitSpyItems) {
                _titleOpenDialogDialogMaxLimitSpyItems = Utils.CreateLangSimple("EN Spy", "ES Spy", "RU Spy");
            }
            return _titleOpenDialogDialogMaxLimitSpyItems.getCurrent();
        }
        function getTextopenDialogMaxLimitSpyItems(maxLimitTotalCount) {
            if (LANG === supLangs.Ru) return setSpanText("RU У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов ,  ваше хранилише переполненно <br> удалите лишние отчеты и пвторите попытку");
            else if (LANG === supLangs.Es) return setSpanText("ES У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов,  ваше хранилише переполненно  <br>  удалите лишние отчеты и пвторите попытку");
            else return setSpanText("EN У вас " + setSpanText(maxLimitTotalCount, cssSelectName) + " отчетов,  ваше хранилише переполненно  <br>  удалите лишние отчеты и пвторите попытку");

        }

        /**
         * Deprecated
         * @param {} maxLimitTotalCount 
         * @param {} $event 
         * @returns {} 
         */
        this.openDialogMaxLimitSpyItems = function (maxLimitTotalCount, $event) {
            return $mdDialog.show(
                 $mdDialog.alert()
                 .title(getTitleOpenDialogDialogMaxLimitSpyItems())
                 .targetEvent($event)
                 .htmlContent(getTextopenDialogMaxLimitSpyItems(maxLimitTotalCount))
                 .ariaLabel(defaultTheme)
                 .clickOutsideToClose(true)
                 .ok("Ok"));
        }
        // #endregion

        // #region TransferComplete
        var _titleOpenDialogTransferComplete;
        function getTitleOpenDialogTransferComplete() {
            if (!_titleOpenDialogTransferComplete) {
                _titleOpenDialogTransferComplete = Utils.CreateLangSimple("RU Transfer", "ES Transfer", "RU Transfer");
            }
            return _titleOpenDialogTransferComplete.getCurrent();
        }

        function getTextopenDialogTransferComplete(targetPlanetName) {
            if (LANG === supLangs.Ru) return setSpanText("RU флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));
            else if (LANG === supLangs.Es) return setSpanText("ES флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));
            else return setSpanText("EN  флот прибыл на планету  " + setSpanText(targetPlanetName, cssSelectName));

        }

        this.openDialogTransferComplete = function (targetPlanetName) {
            return $mdDialog.show(
                   $mdDialog.alert()
                   .title(getTitleOpenDialogTransferComplete())
                   .targetEvent()
                   .htmlContent(getTextopenDialogTransferComplete(targetPlanetName))
                   .ariaLabel(defaultTheme)
                   .clickOutsideToClose(true)
                   .ok("Ok"));
        }

        // #endregion



    }
]);
Utils.CoreApp.gameApp.service("journalMotherJumpDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper) {
        //todo delete after
        GameServices.$mjdH = this;

        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;
        var setSpanText = baseDialogHelper.setSpanText;

        var motherTitle = "Mothership:";

        // #region MaxLimitSpyItems 

        var jumpErrors = {
            JumpMotherInProgress: "JumpMotherInProgress",
            DataIsOldRepeatRequest: "DataIsOldRepeatRequest",
            NoData: "No data",
            InputDataIncorrect: "Input data incorrect",
            JupmMotherIsCurrentSystem: "JupmMotherIsCurrentSystem"
        };

        var _textJumpMessageIsCurrentSystem;
        function getTextJumpMessageIsCurrentSystem() {
            if (!_textJumpMessageIsCurrentSystem) {
                _textJumpMessageIsCurrentSystem = Utils.CreateLangSimple("You are already in the system", "Ya se encuentra en el sistema", "Вы уже находитесь в этой системе");
            }
            return setSpanText(_textJumpMessageIsCurrentSystem.getCurrent());
        }

        function getTextJumpMotherInProgress(systemName, formatedDelay) {
            if (LANG === supLangs.Ru) {
                return setSpanText("Мазер уже перемещается в систему: " + setSpanText(systemName, cssSelectName) + ". <br/> " +
                    "До завершения прыжка осталось  " + setSpanText(formatedDelay, cssSelectName) + ". <br/>" +
                    "Отмените текущее задание для нового прыжка.");

            } else if (LANG === supLangs.Es) {
                return setSpanText("Mothership se mudó a: " + setSpanText(systemName, cssSelectName) + ". <br/> " +
                    "Tiempo para completar los " + setSpanText(formatedDelay, cssSelectName) + " restantes. <br/>" +
                    "Cancele el salto actual para el nuevo salto.");
            } else {
                return setSpanText("Mothership has moved in: " + setSpanText(systemName, cssSelectName) + " <br/> " +
                    "Remaining to complete the jump  " + setSpanText(formatedDelay, cssSelectName) + ". <br/>" +
                    "Cancel the current jump for the new jump");
            }

        }

        this.openDialogMotherJumpEnter = function (targetSystemName, timeToJump) {
            var msg;
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .closeTo({ left: 0 });

            if (LANG === supLangs.Ru) {
                msg = "Целевая система " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Время до прыжка: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Прыжок")
                    .cancel("Отмена");

            }
            else if (LANG === supLangs.Es) {
                msg = "Sistema de destino " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Tiempo para saltar: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Saltar")
                    .cancel("Cancelar");

            }
            else {
                msg = "Target system " + targetSystemName;
                confirm
                    .title(msg)
                    .htmlContent(setSpanText("Time to jump: " + setSpanText(timeToJump, cssSelectName)))
                    .ok("Jump")
                    .cancel("Cancel");

            }
            return $mdDialog.show(confirm);
        }

        this.openDialogErrorJumpMotherRequest = function (errMessage) {
            return $mdDialog.show(
                   $mdDialog.alert()
                   .title(motherTitle)
                   .ariaLabel(defaultTheme)
                   .clickOutsideToClose(true)
                   .textContent(errMessage)
                   .ok("Ok"));

        }

        this.openDialogErrorJumpMotherInProgress = function (systemName) {
            //todo  посчитать оставшейся время
            var curreentDelay = "00:00:05";
            return $mdDialog.show(
                    $mdDialog.alert()
                    .ariaLabel(defaultTheme)
                     .title(motherTitle)
                    .clickOutsideToClose(true)
                    .htmlContent(getTextJumpMotherInProgress(systemName, curreentDelay))
                    .ok("Ok")
                    //  .targetEvent(ev)
                );
        }

        this.openDialogErrorJupmMotherIsCurrentSystem = function () {
            return $mdDialog.show(
                 $mdDialog.alert()
                 .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextJumpMessageIsCurrentSystem())
                .ok("Ok")
            );

        };

        this.openDialogErrorJupmMother = function (msg, systemName) {
            if (msg === jumpErrors.JumpMotherInProgress) return this.openDialogErrorJumpMotherInProgress(systemName);
            else if (msg === jumpErrors.JupmMotherIsCurrentSystem) return this.openDialogErrorJupmMotherIsCurrentSystem();
            else return this.openDialogErrorJumpMotherRequest(msg);
        };

        this.jumpErrors = jumpErrors;


        function getTextOpenDialogMotherJumped(fromSystem, toSystem) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));
            } else {
                return setSpanText("EN Мазер выполнил прыжок из системы : " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName));
            }
        }
        this.openDialogMotherJumped = function (fromSystem, toSystem) {
            return $mdDialog.show(
                 $mdDialog.alert()
                .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogMotherJumped(fromSystem, toSystem))
                .ok("Ok"));
        }

        function getTextOpenDialogErrorMoterJumpTaskCompleted(targetSystemName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");
            } else {
                return setSpanText("EN мазер уже выполнил прыжок в систему " + setSpanText(targetSystemName, cssSelectName) + "  и находится в ней");
            }
        }

        this.openDialogErrorMoterJumpTaskCompleted = function (targetSystemName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .title(motherTitle)
                .ariaLabel(defaultTheme)
                .clickOutsideToClose(true)
                .htmlContent(getTextOpenDialogErrorMoterJumpTaskCompleted(targetSystemName))
                .ok("Ok"));
        };

        function getTextOpenDialogBuyInstMotherJump(fromSystem, toSystem, ccPrice) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ?");
            } else {
                return setSpanText("EN Запросить у конфедерации  моментальное перемещение из системы " + setSpanText(fromSystem, cssSelectName) + " в систему " + setSpanText(toSystem, cssSelectName) + " за " + setSpanText(ccPrice, cssSelectName) + "CC ?");
            }
        }

        this.openDialogBuyInstMotherJump = function (fromSystem, toSystem, ccPrice, $event) {
            var confirm = $mdDialog.confirm()
               .ariaLabel(defaultTheme)
               .title(motherTitle)
               .htmlContent(getTextOpenDialogBuyInstMotherJump(fromSystem, toSystem, ccPrice))
               .targetEvent($event)
               .ok("Confirm")
              .cancel("Cancel");
            return $mdDialog.show(confirm);
        }


        // #endregion


    }
]);
Utils.CoreApp.gameApp.service("userChannelsDialogHelper", ["baseDialogHelper", "maxLenghtConsts",
    function (baseDialogHelper, maxLenghtConsts) {
        var $self = this;
        var supLangs = baseDialogHelper.supportedLangs;
        var cssSelectName = baseDialogHelper.cssSelectName;
        var defaultTheme = baseDialogHelper.defaultTheme;
        var $mdDialog = baseDialogHelper.$$mdDialog;

        var setSpanText = baseDialogHelper.setSpanText;

        this.$mdDialog = baseDialogHelper.$$mdDialog;
        this.maxLenghtConsts = maxLenghtConsts;
        // #region openDialogConfirmDeletePrivateChannel
        function getTextOpenDialogConfirmDeletePrivateChannel(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");
            } else {
                return setSpanText("EN  Вы действительно хотите удалить переписку с пользователем  " + setSpanText(targetUserName, cssSelectName) + "?");
            }
        }

        this.openDialogConfirmDeletePrivateChannel = function ($event, targetUserName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Delete private channel!")
                .htmlContent(getTextOpenDialogConfirmDeletePrivateChannel(targetUserName))
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogUserHasChannel

        function getTextOpenDialogUserHasChannel(existChannelName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");
            } else {
                return setSpanText("EN  У вас уже существует канал " + setSpanText(existChannelName, cssSelectName) + "  что то там еще");
            }
        }

        this.openDialogUserHasChannel = function ($event, existChannelName) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("Create channel: Warn!")
                .targetEvent($event)
                .ariaLabel(defaultTheme)
                .htmlContent(getTextOpenDialogUserHasChannel(existChannelName))
                .ok("Ok"));
        };
        // #endregion

        // #region openDialogConfirmDeleteGroupChannel
        function getTextOpenDialogConfirmDeleteGroupChannel(targetUserName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES   Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");
            } else {
                return setSpanText("EN   Канал" + setSpanText(targetUserName, cssSelectName) + " будет удален  без возможности восстановления  со всей историей, <br> вы действительно хотите удлать канал?");
            }
        };

        this.openDialogConfirmDeleteGroupChannel = function ($event, targetChannelName) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Delete group channel!")
                .htmlContent(getTextOpenDialogConfirmDeleteGroupChannel(targetChannelName))
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogUnsubscribeFromGroupChannel

        function getTextOpenDialogUnsubscribeFromGroupChannel(targetChannelName) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");
            } else {
                return setSpanText("EN  Вы отписываетесь от канала " + setSpanText(targetChannelName, cssSelectName) + "  и больше не сможете получать сообщения, подтвердить действие?");
            }
        };

        this.openDialogUnsubscribeFromGroupChannel = function ($event, targetChannelName) {
            var confirm = $mdDialog.confirm()
                 .ariaLabel(defaultTheme)
                 .title("Unsubscribe from group channel")
                 .htmlContent(getTextOpenDialogUnsubscribeFromGroupChannel(targetChannelName))
                 .targetEvent($event)
                 .ok("Confirm")
                 .cancel("Cancel");
            return $mdDialog.show(confirm);
        };
        // #endregion

        // #region openDialogChannelMaxLimit
        function getTextOpenDialogChannelMaxLimit(targetChannelTranslateType, maxLimit) {
            if (LANG === supLangs.Ru) {
                return setSpanText("RU  У вас слишком много каналов  в разделе " + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                    "<br> Удалите не используемые каналы и повторите попытку ");

            } else if (LANG === supLangs.Es) {
                return setSpanText("ES  У вас слишком много каналов  в разделе" + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                    "<br> Удалите не используемые каналы и повторите попытку ");
            } else {
                return setSpanText("EN  У вас слишком много каналов в разделе " + setSpanText(targetChannelTranslateType, cssSelectName) + " (" + setSpanText(maxLimit + "/" + maxLimit, cssSelectName) + ") " +
                     "<br> Удалите не используемые каналы и повторите попытку ");
            }
        };

        this.getTextOpenDialogChannelMaxLimit = getTextOpenDialogChannelMaxLimit;
        this.openDialogChannelMaxLimit = function ($event, targetChannelTranslateType, maxLimit) {
            return $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title("WARN: Channel max limit")
                .targetEvent($event)
                .ariaLabel(defaultTheme)
                .htmlContent(getTextOpenDialogChannelMaxLimit(targetChannelTranslateType, maxLimit))
                .ok("Ok"));
        };
        // #endregion


        // #region openDialogDeepDeleteOtherGroupChannels
        var _textOpenDialogDeepDeleteOtherGroupChannels;
        function getTextOpenDialogDeepDeleteOtherGroupChannels() {
            if (!_textOpenDialogDeepDeleteOtherGroupChannels) {
                _textOpenDialogDeepDeleteOtherGroupChannels = Utils.CreateLangSimple("EN Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?",
                    "ES Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?",
                    "RU Вы дейстительно хотите провести глубокую очистку и  удалить все подключенные каналы  и связанную с вами информацию?");
            }
            return _textOpenDialogDeepDeleteOtherGroupChannels.getCurrent();
        }

        this.openDialogDeepDeleteOtherGroupChannels = function ($event) {
            var confirm = $mdDialog.confirm()
                .ariaLabel(defaultTheme)
                .title("WARN: Deep delete all group channels!")
                .htmlContent(getTextOpenDialogDeepDeleteOtherGroupChannels())
                .targetEvent($event)
                .ok("Confirm")
                .cancel("Cancel");
            return $mdDialog.show(confirm);

        };
        // #endregion

        // #region OpenDialogNotPermitted
        this.openDialogNotPermitted = baseDialogHelper.openDialogNotPermitted;
        // #endregion

    }
]);
Utils.CoreApp.gameApp.service("planshetHelper", ["mainHelper",
    function(mainHelper) {
        var lastGuid;
        var timer = Date.now();
        var DELAY_OF_RUN = 200;
        var planshet;
        var scope;
        var dataIsLoaded = true;
        var firstClose = false;
        function getPlanshet() {
            if (!planshet) {
                var $planshet = $("#planshet");
                if (!$planshet || !$planshet.length) return false;
                else planshet = $planshet;
            } 
            scope = planshet.scope();
            return planshet;
        };

        function isLoaded() {
            return dataIsLoaded;
        };

        function isOpened($planshet) {
            var _planshet = $planshet||getPlanshet();
            if (!_planshet) return null;
            var state = parseInt(_planshet.css("right"));
            if (state < 5) return false;
            else return true;
        };

        function close($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return null;
            _planshet.removeAttr("style");
            if (!scope.planshetToggle.opened) {
                return null;
            }
            if (firstClose) {
                EM.Audio.GameSounds.planshetClose.play();
            } else {
                firstClose = true;
            }
           

            mainHelper.applyTimeout(function () {
                scope.planshetToggle.opened = false;
            });

        }
        function open($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return;
            if (scope.planshetToggle.opened) {
                return;
            }
            _planshet.css("right", 5);
            EM.Audio.GameSounds.planshetOpen.play();
          
           
            mainHelper.applyTimeout(function () {
                scope.planshetToggle.opened = true;
            });
        }


        function _shortToggle($planshet) {
            var _planshet = $planshet || getPlanshet();
            if (!_planshet) return;
 

            isOpened(_planshet) ? close(_planshet) : open(_planshet);
        };

        function toggle($planshet) {
            var _planshet =$planshet|| getPlanshet();
            if (!_planshet) return;

            if ((Date.now() - timer) < DELAY_OF_RUN) return;
            timer = Date.now();
            _shortToggle(_planshet);

        };

        function updateState(source) {
            var _planshet = getPlanshet();
            if (!_planshet) return;
            if ((Date.now() - timer) < DELAY_OF_RUN) return;
            timer = Date.now();
            var guid;
            if (!source) {
                _shortToggle(_planshet);
                return;
            } else if (source.hasOwnProperty("name")) guid = source.name;
            else guid = source;

            if (guid !== lastGuid) {
                lastGuid = guid;
                open();
                return;
            }
            _shortToggle(_planshet);
        };

        function startLoad() {
            var _planshet = getPlanshet();
            if (!_planshet) return this;
            dataIsLoaded = false;
            _planshet.find(".load-indicator").removeClass("display-none");
            return this;
        };


        function endLoad(callback) {
            var _planshet = getPlanshet();
            if (!_planshet) {
                if (callback instanceof Function) callback();
                return this;
            }
            if (dataIsLoaded) return this;
            dataIsLoaded = true;
            _planshet.find(".load-indicator").addClass("display-none");
            if (callback instanceof Function) callback();
            return this;
        };

        this.isLoaded = isLoaded;
        this.updateState = updateState;
        this.isOpened = isOpened;
        this.toggle = toggle;
        this.open = open;
        this.close = close;
        this.startLoad = startLoad;
        this.endLoad = endLoad;
    }
]);
Utils.CoreApp.gameApp.service("journalHelper",
    [
        "planshetService",
        "journalService",
        "tabService",
        "mapInfoService",
        "hangarService",
        "journalDialogHelper",
        "$timeout",
        function (planshetService,
                 journalService,
                 tabService,
                 mapInfoService,
                 hangarService,
                 journalDialogHelper,
                 $timeout) {
            var $self = this;
            //#region Declare
            var transferHangarModel = function () {
                return Utils.ModelFactory.UnitList(null, true);
            }; //not for using
            var btnParamModelExample = {
                Id: 0,
                TabIdx: 0,
                SourceIsTab: false,
                TargetName: "name",

                Method: "POST",
                Url: "api/ctrl/method",
                Data: {}
            }; // helpVars
            var targetPlanetName;
            var statuses = journalService.statuses;

            var serchPlanetType = mapInfoService.serchPlanetType;
            var serchType;

            //#endregion

            //#region Help

            //$self.$hub
            Object.defineProperty($self,
                "$hub",
                {
                    get: function () {
                        return GameServices.mainGameHubService;
                    }

                });

            function setSerchType(state) {
                serchType = state;
            }

            function getSerchType() {
                return serchType;
            }

            function getJournal(tabIdx, callbackAction, update) {
                journalService.getJournalPlanshet(null, update, tabIdx, callbackAction);
            }

            function setAction(sourceIsJournal, callbackAction, tabIdx) {
                function tab() {
                    tabService.isActiveTabByIdx(tabIdx) ? callbackAction() : tabService.activateTabByIdx(tabIdx, callbackAction);
                }

                if (sourceIsJournal) {
                    tab();
                    return;
                }
                else {
                    var status = journalService.journalStatus();
                    tabService.setIdxOnCompile(tabIdx);
                    if (status === statuses.noJournal) getJournal(tabIdx, callbackAction, true);
                    else if (status === statuses.inCache) {
                        journalService.updatePlanshetView(callbackAction);

                    }
                }

            }

            //#endregion

            //#region TaskTransferTranslate
            var transferTranslate = {};
            transferTranslate.atack = Utils.CreateLangSimple("Attack the planet :", "Ataque al planeta :", "Атаковать планету :");
            transferTranslate.transfer = Utils.CreateLangSimple("en transfer to planet :", "es transfer to planet :", "ru transfer to planet :");
            transferTranslate.time = Utils.CreateLangSimple("en TaskTime :", "es TaskTime :", "ru TaskTime :");

            function getTransferTypeName(transferType) {
                if (transferType) return transferTranslate.transfer.getCurrent();
                else return transferTranslate.atack.getCurrent();
            }

            function getTransferTimeName() {
                return transferTranslate.time.getCurrent();
            }

            this.getTransferTypeName = getTransferTypeName;
            this.getTransferTimeName = getTransferTimeName;
            this.transferTranslate = transferTranslate;
            //#endregion

            //#region TaskTransferError

            this.taskErrors = (function () {
                function createErrorModel(en, es, ru) {
                    var langModel = Utils.CreateLangSimple(en, es, ru);

                    return {
                        showError: false,
                        translatedError: "",
                        getTranslateError: function () {
                            return langModel.getCurrent();
                        }
                    };
                }

                var taskErrors = {
                    planetNotExist: createErrorModel("en planetNotExist", "es planetNotExist", "ru planetNotExist"),
                    unitsIsEmpty: createErrorModel("en UnitsIsEmpty", "es UnitsIsEmpty", "ru  UnitsIsEmpty"),
                    resetErrors: null
                };
                taskErrors.resetErrors = function () {
                    taskErrors.planetNotExist.showError = false;
                    taskErrors.unitsIsEmpty.showError = false;
                };
                return taskErrors;
            })();

            //#endregion  

            //#region Task
            function tfi() {
                return {
                    before: transferHangarModel(),
                    source: transferHangarModel(),
                    target: transferHangarModel()
                };
            }

            var transferInst;
            var transferParams;

            function changeTaskForm(show, planetName, scope, action) {
                scope.$emit("taskPlanetSerch:showTaskForm", show, planetName, action);
            }

            function updateTaskHangar(event, unitName) {
                var tScopeUnit = event.targetScope.unit;
                var bef = transferInst.before[unitName].count;
                var src = tScopeUnit.sourceUnit;
                if (bef <= tScopeUnit.Count) {
                    tScopeUnit.Count = bef;
                }
                src.Count = bef - tScopeUnit.Count;
                transferInst.target[unitName].count = tScopeUnit.Count;
            }

            function rgisterTaskUnit(scope, target) {
                if (!transferInst) transferInst = tfi();

                var scopeUnit = scope.unit;
                var unitNativeName = scopeUnit.NativeName;

                if (target === "source") {
                    transferInst.before[unitNativeName].count = scopeUnit.Count;
                    transferInst.source[unitNativeName].count = scopeUnit.Count;
                    transferInst.source[unitNativeName].scope = scope;
                    return;
                }

                if (target === "target") {
                    var srcUnit = transferInst.source[unitNativeName].scope.unit;
                    scope.unit.sourceUnit = srcUnit;
                    transferInst.target[unitNativeName].scope = scope;

                    if (!srcUnit.Count) {
                        scope.unit.Count = null;
                        scope.target = false;
                    }
                    scope.unitChange = function () {
                        scope.$emit("taskPlanetSerch:changeTransferUnit", updateTaskHangar, unitNativeName);
                        return;
                    };
                    //console.log("transferInst", scope, transferInst);
                }
            }

            function resetTaskForm(taskPlanetScope) {
                if (!transferInst) return;
                var repoUnits = hangarService.getCloneObjectHangarData();
                var sourceUnits = taskPlanetScope.ctrl.taskSourceUnits;
                var targetUnits = taskPlanetScope.ctrl.taskTargetUnits;
                _.forEach(repoUnits,
                    function (value, key) {
                        if (sourceUnits.hasOwnProperty(key)
                            && targetUnits.hasOwnProperty(key)
                            && transferInst.before
                            && transferInst.before.hasOwnProperty(key)) {

                            var repoUnitCount = repoUnits[key].Count;
                            sourceUnits[key].Count = repoUnitCount;
                            transferInst.before[key].count = repoUnitCount;

                            targetUnits[key].Count = repoUnitCount === 0 || repoUnitCount === null ? null : 0;

                        }

                    });
            }

            //#endregion

            //#region CalculateTime

            this.calculateFleetTime = function (deferred, targetPName) {

                var ce = EM.EstateData.GetCurrentEstate();
                var estateId = ce.EstateId;
                var startSystemId = 0;
                var isMother = ce.EstateType === EM.EstateData.MotherEstateType;
                var msgs = {
                    startSystem: "mother start system is not exist",
                    notEstate: "estateId  not exist"
                };

                if (isMother) {
                    startSystemId = ce.SystemId;
                    if (typeof startSystemId !== "number" || startSystemId === 0 || estateId) {
                        console.log(msgs.startSystem);
                        deferred.reject(msgs.startSystem);
                        return;
                    }
                }
                else if (!estateId) {
                    console.log(msgs.notEstate);
                    deferred.reject(msgs.notEstate);
                    return;
                }

                var hubDeferred = $self.$hub.journalGetTaskTime(estateId, targetPName, startSystemId);
                hubDeferred.then(function (answer) {
                    var curEstateId = EM.EstateData.GetCurrentEstate().EstateId;
                    console.log("calculateFleetTime",
                        {
                            answer: answer,
                            curEstateId: curEstateId
                        });
                    if (estateId !== curEstateId) deferred.reject("sourceEstateIsWrong");
                    else deferred.resolve(answer.FormatedSeconds);
                },
                    function (erorAnswer) {
                        var msg = Errors.GetHubMessage(erorAnswer);
                        if (msg === ErrorMsg.SystemIdNotSet) {
                            //todo  что то там сделать
                            console.log("timer fleet error : ", msg);
                        }
                        deferred.reject(erorAnswer);
                    });

            }

            //#endregion 

            //#region Spy
            function getSpyPlanetName(scope) {
                return scope.$parent.getSpyTargetPlanetName();
            }

            function chekSpyPlanetName(scope) {
                var name = getSpyPlanetName(scope);
                if (name && name.length < 5) {
                    Utils.Console.Warn("Planet name is not unic", name);
                    return false;
                }
                return mapInfoService.containPlanetName(mapInfoService.serchPlanetType.OtherUsers, name);
            }

            function resetSpySerchForm(scope) {
                scope.$parent.clear();
            }

            //#endregion

            //#region open Buttons Action
            function attack(params) {
                targetPlanetName = params.TargetName;
                setSerchType(serchPlanetType.OtherUsers);
                mapInfoService.addPlanetNames([targetPlanetName], serchType);
                setAction(params.SourceIsTab,
                    function () {
                        var b = journalService.getNewAttackBtn();
                        var btnId = "#" + b.ButtonId;
                        var dom;
                        planshetService.conditionAwaiter(function () {
                            dom = $(btnId);
                            return dom.length === 1;
                        },
                            function () {
                                $timeout(function () {
                                    dom.click();
                                },
                                    40);

                            });
                    },
                    params.TabIdx);
                return;
            }

            function newAttack(params, element, attrs, scope) {
                transferParams = null;
                setSerchType(serchPlanetType.OtherUsers);
                params.Data.TargetName = null;
                if (targetPlanetName) {
                    params.Data.TargetName = targetPlanetName;
                    targetPlanetName = null;
                }
                params.Data.IsTransfer = false;
                changeTaskForm(true,
                    params.Data.TargetName,
                    scope,
                    function (taskPlanetScope) {
                        resetTaskForm(taskPlanetScope);
                        taskPlanetScope.ctrl.setTransferType(params.Data.IsTransfer);
                    });
                transferParams = params;
            }

            function newTransfer(params, element, attrs, scope) {
                setSerchType(serchPlanetType.OnlyUserPlanet);
                params.Data.TargetName = null;
                params.Data.IsTransfer = true;
                changeTaskForm(true,
                    params.Data.TargetName,
                    scope,
                    function (taskPlanetScope) {
                        resetTaskForm(taskPlanetScope);
                        taskPlanetScope.ctrl.setTransferType(params.Data.IsTransfer);

                    });

                transferParams = params;
            }

            var _spyInProgress = false;

            function spy(params, element, attrs, scope, $event) {
                if (_spyInProgress) return;
                //params.Data.planetId = params.Id; 

                // #region Deprecated

                //var max = journalService.getSpyMaxItems();
                //var total = journalService.getSpyTotalItems(true);
                //if (total >= max) {
                //    journalDialogHelper.openDialogMaxLimitSpyItems(max, $event);
                //    return;
                //}

                // #endregion


                _spyInProgress = true;
                setAction(params.SourceIsTab,
                    function () {
                        $self.$hub.journalCreateSpyItemByPlanetId(params.Data.planetId)
                            .finally(function () {
                                setTimeout(function () {
                                    _spyInProgress = false;
                                },
                                    1000);
                            }).then(function (answer) {
                                console.log("spy item", answer);
                                journalService.addSpyItem(answer);
                            },
                                function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    throw Errors.ClientNotImplementedException({
                                        params: params,
                                        scope: scope,
                                        errorAnswer: errorAnswer,
                                        msg: msg
                                    },
                                        "journalHelper.spy");
                                });
                    },
                    params.TabIdx);
                return;
            }

            function newSpy(params, element, attrs, scope, $event) {
                if (_spyInProgress) return;
                if (!chekSpyPlanetName(scope)) return;

                // #region Deprecated

                //var max = journalService.getSpyMaxItems();
                //var total = journalService.getSpyTotalItems(true);
                //if (total >= max) {
                //    journalDialogHelper.openDialogMaxLimitSpyItems(max, $event);
                //    return;
                //}   
                // #endregion

                _spyInProgress = true;
                var planetName = getSpyPlanetName(scope).toUpperCase();
                $self.$hub.journalCreateSpyItemByPlanetName(planetName)
                    .finally(function () {
                        setTimeout(function () {
                            _spyInProgress = false;
                        },
                            1000);
                    }).then(function (answer) {
                        journalService.addSpyItem(answer);
                        params.Data.planetName = null;
                        resetSpySerchForm(scope);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                params: params,
                                scope: params,
                                errorAnswer: errorAnswer,
                                msg: msg
                            },
                                "journalHelper.newSpy");
                        });

            }

            function deleteSpyItem(params, element, attrs, scope) {
                journalService.deleteReportOrSpyItem(params, "deleteSpyItem");
            }

            function deleteReportItem(params, element, attrs, scope) {
                journalService.deleteReportOrSpyItem(params, "deleteReportItem");
            }

            function updateShowTaskError(taskPlanetCtrl, errorName, show) {
                console.log("updateShowTaskError", taskPlanetCtrl);
                if (!taskPlanetCtrl || !errorName) return;
                if (taskPlanetCtrl.taskErrors.hasOwnProperty(errorName) && taskPlanetCtrl.taskErrors[errorName].showError !== show) {
                    taskPlanetCtrl.taskErrors[errorName].showError = show;
                }
            }

            var _submitTaskFormInProgress = false;

            function submitTaskForm(params, element, attrs, scope) {
                if (!scope) return;
                if (_submitTaskFormInProgress) return;
                _submitTaskFormInProgress = true;

                function onComplete(now) {
                    $timeout(function () {
                        _submitTaskFormInProgress = false;
                    },
                        now ? 0 : 1000);
                }

                var targetUnits = transferInst.target;
                var taskPlanetScope = scope.$parent.$parent.$parent;
                console.log("taskPlanetScope",
                    {
                        taskPlanetScope: taskPlanetScope,
                        scope: scope
                    });
                var tpCtrl = taskPlanetScope.ctrl;
                var planetValidate = tpCtrl.isValide;
                var unitsExist = false;

                function checkTargetUnits() {
                    _.forEach(targetUnits,
                        function (unit, unitKey) {
                            if (targetUnits.hasOwnProperty(unitKey) && unit.hasOwnProperty("count") && unit.count > 0) {
                                unitsExist = true;
                                return;
                            }
                        });
                }

                function send() {
                    updateShowTaskError(tpCtrl, "planetNotExist", false);
                    updateShowTaskError(tpCtrl, "unitsIsEmpty", false);
                    var names = Utils.ModelFactory.UnitList();
                    var unitCounts = {};
                    _.forEach(names,
                        function (value, key) {
                            if (names.hasOwnProperty(key)) {
                                var count = typeof targetUnits[key].count === "number" ? targetUnits[key].count : 0;
                                unitCounts[key] = count;
                            }
                        });
                    transferParams.Data.SourceId = EM.EstateData.GetCurrentEstate().EstateId;
                    transferParams.Data.Units = unitCounts;
                    transferParams.Data.TargetName = tpCtrl.taskTargetPlanetName;
                    console.log("submitTaskForm",
                        {
                            transferParams: transferParams,
                            tpCtrl: tpCtrl,
                            unitCounts: unitCounts,
                            "ournalService.$taskCreateDelayedActions": journalService.$taskCreateDelayedActions
                        });
                    $self.$hub.journalCreateTaskItem(transferParams.Data)
                        .then(function (newTaskId) {
                            console.log("$self.$hub.journalCreateTaskItem(transferParams.Data)", {
                                newTaskId: newTaskId
                            });
                            journalService.$taskCreateDelayedActions[newTaskId] = function (newTaskItem) {
                                journalService.addToLocalTaskItem(newTaskItem);
                                var serverUnitsInTask = newTaskItem.HangarInTask;
                                var beforeUnits = transferInst.before;

                                function calc(from, what) {
                                    from = from ? from : 0;
                                    what = what ? what : 0;
                                    var delta = from - what;
                                    return delta ? delta : null;
                                }

                                _.forEach(beforeUnits,
                                    function (value, unitNativeName) {
                                        if (beforeUnits.hasOwnProperty(unitNativeName)) {
                                            var serverUnitCountInTask = serverUnitsInTask[unitNativeName];
                                            var beforeUnit = beforeUnits[unitNativeName];

                                            beforeUnit.count = calc(beforeUnit.count, serverUnitCountInTask.Count);
                                            var repoUnit = hangarService.getPanelUnitData(unitNativeName);
                                            if (!repoUnit.Progress) repoUnit.Progress = {};
                                            repoUnit.Progress.Level = calc(repoUnit.Count, serverUnitCountInTask.Count);
                                            repoUnit.Count = repoUnit.Progress.Level;

                                            if (repoUnit.Count < 0) {
                                                repoUnit.Count = 0;
                                                console.log("repoUnit.Count < 0", repoUnit);
                                            }
                                        }
                                    });
                                changeTaskForm(false, null, scope, resetTaskForm);
                                hangarService.updateHangarView();
                                onComplete();
                                delete journalService.$taskCreateDelayedActions[newTaskItem.Id];
                            }
                            console.log("newTaskId", newTaskId);


                        },
                            function (errorAnswer) {
                                onComplete();
                                var msg = Errors.GetHubMessage(errorAnswer);
                                throw Errors.ClientNotImplementedException({
                                    params: params,
                                    scope: scope,
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                },
                                    "journalHelper.submitTaskForm.send.onError");
                            });

                }

                checkTargetUnits();
                tpCtrl.setResultIsValid(unitsExist);
                if (tpCtrl.resultIsValid) send();
                else {
                    updateShowTaskError(tpCtrl, "planetNotExist", !planetValidate);
                    updateShowTaskError(tpCtrl, "unitsIsEmpty", !tpCtrl.unitsIsValid);
                    onComplete(true);
                }

            }

            function setAllUnits(params, element, attrs, scope) {
                var taskPlanetCtrlScope = scope.$parent.$parent.$parent;
                var repoUnits = hangarService.getCloneObjectHangarData();
                var srcUnits = taskPlanetCtrlScope.ctrl.taskSourceUnits;
                var targetUnits = taskPlanetCtrlScope.ctrl.taskTargetUnits;

                function nolCheck(count, setCount) {
                    return count === 0 || count === null ? null : setCount ? count : 0;
                }

                function setUnit(unitNativeName, instGroup, scopeGroup, fromCount, setCount, isTarget) {
                    var newCount = nolCheck(fromCount, setCount);
                    instGroup[unitNativeName].count = newCount;
                    scopeGroup[unitNativeName].Count = newCount;
                }

                taskPlanetCtrlScope.$apply(function () {
                    _.forEach(repoUnits,
                        function (value, unitKey) {
                            if (repoUnits.hasOwnProperty(unitKey) && srcUnits.hasOwnProperty(unitKey)) {
                                var repoUnit = repoUnits[unitKey];
                                setUnit(unitKey, transferInst.source, srcUnits, repoUnit.Count, false);
                                setUnit(unitKey, transferInst.target, targetUnits, repoUnit.Count, true, true);
                            }
                        });
                });
                return;
            }

            function resetTaskUnits(params, element, attrs, scope) {
                var taskPlanetScope = scope.$parent.$parent;
                resetTaskForm(taskPlanetScope);
            }

            function cancelMotherJump(params, element, attrs, scope) {
                journalService.requestCancelMotherJump();
            }

            function instMotherJump(params, element, attrs, scope, $event) {
                console.log("instMotherJump params",
                    {
                        params: params,
                        PriceCc: params.PriceCc,
                        type: typeof params.PriceCc,
                        isEnoughCc: GameServices.resourceService.isEnoughCc(params.PriceCc)
                    });
                if (typeof params.PriceCc === "number" && GameServices.resourceService.isEnoughCc(params.PriceCc)) {
                    journalService.requestInstMotherJump(params.PriceCc, $event);
                }

            }

            this.cancelMotherJump = cancelMotherJump;
            this.instMotherJump = instMotherJump;
            //#endregion

            //#region Public
            this.resetTaskForm = resetTaskForm;
            this.rgisterTaskUnit = rgisterTaskUnit;
            this.resetTaskUnits = resetTaskUnits;
            this.updateTaskHangar = updateTaskHangar;

            this.attack = attack;
            this.newAttack = newAttack;
            this.newTransfer = newTransfer;

            this.setAllUnits = setAllUnits;
            this.submitTaskForm = submitTaskForm;

            this.deleteReportItem = deleteReportItem;

            this.spy = spy;
            this.newSpy = newSpy;
            this.deleteSpyItem = deleteSpyItem;

            this.getSerchType = getSerchType;
            //#endregion
        }
    ]);

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
Utils.CoreApp.gameApp.service("mapControlHelper", [
    "planshetService",
    "mapInfoHelper",
    "mainHelper",
    function (planshetService, mapInfoHelper, mainHelper) {
        var lk = Utils.RepoKeys.LowerEstateListKeys();
        var buttons = {};
        var mapTypes = EM.MapGeometry.MapTypes;

        /**
              * @description _setDIM SetDataInMapControllContainer
              * @param {string} funcBtmName   MapControl._buttons[имя функции - funcBtmName]
              * @param {string} dataName имя атрибута даты после 'data-'
              * @param {dynamic} val  значение дата атрибута
              * @returns {void} 
              */
        function setDim(funcBtmName, dataName, val) {
            Utils.SetAttrDataVal(buttons[funcBtmName](), dataName, val);
        };

        function getBtn(btnName) {
            return GameServices.paralaxButtonHelper.getMapCtrlBtn(btnName);
        }

        function updateBtn(btn) {
            GameServices.paralaxButtonHelper.updateMapCtrlBtn(btn);
        }

        function buttonShow(btn, show) {
            //console.log("buttonShow", { btn: btn, show: show });
            if (btn) {
                btn.Hide = !show;
            }


        };

        function setGroupVisible(
            idxGalaxyInfo,
            idxSectorInfo,
            idxPlanetInfo,
            idxStarInfo,
            idxJumpToSector,
            idxJumpToPlanetoid,
            idxumpToMother,
            idxJumpToUserPlanet,
            idxJumpToGalaxy,
            idxOpenBookmarks) {

            var show = buttonShow;
            var btns = buttons;

            mainHelper.applyTimeout(function () {
                show(btns.btnGalaxyInfo(), (idxGalaxyInfo));
                show(btns.btnSectorInfo(), (idxSectorInfo));
                show(btns.btnPlanetInfo(), (idxPlanetInfo));
                show(btns.btnStarInfo(), (idxStarInfo));

                show(btns.btnJumpToSector(), (idxJumpToSector));
                show(btns.btnJumpToPlanetoid(), (idxJumpToPlanetoid));
                show(btns.btnJumpToMother(), (idxumpToMother));
                show(btns.btnJumpToUserPlanet(), (idxJumpToUserPlanet));
                show(btns.btnJumpToGalaxy(), (idxJumpToGalaxy));
                show(btns.btnOpenBookmarks(), (idxOpenBookmarks));
            });


        };

        function hideAll() {
            setGroupVisible(0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };

        //#region State


        function setGalaxyState() {
            setGroupVisible(1, 0, 0, 0, 0, 0, 1, 0, 0, 1);
        }

        function setSectorState() {
            setGroupVisible(1, 1, 0, 0, 0, 0, 1, 0, 1, 1);
        }

        function setSystemState() {
            setGroupVisible(1, 1, 0, 0, 0, 0, 1, 0, 1, 1);
        }

        function setStarState() {
            setGroupVisible(1, 1, 0, 0, 1, 0, 0, 0, 1, 1);
        }

        function setPlanetoidState() {
            setGroupVisible(0, 1, 0, 0, 1, 0, 1, 0, 1, 1);
        }

        function setUserPlanetState() {
            setGroupVisible(0, 0, 1, 1, 0, 1, 1, 0, 0, 1);
        }

        function setMotherState() {
            //console.log("setMotherState");
            setGroupVisible(0, 1, 0, 1, 1, 0, 0, 0, 1, 1);
        }

        function setState(toState) {
            // console.log("toState", toState);
            var m = this["set" + toState];
            if (m instanceof Function) m();
            // eval("set" + toState + "()");
        }

        //#endregion

        //#region Buttons
        buttons._check = function (name) {
            var cont = buttons["_" + name];
            if (!cont) {
                cont = getBtn(name);
                buttons["_" + name] = cont;
            }
            return cont;
        };
        buttons._btnGalaxyInfo = null;
        buttons.btnGalaxyInfo = function () {
            return buttons._check("btnGalaxyInfo");
        };
        buttons._btnSectorInfo = null;
        buttons.btnSectorInfo = function () {
            return buttons._check("btnSectorInfo");
        };
        buttons._btnPlanetInfo = null;
        buttons.btnPlanetInfo = function () {
            return buttons._check("btnPlanetInfo");
        };
        buttons._btnStarInfo = null;
        buttons.btnStarInfo = function () {
            return buttons._check("btnStarInfo");
        };
        //navigation
        buttons._btnJumpToSector = null;
        buttons.btnJumpToSector = function () {
            return buttons._check("btnJumpToSector");
        };
        buttons._btnJumpToPlanetoid = null;
        buttons.btnJumpToPlanetoid = function () {
            return buttons._check("btnJumpToPlanetoid");
        };
        buttons._btnJumpToMother = null;
        buttons.btnJumpToMother = function () {
            return buttons._check("btnJumpToMother");
        };
        buttons._btnJumpToUserPlanet = null;
        buttons.btnJumpToUserPlanet = function () {
            return buttons._check("btnJumpToUserPlanet");
        };
        buttons._btnJumpToGalaxy = null;
        buttons.btnJumpToGalaxy = function () {
            return buttons._check("btnJumpToGalaxy");
        };
        buttons._btnOpenBookmarks = null;
        buttons.btnOpenBookmarks = function () {
            return buttons._check("btnOpenBookmarks");
        };

        //#endregion

        //#region Config



        //#endregion


        //#region Methods

        //#region Info
        function galaxyInfo(params, element, attrs, accept) {

            var galaxy = mapTypes.Galaxy;
            mapInfoHelper.getInfo(galaxy, EM.EstateData.GetCurrentSpaceLocation().GalaxyId, accept);
        };

        function sectorInfo(params, element, attrs, accept) {
            var sector = mapTypes.Sector;
            mapInfoHelper.getInfo(sector, EM.EstateData.GetCurrentSpaceLocation().SectorId, accept);

            //new Planshet().updateState(sector + EM.EstateData.CurrentEstate.SectorId);
        };

        function planetInfo(params, element, attrs, accept) {
            var planet = mapTypes.Planet;
            mapInfoHelper.getInfo(planet, EM.EstateData.GetCurrentSpaceLocation().SpaceObjectId, accept);
        }

        function starInfo(params, element, attrs, accept) {
            var star = mapTypes.Star;
            mapInfoHelper.getInfo(star, EM.EstateData.GetCurrentSpaceLocation().SystemId, accept);
        }

        function openBookmarks(param, element, attrs, accept) {

            mapInfoHelper.getInfo(mapTypes.Bookmark);
        };

        //#endregion

        //#region Navigation
        function jumpToSector(param, element, attrs, accept) {
            // todo  нужны парметры
            if (!param) {
                var csl = EM.EstateData.GetCurrentSpaceLocation();
                EM.EstateData.SetSpaceLocationFromSectorId(csl.SectorId);
            };
            console.log("jumpToSector", param);
 
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickBySector();
           // setSectorState();
        }


        function jumpToPlanetoid(param, element, attrs, accept) {
            //Hangar.GetHangarData();
            var planetLoc = EM.EstateData.GetPlanetLocation();
            EM.MapGeometry.System.Destroy();
            EM.SpaceState.SetNewCoord(planetLoc.SectorId, planetLoc.SystemId);

            EM.MapBuilder.System.Callback = function () {
                var sp = new EM.SpaceState.SpacePosition();
                sp.clickByBtnSystem(EM.SpaceState.LastActiveStarSystem);

                setTimeout(function () {
                    var meshId = EM.MapGeometry.System.GetPlanetMeshIdByUniqueId(planetLoc.PlanetId);
                    EM.MapEvent.PlanetoidDubleClick(meshId, null, true);
                    setState("PlanetoidState");
                }, 10);
            }

            //moveToPlanet();

            EM.MapBuilder.System.Build();
        };


        function jumpToMother(param, element, attrs, accept, isInit) {
            //console.log("mapControlHelper.jumpToMother");
            if (!isInit) {
                GameServices.estateService.setEstate(0);
                EM.EstateData.SaveCurrentEstateByEsateType(false, 0);

            }

            var motherLoc = EM.EstateData.GetMotherLocation();
  
   
            //console.log("jumpToMother.motherLoc", motherLoc);
            if (EM.MapGeometry.System.GetStarStatus(motherLoc.SystemId)) {
                 console.log("if (EM.MapGeometry.System.GetStarStatus(motherLoc.SystemId))");
                EM.EstateBuilder.UpdateMother();
                return;
            }
            EM.MapGeometry.System.Destroy();
            EM.SpaceState.SetNewCoord(motherLoc.SectorId, motherLoc.SystemId);
            EM.MapBuilder.System.Callback = function () {
        
                var lastSystem = EM.GetMesh(EM.SpaceState.LastActiveStarSystem);
      
                var position = lastSystem.position.clone();
                var offset = 400;
                position.x += offset;
                position.y += 200;
                position.z += offset;
                var mother = EM.GetMotherMesh();
                mother.position = position;
                //console.log("lastSystem", {
                //    lastSystem: lastSystem
                //});
               EM.EstateBuilder.UpdateMother();
            };
            EM.MapBuilder.System.Build();

        };

        function jumpToUserPlanet(param, element, attrs, accept) {
         //   console.log("mapControlHelper.jumpToUserPlanet");
            var planetId = param.OwnId;
            if (!planetId) return;

            var curPlanetId = EM.EstateData.GetCurrentEstate().EstateId;


            function setEstate() {
                EM.EstateData.SaveCurrentEstateByEsateType(true, planetId);
                EM.EstateBuilder.UpdatePlanet();
                setState("UserPlanetState");
            }

            if (param.UpdateSelect) {
                var estateItem = GameServices.estateService.getEstateItem(planetId);
                if (estateItem) {
                    GameServices.estateService.setEstate(planetId);
                    setEstate();
                }
            } else {
                if (curPlanetId === planetId) return;
                setEstate();
            };

        };

        function jumpToGalaxy(param, element, attrs, accept) {
            var csl = EM.EstateData.GetCurrentSpaceLocation();
            // console.log("mapControlHelper.jumpToGalaxy", ce);
            var sp = new EM.SpaceState.SpacePosition();
            sp.clickByBtnGalaxy("Galaxy", csl.GalaxyId);

            EM.EstateData.SetSpaceLocationFromGalaxyId(csl.GalaxyId);
        };

        function jumpToPlanetFromPlanshet(param, element, attrs, accept) {
            //planetId

            var estateList = $(EstateList.TargetSelector);
            estateList.val(planetId);
            estateList.change();
        }


        //#endregionSetState
        //#endregion


        this.galaxyInfo = galaxyInfo;
        this.sectorInfo = sectorInfo;
        this.planetInfo = planetInfo;
        this.starInfo = starInfo;
        this.openBookmarks = openBookmarks;

        this.jumpToPlanetoid = jumpToPlanetoid;
        this.jumpToUserPlanet = jumpToUserPlanet;
        this.jumpToGalaxy = jumpToGalaxy;
        this.jumpToMother = jumpToMother;

        this.jumpToSector = jumpToSector;
        this.setState = setState;

        this.setGalaxyState = setGalaxyState;
        this.setSectorState = setSectorState;
        this.setSystemState = setSystemState;
        this.setStarState = setStarState;
        this.setPlanetoidState = setPlanetoidState;
        this.setUserPlanetState = setUserPlanetState;
        this.setMotherState = setMotherState;

        this.init = function () {
            //hideAll();
            setMotherState();
            return true;
        };


    }
]);
Utils.CoreApp.gameApp.service("mapInfoHelper", [
    function () {
        var mapData = EM.MapData;
        var mapTypes = EM.MapGeometry.MapTypes;

        //#region Url

        var mapActions = {};
        Object.defineProperty(mapActions, mapTypes.Galaxy, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetGalaxyInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Sector, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetSectorInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Star, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetStarInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Planet, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetPlanetInfo);
            }
        });
        Object.defineProperty(mapActions, mapTypes.Moon, {
            get: function () {
                return mapData._getHubAction(mapData._actionNames.worldGetMoonInfo);
            }
        });

        //   mapActions[mapTypes.Bookmark] = "/api/bookmark/GetList/";

        //#endregion

        function getInfo(type, id, accept) {
            //console.log({
            //    type: type,
            //    id: id,
            //    accept: accept,
            //    mapTypes: mapTypes,
            //    lowType: type.toLowerCase(),
            //    url: url
            //});

            if (!type) return;
            if (mapTypes.Bookmark === type) {
                GameServices.bookmarkService.loadBokmarksPlanshet();
                return;
            }
            var lowType = type.toLowerCase();
            var nativeType = _.upperFirst(type);
            if (!mapActions[nativeType]) return;  
            GameServices.mapInfoService.getMapInfo(nativeType, id, mapActions[nativeType], accept);


        }

        this.getGalaxyInfo = function (id, accept) {
            getInfo(mapTypes.Galaxy, id, accept);
        }
        this.getSectorInfo = function (id, accept) {
            getInfo(mapTypes.Sector, id, accept);
        }
        this.getStarInfo = function (id, accept) {
            getInfo(mapTypes.Star, id, accept);
        }
        this.getPlanetInfo = function (id, accept) {
            getInfo(mapTypes.Planet, id, accept);
        }

        this.getInfo = getInfo;
        this.mapTypes = mapTypes;


    }
]);
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

Utils.CoreApp.gameApp.service("paralaxButtonHelper", [
    "planshetService", "hangarService", "mapControlHelper",
    function (planshetService, hangarService, mapControlHelper) {
        //#region Declate
        var btnKeys = ["leftNavBtns", "toggleBtns", "mapControllBtns", "hangarBtns"];

        var buttons = [];
        var leftNavButtons = [];
        var toggle = {};
        var mapCtrlBtns = [];
        // not fo using
        var mapControlbtnsIds = [
            "btnGalaxyInfo",
            "btnSectorInfo",
            "btnPlanetInfo",
            "btnStarInfo",
            "btnJumpToSector",
            "btnJumpToPlanetoid",
            "btnJumpToMother",
            "btnJumpToUserPlanet",
            "btnJumpToGalaxy",
            "btnOpenBookmarks"
        ];



        var updatePlanshet = function () {
            planshetService.updatePlanshet();
        }

        var leftnavIsSet = { q: false };
        var mapControlsIsSet = { q: false };
        var toggleSet = { q: false };




        //#endregion

        //#region Common

        function setHoverVoiceToButton(button, voice) {
            if (button) {
                if (!button.Params) {
                    button.Params = {};
                }
                if (!button.Params.onHovered) {
                    button.Params.onHovered = voice || function () { EM.Audio.GameSounds.defaultHover.play() }
                }
            }
        }

        function setInterfaceSvgNameToButton(button, name) {
            
            if (button) {
                if (!button.Params) {
                    button.Params = {};
                }
                if (!button.Params.svgName) {
                    button.Params.svgName = name;
                }
            }
        }
        
        function upgradeMethods(group, methods, chekItem) {
            function callback() {
                if (chekItem.q) {
                    return group;
                }
                if (methods instanceof Function) {
                    methods(group);
                    chekItem.q = true;
                    return group;
                }
                return group;
            }

            function hasData() {
                if (group instanceof Object) {
                    return !Utils.CheckObjIsEmpty(group);
                }
                return !!group;
            }

            return planshetService.conditionAwaiter(hasData, callback);

        }

        function getObj(group, methods, chekItem) {
            if (chekItem.q) {
                return group;
            } else {
                return upgradeMethods(group, methods, chekItem);
            }
        }

        //#endregion

        //#region LeftNav 

        function setNavBtnsMethods(data) {
            //alliance
            data[0].Method = function (params, element, attrs, $scope, $event) {
                GameServices.allianceService.toggleAlliance(params, element, attrs, $scope, $event);
            };
            //  confederation
            data[1].Method = function (params, element, attrs, $scope, $event) {
                GameServices.confederationService.leftNavGetConfederation(params, element, attrs, $scope, $event);
            };
            //journal
            data[2].Method = function (params, element, attrs, $scope, $event) {
                GameServices.journalService.leftNavGetJournal(params, element, attrs, $scope, $event);
            };
            //  userChannels
            data[3].Method = function (params, element, attrs, $scope, $event) {
                GameServices.userChannelsService.leftNavGetUserChannels(params, element, attrs, $scope, $event);
            };
 

            function voice() {
                EM.Audio.GameSounds.defaultHover.play(0.005);
            }

            function setAdvanced(d,svgName) {
                setInterfaceSvgNameToButton(d, svgName);
                setHoverVoiceToButton(d, voice);
            }

            setAdvanced(data[0], "alliance");
            setAdvanced(data[1],"confederation");
            setAdvanced(data[2],"journal");
            setAdvanced(data[3],"message");
 
            return data;
        };


        //#endregion

        function toggleMethod(data, onClickToggle) {
            data.Method = function () {
              // console.log("toggleMethod");
                onClickToggle();
                EM.Audio.GameSounds.defaultButtonClick.play();
            };
            setHoverVoiceToButton(data);
            setInterfaceSvgNameToButton(data,"hangar-toggle");
            
            return data;
        }

        function mapCtrlBtnsMethods(data) {
            //var refToSvgName = {
            //    "btnSectorInfo": "galaxy-info",
            //    "btnPlanetInfo": "sector-info",
            //    "btnStarInfo": "planet-info",
            //    "btnJumpToPlanetoid": "jump-to-planetoid",
            //    "btnJumpToMother": "jump-to-mother",
            //    "btnJumpToGalaxy": "jump-to-galaxy",
            //    "btnJumpToUserPlanet": "jump-to-user-planet",
            //    "btnOpenBookmarks": "open-bookmarks"
            //};

            for (var i = 0; i < data.length; i++) {
                function method(params, $event) {
                    mapControlHelper[params._methodName](params, $event.target, null, updatePlanshet);
                }
                data[i].Method = method;
                data[i].Hide = true;
                setHoverVoiceToButton(data[i]);
                var mn = _.lowerFirst(data[i].ButtonId.substr(3));
                data[i].Params._methodName = mn;
                setInterfaceSvgNameToButton(data[i], _.kebabCase(mn));
            }
            return data;
        }

        function getMapCtrlBtns() {
            return getObj(mapCtrlBtns, mapCtrlBtnsMethods, mapControlsIsSet);
        }


        //#region Public
        this.setBaseBtns = function (data) {
            leftNavButtons = data[btnKeys[0]];
            
            toggle = data[btnKeys[1]][0];
            mapCtrlBtns = data[btnKeys[2]];
            hangarService.saveInitHangarPanel(data[btnKeys[3]]);
        }

        this.getLeftNavButtons = function () {
            var btns = getObj(leftNavButtons, setNavBtnsMethods, leftnavIsSet);
            //console.log("getLeftNavButtons", { btns: btns });
            return btns;
        };

        this.getMapCtrlBtns = getMapCtrlBtns;
        this.getMapCtrlBtn = function (name) {
            return _.find(getMapCtrlBtns(), function (o) {
                return o.ButtonId === name;
            });
        };

        this.updateMapCtrlBtn = function (btn) {
            var idx = _.findIndex(mapCtrlBtns, function (o) { return (o.ButtonId === btn.ButtonId); });
            mapCtrlBtns[idx] = btn;
        }
        this.getToggle = function (onClickToggle) {
            return getObj(toggle, function (data) {
                if (onClickToggle) {
                    toggleMethod(data, onClickToggle);
                }

            }, toggleSet);
        }

        this.addMapCtrlBtn = function (newButton) {
            mapCtrlBtns.push(newButton);
        }

        this.removeButton = function (button) {
            _.pull(buttons, button);
        };
        //#endregion

        //#region Create - clone c#
        var buttonsConstants = {
            CssSmall: "small",
            CssMediaTriple: "media-triple",
            CssMediaDouble: "media-double",
            CssMid: "mid",
            CssTabButton: "tab-btn",
            CssXlBtn: "xl-btn",
            Post: "POST",
            Get: "GET",
            Center: "center",
            Ms: "ms",
            M: "m"
        };
        Object.freeze(buttonsConstants);
        function sectionItem() {
            function SectionItem() {
                var self = this;
                this.Data = {};
                this.Path = "";
                this.IsPath = false;
                this.Size = "";
                this.ItemId = "";
                this.JsFunction = "";
                this.IsComplexPart = false;
                this.BorderAnimView = function (size, path, data) {
                    self.Size = size;
                    if (path) {
                        self.Path = path;
                        self.IsPath = true;
                    }
                    if (data) {
                        self.Data = data;
                    }
                    return self;
                };
            }
            return new SectionItem();
        }

        function sectionContentViewData(left, centr, right) {
            function SectionContentViewData() {
                this.Left = left || sectionItem();
                this.Centr = centr || sectionItem();
                this.Right = right || sectionItem();
            }

            return new SectionContentViewData();
        }

        function buttonPartialView(data, path) {
            function ButtonPartialView() {
                this.PartialPath = path || "";
                this.Data = data;
            }

            return new ButtonPartialView();
        }

        function buttonsView(btnPartialView, params) {
            function ButtonsView() {
                var self = this;
                this._constants = buttonsConstants;
                this.TranslateName = "";
                this.ButtonId = "";
                this.CssClass = "";
                this.ShowName = false;
                this.ConteinPartial = false;
                this.PartialView = btnPartialView || buttonPartialView();
                this.IsCssImage = false;
                this.CssImage = "";
                this.Method = "";
                this.Params = params || {};
                /**
             * 
             * @param {} groupCount 
             * @param {} showName 
             * @param {} name 
             * @param {} method 
             * @param {} param 
             * @param {} buttonId 
             * @returns {} 
             */
                this.ConstructorSizeBtn = function (groupCount, showName, name, method, param, buttonId) {
                    if (!groupCount) groupCount = 1;
                    var size = this._constants.CssXlBtn;
                    if (groupCount === 2) size = self._constants.CssMediaDouble;
                    if (groupCount === 3) size = self._constants.CssMediaTriple;
                    if (groupCount === 4) size = self._constants.CssSmall;
                    if (name == null) name = "Ok";
                    self.TranslateName = name;
                    self.CssClass = size;
                    self.Method = method;
                    self.ShowName = showName;
                    self.Params = param;
                    self.ButtonId = buttonId;
                    return self;
                };

            }
            return new ButtonsView();
        }


        function complexButtonView() {
            function ComplexButtonView() {
                var self = this;
                this.Collection = [];
                this.IsNewItem = false;
                this.Full = function (_sectionContentViewData) {
                    _sectionContentViewData.Left.BorderAnimView(buttonsConstants.Ms);
                    _sectionContentViewData.Centr.BorderAnimView(buttonsConstants.Center);
                    _sectionContentViewData.Right.BorderAnimView(buttonsConstants.Ms);
                    self.Collection[0] = _sectionContentViewData.Left;
                    self.Collection[1] = _sectionContentViewData.Centr;
                    self.Collection[2] = _sectionContentViewData.Right;
                    return self;
                };
                this.OnlyCentr = function (path, data) {
                    var left = sectionItem();
                    left.BorderAnimView(buttonsConstants.Ms);
                    var centr = sectionItem();
                    centr.BorderAnimView(buttonsConstants.Center, path, data);
                    var right = sectionItem();
                    right.BorderAnimView(buttonsConstants.Ms);
                    self.Collection = [left, centr, right];
                    return self;
                };
                this.SimpleCentr = function (path, name) {
                    return self.OnlyCentr(path, { Head: name });
                };
            }

            return new ComplexButtonView();
        }

        this.SectionItem = sectionItem;
        this.ButtonPartialView = buttonPartialView;
        this.ButtonsView = buttonsView;
        this.ComplexButtonView = complexButtonView;
        this.SectionContentViewData = sectionContentViewData;
        this.BUTTONS_CONSTANTS = buttonsConstants;
        this.setHoverVoiceToButton = setHoverVoiceToButton;


        //#endregion



        // #region CustomConfigs

        this.createAllianceManageUserRequestBtns = function (request, actionNewMessage, actionRefuse, actionAccept, armAllianceAcceptedStatus) {
            if (request.AllianceAccepted === armAllianceAcceptedStatus.Accept) {
                request.ButtonsView = [];
                return;
            }
            var size = 3;
            var r = { request: request };
            var createMessageToMemberBtn = buttonsView();
            createMessageToMemberBtn.ConstructorSizeBtn(size, true, "new Message", actionNewMessage, r);

            var refuseMemberBtn = buttonsView();
            refuseMemberBtn.ConstructorSizeBtn(size, true, "Refuse", actionRefuse, r);

            var acceptMemberBtn = buttonsView();
            acceptMemberBtn.ConstructorSizeBtn(size, true, "Accept", actionAccept, r);

            console.log("createAllianceManageUserRequestBtns", request);
            request.ButtonsView = [createMessageToMemberBtn, refuseMemberBtn, acceptMemberBtn];
        }

        this.getOrCreateMyAllianceRequestBtns = function (request, actionCreateMsg, actionRemoveRequest, actionJoinToAlliance) {
            function createMsgBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "new Message", actionCreateMsg, { request: request });
                return btn;
            }
            function removeRequestBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "Refuse", actionRemoveRequest, { request: request });
                return btn;
            }

            function joinToAllianceBtn(size) {
                var btn = buttonsView();
                btn.ConstructorSizeBtn(size, true, "Join", actionJoinToAlliance, { request: request });
                //reqBtns[2].CssClass += " red";
                return btn;
            }

            function getRequestBtns() {
                var armStatus = GameServices.allianceService.armAllianceAcceptedStatus;
                console.log("getOrCreateMyAllianceRequestBtns", { request: request, armStatus: armStatus });
                if (request.AllianceAccepted === armStatus.NoAction) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 2) request.ButtonsView = [createMsgBtn(2), removeRequestBtn(2)];
                }
                else if (request.AllianceAccepted === armStatus.Accept) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 3) request.ButtonsView = [createMsgBtn(3), removeRequestBtn(3), joinToAllianceBtn(3)];
                }
                else if (request.AllianceAccepted === armStatus.Reject) {
                    if (!request.hasOwnProperty("ButtonsView") || request.ButtonsView.length !== 1) request.ButtonsView = [removeRequestBtn(1)];
                }
                else throw new Error("paralaxButtonHelper.getRequestBtns no data");
                return request.ButtonsView;
            };
            return getRequestBtns();

        }
        // #endregion
    }
]);
Utils.CoreApp.gameApp.service("scrollerHelper", [
    "planshetService", "$q",
    function (planshetService, $q) {
        var $self = this;
        var _guid = Utils.Guid;
        var contentScroller = ".content_scroller";

        function update(opts) {
            if (!planshetService.getInProgress() && opts._lastCollectionLenght < opts.TotalServerCount && opts._isLastItemVisible()) {
                opts._lock = true;
                opts.GetPage(opts.GetMinIdOrCondition(), opts._lastCollectionLenght, function (answer) {
                    opts._updateCollection = true;
                    opts.SaveAndSetItem(answer);
                    opts._lock = false;
                    console.log("scrollerHelper.update", {
                        opts: opts ,
                        "opts._lastCollectionLenght": opts._lastCollectionLenght,
                        "opts._isLastItemVisible()": opts._isLastItemVisible(),
                    });
                });
            }

        }


 


        /**
         * 
         * @param {object} bodyElement 
         * @param {Number} tabIdx  
         * @param {Function} totalServerCountFunc @return int
         * @param {Function} itemsCollection @return arr
         * @param {Function} getMinIdOrCondition @return int
         * @param {Function} getPage 
         * @param {Function} saveAndSetitem  @return void
         * @param {string} itemSelector  селектор для поиска   экземпляра эллемента коллекции
         * @returns {} 
         */
        function initializeScroll(
            bodyElement,
            getTabs,
            totalServerCountFunc,
            itemsCollection,
            getMinIdOrCondition,
            getPage,
            saveAndSetitem,
            itemSelector) {

            if (planshetService.getInProgress()) return;
            if (bodyElement.length !== 1) return;
            var opts;
            //console.log("initializeScroll", bodyElement);   
            var deferred = $q.defer();
            // test async
            console.log("init scroller async");

            setTimeout(function () {
                var totalCount = totalServerCountFunc();
                deferred.resolve(totalCount);
                console.log("init scroller async", {
                    totalCount: totalCount,
                    opts: opts
                });
            }, 1000);



            opts = new IScrollerOptions();
            opts.HtmlElementToBind = bodyElement;
            opts.GetTotalServerCountPromise = function () {
                return deferred.promise;
            };
            opts.GetItemsCollection = itemsCollection;
            opts.GetMinIdOrCondition = getMinIdOrCondition;
            opts.GetPage = getPage;
            opts.SaveAndSetItem = saveAndSetitem;

        }

        //   this.initializeScroll = initializeScroll;

        this.initializeScroll = function (opts, isLocal) {
            if (isLocal||!Utils.Event.HasScroll(opts.HtmlElementToBind)) {
                opts.HtmlElementToBind.bind("DOMMouseScroll mousewheel onmousewheel", function (e) {
                    if (opts._lock) return;
                    if (e.originalEvent.wheelDelta > 0) return;
                    //console.log({ serverCollCount: serverCollCount, collectionCount: collectionCount });  

                    if (opts.UpdateTotal) {
                        opts._lock = true;
                        opts.GetTotalServerCountPromise().then(function (totalCount) {
                            opts.TotalServerCount = totalCount;
                            opts._lock = false;
                            opts.UpdateTotal = false;
                            update(opts);
 
                            },
                        function (errorAnswer) {
                            if (!errorAnswer) errorAnswer = {};
                            errorAnswer.scrollerHelperError = "scrollerHelper.GetTotalServerCountPromise error";
                            opts.HtmlElementToBind.unbind("DOMMouseScroll mousewheel onmousewheel");
                            opts._lock = false;
                            throw Errors.ClientNotImplementedException({ opts: opts }, "scrollerHelper.initScroller"); 
                        });
                    }
                    else update(opts); 
                });
            }
            else {
                opts.HtmlElementToBind.unbind("DOMMouseScroll mousewheel onmousewheel");
                return $self.initializeScroll(opts,true);
            }
            return opts;
        };

        function IScrollerOptions() {
            var _self = this;
            this.GUID = null;
            this.GetTotalServerCountPromise = null;
            this.GetMinIdOrCondition = null;
            this.GetItemsCollection = null;
            this.SaveAndSetItem = null;
            this.ItemSelector = "div.dropable:last-child";
            this.GetPage = null;




            this._scrollerGuid = null;
            this._updateCollection = true;

            Object.defineProperty(this, "HtmlElementToBind", {
                get: function () {
                    return _guid.Data.Get(_self.GUID);
                },
                set: function (value) {
                    var newGuid = _guid.CreateGuid();
                    var elem = $(value);
                    if (_guid.Data.GetFromElem(elem)) {
                        _guid.Data.Update(_self.GUID, newGuid);
                        _self.GUID = newGuid;
                    }
                    else {
                        _self.GUID = newGuid;
                        _guid.Data.Add(value, _self.GUID);
                    }

                    _self._scrollerGuid = _guid.CreateGuid();
                }
            });

            this.TotalServerCount = null;
            this.UpdateTotal = true;
            this.updateTotal = function () {
                _self.UpdateTotal = true;
            }


            this._lock = false;
            this._isLastItemVisible = function () {
                var lastElemPosition = _self._getLastItemPosition() || { top: 0 };
                //console.log("isLastItemVisible",{
                //    lastElemPosition: lastElemPosition,
                //    "getLastItemPosition(sBind, itemSelector)": getLastItemPosition(sBind, itemSelector),
                //});   

                var scroller = _guid.Data.Get(_self._scrollerGuid);
                if (!scroller || !scroller.length) {
                    var dom = _self.HtmlElementToBind.parents(contentScroller);
                    scroller = _guid.Data.Update(null, _self._scrollerGuid, dom);
                }
                //console.log("getPage", {
                //    "sBind.height()": scroller.height(),
                //    "lastElemPosition.top": lastElemPosition.top,
                //    " sBind.offset().top": scroller.offset().top,
                //    "astElemPosition.top - sBind.offset().top": lastElemPosition.top - scroller.offset().top,
                //    result: scroller.height() > (lastElemPosition.top - scroller.offset().top)

                //});

                return scroller.height() > (lastElemPosition.top - scroller.offset().top) - 121;
            };
            this._getLastItemPosition = function () {
                return _self.HtmlElementToBind.find(_self.ItemSelector).offset();
            };

            var _lock = false;
            var startLock = 0;
            var _maxLockTime = 10000;
            Object.defineProperty(_self, "_lock", {
                get: function () {
                    if (!_lock) return _lock;
                    if (startLock + _maxLockTime < Date.now()) {
                        _lock = false;
                    }
                    return _lock;
                },
                set: function (value) {
                    if (!value) {
                        _lock = false;
                        return;
                    }
                    if (_lock) return;
                    startLock = Date.now();
                    _lock = value;
                }
            });



            var _lastCollectionLenght = 0;
            Object.defineProperty(_self, "_lastCollectionLenght", {
                get: function () {
                    if (_self._updateCollection) {
                        var collection = _self.GetItemsCollection();
                        _lastCollectionLenght = collection.length;
                        _self._updateCollection = false;
                    }
                    return _lastCollectionLenght;

                }

            });;


        }

        this.IScrollerOptions = function () {
            return new IScrollerOptions();
        }

    }
]);
Utils.CoreApp.gameApp.service("statisticHelper", [
    function () {
        "use strict";


        function clickableModel(onClick, onHovered) {
            var m = {
                onHover: onHovered||null,
                hasOnclick:  false,
                _onClick: onClick || null
            };

            Object.defineProperty(m, "onClick", {
                get: function () { return m._onClick },
                set: function (val) {
                    if (val) {
                        m._onClick = val;
                        m.hasOnclick = true;
                        if (!m.onHover) {
                            m.onHover = function ($event) { EM.Audio.GameSounds.defaultHover.play(); }
                        }
                    } else {
                        m.hasOnclick = false; 
                        m._onClick = null; 
                        m.onHover = null; 
                    }
                }
            });
            return m;
        }

        function imgModel(onClick, onHovered) {
            var model = clickableModel(onClick, onHovered);
            model.title = "";
            model.style = "";
            model.css = "";
            model.isImg = false;
            model.isBgImage = false;
            model.url = "";
            model.alt = "";
            model.hasContent = false;
            model.templateUrl = null;
            model.setTemplate = function (templateUrl) {
                model.hasContent = true;
                model.templateUrl = templateUrl;
            };


            return model;
        }

        /**
         * измеряет ширину и высоту исходного изображения  (в px) изменяет backgroundSize  в % отношении так,
         *  чтобы наименьшая сторона стала 100%, сохраняет пропорции. но центрирует и обрезает края,
         *  если пропорции отличаются более чем в 2 раза назначает backgroundSize по умолчанию  - "contain", или если передан defaultBgs
         * расчет ведется исходя из того что целевая фигура- квадрат
         * пропрция считаяется исходя из ширины/высоту img.width/img.height
         * @param {object} styleModel 
         * @param {string} url 
         * @param {string||null} defaultBgs присваивает по умолчанию значение backgroundSize  если не нулл  и если пропорции <0.5||>2;  default : "contain" 
         * @returns {void} null
         */
        this.resizePictire = function (styleModel, url, defaultBgs) {
            var img = new Image();
            img.src = url;
            img.onload = function (e) {
                var x = img.width;
                var y = img.height;
                var srcProportion = x / y;

                function dispose() {
                    img = null;
                }
                if (srcProportion === 1) return dispose();
                if (srcProportion > 2 || srcProportion < 0.5) {
                    styleModel.backgroundSize =defaultBgs|| "contain";
                    return dispose();
                }
                var k = (x < y) ? y / x : x / y;
                styleModel.backgroundSize = k * 100 + "%";
                return dispose();
            };
        }
 

        /**
        * Создает модель для  тега  img в StatisticModel.image
        * @param {string} url 
        * @param {string||null} alt 
        * @param {string||null} title 
        * @param {string||null} css 
        * @param {string||null} style 
        * @param {bool||null} hasOnclick default false
        * @param {function||null} onClick default null
        * @returns {object} модель image для  StatisticModel.image  как для тега  img
        */
        this.createImg = function (url, alt, title, css, style, onClick, onHovered) {
            var model = imgModel(onClick, onHovered);
            model.isImg = true;
            model.url = url;
            model.alt = alt;
            model.title = title;
            model.css = css;
            model.style = style;
            return model;
        };

        /**
        * Создает модель для  назначения background-image контейнеру для спрайта в модели  StatisticModel.image
        * @param {string} css 
        * @param {string||null} title 
        * @param {string||null} style 
        * @param {bool||null} hasOnclick default false
        * @param {function||null} onClick default null
        * @returns {object} модель image для  StatisticModel.image
        */
        this.createBgImage = function (css, title, style, onClick, templateUrl, onHovered) {
            var model = imgModel(onClick, onHovered);
            model.isBgImage = true;
            model.css = css;
            model.title = title;
            model.style = style;
            model.setTemplate(templateUrl);
            
            return model;
        }

        /**
         * создает экземляр модели для директивы statistic
         * @param {array} statsItems [StatItemModel,StatItemModel,StatItemModel,StatItemModel]
         * @param {object} imageModel   (imgModel)
         * @returns {object} statisticModel
         */
        this.createStatisticModel = function (statsItems, imageModel) {
            return {
                stats: statsItems,
                image: imageModel
            };
        };
        /**
         * Создает эллемет статистики для директывы statistic, является элементом масива stats в модели statisticModel
         * @param {string} key отображаемое имя свойства
         * @param {string} val отображаемое значение свойства 
         * @param {string||null} advancedCss стили или стиль для контейнера свойства
         * @param {string||null} advancedCssKey стили или стиль для контейнера имени свойства (дочерный эллемет)
         * @param {string||null} advancedCssVal стили или стиль для контейнера значения свойства (дочерный эллемет)
         * @param {bool||null} hasOnclick default false задает параметр будет ли контейнер кликабельным или нет
         * @param {function||null} onClick default null фцнкция которая должна отработать если есть клик
         * @returns {object} StatItem   (StatisticModel.stats[StatItem])
         */
        this.createStatItemModel = function (key, val, advancedCss, advancedCssKey, advancedCssVal, onClick, onHover) {
            var model = clickableModel(onClick, onHover);
            model.key = key;
            model.val = val;
            model.advancedCss = advancedCss;
            model.advancedCssKey = advancedCssKey;
            model.advancedCssVal = advancedCssVal;
            return model;
        }

    }
]);
Utils.CoreApp.gameApp.service("timerHelper", [
    "$interval", "buildService",
    function ($interval, buildService) {
        var $self = this;

        function TimerTypes() {
            this.simpleTimer = "simpleTimer";
            this.buildTimer = "buildTimer";
            this.noTimerRight = "noTimerRight";
            this.hangarUnitTimer = "hangarUnitTimer";
        }

        TimerTypes.prototype.getKeys = function () {
            return Object.keys(this);
        };

        var refTimerTypes = new TimerTypes();
        Object.freeze(refTimerTypes);

        var timeDelay = {};
        timeDelay.BaseDelay = 2000;
        timeDelay.Objects = {};

        var vertical = "vertical";
        var horizontal = "horizontal";




        /**
         * 
         * @param {string} timerKey 
         * @param {int} delay milisecond
         * @returns {} 
         */
        timeDelay.Start = function (timerKey, delay) {
            if (timeDelay.Objects[timerKey]) return;

            timeDelay.Objects[timerKey] = {
                StartTime: Date.now(),
                Delay: delay || timeDelay.BaseDelay
            };
        };
        /**
         * 
         * @param {string} timerKey 
         * @returns {void} 
         */
        timeDelay.IsTimeOver = function (timerKey) {
            if (!timeDelay.Objects[timerKey]) {
                return true;
            }

            var timer = timeDelay.Objects[timerKey];


            if ((timer.StartTime + timer.Delay) < Date.now()) {
                delete timeDelay.Objects[timerKey];
                return true;
            }

            return false;
        };
        /**
         * 
         * @param {string} timerKey 
         * @returns {void} 
         */
        timeDelay.HasTimeDelay = function (timerKey) {
            return !!timeDelay.Objects[timerKey];
        }; /**
         * 
         * @param {string} timerKey 
         * @param {int} delay milisecond
         * @returns {void} 
         */
        timeDelay.UpdateTimer = function (timerKey, delay) {
            if (!timeDelay.IsTimeOver(timerKey)) {
                delete timeDelay.Objects[timerKey];
                timeDelay.Start(timerKey, delay);
            } else {
                timeDelay.Start(timerKey, delay);
            }
        };


        function ITimerDictionary() {

        }
        ITimerDictionary.prototype.names = [];
        ITimerDictionary.prototype.updateTimer = function (timerName) {
            var timer = this[timerName];
            var stop = timer.activateUpdateTimer();
            if (stop) {
                timer.scope.timerData.$hasTimer = false;
                this.deleteTimer(timerName);
            }

        };
        ITimerDictionary.prototype.addTimer = function (timerName, activateUpdateTimer, scope, setFirstStep) {
            this.names = _.union(this.names, [timerName]);
            this[timerName] = {};
            this[timerName].activateUpdateTimer = activateUpdateTimer;
            this[timerName].scope = scope;
            if (setFirstStep && this[timerName].scope) {
                $self.updateStringTimer(this[timerName].scope);
            }
        };
        ITimerDictionary.prototype.deleteTimer = function (timerName) {
            _.remove(this.names, function (o) {
                return o === timerName;
            });
            delete this[timerName];
        };
        ITimerDictionary.prototype.getTimer = function (timerName) {
            return this[timerName];
        };
        ITimerDictionary.prototype.timerNameConstuctior = function (typerTypePropertyName, uniqueId, itemId) {
            return refTimerTypes[typerTypePropertyName] + "_" + uniqueId + "_" + itemId;
        };
        ITimerDictionary.prototype.addSinchronizer = function (timerName, upgrade) {
            function activateUpdateTimer() {
                upgrade();
                return false;
            }

            this.addTimer(timerName, activateUpdateTimer, {});
        }; //#region Type Timers actions

        var timerDictionary = new ITimerDictionary();

        //#endregion


        //#region ScopeHelper  
        function getComplexBtnScope($scope) {
            return Utils.A.getParentScopeWithProp($scope, "dropElement");   
        }

        //#endregion;

        //#region Start Update Register  




        function registerSimpleTimer(timerScope, newTimerData) {
            //todo  переделать   
            if (!timerScope.timerData) {
                throw new Error("registerSimpleTimer:!timerScope.timerData");
            }
            if (newTimerData) {
                Utils.UpdateObjFromOther(timerScope.timerData, newTimerData);
            }   
            var cbScope;
            var cbItemData;
            var activateUpdateTimer;
            var timerName;
            if (timerScope.hasOwnProperty("timerAdvancedParam") && timerScope.timerAdvancedParam) {
                // ReSharper disable once PossiblyUnassignedProperty
                cbItemData = timerScope.timerAdvancedParam.cbItemData;
                activateUpdateTimer = function () {
                    timerScope.timerAdvancedParam.activateUpdate(timerScope, cbItemData);
                };
                timerName = timerScope.timerAdvancedParam.timerName;
            } else {
                cbScope = getComplexBtnScope(timerScope);
                cbItemData = cbScope.item;
                activateUpdateTimer = function () {
                    // todo  проверить
                    var updateSimpleTimer = Utils.A.getValFromParent(cbScope, "updateSimpleTimer");
                    if (updateSimpleTimer) {
                        return updateSimpleTimer(timerScope, cbItemData);
                    } else {
                        throw Errors.ClientNotImplementedException({
                            timerScope: timerScope,
                            newTimerData: newTimerData,
                            updateSimpleTimer: updateSimpleTimer,
                            cbItemData: cbItemData,
                            cbScope: cbScope,
                        }, "registerSimpleTimer : activateUpdateTimer");
                    }  
                };
                timerName = timerDictionary.timerNameConstuctior(refTimerTypes.simpleTimer, cbScope.body.BodyId, cbItemData.Id);
            }
            //   scope.timerData = timerData;
    
            timerScope.timerData.$orientation = horizontal;
            timerScope.timerData.$hasTimer = timerScope.timerData.IsProgress;
            if(!timerScope.timerData.$timerHtmlData) {
                timerScope.timerData.$timerHtmlData = "";
            }
            if (!timerScope.timerData.$indicator) {
                timerScope.timerData.$indicator = $self.getIndicator(false, 0);
            }
            if (timerScope.timerData.$hasTimer) {
                timerDictionary.addTimer(timerName, activateUpdateTimer, timerScope, true);
            }
 
 
        }


        function registerNoTimerRight(timerData) { 
            timerData.$noTimer = {}; 
            timerData.$noTimer.$showData = true;
            timerData.$noTimer.$orientation = vertical;
            timerData.$noTimer.$hasTimer = false;
            timerData.$noTimer.$timerHtmlData = (timerData.hasOwnProperty("Level")) ? timerData.Level : null;
            timerData.$noTimer.$indicator =$self.getIndicator(true,0);
        }


        function registerBuildTimer(timerScope, newTimerData, ownId, $cbScope) {
            if (!(typeof ownId === "number")) return;
            if (!timerScope.timerData) {
                throw new Error("registerBuildTimer: !timerData");
            }
            timerScope.timerData.$isUnit = buildService.isUnit(timerScope.border.Data.NativeName);
            if (timerScope.timerData.$isUnit) return;
            if (newTimerData && !_.isEqual(timerScope.timerData, newTimerData)) {
                Utils.UpdateObjFromOther(timerScope.timerData, newTimerData);
            }
            var cbScope = $cbScope || getComplexBtnScope(timerScope);
            var cbItemData = cbScope.item;

            // timerData = cbItemData.Progress;
            //  if (!timerScope.timerData) return;
            timerScope.timerData.$ownId = ownId;
            function activateUpdateTimer() {
                return buildService.updateBuildTimer(timerScope, cbItemData);
            }

            timerScope.timerData.$orientation = horizontal;
            //    scope.timerData = timerData;
            timerScope.timerData.$hasTimer = timerScope.timerData.IsProgress;
            if (!timerScope.timerData.$indicator) {
                timerScope.timerData.$indicator = $self.getIndicator(false, 0);
            }
         
            if (timerScope.timerData.$hasTimer) {
                var timerName = timerDictionary.timerNameConstuctior(refTimerTypes.buildTimer, cbItemData.parentUniqueId, cbItemData.NativeName);
                timerDictionary.addTimer(timerName, activateUpdateTimer, timerScope, true);

            }

        }

        function addSinchronizer(timerName, serverUpgrade, delay, restart) {
            function upgrade() {
                if (timeDelay.HasTimeDelay(timerName)) {
                    if (restart) {
                        timeDelay.UpdateTimer(timerName, delay);
                        restart = false;
                    } else if (timeDelay.IsTimeOver(timerName)) serverUpgrade();
                    return;
                } else timeDelay.Start(timerName, delay);
            }

            timerDictionary.addSinchronizer(timerName, upgrade);
        }

        function addViewSinchronizer(timerName, updateView) {
            timerDictionary.addSinchronizer(timerName, updateView);
        }

        //#endregion

        //непрерывный таймер
        $interval(function () {
            var names = timerDictionary.names;
            if (names.length > 0) {
                _.forEach(names, function (name, key) {
                    if (name) {
                        timerDictionary.updateTimer(name);
                    }

                });
            }
        }, 1000);

        //#region Public
        this.updateStringTimer = function (timerScope) {
            var timerData = timerScope.timerData;
            var startTime = timerData.StartTime;
            var duration = timerData.Duration;
            var timeToLeft = startTime + duration - Utils.Time.GetUtcNow(false);

            if (timeToLeft > duration) timeToLeft = duration;
            if (timeToLeft < 0) timeToLeft = 0;
            var timeProgress = Math.ceil(Math.abs(((timeToLeft / duration) * 100) - 100));
            if (!timerData.$indicator) {
                timerData.$indicator = $self.getIndicator(false, timeProgress);
            }
            else {
                Utils.UpdateObjFromOther(timerData.$indicator, $self.getIndicator(false, timeProgress));
            }  
          
            timerData.$timerHtmlData = Utils.Time.Seconds2Time(timeToLeft);
            var stop = (timeToLeft === 0);
            timerData.IsProgress = !stop;
            return stop;
        };

        this.deleteTimerFromList = function (timerName) {
            if (timerDictionary[timerName]) {
                timerDictionary.deleteTimer(timerName);
            }
        };
        this.registerSimpleTimer = registerSimpleTimer;
        this.registerNoTimerRight = registerNoTimerRight;
        this.registerBuildTimer = registerBuildTimer;
        this.timeDelay = timeDelay;
        this.refTimerTypes = refTimerTypes;
        this.addSinchronizer = addSinchronizer;
        this.addViewSinchronizer = addViewSinchronizer;
        this.getIndicator = function (orientation, progres) {
            var q = {};
            q[orientation ? "height" : "width"] = progres + "%";
            return q;
        };
        this.verticalCss = vertical;
        this.horizontalCss = horizontal;
        this.getComplexBtnScope = getComplexBtnScope;
        //#endregion
    }
]);
// timer animation http://lexxus.github.io/jq-timeTo/
// http://preview.codecanyon.net/item/jcountdown-mega-package/full_screen_preview/3443480?ref=tommyngo&clickthrough_id=922481326&redirect_back=true

Utils.CoreApp.gameApp.service("controlDiskHelper", [
    "$timeout", "mainHelper", "mapInfoHelper", "bookmarkService", "journalService", function ($timeout, mainHelper, mapInfoHelper, bookmarkService, journalService) {
        "use strict";
        var domId = "#map-control-navigator";
        var hk = Utils.RepoKeys.HtmlKeys;
        var mapTypes = mapInfoHelper.mapTypes;
        var ar = EM.AssetRepository;
        var _meshLocalsKey = ar.MESH_LOCALS_KEY;
        var _meshInfoKey = ar.MESH_INFO_KEY;

  
 
        //#region JumpMother

        var targets = {
            info: "info",
            bookmark: "bookmark",
            jumpMotherDialog: "jump-mother-dialog"
        };

        var jumpBtnTranslate = Utils.CreateLangSimple("Jump", "Saltar", "Гиперпрыжок");
        function jumpMotherHandler(eventMeshId, diskModel) {
            //var re = new RegExp(mapTypes.Star, "i");
            //var hasStar = eventMeshId.search(re);
            if (diskModel.mapType === ar.GO_TYPE_NAMES.star && diskModel._meshServerData) {
                var curMother = EM.EstateData.GetMotherLocation();
                if (curMother.SystemId && curMother.SystemId !== diskModel._meshServerData.Id) {
                    diskModel.jumpTranslate = jumpBtnTranslate.getCurrent();
                    diskModel.showMotherJump = true;
                }

                //console.log(diskModel);
            }

        };
        //#endregion


        var infoInProgress = false;

        function initEvents(model) { 
            if (!Utils.Event.HasClick(model.element)) {
                model.element.click(function (event) {
                    if (infoInProgress) return;
                    EM.Audio.GameSounds.defaultButtonClick.play();
                    //console.log("model.element.click", {
                    //    model: _.cloneDeep(model),
                    //    event: event                    });
                    if (!model.mapType || !model.mapId) {
                        throw Errors.ClientNotImplementedException({
                            model: model,
                            mapType: model.mapType,
                            mapId: model.mapId

                        }, "controlDiskHelper.model.element.click type and id not set in instance");
                    }
                    var target = null;
                    var elem = $(event.target);
                    if (typeof elem.data("target") === "string") {
                        target = elem.data("target");
                    } else if (typeof elem.parent().data("target") === "string") {
                        target = elem.parent().data("target");
                    } else {
                        console.log("target not exist");
                    }
                    //console.log("target", {
                    //    target: target
                    //});
                    if (targets.bookmark === target) bookmarkService.addBookmark(model.mapType, model.mapId);
                    else if (targets.info === target) mapInfoHelper.getInfo(model.mapType, model.mapId);
                    else if (targets.jumpMotherDialog === target) journalService.jumpMotherToTargetSystemByMapControl(event, model);
                    model.hide();
                });
            }
            model.element.find(".md-button").hover(function (event) {
                EM.Audio.GameSounds.defaultHover.play();
            }, angular.noop);

        };
        //controlDiskModel
        var cDm;
        function createCdModel(element, scope) {
            cDm = {
                element: element,
                scope: scope,
                activeCssClass: "active",
                visible: false,
                dropContainerActiveCss: false,
                styles: {
                    left: 0,
                    top: 0
                },
                _setSyles: function (x, y) {
                    cDm.styles.left = x;
                    cDm.styles.top = y;
                },
                _resetSyles:  function () {
                    cDm.styles.left = -9999;
                    cDm.styles.top = -9999;
                },
                meshId: "",
                mapId: 0,
                mapType: null, //string

                delayDone: true,
                showMotherJump: false,
                jumpTranslate: null,
                _meshInfo: null,
                _meshServerData: null,
                _mapTypeItem: null,
                _setMeshData: function (event) {
                    if (cDm._meshInfo) return;
                    var _mesh;
                    var meshType = ar.CreateMeshArgumentType(event.source);
                    if (meshType.IsMesh) _mesh = event.source;
                    else if (meshType.IsObject
                             && !meshType.IsEmptyObject
                             && meshType._isCorrectMeshId(event.source.id)) {

                        _mesh = EM.GetMesh(event.source.id);

                    }
                    else if (meshType.IsCorrectMeshId()) _mesh = EM.GetMesh(event.source);
                    else throw Errors.ClientNotImplementedException({ event: event, cDm: cDm }, "controlDiskHelper.cDm.controlDiskModel._setMeshData");

                    if (!_mesh) throw Errors.ClientNullReferenceException({ event: event, cDm: cDm, _mesh: _mesh }, "_mesh", "controlDiskHelper.cDm.controlDiskModel._setMeshData");

                    cDm._meshInfo = ar.GetMeshInfoFromMeshOrMeshId(_mesh);
                    cDm.meshId = _mesh.id;
                    cDm.mapId = cDm._meshInfo.UniqueId;

                    cDm._mapTypeItem = cDm._meshInfo.GetMapType();
                    if (!cDm._mapTypeItem) throw Errors.ClientNotImplementedException({ event: event, cDm: cDm }, "controlDiskHelper.cDm.controlDiskModel._setMeshData._mapTypeItem");

                    var mapType = cDm._mapTypeItem.MapType;
                    if (mapType === ar.MapTypes.Satellite && cDm._mapTypeItem.SubMapType === ar.MapTypes.Moon) cDm.mapType = cDm._mapTypeItem.SubMapTypeLower;
                    else cDm.mapType = cDm._mapTypeItem.MapTypeLower;
                    if (cDm._mapTypeItem.MapTypeLower === ar.GO_TYPE_NAMES.star) {
                        cDm._meshServerData = ar.GetLocalsFromMesh(_mesh, ar.SERVER_DATA_KEY);
                    }
                },
                _isReseted :false,
                reset: function () {
                    if (cDm._isReseted) return;   
                    cDm.visible = false;
                    cDm.dropContainerActiveCss = false;
                    cDm._resetSyles();

                    cDm.meshId = null;
                    cDm.mapId = null;
                    cDm.mapType = null;
                    cDm.showMotherJump = false;
                    cDm.targetSystemId = null;
                    cDm._meshInfo = null;
                    cDm._mapTypeItem = null;
                    cDm._isReseted = true;
                },

                show: function (event) {
        
                    // var coord = EM.GetPointerCoordinate();
                    cDm._isReseted = false;
                    cDm.visible = true;
                    console.log("event", event);
                    cDm._setMeshData(event);
                    cDm._setSyles(event.pointerX + 20, event.pointerY);
                    jumpMotherHandler(cDm.meshId, cDm);
                    cDm.dropContainerActiveCss = true;
                    $timeout(angular.noop);
                    $timeout(function() {
                        EM.Audio.GameSounds.onControlDiscShow.play();
                    },200);
                  
                    return;
 
                },
                hide: function () {
                    cDm.reset();
                    $timeout(angular.noop);
                }
            };
            initEvents(cDm);
            //  console.log(controlDiskModel);
            return cDm;
        };

        this.createCdModel = createCdModel;
        this.show = function (event) {
            return cDm.show(event);
        };
        this.hide = function () {
            return cDm.hide();
        };
    }
]);
Utils.CoreApp.gameApp.service("controlPanelSwicherHelper", ["mainHelper", function(mainHelper) {
        var spScope;
        var animateCss = "animate";

        function getScope() {
            if (spScope) {
                return spScope;
            } else {
                return spScope = angular.element("#control-panel").scope();
            }
        }

        function updateState(showHangar) { 
            var sc = getScope();
            var targetState;
            if (showHangar === undefined) {
                //  console.log("showMap");
                targetState = !sc.cpShowHangar;
            } else {
                targetState = showHangar;
            }
            var curStateIsHangar = sc.cpShowHangar;
            if (curStateIsHangar === targetState) {
                return;
            }
            mainHelper.applyTimeout(function () {
                if (curStateIsHangar) {
                    sc.cpAnimateCss = animateCss;
                    mainHelper.$timeout(function () {
                        sc.cpShowHangar = false;
                        sc.cpMapAnimateCss = animateCss;
                    }, 400);

                } else {
                    //console.log("cpShowHangar");
                    sc.cpAnimateCss = "";
                    sc.cpMapAnimateCss = "";
                    sc.cpShowHangar = true;
                }
            });  
        } 

        this.updateState = updateState;
        this.setMap = function () {
            updateState(false);
        };
        this.setHangar = function () {
            updateState(true);
        };

    }
]);
Utils.CoreApp.gameApp.service("dropableElementHelper", ["$timeout", function ($timeout) {
    function DropableElement() {
        var openDelay = Utils.Time.DROP_ELEMENT_ANIMATION;
        var st = {
            compileContent: false,
            isOpened: false,
            guid: _.uniqueId("a_setting")
        };

        function close(onDone) {
            st.isOpened = false;
            if (onDone instanceof Function) {
                $timeout(function () {
                    onDone();
                }, openDelay, false);
            }

        }

        function open(onDone) {
            st.compileContent = true;
            if (DropableElement.lastOpenedElement && DropableElement.lastOpenedElement.isOpened) {
                DropableElement.lastOpenedElement.close(function () {
                    st.isOpened = true;
                    DropableElement.lastOpenedElement = st;
                    if (onDone instanceof Function) onDone();
                });
            } else {
                st.isOpened = true;
                DropableElement.lastOpenedElement = st;
                if (onDone instanceof Function) {
                    $timeout(function () {
                        onDone();
                    }, openDelay, false);
                }
            }


        }

        st.open = open;
        st.close = close;
        st.toggle = function (onDone) {
            st.isOpened ? st.close(onDone) : st.open(onDone);
        };

        return st;
    }
    DropableElement.lastOpenedElement = null;

    this.create = function () {
        return new DropableElement();
    };
}]);



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


Utils.CoreApp.gameApp.factory("hubFactory", ["$rootScope",
  function ($rootScope) {  
      return function (hubName,logLevel) {
          var createProp = "create" + hubName;
          if (signalR && signalR.hasOwnProperty(createProp) && signalR[createProp] instanceof Function) {
             
              var hub = signalR[createProp](logLevel);
 
              hub.$apply = function (action, responce) {
                  $rootScope.$apply(function () {
                      if (action instanceof Function) action(responce);
                  });
              }
              return { hub: hub, $$rootScope: $rootScope };
          } else {
              var msg = "SignalR: hab not exist, hub name: " + hubName;
              throw new Error(msg);
          };

      }
  }]);


 

Utils.CoreApp.gameApp.service("mainGameHubService",
    [
        "hubFactory", "allianceService", "profileService", "userChannelsService", "confederationService", "journalService", function (hubFactory,
            allianceService,
            profileService,
            userChannelsService,
            confederationService,
            journalService) {
            var connectionStates = {
                initial: 2,      // after connect -1 ;
                connecting: 0,
                connected: 1,
                disconnected: 2 // unf it is default value for new connection in prev. versions was initial
            };
            //const enum ConnectionState {
            //    Connecting,    //0
            //    Connected,     //1
            //    Disconnected,  //2
            //}

 

            // var connectionStates = $.signalR.connectionState;
            var showLog = true;

            function _log(key, val) {
                if (!showLog) return;
                if (!val) console.log(key);
                else console.log(key, val);
            }

            // #region Core
            // #region Declare
            var _hubItem = hubFactory("MainGameHub");
            var hub = _hubItem.hub;
            var hbConn = hub.connection;
    
 
            //enable logg hub events
            hbConn.logging = true;
            var mf = Utils.ModelFactory;
            var client = hub.client;
            var server = hub.server;
            var hubService = this;
            var countOnlineUsers = 0;
            // #endregion
            //#region  helpers
            hubService._currentUser = mf.ConnectionUser();
            hubService._checkCurrentUser = function () {
                if (!hubService.isValidUserData(hubService._currentUser)) throw new Error("gameNotLoad");
            }
            hubService.isValidUserData = function (user) {
                return user &&
                    user.hasOwnProperty("UserId") &&
                    user.UserId > 0 &&
                    user.hasOwnProperty("AllianceId") &&
                    user.AllianceId > 0;
            };
            hubService.isCurrentUser = function (userId) {
                return hubService._currentUser.UserId === userId;
            };
            hubService._removeHubGroupForCr = function (hubGroupName) {
                delete hubService._currentUser.Groups[hubGroupName];
            };
            hubService._addHubGroupForCr = function (ihubHroupItem) {
                if (!hubService._currentUser.Groups) hubService._currentUser.Groups = {};
                hubService._currentUser.Groups[ihubHroupItem.GroupeName] = ihubHroupItem;
            };
            //#endregion

            function ping() {
                var time = Date.now();
                var def = server.ping();
                def.then(function () {
                    console.log({ ping: Date.now() - time, connectionState: hbConn.connectionState });
                },
                    function (e) {
                        console.log({
                            e: e
                        });
                    });
                return def;
            }


            var pingDelay = 10000; //1000;// 40000;
            var pingTimeount;

            function connect() {
                hub.start().then(function(e) {
                        //  console.log("connect", { e: e });
                        hubService.onConnected(hbConn.connectionState === connectionStates.connected, function() {
                            if (pingTimeount) clearInterval(pingTimeount);
                            pingTimeount = setInterval(function () {
                                if (hbConn.connectionState === connectionStates.connected) ping();
                                else {
                                    clearInterval(pingTimeount);
                                    //todo  сделать диалог хелпер
                                    var msg ="Внимение!! соединение было потерянно, необходимо перезагрузиьт игру. Сделать это сейчас?";
                                    Utils.Console.Error(msg);
                                    var confirmed = confirm(msg);
                                    if (confirmed) location.reload();
                                }
                            }, pingDelay);
                        });
                        //   console.log("=================END connect.start ==================");
             
                    },
                    function(error) {
                        console.log({ error: error });
                        throw error;

                    });
            }
            //   console.log("===============START connect.start ==================");


            //{
            //    waitForPageLoad: false
            //}


            hubService.reconnect = function () {
                console.log("client reconnected");
            };

            hubService._updateCurrentUser = function (newConnectionUserData) {
                if (newConnectionUserData.UserId === hubService._currentUser.UserId) hubService._currentUser._updateData(newConnectionUserData);
            };
            var leftUsers = {};
            var baseDelay = 5000;
            leftUsers.IDelayUser = function (leftUser) {
                function DelayUser() {
                    var $this = this;
                    this.data = leftUser;
                    this.timer = setTimeout(function () {
                        countOnlineUsers--;
                        _hubItem.$$rootScope.$broadcast("user:left-game", $this.data);
                    },
                        baseDelay);
                }

                return new DelayUser();
            };
            leftUsers.add = function (leftUser) {
                
                leftUsers[leftUser.UserId] = leftUsers.IDelayUser(leftUser);
            };
            leftUsers.tryCancelTimer = function (newUserId) {
                if (leftUsers[newUserId]) {
                    clearTimeout(leftUsers[newUserId].timer);
                    delete leftUsers[newUserId];
                }
            };
            hubService.onConnected = function (success, $onDone) {
 
                if (success) {
                    server.init(LANG).then(function (ok) { $onDone()},
                        function (error) {
                            console.log("onConnected:init:error", { error: error });
                        });
                }
                else throw new Error("client.onConnected - error");
            };
            client.onUserInitialized = function (onlineCount, newUserId, allianceId, initializeData) {
                _log("========== START onUserInitialized ==========");
                countOnlineUsers = onlineCount;
                if (initializeData) {
                    hubService._currentUser._updateData(initializeData.ConnectionUser);
                    EM.GameLoader.Load(initializeData);
                    _log("client.onConnected",
                        {
                            onlineCount: countOnlineUsers,
                            initializeData: initializeData,
                            currentUser: hubService._currentUser
                        });
                }
                else {
                    leftUsers.tryCancelTimer(newUserId);
                    GameServices.allianceService.onOtherUserConnected(newUserId, allianceId);
                }
                _hubItem.$$rootScope.$broadcast("user:join-to-game",
                    {
                        CurrentConnectionUser: _.cloneDeep(hubService._currentUser),
                        ConnectedUserId: newUserId,
                        ConnectedAllianceId: allianceId,
                        OnlineTotalCount: onlineCount
                    });
                _log("========== END onUserInitialized ==========");
            };
            client.onReconnected = function (connectionId) {
                console.log("onReconnected connectionId:" + connectionId);
            };
            client.userLeftGame = function (connectionUser) {
                // _log("userLeftGame", connectionUser);
                console.log("userLeftGame", connectionUser);
                leftUsers.add(connectionUser);
            };
            /**
             * Обновляет данные текущего пользователя
             * @param {object} connectionUser  ConnectionUser Utils.ModelFactory.ConnectionUser
             * @returns {void} 
             */
            client.updateConnectionUser = function (connectionUser) {
                hubService._checkCurrentUser();
                hubService._updateCurrentUser(connectionUser);
            };
            //todo  сделать какое то оповищение или блокировку
            hubService.disconnect = client.disconnect = function (redirect) {
                hbConn.stop();
                //  alert("disconnect");
                if (redirect) {
                 Utils.RedirectToAction();
                }
            };
            hubService.notAutorized = client.notAutorized = function () {
                hbConn.stop();
                Utils.Console.Error("notAutorized");
                Utils.RedirectToAction("/Account/LogOff/");
            };
            hubService.getPing = function () {
                return ping();
            };
            client.test = function (data) { console.log(" client.test", { data: data, hub: hub }); };
            //#region loacal 
            /**
            * 
            * @returns {int} countOnlineUsers
            */
            Object.defineProperty(this,
                "onlineCount",
                {
                    get: function () {
                        return countOnlineUsers;
                    }
                });
            // #endregion
            // #endregion
            //неопределенные
            hubService.sercherGetUserNames = function (partUserName) {
                return server.sercherGetUserNames(partUserName);
            };
            // выделенные
            Utils.CoreApp.gameAppExtensions.HubAlliance(hubService,
                client,
                server,
                allianceService,
                _hubItem.$$rootScope);
            Utils.CoreApp.gameAppExtensions.HubWorld(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubPersonalInfo(hubService,
                client,
                server,
                allianceService,
                profileService);
            Utils.CoreApp.gameAppExtensions.HubBookmark(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubBuild(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubEstate(hubService, client, server);
            Utils.CoreApp.gameAppExtensions.HubJournal(hubService, client, server, journalService);
            Utils.CoreApp.gameAppExtensions.HubUserChannels(hubService,
                client,
                server,
                userChannelsService,
                _hubItem.$$rootScope);
            Utils.CoreApp.gameAppExtensions.HubConfederation(hubService,
                client,
                server,
                confederationService,
                _hubItem.$$rootScope);


            _.forEach(client, function (value, key) {
                //console.log({ key: key, value: value });
                _hubItem.hub.on(key, value);
                //hub.server['TestService'] = function(clientMessage) {
                //     return hub.invoke.apply(hub, $.merge(['TestService'], $.makeArray(arguments)));
                //};

                //hub.on('TestSended', (i) => {
                //    nextIndicator(i);
                //    console.log('received message', { message: i });
                //});
            });

            console.log("hub", hub);
 
            $(window).on("beforeunload", function () {
                hubService.disconnect(false);
                return "";
            });



            // запуск приложения
            //  setInterval(function () { console.log({ 'hbConn.connectionState': hbConn.connectionState }) }, 100);
    
            console.log("hbConn.connectionState on run start", hbConn.connectionState);
            switch (hbConn.connectionState) {
                case connectionStates.initial:
                    _log("hbConn.state : connectionStates.initial");
                    connect();
                    connectionStates.initial = -1;
                    break;
                case connectionStates.connecting:
                    _log("hbConn.state : connectionStates.connecting");
                    break;
                case connectionStates.connected:
                    _log("hbConn.state :  connectionStates.connected");
                    break;
                case connectionStates.disconnected:
                    console.log("hbConn.state : connectionStates.disconnected", currentUser);
                    break;
                default:
                    throw new Error("hbConn.state:connectionStates not exist  - default");
            }

 
        }
    ]);
//_t.connection.start().then(function (e) { console.log({ r: r }) }, function (error) { console.log({ error: error }) });

 
Utils.CoreApp.gameApp.service("translateService", [
    "planshetService",
    function (planshetService) {
        var keys = ["alliance", "mapInfo", "confederation", "journal", "common", "unit"];
        var translate = {
            alliance: null,
            mapInfo: null,
            confederation: null,
            journal: null,
            common: null,
            unit: null
        };

        function _setAlltranslate(data) {
            translate.alliance = data.alliance;
            translate.mapInfo = data.mapInfo;
            translate.confederation = data.confederation;
            translate.journal = data.journal;
            translate.common = data.common;
            translate.unit = data.unit;
        }

        function getFromServer() {
            var params = {};
            params.url = "/api/Translate/GetGameTranslate/";
            params.onSuccess = function (answer) {
                _setAlltranslate(answer);
            };
            planshetService.requestHelper(params, "translateService", true, true);

        };

        this.getAlliance = function () {
            return translate.alliance;
        };
        this.getMapInfo = function () {
            return translate.mapInfo;
        };
        this.getConfederation = function () {
            return translate.confederation;
        };
        this.getJournal = function () {
            return translate.journal;
        };
        this.getCommon = function () {
            return translate.common;
        };
        this.getUnit = function () {
            return translate.unit;
        };
        this.getAll = function () {
            return translate;
        };

        var tr = Utils.CreateLangSimple;
        this.local = {
            notPermitedForShow: tr("EN notPermitedForShow", "Es notPermitedForShow", "RU не достаточно прав для просмотра")
        };
        this.init = _setAlltranslate;
 

    }
]);
Utils.CoreApp.gameApp.service("hangarService", [
    "spaceShipyardService",
    function (spaceShipyardService) {
        var hangarPanel;
        //not for use example hangar item

        function unitProgress() {
            return {
                Level: null,
                StartTime: null,
                Duration: null,
                IsProgress: false,
                RemainToComplete: null,
                verticalIndicator: { height: 0 }
            }
        }

        var hangarPanelItemView = {
            NativeName: "",
            Name: "",
            SpriteImages: "",
            Count: null,
            Progress: unitProgress()
        };   
        var nativeNames = Utils.RepoKeys.DataKeys.UnitListNames();
        var nameIdReference = {
            Drone: 0,
            Frigate: 1,
            Battlecruiser: 2,
            Battleship: 3,
            Drednout: 4
        };
       
        function getShipyard() {
            return GameServices.spaceShipyardService.getBuildCollection();
        }

        function findPanelItem(name) {
            return _.find(hangarPanel, function (o) {
                return o.PartialView.Data.NativeName === name;
            });
        }

        function findUnitInShipyard(shipyardCollection, unitName) {
            return _.find(shipyardCollection, function (o) {
                return o.NativeName === unitName;
            });
        }

        function setShipyardData(unitItemViewData) {
            var shipyardItem = findUnitInShipyard(getShipyard(), unitItemViewData.NativeName);
            if (!shipyardItem) return;
            shipyardItem.Progress.Level = unitItemViewData.Count;

        }


        function updatePanelItemData(unitViewData) {
            var mid = "mid";
            var grayScale = " grayScale";
            var item = findPanelItem(unitViewData.NativeName);
            if (unitViewData.Count !== null && unitViewData.Count > 0) item.CssClass = mid;
            else if (item.CssClass === mid) item.CssClass = mid + grayScale;
            item.PartialView.Data = unitViewData;
            //setShipyardData(unitViewData);

        }

        function getHangarData() {
            var shipyard = getShipyard();
            var result = [];
            for (var i = 0; i < hangarPanel.length; i++) {
                var panelItem = hangarPanel[i].PartialView.Data;
                var resultItem = panelItem;
                var shipyardItem = _.find(shipyard, function (o) {
                    return o.NativeName === panelItem.NativeName;
                });


                if (!shipyardItem) {
                    resultItem.Progress = unitProgress();
                    resultItem.Count = null;
                } else {
                    resultItem.Progress = shipyardItem.Progress;    
                    if (!resultItem.Progress) resultItem.Progress = unitProgress();
    
                    resultItem.Count = resultItem.Progress.Level;
       
                }

                result.push(resultItem);
            }

            return result;
        }

        function getCloneHangarData() {
            return _.cloneDeep(getHangarData());
        }

        /**
         * 
         * @param {array} repoUnits 
         * @returns {object}  {UnitNativeName:repoUnits[i]}
         */
        function convertArrToObject(repoUnits) {
            var result = {};
            for (var i = 0; i < repoUnits.length; i++) {
                var key = repoUnits[i].NativeName;
                result[key] = repoUnits[i];
            }
            return result;
        }

        function getCloneObjectHangarData() {
            return convertArrToObject(getCloneHangarData());
        }

        function getPanelUnitData(unitName) {
            return _.find(hangarPanel, function (o) {
                return o.PartialView.Data.NativeName === unitName;
            }).PartialView.Data;
        }
            
        function cycleUpdateUnits() {
            spaceShipyardService.upgradeShipyardUnits();  
            var dataUnits = getHangarData();
            // console.log("cycleUpdateUnits", dataUnits);

            for (var i = 0; i < dataUnits.length; i++) {
                updatePanelItemData(dataUnits[i]);
            }
            //console.log("dataUnits", dataUnits);
        }


        function startProduction() {
            GameServices.timerHelper.addViewSinchronizer("units", cycleUpdateUnits);
        }

        this.saveInitHangarPanel = function (panelHangarButtons) { 
            hangarPanel = panelHangarButtons;
            var lock = false;

            function unlock() { lock = false; }

            _.forEach(hangarPanel, function (unitBtn, key) {
       
                unitBtn.Method = function (params, element, attrs, $btnScope, $event) {
                    if (lock) return;
                    lock = true;
                    GameServices.unitDialogService.CreateUnitDetailDialog($event, unlock, unitBtn.PartialView.Data.NativeName);
                };
               
            });
        };

        this.getHangarPanel = function () {   
            return hangarPanel;
        };

        this.getHangarData = getHangarData;
        this.getCloneHangarData = getCloneHangarData;
        this.getCloneObjectHangarData = getCloneObjectHangarData;
        this.updateHangarView = function () {
            _.forEach(hangarPanel, function (item, key) {
                if (hangarPanel.hasOwnProperty(key)) {
                    updatePanelItemData(item.PartialView.Data);
                }
            });
        };

        this.retstartView = function () {
            //   console.log("hangarService.retstartView updateSinchronizer");
            GameServices.estateService.updateSinchronizer(true);
            startProduction();
        };
        this.getPanelUnitData = getPanelUnitData;
    }
]);
Utils.CoreApp.gameApp.service("journalService",
    [
        "planshetService",
        "tabService",
        "hangarService", "journalDialogHelper", "npcHelper", "timerHelper", "scrollerHelper", "journalMotherJumpDialogHelper", "mainHelper",
        function (planshetService,
                 tabService,
                 hangarService,
                 journalDialogHelper,
                 npcHelper,
                 timerHelper,
                 scrollerHelper,
                 journalMotherJumpDialogHelper,
                 mainHelper) {
            var $self = this;

            this.$planshetIndex = null;
            Object.defineProperty($self,
                "UniqueId",
                {
                    value: "journal-collection",
                    writable: false,
                    configurable: false
                });
            Object.defineProperty($self,
                "PlanshetModel",
                {
                    get: function () {
                        if (!$self.$planshetIndex)
                            throw Errors.ClientNullReferenceException({
                                $self: $self
                            },
                                "$self.$planshetIndex",
                                "journalService",
                                ErrorMsg.NoData);
                        var model = planshetService.$planshetModels[$self.$planshetIndex];
                        if (model.UniqueId !== $self.UniqueId)
                            throw Errors.ClientNotImplementedException({
                                $self: $self
                            },
                                "is not  journal model");
                        return model;
                    },
                    set: function (value) {
                        planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_JOURNAL);
                        $self.$planshetIndex = planshetService.getModelIndex($self.UniqueId);
                    }
                });

            Object.defineProperty($self, "$currentUserInfo", {
                get: function () {
                    //UserId: crData.userId,
                    //UserName: crData.userName,
                    //UserIcon: crData.userAvatar.Icon,
                    //AllianceId: crData.allianceId,
                    //AllianceName: crData.allianceName,
                    //AllianceRoleId: crData.allianceRoleId,
                    return GameServices.allianceService.$currentUserInfo;

                }
            });
            this.$taskCreateDelayedActions = {};

            function updatePlanshet(advancedAction) {
                planshetService.updatePlanshet(advancedAction);
            };

            var _startDataInitialized = false;
            var newTaskButtons;

            var _taskActionButtons;
            var journalIdx = {
                task: 0,
                report: 1,
                spy: 2
            };
            var statuses = {
                noJournal: 0,
                inCache: 1,
                isActive: 2
            };

            var skagryName = npcHelper.NPC_NATIVE_NAMES.SKAGRY;

            Object.defineProperty($self,
                "$hub",
                {
                    get: function () {
                        return GameServices.mainGameHubService;
                    }
                });

            // порядок кнопок в листе кнопок таск (journal.Bodys[0].TemplateData.Buttons)
            var taskButtonEx = ["NewTaskAttack", "NewTaskTransfer", "Reset", "LoadAll", "SubmitForm"];
            var spyBtnsIds = ["btn-serch-target-spy"];

            //#region Helpers     

            function getBodyByIdx(idx) {      
                return $self.PlanshetModel.Bodys[idx];
            }

            function getUpdateStatus(update) {
                if (!$self.$planshetIndex) return true;
                if (update === undefined || update === null) {
                    update = (statuses.noJournal === $self.journalStatus());
                    return update;
                }
                return update;
            }

            function orderById(collection, directionAsk) {
                return _.orderBy(collection, ["Id"], directionAsk ? ["ask"] : ["desc"]);

            }

            this.getTabs = function () {
                return $self.PlanshetModel;
            };
            this.updatePlanshetView = function (advancedAction) {
                planshetService.setCurrentModel($self.UniqueId);
                if (advancedAction instanceof Function) updatePlanshet(advancedAction);
                else updatePlanshet();
            };

            //#endregion

            //#region Tabs Local
            function getTabDataByIdx(idx) {
                return getBodyByIdx(idx).TemplateData;
            }

            function getTaskData() {
                return getTabDataByIdx(journalIdx.task);
            }

            function getReportData() {
                return getTabDataByIdx(journalIdx.report);
            }

            function getSpyData() {
                return getTabDataByIdx(journalIdx.spy);
            }

            //#endregion

            //#region Total and Max

            // #region Deprecated
            function getMaxItems(tabIdx) {
                return getTabDataByIdx(tabIdx).MaxItems;
            }
            this.getTaskMaxItems = function () {
                return getMaxItems(journalIdx.task);
            };
            this.getSpyMaxItems = function () {
                return getMaxItems(journalIdx.spy);
            };
            this.getReportMaxItems = function () {
                return getMaxItems(journalIdx.report);
            };        

            // #endregion

            function getTotalItems(tabIdx) {
                return getTabDataByIdx(tabIdx).TotalItems;
            }



            this.getTaskTotalItems = function () {
                var d = getTaskData();
                if (typeof d.TotalItems !== "number") {
                    d.TotalItems = $self.getTaskCollection().length;
                }
                return d.TotalItems;

            };

            this.getReportTotalItems = function (isLocal) {
                var count = getTotalItems(journalIdx.report);
                if (isLocal) return count;
                var deferred = mainHelper.$q.defer();
                deferred.resolve(count, angular.noop);
                return deferred.promise;
            };

            this.getSpyTotalItems = function (isLocal) {
                var count = getTotalItems(journalIdx.spy);
                if (isLocal) return count;
                var deferred = mainHelper.$q.defer();
                deferred.resolve(count, angular.noop);
                return deferred.promise;
            };

            //#endregion

            //#region MotherJump
            var $mjd = journalMotherJumpDialogHelper;
            var motherTimerId = "journalTask_motherJumpTimer";

            function _setLocalMotherJump(newMotherJumpModel) {
                mainHelper.applyTimeout(function () {
                    var td = getTaskData();
                    td.MotherJump = newMotherJumpModel;
                });
            }

            function _resetMotherJumpModel() {
                var data = getTaskData();
                if (data) {
                    timerHelper.deleteTimerFromList(motherTimerId);
                    data.MotherJump = null;
                    updatePlanshet();
                    EM.EstateData.SaveMotherSpaceLocationFromData(GameServices.estateService.getEstateItem(0));
                }

            }

            //todo проверить текущее состояние и назначить анимацию если текущее состояние мазер
            function _activateMotherJump(newAdress, motherItemData) {

                EM.EstateData.UpdateMotherDataLocation(newAdress.Galaxy, newAdress.Sector, newAdress.System);
                var sourceSysName = motherItemData.SourceSystemName;
                var targetSysName = motherItemData.TargetSystemName;
                _resetMotherJumpModel();

                var curState = EM.EstateData.GetCurrentSpaceLocation();
                if (curState.SystemId === newAdress.System && newAdress.OwnId === curState.SpaceObjectId) {
                    console.log("curState.SystemId === newAdress.System && newAdress.OwnId === curState.SpaceObjectId");
                }
                $mjd.openDialogMotherJumped(sourceSysName, targetSysName);
            }

            function _instMotherJump(ccPrice, newAdress, motherItemData) {
                mainHelper.applyTimeout(function () {
                    GameServices.resourceService.addCc(ccPrice, "-");
                });
                _activateMotherJump(newAdress, motherItemData);
            }

            function _requestCheckMotherJumpTimeDone(advancedAction, motherItemData) {
                $self.$hub.journalIsMotherJumpTimeDone()
                    .then(function (answer) {
                        if (typeof answer === "number") advancedAction(answer);
                        else _activateMotherJump(answer, motherItemData);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                msg: msg,
                                errorAnswer: errorAnswer
                            });
                        });
            }

            this.requestGetMotherJumpTime = function (onSucsess, onError, sourceSystemId, targetSystemId) {
                if (!(onSucsess instanceof Function)) return;
                if (!sourceSystemId || !targetSystemId) return;
                if (!(onError instanceof Function)) {
                    onError = function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    }
                }
                $self.$hub.journalGetMotherJumpTime(sourceSystemId, targetSystemId).then(onSucsess, onError);

            };
            this.setMotherJumpTimer = function (motherJumpModel) {
                if (motherJumpModel && motherJumpModel.FlyDuration && motherJumpModel.FlyDuration > 0) {
                    EM.EstateData.SaveMotherSpaceLocationFromData(GameServices.estateService.getEstateItem(0),
                        motherJumpModel.TargetSystemId,
                        motherJumpModel.StartTime,
                        motherJumpModel.EndTime);
                    _setLocalMotherJump(motherJumpModel);
                }

            };
            this.requestAddTaskMotherJump = function (guid, onError) {
                $self.$hub.journalAddTaskMotherJump(guid)
                    .then($self.setMotherJumpTimer,
                        function (errorAnswer) {
                            if (onError instanceof Function) onError(errorAnswer);
                            else {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                throw Errors.ClientNotImplementedException({
                                    msg: msg,
                                    errorAnswer: errorAnswer
                                });
                            }
                        });
            };
            this.getLocalMotherJump = function () {
                return getTaskData().MotherJump;
            };
            this.hasJumpMother = function () {
                return (!!$self.getLocalMotherJump());
            };

            this.updateJumpMotherTimer = function (timerScope, motherItemData) {
                var stop = timerHelper.updateStringTimer(timerScope);
                if (stop) {
                    _requestCheckMotherJumpTimeDone(function (answer) {
                        if (typeof answer === "number") {
                            timerScope.timerData.Duration = answer;
                            timerScope.timerData.IsProgress = true;
                            timerHelper.registerSimpleTimer(timerScope, timerScope.timerData);
                        }
                    },
                        motherItemData);
                }
                return stop;
            };

            this.requestCancelMotherJump = function () {
                var data = $self.getLocalMotherJump();
                if (data) {
                    var jupId = data.Id;
                    $self.$hub.journalCancelMotherJump(jupId)
                        .then(_resetMotherJumpModel,
                            function (errorAnswer) {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                if (msg === "TaskCompleted") {
                                    //todo  сделать диалог
                                    _resetMotherJumpModel();
                                }
                                else {
                                    throw Errors.ClientNotImplementedException({
                                        msg: msg,
                                        errorAnswer: errorAnswer
                                    });
                                };
                            });
                }
            };
            this.requestInstMotherJump = function (ccPrice, $event) {
                var data = $self.getLocalMotherJump();
                if (data) {
                    $mjd.openDialogBuyInstMotherJump(data.SourceSystemName, data.TargetSystemName, ccPrice, $event)
                        .then(function () {
                            // confirm
                            $self.$hub.journalInstMotherJump(data.Id)
                                .then(function (answer) {
                                    _instMotherJump(ccPrice, answer, data);
                                },
                                    function (errorAnswer) {
                                        var msg = Errors.GetHubMessage(errorAnswer);
                                        if (msg === ErrorMsg.TaskCompleted) {
                                            $mjd.openDialogErrorMoterJumpTaskCompleted();
                                        }
                                        throw Errors.ClientNotImplementedException({
                                            msg: msg,
                                            errorAnswer: errorAnswer
                                        });

                                    });
                        },
                            function () {
                                //cancel
                            });

                }
            };

            /**
             * 
             * @param {object} evt      domEvent
             * @param {object} model controlDiskHelper.controlDiskModel
             * @returns {void} 
             */
            this.jumpMotherToTargetSystemByMapControl = function (evt, model) {
                var systemData = model._meshServerData;
                var systemName = "";
                if (systemData) systemName = systemData.NativeName;
                else {
                    throw Errors.ClientNotImplementedException({
                        systemData: systemData,
                        msg: "System name not exist",
                        model: _.cloneDeep(model)
                    });
                }

                var targetSystemId = systemData.Id;
                var curMother = EM.EstateData.GetMotherLocation();
                var curMotherSystemId = curMother.SystemId;
                if (curMotherSystemId === targetSystemId) return $mjd.openDialogErrorJupmMotherIsCurrentSystem();

                if (curMother.IsMoving) return $mjd.openDialogErrorJumpMotherInProgress(systemName);

                function error(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    $mjd.openDialogErrorJupmMother(msg, systemName);
                    throw Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer
                    });
                }

                function setDialog(answer) {
                    console.log("setDialog.answer", answer);
                    var convertedDelay = answer.FormatedSeconds;
                    var hub = $self.$hub;
                    var confirm = $mjd.openDialogMotherJumpEnter(systemName, convertedDelay);

                    confirm
                        .then(function () {
                            //ok
                            $self.requestAddTaskMotherJump(answer.Guid,
                                function (errorAnswer) {
                                    hub.journalRemoveGuid(answer.Guid);
                                    error(errorAnswer);
                                });
                        },
                            function () {
                                //cancel
                                hub.journalRemoveGuid(answer.Guid);
                            });
                };

                $self.requestGetMotherJumpTime(setDialog, error, curMother.SystemId, targetSystemId);
                return null;
            };

            //#endregion

            //#region Collections

            function getTabCollection(idx) {
                var d = getBodyByIdx(idx).TemplateData;
                return d.hasOwnProperty("Collection") ? d.Collection : d.Collection = [];
            }

            function addCollectionByIdx(idx, newItems) {
                if (!(newItems instanceof Array)) {
                    newItems = [newItems];
                }

                var sumItems = _.unionBy(getTabCollection(idx), newItems, "Id");
                var j = $self.PlanshetModel;
                var data = j.Bodys[idx].TemplateData;
                if (!data.TotalItems || data.TotalItems < sumItems.length - 1) {
                    data.TotalItems = sumItems.length-1;
                }  
                data.Collection = orderById(sumItems);
            }

            function getReportCollection() {
                return getTabCollection(journalIdx.report);
            }

            function getSpyCollection() {
                return getTabCollection(journalIdx.spy);
            }

            this._deleteItemFromCollectionByIdx = function (idx, id) {
                var col = getTabCollection(idx);
                _.remove(col,
                    function (o) {
                        return o.Id === id;
                    });
                var j = $self.PlanshetModel;
                j.Bodys[idx].TemplateData.Collection = orderById(col);
                j.Bodys[idx].TemplateData.TotalItems--;

            };

            function addSpyCollection(items) {
                addCollectionByIdx(journalIdx.spy, items);
                $self._spyScrollerOptions.updateTotal();

            }

            function addReportCollection(items) {
                addCollectionByIdx(journalIdx.report, items);
                $self._reportScrollerOptions.updateTotal();
            }

            function fixTaskUnitCount(taskItem) {
                var hangar = taskItem.HangarInTask;
                console.log("fixTaskUnitCount", hangar);
                _.forEach(hangar,
                    function (unit, unitKey) {
                        if (unit.Count === 0) {
                            unit.Count = null;
                        }
                    });
                return taskItem;
            }

            function getLastId(idx) {
                var col = getTabCollection(idx);
                if (col) {
                    return _.minBy(col, "Id").Id;
                }
                return 0;


            }

            function getLastReportId() {
                return getLastId(journalIdx.report);
            }

            function getLastSpyId() {
                return getLastId(journalIdx.spy);
            }

            function registerTaskItems() {
                var col = getTabCollection(journalIdx.task);
                if (col && col.length > 0) {
                    for (var i = 0; i < col.length; i++) {
                        fixTaskUnitCount(col[i]);
                    }
                    //console.log("col", col);
                }
            }

            this.getTaskCollection = function () {
                return getTabCollection(journalIdx.task);
            };

            this.getReportCollection = getReportCollection;
            this.addReportCollection = addReportCollection;

            this.getSpyCollection = getSpyCollection;
            this.addSpyCollection = addSpyCollection;

            //#endregion

            //#region Item
            function addSpyItem(item) {
                item.ComplexButtonView.IsNewItem = true;
                addSpyCollection([item]);
            }

            function addReportItem(item) {
                //item.ComplexButtonView.IsNewItem = true;
                addReportCollection([item]);
            }

            this.addToLocalTaskItem = function (taskItem) {

                addCollectionByIdx(journalIdx.task, [fixTaskUnitCount(taskItem)]);
            };

            function deleteTaskItem(taskId) {
                $self._deleteItemFromCollectionByIdx(journalIdx.task, taskId);
            }

            // Проверяет юнитов в задании и назначает обновление в случае окончания таймера
            function updateSimpleTimer(timerScope, taskItemData) {
                var stop = timerHelper.updateStringTimer(timerScope);
                if (stop) {
                    //todo  ничего не делаем. серевер  пошлет нотификацио об окончании задачи
                    return stop;
                }

                return stop;

            }

            this.addSpyItem = addSpyItem;
            this.addReportItem = addReportItem;
            this.updateSimpleTimer = updateSimpleTimer;

            //#endregion

            //#region Buttons
            function getTaskButtons() {
                return getTaskData().Buttons;
            }

            function reportBtnIdConstructor(id, isSpy) {
                var prefix = (isSpy) ? "spy_" : "report_";
                var btnId = prefix + id + "_";
                var type = {
                    mes: btnId + "mes",
                    spy: btnId + "spy",
                    remove: btnId + "delete"
                };
                if (isSpy) {
                    type.attack = btnId + "attack";
                }
                return type;
            }

            function getNewTaskButtons() {
                if (newTaskButtons) {
                    return newTaskButtons;
                }
                else {
                    var b = getTaskButtons();
                    newTaskButtons = [
                        _.find(b,
                            function (o) {
                                return (o.ButtonId === "add-task-attack");
                            }), _.find(b,
                            function (o) {
                                return (o.ButtonId === "add-task-transfer");
                            })
                    ];
                    return newTaskButtons;

                }

            }

            //var t = 0;
            function getReportDeleteBtn(tabCollectionItem) {
                //console.log("getReportDeleteBtn count", t++);
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.remove);
                    });

            }

            function getSpyInfoButtons(tabCollectionItem) {
                var btns = [];
                var tb = tabCollectionItem.Buttons;
                var id = tabCollectionItem.Id;
                var btnsIds = reportBtnIdConstructor(id, true);

                var spy;
                if (tabCollectionItem.TargetUserName === skagryName) {
                    spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (spy) {
                        btns.push(spy);
                    }

                }
                else {
                    var mes = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.mes);
                        });
                    spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (mes) {
                        btns.push(mes);
                    }
                    if (spy) {
                        btns.push(spy);
                    }

                }
                //console.log("getSpyInfoButtons", btns);
                return btns;
            }

            function getSpyButtonFromSerch() {
                var c = getSpyData().Buttons;
                var b = _.find(c,
                    function (o) {
                        return o.ButtonId === spyBtnsIds[0];
                    });
                return b;
            }

            function getSpyAtkBtn(tabCollectionItem) {
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id, true);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.attack);
                    });
            }

            function getSpyDeleteBtn(tabCollectionItem) {
                var btnsIds = reportBtnIdConstructor(tabCollectionItem.Id, true);
                return _.find(tabCollectionItem.Buttons,
                    function (o) {
                        return (o.ButtonId === btnsIds.remove);
                    });

            }

            this.getNewTaskButtons = getNewTaskButtons;
            this.getNewAttackBtn = function getNewAttackBtn() {
                return getNewTaskButtons()[0];

            }
            this.getTaskActionButtons = function () {
                if (_taskActionButtons) {
                    return _taskActionButtons;
                }
                else {
                    var b = getTaskButtons();
                    _taskActionButtons = [b[2], b[3], b[4]];
                    return _taskActionButtons;

                }
            };
            this.getReportInfoButtons = function (tabCollectionItem) {
                var btns = [];
                var id = tabCollectionItem.Id;
                var btnsIds = reportBtnIdConstructor(id);
                var tb = tabCollectionItem.Buttons;

                if (tabCollectionItem.IsLose) {
                    //tabCollectionItem.AtackerIsSkagry
                    var spy = _.find(tb,
                        function (o) {
                            return (o.ButtonId === btnsIds.spy);
                        });
                    if (tabCollectionItem.TargetUserName === skagryName) {
                        if (spy) {
                            btns.push(spy);
                        }

                    }
                    else {
                        var mes = _.find(tb,
                            function (o) {
                                return (o.ButtonId === btnsIds.mes);
                            });
                        if (mes) {
                            btns.push(mes);
                        }
                        if (spy) {
                            btns.push(spy);
                        }
                    }

                }
                return btns;

            };
            this.getReportDeleteBtn = getReportDeleteBtn;

            this.getSpyInfoButtons = getSpyInfoButtons;
            this.getSpyButtonFromSerch = getSpyButtonFromSerch;
            this.getSpyAtkBtn = getSpyAtkBtn;
            this.getSpyDeleteBtn = getSpyDeleteBtn;
            this.getSourceHangarInTask = hangarService.getHangarData;
            this.getTaskTargetUnits = function () {
                return _.cloneDeep(getTaskData().HangarInTask);
            }; //#endregion

            //#region Check and Cache

            function isActiveModel() {
                return planshetService.isCurrentModel($self.UniqueId);
            }

            function needUpdateCache() {
                return planshetService.needUpdateCache($self.UniqueId);
            }

            this.hasJournalInPlanshet = function () {
                if (!$self.$planshetIndex) {
                    return false;
                }
                else {
                    return true;
                }
            };
            this.isActiveModel = isActiveModel;
            this.statuses = statuses;
            this.journalStatus = function () {
                return $self.hasJournalInPlanshet() ? isActiveModel() ? statuses.isActive : needUpdateCache() ? statuses.noJournal : statuses.inCache : statuses.noJournal;
            };
            this.journalIdx = journalIdx;

            //#endregion

            //#region Request 

            this._checkTaskTimeIsOver = function (taskId, calback) {
                $self.$hub.journalTaskTimeIsOver(taskId).then(function (answer) {
                    if (calback instanceof Function) calback(answer);
                },
                    function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    });
            };
            this._getReportItemByTaskId = function (taskId, calback) {
                var deferred = mainHelper.$q.defer();
                deferred.promise
                    .then(function (answer) {
                        console.log("_getReportItemByTaskId",
                            {
                                answer: answer
                            });
                        if (calback instanceof Function) {
                            calback(answer);
                        }
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                msg: msg,
                                errorAnswer: errorAnswer
                            });
                        });
                $self.$hub.journalGetReportItemByTaskId(taskId).then(deferred.resolve, deferred.reject);
                return deferred.promise;  
            };

            // callbacks
            function saveReportCollection(answer) {
                console.log("saveReportCollection",
                    {
                        answer: _.cloneDeep(answer)
                    });
                if (answer && answer.length > 0) {
                    mainHelper.applyTimeout(function () {
                        addReportCollection(answer);
                    });
                }
            }

            function saveSpyCollection(answer) {
                if (answer && answer.length > 0) {
                    mainHelper.applyTimeout(function () {
                        addSpyCollection(answer);
                    });
                }
            }

            function getServerReportItems(minPosition, collectionCount, callback) {
                // #region Deprecated
                //  var total = $self.getReportTotalItems(true);
                //var max = $self.getReportMaxItems();
                //if (total >= max) {
                //    Utils.Console.Warn("Превышен лимит хранимых эллементов сделать обработчик");
                //    return;
                //}    
                // #endregion

                $self.$hub.journalGetReportItems(minPosition).then(function (answer) {
                    if (callback instanceof Function) callback(answer);

                },
                    function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            msg: msg,
                            errorAnswer: errorAnswer
                        });
                    });

            }

            function getServerSpyItems(minPosition, collectionCount, callback) {   
                // #region Deprecated
                //var max = $self.getSpyMaxItems();
                //var total = collectionCount || $self.getSpyTotalItems(true);
                //if (total >= max) {
                //    return;
                //}
                // #endregion
                $self.$hub.journalGetSpyItems(minPosition)
                    .then(function (answer) {
                        if (callback instanceof Function) callback(answer);
                    },
                        function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            throw Errors.ClientNotImplementedException({
                                minPosition: minPosition,
                                collectionCount: collectionCount, 
                                errorAnswer: errorAnswer,
                                msg: msg
                            },
                                "journalService.getServeSpyItems");
                        });

            }

            function deleteReportOrSpyItem(params, name) {
                var hubDelegate;
                var isSpy = false;
                if (name === "deleteSpyItem") {
                    isSpy = true;
                    hubDelegate = function () {
                        return $self.$hub.journalDeleteSpyItem(params.Id);
                    };
                }
                else if (name === "deleteReportItem") {
                    hubDelegate = function () {
                        return $self.$hub.journalDeleteReportItem(params.Id);
                    };
                }
                else {
                    throw Errors.ClientNotImplementedException({
                        params: params,
                        name: name,
                        exMessage: "method not exist"

                    },
                        "journalService.deleteReportOrSpyItem");
                }

                function onError(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer
                    });
                }

                hubDelegate().then(function (answer) {
                    if (answer) {
                        if (isSpy) $self._spyScrollerOptions.updateTotal();
                        else $self._reportScrollerOptions.updateTotal();
                        mainHelper.applyTimeout(function () {
                            $self._deleteItemFromCollectionByIdx(params.TabIdx, params.Id);
                        });
                    }
                    else throw onError("Journal item not deleted");
                },
                    onError);
            }

            this.leftNavGetJournal = function (params, element, attrs, $scope, $event) {
                this.getJournalPlanshet();
            };

            this.getJournalPlanshet = function (params, update, targetTabIdx, advancedAction) {
                var $update = getUpdateStatus(update);
                if (!$update && planshetService.isCurrentModel($self.UniqueId)) {
                    if (_.isInteger(targetTabIdx)) {
                        planshetService.open();
                        if (!(tabService.isActiveTab(targetTabIdx))) {
                            tabService.setTabIdx(targetTabIdx);
                            //tabService.initializeTabs(journal, targetTabIdx);
                        }
                        if (advancedAction instanceof Function) advancedAction();
                    }
                    else planshetService.toggle($self.UniqueId);
                    return;
                }
                if (!$update) {
                    $self.updatePlanshetView(advancedAction);
                    planshetService.toggle($self.UniqueId);
                    return;
                }

                var opts = planshetService.IHubRequestOptions(function () {
                    return $self.$hub.journalInitialPlanshet();
                },
                    $self.UniqueId);

                opts.OnSuccsess = function (answer) {
                    $self.PlanshetModel = answer;
                    registerTaskItems();
                    $self.updatePlanshetView(advancedAction);
                    planshetService.toggle($self.UniqueId);
                };
                opts.OnError = function (errorAnswer) {
                    var msg = typeof errorAnswer === "string" ? errorAnswer : Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        msg: msg,
                        errorAnswer: errorAnswer
                    });
                };

                opts.TryGetLocal = true;
                opts.SetToCurrent = true;
                opts.UpdateCacheTime = true;
                opts.CacheTime = Utils.Time.TIME_CACHE_JOURNAL;
                planshetService.planshetHubRequest(opts);

            };

            this.deleteReportOrSpyItem = deleteReportOrSpyItem;
            //#endregion

            //#region  Hub Event
            this.onTaskCreated = function (newTaskItem, $maxCount) {
                console.log(" onTaskCreated",
                    {
                        newTaskItem: newTaskItem,
                        maxCount: $maxCount
                    });
                if (getTaskData()) {

                }
                if (!newTaskItem || !newTaskItem.Id) return;
                if ($self.$taskCreateDelayedActions[newTaskItem.Id]) {
                    $self.$taskCreateDelayedActions[newTaskItem.Id](newTaskItem);
                    return;
                }
                else {
                    $self.addToLocalTaskItem(newTaskItem);     
                    return;

                    if ($maxCount === undefined) {
                        $maxCount = 10;
                    }
                    $maxCount--;
                    if ($maxCount < 1) {
                        $self.addToLocalTaskItem(newTaskItem);
                    }
                    else {
                        mainHelper.$timeout(function () {
                            $self.onTaskCreated(newTaskItem, $maxCount);
                        },
                            100);
                    }

                }   

            };

            this.onTaskFinished = function (notyfyData) { 
                console.log("onTaskFinished", {
                    notyfyData: notyfyData

                });
                if (!notyfyData || !notyfyData.Task) {
                    console.log("onTaskFinished:error", {
                        notyfyData: notyfyData
                    });
                    return;
                }
                var taskItem = notyfyData.Task;
                if (taskItem.TaskEnd) {
                    if (taskItem.IsTransfer) {
                        journalDialogHelper.openDialogTransferComplete(taskItem.TargetPlanetName);
                        deleteTaskItem(taskItem.Id);
                    }
                    else {
                        var reportAnswer = notyfyData.TabReportOut;
                        mainHelper.applyTimeout(function () {
                            if (reportAnswer.IsLose) {
                                if ($self.$currentUserInfo.userName === reportAnswer.TargetUserName) {
                                    GameServices.estateService.updateServerEstateList(true);
                                }
                            }
                            deleteTaskItem(taskItem.Id);
                            addReportItem(reportAnswer);
                            if (planshetService.isCurrentModel($self.UniqueId)) {
                                if (!tabService.isActiveTabByIdx(journalIdx.report)) {
                                    tabService.addNewDataInTabEvent(journalIdx.report);
                                }
                            }
                           
               

                            if (notyfyData.NewTotalWinnerUserCc) {
                                 GameServices.resourceService.setCc(notyfyData.NewTotalWinnerUserCc);
                            }


                        });

                    }

                }
                else {
                    console.log("onTaskFinished:error task not finished");
                }

            };
            //#endregion

            //#region  Scroller 
            this._reportScrollerOptions = scrollerHelper.IScrollerOptions();
            this._spyScrollerOptions = scrollerHelper.IScrollerOptions();
            this.initializeReportScroll = function (bodyElement) {
                var opts = $self._reportScrollerOptions;
                opts.HtmlElementToBind = bodyElement;
                opts.GetTotalServerCountPromise = $self.getReportTotalItems;
                opts.GetItemsCollection = getReportCollection;
                opts.GetMinIdOrCondition = getLastReportId;
                opts.GetPage = getServerReportItems;
                opts.SaveAndSetItem = saveReportCollection;
                scrollerHelper.initializeScroll($self._reportScrollerOptions);

            };
            this.initializeSpyScroll = function (bodyElement) {
                var opts = $self._spyScrollerOptions;
                opts.HtmlElementToBind = bodyElement;
                opts.GetTotalServerCountPromise = $self.getSpyTotalItems;
                opts.GetItemsCollection = getSpyCollection;
                opts.GetMinIdOrCondition = getLastSpyId;
                opts.GetPage = getServerSpyItems;
                opts.SaveAndSetItem = saveSpyCollection;
                scrollerHelper.initializeScroll($self._spyScrollerOptions);

            };
            this.setInitializeJournal = function (initData) {
                $self.PlanshetModel = _.cloneDeep(initData[$self.UniqueId]);
            };
            //#endregion

        }
    ]);

Utils.CoreApp.gameApp.service("planshetService", [
    "$interval", "timerHelper", "planshetHelper",
    function ($interval, timerHelper, planshetHelper) {
        //#region Declare
        var $self = this;
        var plansheteDefaultUniqueId = "startPlanshet";
        var inProgress = false;

        /**
         * Базовая модель экзепляра планшета
         * @returns {object} plansheModel
         */
        var protoModel = function () {
            return {
                UniqueId: "",
                HeadTranslateName: "",
                Buttons: [],
                Bodys: [],
                TemplateUrl: "",
                HasTabs: false,
                IsMother: false
            };
        };
        var planshetModels = [];
        var currentModel = {};   

        var LocalErrors = {
            planshetInProgress: "planshetInProgress",
            notHasOnSuccess: "notHasOnSuccess",
            notHasHubDelegate: "notHasHubDelegate",
            notHasOnError: "notHasOnError",
            noCachePolicy: "noCachePolicy",
        };


        //#endregion




        //#region Progress
        /**
         * 
         * @param {function} condition  должна возвращать  bool
         * @param {function} callback   сделать если condition =true;
         * @param {int} delay Number of milliseconds between each function call.
         * @param {int} repeat count
         * @returns {void} 
         */
        function conditionAwaiter(condition, callback, delay, repeat) {
            if (condition()) return callback();
            delay = delay ? delay : 40;
            repeat = repeat ? repeat : 10;
            var t = $interval(function () {
                if (condition()) {
                    $interval.cancel(t);
                    t = null;
                    return callback();
                }
            }, delay, repeat);

        }

        function awaiter(callback, delay, repeat) {
            return conditionAwaiter(function () { return !inProgress; }, callback);
        }

        /**
         * 
         * @param {bool} value true or file
         * @returns {void} 
         */
        function setInProgress(value) {
            inProgress = value;
        }

        function getInProgress() {
            return inProgress;
        }

        //#endregion

        //#region reqHelpers

        /**
         * 
         * @returns {object} Utils.ModelFactory.RequestParams
         */
        function reqParams() {
            return Utils.ModelFactory.RequestParams();
        }

        /**
         * 
         * @param {object} serverParams params for server
         * @returns {object}  приведенный к reqParams
         */
        function reqFixParam(serverParams) {
            var p = reqParams();
            p.url = serverParams.Url;
            p.method = serverParams.Method;
            p.data = serverParams.Data;
            return p;
        }

        //#endregion

        //#region PlanshetViewData

        /**
         * 
         * @returns {object} planshetHelper - angular service 
         */

        function endLoad() {
            planshetHelper.endLoad();
        }

        function startPreloader(parameters) {
            planshetHelper.startLoad();
        }

        /**
        * закрывает  планшет панель
        * @returns {void} 
        */
        function close() {
            //console.log("close");
            planshetHelper.close();
        }

        /**
        * 
        * @returns {void} открывает  планшет панель
        */
        function open() {
            planshetHelper.open();
        }

        /**
                 * 
                 * @returns {void}  меняет состояние видимого плагщета не противоположенное 
                 */
        function isOpened() {
            return planshetHelper.isOpened();
        }

        function updateState(guid) {
            planshetHelper.updateState(guid);
        }

        var lastToggleId;
        function toggle(uniqueId) {
            var id = uniqueId || currentModel.UniqueId;
            if (lastToggleId === id) planshetHelper.toggle();
            else open();
            lastToggleId = id;
        } /**
         * 
         * @returns {void}   проверяет является ли текущее состояние плашета состоянием планшет открыт
         */ //#endregion

        //#region History
        var history = [];
        var historyIdx = 0;
        var maxHistoryElems = 20;

        var historyBlackList = ["startPlanshet",
            "build-collection-industrial-complex",
            "build-collection-space-shipyard",
            "build-collection-laboratory",
            "build-collection-command-center"
        ];

        function hasPrevPlanshetElem() {
            return !!history[historyIdx - 1];
        }
        function hasNextPlanshetElem() {
            return !!history[historyIdx + 1];
        }

        function canAddToHistory(uniqueId) {
            return !_.find(historyBlackList, function (o) {
                return o === uniqueId;
            });
        }

        function addToHistory(uniqueId) {
            if (canAddToHistory(uniqueId)) {
                history.push(uniqueId);
                if (history.length > maxHistoryElems) history.shift();
                var idx = history.length - 1;
                if (history[idx]) historyIdx = idx;
                else historyIdx = 0;

            }

        }

        function getPrevHistoryId() {
            console.log("getPrevHistoryId", {
                history: history,
                length: history.length - 1,
                UniqueId: history[history.length - 1],
            });
            if (hasPrevPlanshetElem()) return history[historyIdx - 1];
            return currentModel.UniqueId;
        }

        function updateByHistory(direction) {
            var idx = historyIdx + direction;
            var uniqueId = history[idx];

            //console.log("prev", {
            //    uniqueId: uniqueId,
            //    history: history,
            //    historyIdx: historyIdx
            //});
            if (history[idx]) {
                $self.updatePlanshet(function () {
                    historyIdx = idx;
                    //  console.log("updatePlanshet", {newIdx : historyIdx});
                }, uniqueId, true, true);
            }
        }

        this.hasPrevPlanshetElem = hasPrevPlanshetElem;
        this.hasNextPlanshetElem = hasNextPlanshetElem;
        this.updateByHistory = updateByHistory;


        //#endregion

        /**
         * Проверяет существует ли запрашиваемая модель в масиве планшет моделей
         * @param {string} uniqueId model.UniqueId
         * @returns {bool} exist or not
         */
        function getItemById(uniqueId) {
            return _.find(planshetModels, function (o) {
                return o.UniqueId === uniqueId;
            });
        }

        function hasItemById(uniqueId) {
            return !!getItemById(uniqueId);
        }

        /**
        * добавляет или обновляет newPlanshetViewModel в коллекцию planshetModels 
        * require  newPlanshetViewModel.UniqueId
        * @returns {object} newPlanshetViewModel planshetModels[i]
        * @returns {void} 
        */
        function addOrUpdatePlanshetModel(newPlanshetViewModel) {
            if (hasItemById(newPlanshetViewModel.UniqueId)) {
                var idx = _.findIndex(planshetModels, { UniqueId: newPlanshetViewModel.UniqueId });
                planshetModels[idx] = newPlanshetViewModel;
            } else planshetModels.push(newPlanshetViewModel);
        }

        function updatePlanshetItemData(newModel, updateCacheTime, cacheTime) {
            addOrUpdatePlanshetModel(newModel);
            if (updateCacheTime) timerHelper.timeDelay.UpdateTimer(newModel.UniqueId, cacheTime || Utils.Time.TIME_CACHE_PLANSHET);
        }

        /**
         * Находит  планшет модель planshetModels[i] по uniqueId и устанавливает в текущей моделью для видимого планшета в  currentModel переменную
         * @param {string} uniqueId model.UniqueId
         * @param {bool} isHistory if isHistory = true not set to current
         * @param {bool} hasTabs  has tab in planshet model
         * @returns {void} 
         */
        function setCurrentModel(uniqueId, isHistory, hasTabs) {
            currentModel = getItemById(uniqueId);
            if (!isHistory && currentModel && currentModel.hasOwnProperty("UniqueId") && history[history.length - 1] !== currentModel.UniqueId) {
                addToHistory(currentModel.UniqueId);
            }

        }

        /**
         * Добавляет или заменяет предудущю модель  новой моделью
         * @param {object} newPlanshetHelperModel planshetModels.add(i)
         * @returns {void} 
         */ /**
        * Устанавливает первичный - базовый планшет до получения данных с сервера
        * @returns {void} 
        */
        function getDefaultPlanshet() {
            var m = Utils.ModelFactory.PlanshetHelper();
            m.HasTabs = false;
            m.HeadTranslateName = "Hi Planshet";
            m.UniqueId = plansheteDefaultUniqueId;
            addOrUpdatePlanshetModel(m);
            return getItemById(plansheteDefaultUniqueId);
        }

        /**
         *  
         * @returns {object} currentModel  возвращает текущую модель видимого планшета
         */
        function getCurrentModel() {
            return inProgress ? false : currentModel;
        }

        /**
         * 
         * @returns {string}  model.UniqueId
         */
        function getCurrentUniqueId() {
            return currentModel.UniqueId;
        }

        /**
                 * 
                 * @param {string} uniqueId model.UniqueId
                 * @returns {bool} is current model or not
                 */
        function isCurrentModel(uniqueId) {
            var curId = getCurrentUniqueId();
            return uniqueId && curId && uniqueId === curId;
        }

        function _cacheIsTimeOver(uniqueId) {
            return timerHelper.timeDelay.IsTimeOver(uniqueId);
        }

        /**
         * 
         * @param {string} uniqueId model.UniqueId
         * @returns {bool}  данные для текущего таймера 
         */
        function needUpdateCache(uniqueId) {
            if (!uniqueId) return true;
            var hasLocalItem = hasItemById(uniqueId);

            // console.log("hasItemById(uniqueId)", hasItemById(uniqueId));
            if (hasLocalItem) {
                // console.log("timerHelper.timeDelay.IsTimeOver(uniqueId)", timerHelper.timeDelay.IsTimeOver(uniqueId));
                return _cacheIsTimeOver(uniqueId);
            }
            return true;
        }

        /**
          * Основной обработчик запросов для клиент серверных взаимодействий. восновном для взаимодействий модулей и подмодулей планшета, так же  обновляет время кеширования новой модели
          * @param {object} params  из конструктора reqParams
          * @param {bool} doNotChangeState not open planshet
          * @param {int} cacheTime ms
          * @param {bool} notCache default false
          * @returns {void} 
          */
        function request(params, doNotChangeState, cacheTime, notCache) {
            setInProgress(true);
            var showError = null;
            var changePlanshetState = !doNotChangeState;
            var onError = function (answer) {
                setInProgress(false);
                endLoad();
                if (params.onError instanceof Function) params.onError(answer);
            };
            showError = params.showError ? params.showError : false;

            if (changePlanshetState) startPreloader();

            function onSuccess(a) {
                setInProgress(false);
                params.onSuccess(a);
                if (changePlanshetState) {
                    endLoad();
                    toggle(a.UniqueId);
                }
                if (notCache) return;
                timerHelper.timeDelay.UpdateTimer(a.UniqueId, cacheTime || Utils.Time.TIME_CACHE_PLANSHET);

            }

            var r = new Utils.Request(params.url, onSuccess, params.data ? params.data : null, params.method, onError, showError);
            r.getJson();
        }
        function localError(params, msg) {
            if (params.hasOwnProperty("onError") && params.onError instanceof Function) params.onError(msg);
        }






        /**
         *  аналог    requestHelper но для хаб методов
         * @param {objct} opts    IHubRequestOptions
         * @returns {void} 
         */
        function planshetHubRequest(opts) {
            opts.$isValid();
            if (inProgress) throw opts.OnError(LocalErrors.planshetInProgress);
            if (opts.UniqueId && opts.TryGetLocal && opts.$tryUpdateLocal()) return;
            setInProgress(true);
            startPreloader();
            opts.Delegate().finally(function () {
                // console.log("hubRequestDelegate.always");
                setInProgress(false);
            })
                    .then(function (newPlanshet) {
                        //    console.log("hubRequestDelegate.then.start");
                        updatePlanshetItemData(newPlanshet, true, opts.CacheTime || Utils.Time.TIME_CACHE_PLANSHET);
                        opts.$onDone(newPlanshet);

                        //   console.log("hubRequestDelegate.then.end");
                    }, function (errorAnswer) {
                        endLoad();
                        opts.OnError(errorAnswer);
                    });

        }


        /**
         * Надстройка над request Проверяет данные перед запросом и определяет необходимость в извлечении данных из кеша а не из запроса
         * @param {object} params  из конструктора reqParams
         * @param {string} uniqueId  model.UniqueId
         * @param {bool} ignore if true not show in cache and current planshet state
         * @param {bool} doNotChangeState not open or close planshet
         * @param {int} cacheTime ms
         * @param {int} notCache ms default false
         * @returns {void} 
         */
        function requestHelper(params, uniqueId, ignore, doNotChangeState, cacheTime, notCache) {
            if (!params.hasOwnProperty("onSuccess")) {
                localError(params, LocalErrors.notHasOnSuccess);
                return;
            }
            if (getInProgress() && !ignore) {
                localError(params, LocalErrors.planshetInProgress);
                return;
            }
            else if (ignore) request(params, doNotChangeState, cacheTime, notCache);
                //else if (doNotChangeState) request(params, doNotChangeState, cacheTime, notCache);
            else {
                if (!notCache && uniqueId) {
                    var opts = $self.IHubRequestOptions(null, uniqueId);
                    opts.OnSuccsess = params.onSuccess;
                    opts.OnError = params.onError;
                    if (opts.$$tryUpdateLocalIgnoreValid()) return;
                }
                else request(params, doNotChangeState, cacheTime, notCache);
            }

        }

 
        //#region Default
        getDefaultPlanshet();
        setCurrentModel(plansheteDefaultUniqueId);
        //#endregion




        //#region Public
        this.getCurrentModel = getCurrentModel;
        this.getCurrentUniqueId = getCurrentUniqueId;
        this.isCurrentModel = isCurrentModel;
 
 

        this.addOrUpdatePlanshetModel = addOrUpdatePlanshetModel;
        this.updatePlanshetItemData = updatePlanshetItemData;
        this.updatePlanshet = function (advancedAction, uniqueId, setCurrentModelById, isHistory) {
            if (uniqueId && (isCurrentModel(uniqueId) || setCurrentModelById)) setCurrentModel(uniqueId, isHistory);
            GameServices._updatePlanshet(advancedAction);
        };
        this.setCurrentModel = setCurrentModel;
        this.hasItemById = hasItemById;
        this.getItemById = getItemById;
        this.getPlanshetModels = function () {
            return planshetModels;
        };

        this.requestHelper = requestHelper;
        //this.run = run;
        this.toggle = toggle;
        this.open = open;
        this.updateState = updateState;
        this.close = close;
        this.isOpened = isOpened;
        this.setInProgress = setInProgress;
        this.getInProgress = getInProgress;
        this.conditionAwaiter = conditionAwaiter;
        this.needUpdateCache = needUpdateCache;
        this.reqParams = reqParams;
        this.reqFixParam = reqFixParam;

        this.LocalErrors = LocalErrors;
        this.planshetHubRequest = planshetHubRequest;
        this.getModelIndex = function (uniqueId) {
            return _.findIndex(planshetModels, function (o) { return o.UniqueId === uniqueId; });
        }

        function IHubRequestOptions(delegate, uniqueId) {
            var $this = this;
            this.Delegate = delegate;
            this.UniqueId = uniqueId;
            this.OnSuccsess = null;
            this.OnError = null;
            this.TryGetLocal = false;
            this.SetToCurrent = false;
            this.UpdateCacheTime = false;
            this.ChangePlanshetState = false;
            this.CacheTime = 0;

            this.$tryUpdateLocal = function () {
                if (!$this.UniqueId) return false;
                if (!$this.$isValidSilent()) return false;
                return this.$$tryUpdateLocalIgnoreValid();
            }
            this.$$tryUpdateLocalIgnoreValid = function () {
                var localItem = getItemById($this.UniqueId);
                if (!localItem) return false;
                if ($this.CacheTime) timerHelper.timeDelay.UpdateTimer($this.CacheTime);
                else if (_cacheIsTimeOver($this.UniqueId)) return false;
                return $this.$onDone(localItem);
            }

            this.$isValid = function () {
                if (this.IsValidated && this._isValidated) return true;
                if (!(this.OnError instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw new Error(LocalErrors.notHasOnError);
                }
                if (!(this.Delegate instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.notHasHubDelegate);
                }
                if (!(this.OnSuccsess instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.notHasOnSuccess);
                }
                if (this.UpdateCacheTime && !this.CacheTime) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    throw this.OnError(LocalErrors.noCachePolic);
                }
                this.IsValidated = true;
                this._isValidated = true;

            }
            this.IsValidated = false;
            this._isValidated = false;
            this.$isValidSilent = function () {
                if (this.IsValidated) return this._isValidated;
                this.IsValidated = true;
                if (!(this.OnError instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                if (!(this.Delegate instanceof Function)) {

                    this._isValidated = false;
                    return false;
                }
                if (!(this.OnSuccsess instanceof Function)) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                if (this.UpdateCacheTime && !this.CacheTime) {
                    this.IsValidated = true;
                    this._isValidated = false;
                    return false;
                }
                this.IsValidated = true;
                this._isValidated = true;
                return this._isValidated;
            };
            this.$onDone = function (newPlanshetData) {
                if ($this.SetToCurrent) {
                    $self.updatePlanshet(function () {
                        endLoad();
                        $this.OnSuccsess(newPlanshetData);
                        if ($this.ChangePlanshetState) toggle(newPlanshetData.UniqueId);
                    }, newPlanshetData.UniqueId, true);
                }
                else {
                    endLoad();
                    $this.OnSuccsess(newPlanshetData);
                    if ($this.ChangePlanshetState) toggle(newPlanshetData.UniqueId);
                }
                return true;

            }
        }
        this.IHubRequestOptions = function (delegate, uniqueId) {
            return new IHubRequestOptions(delegate, uniqueId);
        };
        Object.defineProperty($self, "$planshetModels", {
            get: function () {
                return planshetModels;
            }
        });


        //#endregion

        //setInterval(function () {
        //    console.log({
        //        planshetModels: planshetModels
        //    });
        //}, 15000);
    }
]);
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




Utils.CoreApp.gameApp.service("tabService", [
    "planshetService", "mainHelper",
    function(planshetService, mainHelper) {
        //var index = _.findIndex(tabModels, function (o) { return o.UniqueId === newModel.UniqueId; }); //  ищет в масиве по значению элелмента
        var planshetBodyId = "#planshet-body";
        var cssNewDataInTab = "new-data-in-tab";
        var cssTabBtn = "tab-btn";
        var cssActive = " "+Utils.RepoKeys.HtmlKeys.CssActive;
        var newTabEvent = false;

        var tabIds = ["planshet_tab_0", "planshet_tab_1", "planshet_tab_2"];

        var activeTabIdx = 0;
        var activeModel;

        var idxOnCompile;

        function getIdxOnCompile() {
            return idxOnCompile;
        }
        function setIdxOnCompile(idx) {
            idxOnCompile = idx;
        }

        function getButtons() {
            if (activeModel && activeModel.Buttons) {
                return activeModel.Buttons;
            }
            return null;
            
        }

        function getBodys() {
            if (activeModel && activeModel.Bodys) {
                return activeModel.Bodys;
            }
            return null;
        }


        function updateDataTabEvent(idx, addOrRemove) {
            newTabEvent = addOrRemove;
            var btns = getButtons();
            if (btns) {
                btns[idx].Params.hasNewEvent = addOrRemove;
            }
            return null;

        }

        function addNewDataInTabEvent(idx) {
            updateDataTabEvent(idx, true);
        }

        function updateCssBtn(btn) {
            if (btn.active) btn.CssClass = cssTabBtn + cssActive;
            else btn.CssClass = cssTabBtn;
        }

        function activateTabItem(tabIdx) {
            var bodys = getBodys();
            if (bodys) {
                var btns = getButtons();
                var activateVoice = activeTabIdx === tabIdx;
                mainHelper.applyTimeout(function () {
                    for (var i = 0; i < btns.length; i++) {
                        btns[i].active = false;
                        bodys[i].active = false;
                        if (i === tabIdx) {
                            btns[tabIdx].active = true;
                            bodys[tabIdx].active = true;
                        }
                        updateCssBtn(btns[i]);
                    }

                    if (newTabEvent) {
                        updateDataTabEvent(tabIdx, false);
                    }

                });
                if (activateVoice) {
                    EM.Audio.GameSounds.planshetTabActivate.play();
                }
            }
 
        }


        function setTabIdx(tabIdx) {
            activeTabIdx = tabIdx;
            activateTabItem(tabIdx);
        }

        function tabClick(params) {
            setTabIdx(params.tabIdx);
        }

        function initializeTabs(tabs) {
            for (var i = 0; i < tabs.Buttons.length; i++) {
                tabs.Buttons[i].Method = tabClick;
                var params = {
                    hasNewEvent: false,
                    newEventCss: cssNewDataInTab,
                    tabIdx: i
                };
                tabs.Buttons[i].Params = params;

            }
            activeModel = tabs;
            setTabIdx(getIdxOnCompile() || 0);
            idxOnCompile = null;
        }

        function activateTabByIdx (idx, callback) {
            setTabIdx(idx);
            if (callback instanceof Function) {
                callback();
            }

            if (newTabEvent) {
                updateDataTabEvent(idx, false);
            }

        }


        this.activateTabItem = activateTabItem;

        this.getButtons = getButtons;
        this.getBodys = getBodys;


        this.isActiveTab = function(item) {
            return (+item.BodyId.substr(-1) === activeTabIdx);
        }
        this.isActiveTabByIdx = function(idx) {
            return (idx === activeTabIdx);
        }
        this.delayActivate = function (idx, callback) {
            planshetService.conditionAwaiter(function () {
                return  activeModel &&  activeModel.hasOwnProperty("Buttons") && activeModel.Buttons.length === 3;
            }, function () {
                activateTabByIdx(idx, callback);
            });
        }
        this.activateTabByIdx = activateTabByIdx;

        this.addNewDataInTabEvent = addNewDataInTabEvent;
        this.initializeTabs = initializeTabs;
        this.setTabIdx = setTabIdx;
        this.getIdxOnCompile = getIdxOnCompile;
        this.setIdxOnCompile = setIdxOnCompile;
        this.tabIds = tabIds;

    }
]);
Utils.CoreApp.gameApp.service("allianceService", [
    "planshetService",
    "tabService",
    "scrollerHelper",
    "mainHelper",
    "statisticHelper",
    "profileService",
    "allianceDialogHelper",
    "npcHelper",
    "timerHelper",
    "$q",
    "$mdDialog",
    "$timeout",
    "maxLenghtConsts",
    function (planshetService, tabService, scrollerHelper, mainHelper, statisticHelper, profileService, allianceDialogHelper, npcHelper, timerHelper, $q, $mdDialog, $timeout, maxLenghtConsts) {
        //#region Declare
        var $self = this;
        var alliancePlanshetModel = {};
        var mf = Utils.ModelFactory;
        var alianceUniqueId;

        var addItemInAllianceList = null;
        var hasItemInAllianceList = null;
        var allianceNames;


        var _allianceTotalCount = 0;
        var _allianceUserTotalCount = 0;

        Object.defineProperty($self, "_allianceTotalCount", {
            get: function () {
                //console.log("_allianceTotalCount.get.before", {
                //    _allianceTotalCount: _allianceTotalCount,
                //    _allianceUserTotalCount: _allianceUserTotalCount,
                //    allianceNames: allianceNames
                //});
                if (_allianceUserTotalCount !== $self._scrollerOptions.TotalServerCount) {
                    var col = _.filter(allianceNames, function (o) {
                        return !o.Disbandet && o.Id >= 1000;
                    });

                    $self._scrollerOptions.TotalServerCount = _allianceUserTotalCount = col.length;
                    //console.log("_allianceTotalCount.get.after", {
                    //    _allianceTotalCount: _allianceTotalCount,
                    //    _allianceUserTotalCount: _allianceUserTotalCount,
                    //    col: col,
                    //    "npcHelper.NPC_USER_IDS": npcHelper.NPC_USER_IDS
                    //});
                }
                return _allianceTotalCount;
            },
            set: function (value) {
                _allianceTotalCount = value;

            }
        });
        this._scrollerOptions = scrollerHelper.IScrollerOptions();

        var LANG_KEY = appL10n.getL10NCurrentLanguage();


        var MESSAGE_SOURCE_TYPE = {
            IsAlliance: 1,
            IsUser: 2
        };

        this.MESSAGE_SOURCE_TYPE = MESSAGE_SOURCE_TYPE;
        /**
         * @enum [numeric]
         * @readonly
         */
        var ArmAllianceAcceptedStatus = {
            NoAction: 1,
            Accept: 2,
            Reject: 3
        };
        this.armAllianceAcceptedStatus = ArmAllianceAcceptedStatus;


        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }

        });


        //#endregion

        //#region Helpers
        function updatePlanshet(initializeTabs) {
            planshetService.updatePlanshet();
            if (alianceUniqueId && initializeTabs) GameServices.tabService.initializeTabs(planshetService.getItemById(alianceUniqueId));

        }


        function getAlliancePage(pvpPoint, skip, onSuccess) {
            $self.$hub
                .allianceGetAllianceItemByMinRating(pvpPoint, skip)
                .then(function (answer) {
                    if (onSuccess instanceof Function) onSuccess(answer);
                }, function (errorAnswer) {
                    console.log("getAlliancePage.getAlliancePage", { errorAnswer: errorAnswer });
                });
        }

        function applyAllianceList() {
            mainHelper.applyTimeout(function () {
                //    alliance.Bodys[0].TemplateData.Collection = getAllianceList();
            });
        }

        function getLocalAllianceNames(request, response, update) {
            var lowerName = request.term.toLowerCase();
            function filter() {
                var f = _.filter(allianceNames, function (o) {
                    return _.includes(o.Name.toLowerCase(), lowerName) && !o.Disbandet;
                });
                //console.log("f", _.map(f, function(item) {
                //    return {
                //        label: item.Name,
                //        value: item.Name,
                //        id: item.Id
                //    }
                //}));
                return _.map(f, function (item) {
                    console.log("getLocalAllianceNames.item", item);
                    return {
                        label: item.Name,
                        value: item.Name,
                        id: item.Id
                    };
                });
            }

            if (allianceNames && !update) {
                if (response) return response(filter());
                return;
            }

            $self.$hub
                .allianceGetAllianceNamesByPartName(lowerName)
                .then(function (answer) {
                    var serverNames = [];
                    _.forEach(answer || [], function (val, idx) {
                        serverNames[idx] = Utils.ModelFactory.IAllianceNameSerchItem(val);
                    });
                    allianceNames = _.unionBy(allianceNames, serverNames, "Id");
                    $self._allianceTotalCount = allianceNames.length;
                    if (response) response(filter());

                }, function (errorAnswer) {
                    console.log("getLocalAllianceNames.AllianceGetAllActiveAllianceNames", { errorAnswer: errorAnswer });
                });

        }

        function allianceNameIsExist(allianceNameOrId) {
            function toBool(idx) {
                return idx !== -1;
            }

            if (typeof allianceNameOrId === "number") {

                return toBool(_.findIndex(allianceNames, function (o) {
                    return o.Id === allianceNameOrId;
                }));
            }
            else if (typeof allianceNameOrId === "string") {
                return toBool(_.findIndex(allianceNames, function (o) {
                    return o.Name === allianceNameOrId;
                }));

            }
        }

        function addAllianceNameToLocal(newAllianceObj) {
            if (!newAllianceObj || !newAllianceObj.hasOwnProperty("Id") || !newAllianceObj.hasOwnProperty("Name")) return;
            if (allianceNameIsExist(newAllianceObj.Id)) {
                console.log("alliance exist!!", {
                    allianceNames: allianceNames,
                    newAlliance: newAllianceObj
                });
                return;
            }
            allianceNames.push(newAllianceObj);

            $self._allianceTotalCount = allianceNames.length;

        }

        function removeAllianceNameFromLocal(allianceNameOrId) {
            //    console.log("removeAllianceNameFromLocal", {
            //        allianceNameOrId:allianceNameOrId,
            //        type:typeof allianceNameOrId,
            //        idx:_.findIndex(allianceNames, function(o) {
            //            return o.Id===allianceNameOrId;
            //        }),
            //        find: _.findIndex(allianceNames, function (o) { return o.Id === allianceNameOrId; }),
            //        allNames: allianceNames
            //});
            if (allianceNameIsExist(allianceNameOrId)) {
                if (typeof allianceNameOrId === "number") {
                    _.remove(allianceNames, function (o) {
                        return o.Id === allianceNameOrId;
                    });

                }
                else if (typeof allianceNameOrId === "string") {
                    _.remove(allianceNames, function (o) {
                        return o.Name === allianceNameOrId;
                    });

                }

                $self._allianceTotalCount = allianceNames.length;
            }
            else console.log("error can't remove, alliance not exist");

        }

        function setSpanText(data, cssClass) {
            return Utils.SetSpanText(data, cssClass);
        }



        function _checkUserIdIsValid(userId) {
            return typeof userId === "number" && userId !== 0;
        }

        function _checkUserNameIsValid(userName) {
            return typeof userName === "string" && userName !== "";
        }
        function _chechAllianceIdIsMyAllianceId(allianceId) {
            console.log({
                type: typeof allianceId === "number",
                typeName: typeof allianceId,
                notZero: allianceId !== 0,
                myAlId: $self.getMyAllianceId(),
                equalId: allianceId !== 0 && allianceId === $self.getMyAllianceId(),
                allEqual: typeof allianceId === "number" && allianceId !== 0 && allianceId === $self.getMyAllianceId(),
            });
            return typeof allianceId === "number" && allianceId !== 0 && allianceId === $self.getMyAllianceId();
        }


        this.addAllianceNameToLocal = addAllianceNameToLocal;

        this.getAllianceNames = getLocalAllianceNames;
        this.getAllianceItemDescription = function (description) {
            if (description && _.startsWith(description, "{")) {
                var translateObj = JSON.parse(description);
                return translateObj[LANG_KEY];
            }
            return description;
        };


        this.isCurrentModel = function () {
            if (!alianceUniqueId) return false;
            return planshetService.isCurrentModel(alianceUniqueId);
        };


        //#endregion

        //#region Role
        this.Role = (function () {
            var _r = {};

            /**
            * 
            * @param {string} roleName 
            * @param {bool} roleVal 
            * @returns {object} RoleModel
            */
            function RolePropModel(propName, propVal) {
                this.propName = propName;
                this.propVal = propVal;
            }

            function SelectRole(nativeName, roleId) {
                this.TranslateName = null;
                this.Id = roleId;
                this.NativeName = nativeName;
                this.updateTranslateName = function (translateRoleNames) {
                    this.TranslateName = translateRoleNames[this.NativeName][LANG_KEY];
                };
            }

            function IAllianceRoleDescription() {
                var _self = this;
                this._roles = {};
                this.Add = function (roleId, iLangSimple) {
                    this._roles[roleId] = iLangSimple;
                }
                this.Get = function (roleId) {
                    return _self._roles[roleId];
                }
                this.GetCurrent = function (roleId) {
                    return this.Get(roleId).getCurrent();
                }
                return this;
            }


            _r.IRolePropModel = function (propName, propVal) {
                return new RolePropModel(propName, propVal);
            };
            _r.ISelectRole = function (nativeName, roleId) {
                return new SelectRole(nativeName, roleId);
            };


            var rolePropsKeys = {
                EditAllianceInfo: "EditAllianceInfo",
                CanManagePermition: "CanManagePermition",
                MessageRead: "MessageRead",
                MessageSend: "MessageSend",
                SetTech: "SetTech",
                ShowManage: "ShowManage",
                AcceptNewMembers: "AcceptNewMembers",
                DeleteMembers: "DeleteMembers"
            };


            function INameIdRoles() {
                this.Creator = mf.INameIdModel(1, "Creator");
                this.Recrut = mf.INameIdModel(2, "Recrut");
                this.Director = mf.INameIdModel(3, "Director");

                //managers
                this.RecrutManager = mf.INameIdModel(4, "RecrutManager");
                this.Scientist = mf.INameIdModel(5, "Scientist");
                this.InfoManager = mf.INameIdModel(6, "InfoManager");
                this.AdvManager = mf.INameIdModel(7, "AdvManager");
                this.ChannelManager = mf.INameIdModel(8, "ChannelManager");

                //adv userRoles
                this.Reader = mf.INameIdModel(11, "Reader");
                this.Outcast = mf.INameIdModel(12, "Outcast");
            }

            INameIdRoles.prototype._error = function (param) {
                if (SHOW_DEBUG) throw new Error("paramIsWrong param : " + param);
                return null;
            };
            INameIdRoles.prototype.getIdByName = function (roleName) {
                if (typeof roleName !== "string") return this._error(roleName);
                var name = roleName.toLowerCase();
                var _id;
                _.forEach(this, function (o) {
                    if (o.Name.toLowerCase() === name) {
                        _id = o.Id;
                        return false;
                    }
                });
                if (!_id) {
                    return this._error(roleName);
                }
                return _id;

            };
            INameIdRoles.prototype.getNameById = function (roleId) {
                if (typeof roleId !== "number") return this._error(roleId);
                //main roles
                var _name;
                _.forEach(this, function (o) {
                    if (o.Id === roleId) {
                        _name = o.Name;
                        return false;
                    }
                });
                if (!_name) {
                    return this._error(roleId);
                }
                return _name;

            };
            INameIdRoles.prototype.equal = function (sourceIdOrName, targetIdOrName) {
                var sourceType = typeof sourceIdOrName;
                var targetType = typeof targetIdOrName;
                if (sourceType === targetType) {
                    if (sourceType === "number") return sourceIdOrName === targetIdOrName;
                    else if (sourceType === "string") return sourceIdOrName.toLowerCase() === targetIdOrName.toLowerCase();
                    else return this._error("source is: " + sourceIdOrName + " , sourct is:" + targetIdOrName);
                }
                else if (sourceType === "string") return this.getNameById(sourceIdOrName).toLowerCase() === targetIdOrName.toLowerCase();
                else if (targetType === "string") return this.getNameById(targetIdOrName).toLowerCase() === targetIdOrName.toLowerCase();
                else return this._error("source is: " + sourceIdOrName + " , sourct is:" + targetIdOrName);

            };


            var nameIdRoles = _r.roleNativeNames = new INameIdRoles();

            _r.rolePropsKeys = rolePropsKeys;
            _r._addAdvancedDataToPlanshetRole = function (newPlanshet) {
                var planshetRoles = newPlanshet.Bodys[1].TemplateData.AllianceMembers.Roles;

                _.forEach(planshetRoles, function (val, roleId) {
                    val.translateRoleHtmlDescription = _r.allianceRoleDescription.GetCurrent(roleId);
                });
            };

            _r.getRoleByName = function (roleName) {
                var roleId = nameIdRoles.getIdByName(roleName);
                if (typeof roleId === "number") {
                    var data = $self.getMyAllianceData();
                    if (data && data.AllianceMembers && data.AllianceMembers.Roles.hasOwnProperty(roleId)) return data.AllianceMembers.Roles[roleId];
                }
                return null;
            };

            _r.createSelectRoles = function (trRoles) {
                return _.map(nameIdRoles, function (o) {
                    var role = new SelectRole(o.Name, o.Id);
                    role.updateTranslateName(trRoles);
                    return role;
                });
            };

            _r.getRolePropertyName = function (trFieldRoles, propertyNativeName) {
                return trFieldRoles[propertyNativeName][LANG_KEY];
            };


            _r.allianceRoleDescription = (function () {
                var ard = new IAllianceRoleDescription();
                var tr = Utils.CreateLangSimple;


                function ardTemplate(roleTranslateName, contentText, nameCss, contentTextCss, containerCss) {
                    var _containerCss = "alliance-role-description";
                    var _namecss = "unique-name";
                    if (containerCss) _containerCss = containerCss;
                    if (nameCss) _namecss = nameCss;

                    return "<div class='" + _containerCss + "'>" +
                        Utils.SetSpanText(roleTranslateName, _namecss) +
                        Utils.SetSpanText(contentText, contentTextCss) +
                        "</div>";
                }

                ard.Add(nameIdRoles.Creator.Id, tr(ardTemplate("Leader ", " description heare"),
                    ardTemplate("Líder ", " description heare"),
                    ardTemplate("Лидер ", " обладает безграничными полномочиями в рамках своего альянса")));

                ard.Add(nameIdRoles.Recrut.Id, tr(ardTemplate("Member ", "description heare"),
                    ardTemplate("Miembro ", "description heare"),
                    ardTemplate("Участнику ", "доступны основные функции комуникации в альянсе<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-отправка сообщений в чат альянса <br>" +
                        "-чтение сообщений альянса")));

                ard.Add(nameIdRoles.Director.Id, tr(ardTemplate("Director ", "description heare"),
                    ardTemplate("Director ", "description heare"),
                    ardTemplate("Директор ", "назначается лидером для помощи в управлении альянсом и обладате теми же полномочиями что и лидер альянса")));

                //  need full
                ard.Add(nameIdRoles.RecrutManager.Id, tr(ardTemplate("HR Manager ", "descr HR Manager"),
                    ardTemplate("HR Gerente ", " descr HR Manager"),
                    ardTemplate("HR Менеджер ", "занимается рассмотрением заявок от кандидатов на вступление в альянс<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Приём заявок на вступление в альянс")));

                ard.Add(nameIdRoles.Scientist.Id, tr(ardTemplate("Scientist ", "description heare"),
                    ardTemplate("Científico ", "description heare"),
                    ardTemplate("Учёные ", "уполномочены выбирать направление развития технологий в альянсе<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Доступ в лаботаторию альянса")));

                ard.Add(nameIdRoles.InfoManager.Id, tr(ardTemplate("Community manager ", "description heare"),
                    ardTemplate("El responsable de comunicacion ", "description heare"),
                    ardTemplate("Комьюнити менеджер ", "отвечает за информационную составляющую альянса<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Редактирование информации альянса")));

                ard.Add(nameIdRoles.AdvManager.Id, tr(ardTemplate("Deputy director ", "description heare"),
                    ardTemplate("Subdirector ", "description heare"),
                    ardTemplate("Заместитель директора ", "руководит альянсом в отсутствие вышестоящего руководства<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Приём заявок на вступление в альянс<br>" +
                        "-Доступ управлением лаботаторией альянса<br>" +
                        "-Редактирование информации альянса")));

                ard.Add(nameIdRoles.ChannelManager.Id, tr(ardTemplate("Messenger ", "description heare"),
                    ardTemplate("Mensajero ", "description heare"),
                    ardTemplate("Связист ", "руководит каналами связи альянса<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Управление каналами связи альянса")));

                ard.Add(nameIdRoles.Reader.Id, tr(ardTemplate("Observer ", "description heare"),
                    ardTemplate("Observador ", "description heare"),
                    ardTemplate("Наблюдателю ", "доступно только чтение альянсовых сообщений<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Чтение сообщений альянса")));

                ard.Add(nameIdRoles.Outcast.Id, tr(ardTemplate("Outcast ", "description heare"),
                    ardTemplate("El exiliado ", "description heare"),
                    ardTemplate("Изгой ", "отбывающий наказание, не имеет никаких прав и ограничен в комуникации с альянсом<br>" +
                        "<b>Полномочия:</b><br>" +
                        "-Лишён всех полномочий")));
                return ard;
            })();

            _r.initRoleView = function (rolesView, roleId, trFieldRoles, outRoles) {
                if (rolesView.hasOwnProperty(roleId)) return;
                var baseRole = outRoles[roleId];
                function _crRoleView(propertyNativeName, propertyValue) {
                    return new RolePropModel(_r.getRolePropertyName(trFieldRoles, propertyNativeName), propertyValue);
                }

                rolesView[roleId] = [
                    _crRoleView(rolePropsKeys.EditAllianceInfo, baseRole.EditAllianceInfo),
                    _crRoleView(rolePropsKeys.CanManagePermition, baseRole.CanManagePermition),
                    _crRoleView(rolePropsKeys.MessageRead, baseRole.MessageRead),
                    _crRoleView(rolePropsKeys.MessageSend, baseRole.MessageSend),
                    _crRoleView(rolePropsKeys.SetTech, baseRole.SetTech),
                    _crRoleView(rolePropsKeys.ShowManage, baseRole.ShowManage),
                ];

            };
            _r.initRolesView = function (rolesView, outRoles) {
                var data = $self.getMyAllianceData();
                if (!data || !data.AllianceMembers || !data.AllianceMembers.TranslateRoleFields) {
                    throw Errors.ClientNotImplementedException({
                        rolesView: rolesView,
                        outRoles: outRoles,
                        data: data
                    });
                }

                var trFieldRoles = data.AllianceMembers.TranslateRoleFields;
                //main roles
                _.forEach(nameIdRoles, function (o) {
                    _r.initRoleView(rolesView, o.Id, trFieldRoles, outRoles);
                });

            };
            _r.getTranslateRoleName = function (trRoles, roleName) {
                return trRoles[roleName][LANG_KEY];
            };


            _r.updateLoacalAmRole = function (userId, newRole) {
                var memModel = $self.getMyAllianceMembers();
                var am = _.find(memModel.Members, function (o) {
                    return o.UserId === userId;
                });
                if (!am) return null;
                Utils.UpdateObjData(am.Role, newRole);
                return am;
            };
            var _updateUserRoleInProgres = false;
            _r.requestUpdateUserRole = function (targetAllianceUserId, targetUserName, targetUserId, targetRoleId, targetRoleName, $event, $$RootScope) {
                if (_updateUserRoleInProgres) return;
                _updateUserRoleInProgres = true;

                $self.$hub.allianceUpdateUserRole(targetAllianceUserId, targetUserId, targetRoleId)
                    .finally(function () {
                        _updateUserRoleInProgres = false;
                    }).then(function (answer) {
                        allianceDialogHelper.openDialogRoleUpdated(targetUserName, targetRoleName, $event);
                        answer.$$RootScope = $$RootScope;
                        answer.IsCurrentUser = false;
                        _r.onAllianceUserUpdateRole(answer);
                    }, function (errorAnswer) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        if (msg === ErrorMsg.NotPermitted) {
                            allianceDialogHelper.openDialogNotPermitted($event);
                        } else if (msg === ErrorMsg.AllianceRoleNotChanged) {
                            allianceDialogHelper.openDialogRoleNotChanged(targetUserName, targetRoleName, $event);
                        }
                        else {
                            throw Errors.ClientNotImplementedException({
                                errorAnswer: errorAnswer,
                                msg: msg,
                                targetUserName: targetUserName,
                                targetUserId: targetUserId,
                                targetRoleId: targetRoleId,
                                targetRoleName: targetRoleName
                            });
                        }

                    });


            };

            _r.onAllianceUserUpdateRole = function (answer) {
                var data = $self.getMyAllianceData();
                if (!data || data.Id !== answer.AllianceId) return;
                if (data.hasOwnProperty("AllianceMembers")
                    && data.AllianceMembers.hasOwnProperty("Members")
                    && data.AllianceMembers.Members) {
                    var role = answer.NewRole;
                    var allianceMember = _r.updateLoacalAmRole(answer.TargetUserId, role);
                    if (!allianceMember) return;
                    if (answer.IsCurrentUser) {
                        if (role.AcceptNewMembers && !answer.AllianceUserRequests) {
                            throw Errors.ClientNullReferenceException({
                                answer: answer,
                                allianceMember: allianceMember,
                                data: data
                            }, "allianceService.Role.onAllianceUserUpdateRole", "user has role but AllianceUserRequests not exist");
                        }

                        var manageTabData = $self.getManageTabData();
                        manageTabData.AllianceUserRequests = answer.AllianceUserRequests;
                    }
                    answer.$$RootScope.$broadcast("alliance:user-role-updated", { allianceMember: allianceMember, IsCurrentUser: answer.IsCurrentUser });
                }

            }
            return _r;
        })();
        //#endregion

        //#region Request



        function _getAlliancePlanset(onSuccess, doNotChangeState) {
            /*нет серверного запроса на обновление всей модели, предполагается что все данные находятся в кеше,
            а время кеширования больше предполагаемого времени сесии.
            Модель альянса обновляется только по частям,
            или со стороны сервера устанавливает модель другими методами,
            в любом случае, модель приходит при инициализации и тут не вызывается,
            при попытке обратиться к методу сервера бросается исключение
            */
            var opts = planshetService.IHubRequestOptions(function () {
                throw opts.OnError("альянс уже должен был быть инициализирован");
                return $self.$hub["get gull alliance tabs"]();
            },alianceUniqueId);

            opts.OnSuccsess = function (_alliancePlanshet) {
                if (onSuccess instanceof Function) onSuccess(_alliancePlanshet);
            };
            opts.OnError = function (errorAnswer) {
                var msg = typeof errorAnswer === "string" ? errorAnswer : Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    msg: msg,
                    errorAnswer: errorAnswer
                });
            };

            opts.TryGetLocal = true;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.ChangePlanshetState = !doNotChangeState;
            opts.CacheTime = Utils.Time.TIME_CACHE_ALLIANCE;
            planshetService.planshetHubRequest(opts);
        }

        function toggleAlliance(params, element, attrs, $scope, $event) {
            if (alianceUniqueId && !_.isEmpty(alliancePlanshetModel)) {
                if (planshetService.isCurrentModel(alianceUniqueId)) planshetService.toggle();
                else planshetService.updatePlanshet(planshetService.toggle, alianceUniqueId, true, false);
            }
            else throw new Error("allianceService.toggleAlliance NotImplementedException");

        }


        function _setNewPlanshet(newPlanshet, needUpdateProfile) {
            $self.Role._addAdvancedDataToPlanshetRole(newPlanshet);
            alliancePlanshetModel = newPlanshet;
            alianceUniqueId = newPlanshet.UniqueId;

            planshetService.updatePlanshetItemData(newPlanshet, true, Utils.Time.TIME_CACHE_ALLIANCE);

            if (planshetService.isCurrentModel(alianceUniqueId)) GameServices._updatePlanshet();
            if (needUpdateProfile) profileService.updateAllianceInfoInCurrentUserProfile($self.getMyAllianceData());
        }

        function getAllianceItem(allianceId, apply, tabIdx) {
            if (hasItemInAllianceList(allianceId)) {
                if (apply instanceof Function) apply();
                return;
            }
            if (!tabIdx) tabIdx = 0;
            $self.$hub.allianceGetAllianceItemById(allianceId, tabIdx).then(function (answer) {
                console.log("answer", answer);
                addItemInAllianceList(answer);
                if (apply instanceof Function) apply();
            }, function (errorAnswer) {
                console.log("getAllianceItem.errorAnswer", errorAnswer);
            });
        }

        function filterAllianceSerchByName(allianceName) {
            function onLoadAlliance(allianceModel) {
                console.log("filterAllianceSerchByName", allianceModel);
                var scope;
                planshetService.conditionAwaiter(function () {
                    scope = angular.element("#inputlg").scope();
                    return !!scope;
                }, function () {
                    scope.allianceName = allianceName;
                });

            }

            _getAlliancePlanset(onLoadAlliance, true);
        }


        this.toggleAlliance = toggleAlliance;

        this.getAllianceItem = getAllianceItem;
        this.filterAllianceSerchByName = filterAllianceSerchByName;

        //#endregion

        //#region Members  

        hasItemInAllianceList = function (allianceId) {
            return !!_.find($self.getAllianceList(), { "Id": allianceId });
        };

        function getTabs() {
            return alliancePlanshetModel;
        }

        function getBodyByIdx(idx) {
            if (alliancePlanshetModel.Bodys && alliancePlanshetModel.Bodys[idx]) return alliancePlanshetModel.Bodys[idx];
            return null;
        }

        function getSerchBody() {
            return getBodyByIdx(0);

        }

        function getAlianceItemInList(allianceId) {
            return _.find($self.getAllianceList(), function (o) {
                return o.Id === allianceId;
            });
        }

        function getTotalAllianceServerItems(withNpc, fromLocl) {
            var total = $self._allianceTotalCount;
            var count = withNpc ? total : _allianceUserTotalCount;
            if (fromLocl) return count;
            var deferred = $q.defer();
            // todo серверное или локальное обновление
            deferred.resolve(count);
            return deferred.promise;
        };

        function getMinAlliancePoint() {
            return _.minBy($self.getAllianceList(), "PvpPoint").PvpPoint;
        }

        function addListToAllianceList(advancedAllianeList) {
            //_.unionBy(getAllianceList(), advancedAllianeList, "Id");
            alliancePlanshetModel.Bodys[0].TemplateData.Collection = _.unionBy($self.getAllianceList(), advancedAllianeList, "Id");
        }

        function saveNewAllianceItem(answer) {
            addListToAllianceList(answer.Collection);
            applyAllianceList();
        }



        addItemInAllianceList = function (item) {
            alliancePlanshetModel.Bodys[0].TemplateData.Collection = _.unionBy($self.getAllianceList(), [item], "Id");

        };



        function getMyAllianceName() {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("Name")) return data.Name;
            return null;
        }

        function isNpcAllianceName(name) {
            return npcHelper.isNpc(name);
        }

        this.getTabs = getTabs;
        this.getAllianceList = function () {
            return getSerchBody().TemplateData.Collection;
        };
        this.addItemInAllianceList = addItemInAllianceList;
        this.getMyAllianceData = function () {
            var data = getBodyByIdx(1);
            //console.log("getMyAllianceData", data);
            if (data && data.hasOwnProperty("TemplateData")) return data.TemplateData;
            return null;
        };
        this.getMyAllianceId = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("Id")) return data.Id;
            return null;
        };
        this.getMyAllianceName = getMyAllianceName;



        /**
        * Utils.AllianceUserShort
        * @returns {object || Utils.AllianceUserShort} id and names for user
        */
        Object.defineProperty($self, "$currentUserInfo", {
            get: function () {
                var data = $self.getMyAllianceData();
                if (!data) throw new Error("current alliance not exist");
                var userId = profileService.getCurrentUserId();
                var userName = profileService.getCurrentUserName();
                var userAvatar = profileService.getCurrentUserAvatar();
                var allianceUserId = null;
                var allianceRoleId = null;
                var allianceId = data.Id;
                var allianceName = data.Name;
                var allianceLabel = data.Label;
                if (data.hasOwnProperty("AllianceMembers")
                    && data.AllianceMembers
                    && data.AllianceMembers.hasOwnProperty("Members")
                    && data.AllianceMembers.Members
                    && data.AllianceMembers.Members.length > 0) {

                    var member = _.find(data.AllianceMembers.Members, function (o) {
                        return o.UserId === userId;
                    });
                    if (member) {
                        allianceUserId = member.AllianceUserId;
                        allianceRoleId = member.Role.Id;
                    }

                }
                return Utils.ModelFactory.AllianceUserShort(allianceId, allianceName, userId, userName, allianceUserId, allianceRoleId, allianceLabel, userAvatar);

            }
        });






        // #region Translate vars
        var _allianceTranslate;
        Object.defineProperty($self, "_allianceTranslate", {
            get: function () {
                if (!_allianceTranslate) {
                    _allianceTranslate = _.cloneDeep(GameServices.translateService.getAlliance());
                }
                return _allianceTranslate;
            }
        });

        var _commonTranslate;
        Object.defineProperty($self, "_commonTranslate", {
            get: function () {
                if (!_commonTranslate) {
                    _commonTranslate = _.cloneDeep(GameServices.translateService.getCommon());
                }
                return _commonTranslate;
            }
        });

        // #endregion


        this.setAllianceStatsModelInScope = function (scope, model, isProfile) {
            if (!scope || !model) return null;
            //      console.log("setAllianceStatsModelInScope", scope);
            if (!model.AllianceTranslates) {
                model.AllianceTranslates = $self._allianceTranslate;
            };

            var translate = model.AllianceTranslates;
            var linkToUser = statisticHelper.createStatItemModel(translate.leader, model.LeaderName, null, null, " link-to-target unique-name ");
            var linkToAlliance = statisticHelper.createStatItemModel(translate.name, model.Name, null, null, " unique-name ");

            if (!isProfile) profileService.setOnClickToUser(linkToUser, model.LeaderName);
            else if (!isNpcAllianceName(model.Name)) {
                linkToAlliance.advancedCssVal += "link-to-target active ";
                linkToAlliance.hasOnclick = true;
                linkToAlliance.onClick = function () {
                    filterAllianceSerchByName(model.Name);
                };

            }
            var stats = [
                linkToAlliance,
                linkToUser,
                statisticHelper.createStatItemModel(translate.pvpPoint, model.PvpPoint),
                statisticHelper.createStatItemModel(translate.tax, model.TaxView + ""),
                statisticHelper.createStatItemModel(translate.controlledPlanet, model.ControlledPlanet),
                statisticHelper.createStatItemModel(translate.population, model.Pilots)
            ];


            var bgImage = statisticHelper.createBgImage("", model.Name);
            bgImage.url = model.Label.Detail;
            bgImage.style = { backgroundImage: Utils.CssHelper.SetUrl(bgImage.url) };
            //console.log({ model: model, bgImage: bgImage });
            statisticHelper.resizePictire(bgImage.style, bgImage.url);

            scope.allianceStatsModel = statisticHelper.createStatisticModel(stats, bgImage);
            return scope;
        };
        this.isNpcAllianceName = isNpcAllianceName;


        //#endregion

        //#region Alliance Common

        var messageBlockedState = false;
        function _updateMessageBlockedState(val) {
            messageBlockedState = val;
        }

        function getMessageBlockedState() {
            return messageBlockedState;
        }


        this.allianceButtonsNativeName = {
            leaveFromAlliance: "leavefromalliance",
            joinToAlliacne: "jointoalliacne"
        };
        this.getAllianceItemBtns = function (allianceItemModel) {
            var btns = allianceItemModel.Buttons;
            var newBtns = [];
            if (btns) {
                _.forEach(newBtns, function (item, idx) {
                    newBtns.push(_.cloneDeep(item));
                });
            }
            return btns;
        };

        this.updateMessageBlockedState = _updateMessageBlockedState;
        this.getMessageBlockedState = getMessageBlockedState;
        //#endregion

        //#region Leave from alliance and Drop User from Alliance
        var _leaveFromAllianceInProgress;
        this.leaveFromAlliance = function (serverParams, element, attrs, $scope) {
            if (_leaveFromAllianceInProgress) return;
            if (serverParams && serverParams.hasOwnProperty("Id") && serverParams.Id) {
                function _finally() {
                    _leaveFromAllianceInProgress = false;
                }

                var btn = $scope.button;
                if (btn.Params.NativeName !== "LeaveFromAlliance".toLowerCase()) return;
                var aItem = $scope.$parent.item;
                var allianceName = aItem.Name;
                var leaveType = 1;
                if (aItem.Pilots === 1) leaveType = 2;
                else {
                    var userName = profileService.getCurrentUserInfo().Name;
                    if (userName.toLowerCase() === aItem.LeaderName.toLowerCase()) leaveType = 2;
                }
                if (leaveType === 2) {
                    allianceDialogHelper.openDialogLeaveLeader(allianceName);
                    //   requestDisbandAlliance(allianceName);
                }
                else if (leaveType === 1) {
                    _leaveFromAllianceInProgress = true;
                    allianceDialogHelper.openDialogleaveFromAlliance(allianceName)
                        .then(function () {
                            //confirmed
                            $self.$hub
                                .allianceLeaveFromUserAlliance()
                                .then(function (newAlliancePlanshet) {
                                    //update planshet and profile
                                    //todo   изменить метод - текущая версия возвращает данные новго планшета
                                    _setNewPlanshet(newAlliancePlanshet, true);
                                    allianceDialogHelper
                                        .openDialogOnLeaveFromUserAlliance(allianceName)
                                        .finally(_finally);
                                }, function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    console.log("leavePilotFromAlliance", {
                                        errorAnswer: errorAnswer,
                                        msg: msg
                                    });
                                    _finally();
                                });
                        }, function () {
                            //cancel
                            _leaveFromAllianceInProgress = false;
                        });
                }
                else throw new Error("leaveFromAlliance.leaveType NotImplementedException");
            }


        }

        var _dropUserFromAllianceInProgress = false;

        this.dropUserFromAlliance = function (targetUserName, targetDropUserId, $event) {
            if (_dropUserFromAllianceInProgress) return;
            allianceDialogHelper
                .openDialogDropUserFromAlliance(targetUserName, $event)
                .then(function () {
                    _dropUserFromAllianceInProgress = true;
                    //confirm 

                    return $self.$hub
                        .allianceDropUserFromAlliance(targetDropUserId)
                        .finally(function () {
                            _dropUserFromAllianceInProgress = false;
                        })
                        .then(function (answer) {
                            // ничего не делаем активируются слудующие событияД
                            // onAllianceUserLeftAlliance  - для текущего альянса
                            // onAllianceUserDroped для пользователя котого дропнули   (передаем новый планшет)
                            // allianceAddNewUserToAlliane  для нового альянса
                            // (проверить все ли данные обновляется и для этой вью)  

                        }, function (errorAnswer) {

                            //error   
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.NotPermitted) {
                                allianceDialogHelper.openDialogNotPermitted($event);
                            }
                            else {
                                throw Errors.ClientNotImplementedException({
                                    errorAnswer: errorAnswer,
                                    msg: msg
                                }, "allianceDropUserFromAlliance.error");
                            }
                        });

                }, function () {
                    _dropUserFromAllianceInProgress = false;
                    //cancel
                });


        };
        this.onAllianceUserDroped = function (oldAllianceId, newConnectionUser, newPlanshetData) {
            _setNewPlanshet(newPlanshetData, true);

            console.log("onAllianceUserDroped", {
                oldAllianceId: oldAllianceId,
                newConnectionUser: newConnectionUser,
                newPlanshetData: newPlanshetData
            });

        };

        //#endregion


        //#region MyAlliance Tab    

        // #region Alliance Members

        function checkAmDataNotValid(allianceId, userName) {
            return !_chechAllianceIdIsMyAllianceId(allianceId) || !_checkUserNameIsValid(userName);
        }
        function _getAllianceMember(allianceId, userName) {
            if (checkAmDataNotValid(allianceId, userName)) return null;
            var data = $self.getMyAllianceMembers();
            if (data) {
                return _.find(data, function (o) {
                    return o.UserName === userName;
                });
            }
            return null;
        }
        function _getAllianceMemberByUserId(allianceId, userId) {
            if (!_chechAllianceIdIsMyAllianceId(allianceId)) return null;
            if (!_checkUserIdIsValid(userId)) return null;
            var data = $self.getMyAllianceMembers();
            if (data && data.Members && data.Members.length) {
                return _.find(data.Members, function (o) {
                    return o.UserId === userId;
                });
            }
            return null;
        }

        // #region Alliance Members status 
        function _updateAllianceMemberStatus(allianceMember, onlineStatus) {
            if (!allianceMember) return;
            mainHelper.applyTimeout(function () {
                allianceMember.OnlineStatus = onlineStatus;
            });
        }


        this.updateAllianceMemberStatusByUserName = function (allianceId, userName, onlineStatus) {
            _updateAllianceMemberStatus(_getAllianceMember(allianceId, userName), onlineStatus);
        };
        this.updateAllianceMemberStatusByUserId = function (allianceId, userId, onlineStatus) {
            _updateAllianceMemberStatus(_getAllianceMemberByUserId(allianceId, userId), onlineStatus);
        };
        // #endregion


        this.getMyAllianceMembers = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("AllianceMembers")) return data.AllianceMembers;
            return null;
        }

        this.getCurrentUserMemberFromMembers = function (members) {
            var uId = profileService.getCurrentUserId();
            var member = _.find(members, function (o) {
                return o.UserId === uId;
            });
            if (!member) throw new Error("user not exist");
            return member;

        };


        //#endregion   

        //#endregion

        //#region Module UserRequestsToAlliance

        function _getRequestsFromAllianceManage() {
            var data = $self.getManageTabData();
            if (data && data.hasOwnProperty("AllianceUserRequests") && data.AllianceUserRequests) return data.AllianceUserRequests;
            return null;
        }

        function _getAurCtrlScope() {
            var elem = angular.element("#my-alliance-requests");
            if (elem.scope) {
                var $scope = elem.scope();
                if ($scope && $scope.hasOwnProperty("aurCtrl")) return $scope;
            }
            return null;
        }

        function _getAmrCtrlScope() {
            var elem = angular.element("#alliance-manage-requests");
            if (elem.scope) {
                var $scope = elem.scope();
                if ($scope && $scope.hasOwnProperty("amrCtrl")) return $scope;
            }
            return null;
        }

        /**
     * 
     * @param {} isMyAllianceTab 
     * @param {} setTimeout 
     * @returns {} 
     */
        function _updateSectionHeight(isMyAllianceTab, setTimeout) {
            var $scope = isMyAllianceTab ? _getAurCtrlScope() : _getAmrCtrlScope();
            var deferred = $q.defer();

            function onDone() {
                $scope.$emit("dropElementContainer:changeHeight", { resolve: deferred.resolve });
            }

            var time = (setTimeout && $scope) ? 40 : 1;
            $timeout(function () {
                if ($scope) onDone();
                else deferred.reject("no scope");

            }, time);
            return deferred.promise;
        }

        this.getRequestsFromMyAlliance = function () {
            var data = $self.getMyAllianceData();
            if (data && data.hasOwnProperty("AllianceUserRequests")
                && data.AllianceUserRequests) return data.AllianceUserRequests;
            return null;
        }

        this.hasRequestsInMyAlliance = function () {
            //    console.log("hasRequestsInMyAlliance", !!getRequestsFromMyAlliance());
            return !!$self.getRequestsFromMyAlliance();
        };



        function _getBaseMessageModelInAllianceManage() {
            var curUserData = $self.$currentUserInfo;
            var allianceMessageModelExt = mf.AllianceMessageModelExt(true, curUserData.allianceRoleId, curUserData.allianceUserId);
            allianceMessageModelExt._setModel(MESSAGE_SOURCE_TYPE.IsAlliance, curUserData.allianceId, curUserData.allianceName, curUserData.allianceLabel.Icon);
            return allianceMessageModelExt;

        }

        function _getBaseMessageModelInMyAlliance() {
            var curUserData = $self.$currentUserInfo;
            var allianceMessageModelExt = mf.AllianceMessageModelExt(false, curUserData.allianceRoleId, curUserData.allianceUserId);
            allianceMessageModelExt._setModel(MESSAGE_SOURCE_TYPE.IsUser, curUserData.userId, curUserData.userName, curUserData.userAvatar.Icon);
            return allianceMessageModelExt;
        }

        function _getMessageModel(baseMessageModel, request) {
            var msg = baseMessageModel._clone();
            msg.Model._setTo(request.GroupId, request.GroupName);
            msg.Model.Message = "";
            return msg;
        }

        function _addNewRequestItem(allianceUserRequests, newDataArmModelExt, isMyAllianceTab, createBtns, onDone) {
            if (!(onDone instanceof Function)) {
                onDone = function () {
                    _updateMessageBlockedState(false);
                };
            }
            if (!allianceUserRequests || !allianceUserRequests.hasOwnProperty("Requests")) {
                onDone();
                if (SHOW_DEBUG) {
                    console.log({ allianceUserRequests: allianceUserRequests });
                    throw new Error("allianceService._addNewRequestItem : no allianceUserRequests");
                }
                else return;
            }

            if (typeof isMyAllianceTab !== "boolean") throw new Error("allianceService._addNewrequestItem : argument -isMyAllianceTab- is wrong ");
            var requests = allianceUserRequests.Requests;
            if (!requests) requests = allianceUserRequests.Requests = [];
            var m = newDataArmModelExt.Model;


            var groupId = null;
            var groupName = "";
            if (MESSAGE_SOURCE_TYPE.IsAlliance === m.SourceType && isMyAllianceTab || MESSAGE_SOURCE_TYPE.IsUser === m.SourceType && !isMyAllianceTab) {
                groupId = m.FromId;
                groupName = m.FromName;
            }

            else if (MESSAGE_SOURCE_TYPE.IsAlliance === m.SourceType && !isMyAllianceTab || MESSAGE_SOURCE_TYPE.IsUser === m.SourceType && isMyAllianceTab) {
                groupId = m.ToId;
                groupName = m.ToName;
            }
            else {
                if (SHOW_DEBUG) {
                    console.log({
                        allianceUserRequests: allianceUserRequests,
                        newDataArmModelExt: newDataArmModelExt,
                        isMyAllianceTab: isMyAllianceTab
                    });
                }
                throw new Error("condition is wrong");
            }

            var group = _.find(requests, function (o) {
                return o.GroupId === groupId;
            });

            if (!group) {
                var au = Utils.ModelFactory.AllianceUserRequestItem(groupName, groupId, [m], m.UserAccepted, m.AllianceAccepted);
                allianceUserRequests.LastUpdateTime = Utils.Time.GetUtcNow();
                requests.push(au);
                group = au;
            }
            else group.Messages.push(m);

            group.AllianceAccepted = m.AllianceAccepted;
            if (m.UserAccepted) group.UserAccepted = m.UserAccepted;
            if (createBtns instanceof Function) createBtns(group);
            if (group.dropable && group.dropable._closed === false) {
                _updateMessageBlockedState(true);
                $timeout(function () {
                    group.dropable.updateHeihgt(function () {
                        _updateSectionHeight(isMyAllianceTab, true)
                            .finally(function () {
                                console.log("group.dropable.updateHeihgt.finally");
                                _updateMessageBlockedState(false);
                                onDone();

                            });
                    });
                }, 10);

            }
            else onDone();

            console.log("_addNewRequestItem", {
                group: group,
                m: m,
                allianceUserRequests: allianceUserRequests
            });
        }

        function _checkRequestDataIsCorrect(request) {
            if (request && request.hasOwnProperty("GroupId")
                && typeof request.GroupId === "number"
                && request.hasOwnProperty("GroupName")
                && typeof request.GroupName === "string") return true;
            return false;
        }

        function _acceptJoinUserToAlliance(toAllianceId) {
            _updateMessageBlockedState(true);
            $self.$hub
                .requestAllianceAcceptJoinUserToAlliance(toAllianceId)
                .finally(function () {
                    console.log("allianceService._acceptJoinUserToAlliance.finally");
                    _updateMessageBlockedState(false);
                }).then(function (newAlliancePlanshet) {
                    _setNewPlanshet(newAlliancePlanshet, true);
                    console.log("newAlliancePlanshet", newAlliancePlanshet);
                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (msg === ErrorMsg.AllianceActionInBlockedState) {
                        var timeToDone = errorAnswer.data.TimeToDone;
                        allianceDialogHelper.errorUserCantJoinToAllianceBecauseInBlockedState(Utils.Time.Seconds2Time(timeToDone));
                    }
                    console.log("allianceService._acceptJoinUserToAlliance.errorAnswer", { msg: msg, errorAnswer: errorAnswer });
                    //error
                });
        }


        function _deleteRequestsFromPlanshet(data, groupId, isMyAllianceTab) {
            if (data && data.Requests && data.Requests.length) {
                _updateMessageBlockedState(true);
                mainHelper.applyTimeout(function () {
                    _.remove(data.Requests, function (o) {
                        return o.GroupId === groupId;
                    });
                    _updateSectionHeight(isMyAllianceTab, true).finally(function () {
                        _updateMessageBlockedState(false);
                    });
                });
            }
        }

        function _deleteRequestHistoryFromMyAlliance(groupId) {
            if (!groupId || typeof groupId !== "number") return;
            _deleteRequestsFromPlanshet($self.getRequestsFromMyAlliance(), groupId, true);
        };

        /**
        * толкьо для  my alliance
        * @param {int} toAllianceId 
        * @param {string} toAllianceName 
        * @param {object} $event 
        * @param {function} onSuccess 
        * @returns {void} 
        */
        this.requestDeleteRequestForUserToAlliance = function (toAllianceId, toAllianceName, $event, onSuccess) {
            allianceDialogHelper.openDialogDeleteUserRequestToAlliance(toAllianceName, function (updateBlockedState) {
                $self.$hub.requestAllianceDeleteRequestForUserToAlliance(toAllianceId)
                    .then(function (answer) {
                        if (answer) {
                            _deleteRequestHistoryFromMyAlliance(toAllianceId, true);
                            updateBlockedState(false);
                            if (onSuccess instanceof Function) onSuccess(answer);

                        }
                        else {
                            updateBlockedState(false);
                            throw new Error("requestDeleteRequestForUserToAlliance.Error");
                        }

                    }, function (errorAnswer) {
                        var msg = null;
                        if (errorAnswer) {
                            msg = Errors.GetMessage(errorAnswer);
                            console.log("requestDeleteRequestForUserToAlliance.errorAnswer", { msg: msg, errorAnswer: errorAnswer });
                        }
                        updateBlockedState(false);
                        throw new Error(errorAnswer);
                    });
            }, _updateMessageBlockedState, $event);
        };


        /**
         * 
         * @param {object} armModelExt  Utils.ModelFactory.AllianceMessageModelExt;
         * @param {Function} onSuccess 
         * @param {Function} onError 
         * @param {object} $event 
         * @returns {void} 
         */
        this.myAllianceRequestSendRequestMessage = function (armModelExt, onSuccess, onError, $event) {
            if (typeof armModelExt !== "object") throw new Error("AllianceMessageModelExt allianceService.myAllianceRequestSendRequestMessage argument armModelExt is wrong");
            allianceDialogHelper.openDialogSendMessage(armModelExt, function () {
                if (armModelExt.FromAlliance && !armModelExt.AllianceUserId || armModelExt.FromAlliance && !armModelExt.AllianceRoleId) {
                    console.log("myAllianceRequestSendRequestMessage.NOT PERMITION");
                    return;
                }
                if (armModelExt.Model.AllianceAccepted === 0) armModelExt.Model.AllianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                _updateMessageBlockedState(true);

                function always() {
                    _updateMessageBlockedState(false);
                }

                function onSuc(answer) {
                    if (onSuccess instanceof Function) onSuccess(answer);
                    console.log({ answer: answer });
                }

                function onErr(errorAnswer) {
                    var msg = Errors.GetMessage(errorAnswer);
                    if (!armModelExt.FromAlliance) {
                        if (msg === "YouInAlliance") {
                            allianceDialogHelper.errorUserInAlliance(getMyAllianceName())
                                .finally(always)
                                .then(function (okData) {
                                    console.log("allianceDialogHelper.errorUserInAlliance on ok", okData);
                                },
                                function (cancel) {
                                    console.log("allianceDialogHelper.errorUserInAlliance on cancel", cancel);
                                });
                        }
                        else allianceDialogHelper.errorJoinToAlliance(errorAnswer, armModelExt.Model.ToId, armModelExt.Model.ToName, $self);
                    }
                    else {
                        //todo  code heare
                    }

                    console.log({ errorAnswer: errorAnswer });
                }

                if (armModelExt.FromAlliance) $self.$hub.requestAllianceFromAllianceManageAddMessage(armModelExt).finally(always).then(onSuc, onErr);
                else $self.$hub.requestAllianceFromMyAllianceAddMessage(armModelExt).finally(always).then(onSuc, onErr);


            }, _updateMessageBlockedState, $event);
        };

        this.addNewRequetToMyAlliance = function (newDataArmModelExt) {
            var requests = $self.getRequestsFromMyAlliance();
            if (!requests) {
                if (SHOW_DEBUG) {
                    console.log({ requests: requests, newDataArmModelExt: newDataArmModelExt });
                    throw new Error("allianceService.addNewRequetToMyAlliance : no data");
                }
                else return;
            }
            _updateMessageBlockedState(true);
            mainHelper.applyTimeout(function () {
                _addNewRequestItem(requests, newDataArmModelExt, true, $self.createMyAllianceRequestBtns);
            });

        };

        this.addNewRequetToAllianceManage = function (newDataArmModelExt) {
            var requests = _getRequestsFromAllianceManage();
            if (!requests) {
                if (SHOW_DEBUG) throw new Error("allianceService.addNewRequetToAllianceManage : no data");
                else return;
            }
            _updateMessageBlockedState(true);
            mainHelper.applyTimeout(function () {
                _addNewRequestItem(requests, newDataArmModelExt, false, $self.createAllianceManageRequestBtns);
            });
        }

        this.onRequestAllianceConfirmAcceptFromAllianceManage = function (serverAllianceMessageModelExt, isRequestUser) {
            var allianceMessageModelExt = Utils.ModelFactory.AllianceMessageModelExt();
            allianceMessageModelExt._setFromData(serverAllianceMessageModelExt);
            if (isRequestUser) {
                $self.addNewRequetToMyAlliance(allianceMessageModelExt);
                $timeout(function () {
                    _updateMessageBlockedState(true);
                    var alName = allianceMessageModelExt.Model.FromName;
                    allianceDialogHelper
                        .onRequestAllianceConfirmAcceptToAllianceForUser(alName)
                        .finally(function () {
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.finally");
                            _updateMessageBlockedState(false);
                        })
                        .then(function (now) {

                            _acceptJoinUserToAlliance(allianceMessageModelExt.Model.FromId);
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.now", now);

                        }, function (late) {
                            console.log("onRequestAllianceConfirmAcceptToAllianceForUser.late", late);

                        });
                }, 100);

            }
            else $self.addNewRequetToAllianceManage(allianceMessageModelExt);
        };
        this.onRequestAllianceRejectRequestToAlliance = function (rejectUserId, isRequestUser, armModelExt) {
            console.log("onRequestAllianceRejectRequestToAlliance", {
                isRequestUser: isRequestUser,
                rejectUserId: rejectUserId,
                armModelExt: armModelExt,
            });
            if (isRequestUser) $self.addNewRequetToMyAlliance(armModelExt);
            else $self.deleteRequestHistoryFromAllianceManage(rejectUserId);

        };
        this.onDeleteAllianceRequestsByManager = function (allianceId, removerRequestUserId) {
            var data = $self.getMyAllianceData();
            if (data && data.Id === allianceId) {
                $self.deleteRequestHistoryFromAllianceManage(removerRequestUserId)
            }
        }

        this.createAllianceManageRequestBtns = function (requestItem) {
            if (requestItem.AllianceAccepted === ArmAllianceAcceptedStatus.Accept) {
                requestItem.ButtonsView = [];
                return requestItem.ButtonsView;
            }

            if (!requestItem.hasOwnProperty("ButtonsView")) {
                var bms = _getBaseMessageModelInAllianceManage();

                function always() {
                    _updateMessageBlockedState(false);
                }

                // #region Actions
                function createMessageToMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!_checkRequestDataIsCorrect(request)) return;

                    var armModelExt = _getMessageModel(bms, request);
                    _updateMessageBlockedState(true);
                    $self.myAllianceRequestSendRequestMessage(armModelExt, function (answer) {
                        console.log("createMessageToMember.succsess", answer);
                        $self.addNewRequetToAllianceManage(answer);
                    }, function (errorAnswer) {
                        //on error
                        console.log("createMessageToMember.errorAnswer", errorAnswer);
                        always();
                    }, $event);
                }

                function refuseMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!_checkRequestDataIsCorrect(request)) return;
                    _updateMessageBlockedState(true);
                    allianceDialogHelper.openDialogAllianceManageRefuseMemberRequest(request.GroupName, $event)
                        .finally(always)
                        .then(function () {
                            //ok
                            _updateMessageBlockedState(true);
                            $self.$hub
                                .requestAllianceRejectRequestToAlliance(request.GroupId)
                                .finally(always)
                                .catch(function (error) {
                                    var msg = "createAllianceManageRequestBtns.refuseMember.Error, request data";
                                    if (error) msg = Errors.GetHubMessage(error);
                                    console.log("createAllianceManageRequestBtns.refuseMember.Error, request data", {
                                        request: request,
                                        ErrorMsg: msg
                                    });

                                });
                        }, function () {
                            //cancel
                        });
                }

                function acceptMember(params, element, attrs, scope, $event) {
                    if (getMessageBlockedState()) return;
                    var request = params.request;
                    if (!request) return;
                    _updateMessageBlockedState(true);
                    var armModelExt = _getMessageModel(bms, request);
                    $self.$hub
                        .requestAllianceConfirmAcceptFromAllianceManage(armModelExt)
                        .finally(always)
                        .then($self.onRequestAllianceConfirmAcceptFromAllianceManage, function (errorAnswer) {
                            var msg = Errors.GetHubMessage(errorAnswer);
                            if (msg === ErrorMsg.UserInAlliance) {
                                allianceDialogHelper
                                    .errorAllianceManageTargetUserInAlliance(armModelExt.Model.ToName)
                                    .then(function () {
                                        $self.deleteRequestHistoryFromAllianceManage(request.GroupId);
                                    }, function (cancel) {
                                        console.log("cancel", cancel);
                                    });
                            }
                            console.log("onRequestAllianceConfirmAcceptFromAllianceManage.Error", {
                                errorAnswer: errorAnswer
                            });

                        });

                }

                // #endregion

                GameServices.paralaxButtonHelper.createAllianceManageUserRequestBtns(requestItem, createMessageToMember, refuseMember, acceptMember, ArmAllianceAcceptedStatus);
            }
            return requestItem.ButtonsView;
        };

        this.createMyAllianceRequestBtns = function (requestItem) {
            var bms = _getBaseMessageModelInMyAlliance();

            function always() {
                _updateMessageBlockedState(false);
                console.log("createMyAllianceRequestBtns.always");
            }

            function createMsg(params, element, attrs, scope, $event) {
                console.log("createMyAllianceRequestBtns.createMsg", {
                    params: params,
                    requestItem: requestItem,
                    getMessageBlockedState: getMessageBlockedState(),
                    bms: bms
                });
                if (getMessageBlockedState()) return;
                var request = params.request;
                if (!_checkRequestDataIsCorrect(request)) return;
                var armModelExt = _getMessageModel(bms, request);
                _updateMessageBlockedState(true);
                $self.myAllianceRequestSendRequestMessage(armModelExt, function (answer) {
                    if (!answer) throw new Error("allianceService.myAllianceRequestSendRequestMessage no answer");
                    $self.addNewRequetToMyAlliance(answer);
                }, function (errorName) {
                    //on error
                    always();
                }, $event);
            }

            function removeRequest(params, element, attrs, scope, $event) {
                var request = params.request;
                if (!_checkRequestDataIsCorrect(request)) return;
                _updateMessageBlockedState(true);
                $self.requestDeleteRequestForUserToAlliance(request.GroupId, request.GroupName, $event, function () {
                    _updateSectionHeight(true, true);
                });
            }

            function joinToAlliance(params, element, attrs, scope, $event) {
                if (getMessageBlockedState()) return;
                var request = params.request;
                var toAllianceId = request.GroupId;
                _acceptJoinUserToAlliance(toAllianceId);
            }

            GameServices.paralaxButtonHelper.getOrCreateMyAllianceRequestBtns(requestItem, createMsg, removeRequest, joinToAlliance);
            return requestItem.ButtonsView;

        };

        this.sendRequestJoinToAlliance = function (serverParams, element, attrs, $scope, $event) {
            if (serverParams
                && serverParams.hasOwnProperty("Id")
                && serverParams.Id
                && serverParams.hasOwnProperty("AllianceName")
                && serverParams.AllianceName) {
                var curUserInfo = $self.$currentUserInfo;
                if (!isNpcAllianceName(curUserInfo.allianceName)) {
                    allianceDialogHelper.errorUserInAlliance(curUserInfo.allianceName);
                    return;
                }

                var targetAllianceId = serverParams.Id;
                var targetAllianceName = serverParams.AllianceName;

                // todo  chech existing request
                //allianceDialogHelper.errorUserToAllianceRequestExist(targetAllianceName);

                if (!curUserInfo.userName
                    || !curUserInfo.userId
                    || !curUserInfo.userAvatar
                    || !targetAllianceId
                    || !targetAllianceName
                    || !curUserInfo.allianceRoleId
                    || !curUserInfo.userAvatar.Icon) {
                    console.log("requestJoinToAlliance.error input data incorrect");
                    return;
                }

                var armModelExt = Utils.ModelFactory.AllianceMessageModelExt(false, curUserInfo.allianceRoleId, curUserInfo.allianceUserId);
                armModelExt._setModel(MESSAGE_SOURCE_TYPE.IsUser, curUserInfo.userId, curUserInfo.userName, curUserInfo.userAvatar.Icon);
                armModelExt.Model._setTo(targetAllianceId, targetAllianceName);
                armModelExt.Model.AllianceAccepted = ArmAllianceAcceptedStatus.NoAction;
                $self.myAllianceRequestSendRequestMessage(armModelExt,
                    function (answer) {
                        $self.addNewRequetToMyAlliance(answer, curUserInfo.userName);
                        allianceDialogHelper.openDialogJoinMessageSended(targetAllianceName);
                    },
                    function (errorAnswer) {
                        console.log("sendRequestJoinToAlliance.myAllianceRequestSendRequestMessage.errorAnswer", errorAnswer);
                    }, $event);
            }
        };

        this.deleteRequestHistoryFromAllianceManage = function (requestUserId) {
            if (typeof requestUserId !== "number") return;
            _deleteRequestsFromPlanshet(_getRequestsFromAllianceManage(), requestUserId, false);
        };

        /**
         * когда пользователь приседеняется к альянсу (на сервере уже добавленн)
         * обновляет информацию о количетве пользователей и создает запрос на удаление пеерписки пользователя и альянс менеджера
         * @param {object } newAllianceMembers see c# List<AllianceMember>
         * @param {object} $$RootScope 
         * @returns {void} 
         */
        this.allianceAddNewUsersToAlliane = function (newAllianceMembers, $$RootScope) {
            var data = $self.getMyAllianceData();
            if (data
                && data.hasOwnProperty("AllianceMembers")
                && data.AllianceMembers.hasOwnProperty("Members")
                && data.AllianceMembers.Members) {
                _.forEach(newAllianceMembers, function (newMember, idx) {
                    var tryFindUser = _.find(data.AllianceMembers.Members, function (o) {
                        return o.UserId === newMember.UserId;
                    });
                    if (!tryFindUser) {
                        data.AllianceMembers.Members.push(newMember);
                        //   data.PvpPoint += newMember.UserPvp;
                        data.Pilots++;
                        data.ComplexButtonView.Collection[1].Data.Pilots = data.Pilots;
                        // data.ComplexButtonView.Collection[1].Data.PvpPoint = data.PvpPoint;
                    }

                });

                var deleteMessages = false;
                var role = $self.Role.getRoleByName(data.AllianceMembers.CurrentUserRoleName);
                if (role && role.AcceptNewMembers) deleteMessages = true;
                if (deleteMessages) {
                    _.forEach(newAllianceMembers, function (newMember, idx) {
                        $self.deleteRequestHistoryFromAllianceManage(newMember.UserId);
                    });
                }

            }
            $$RootScope.$broadcast("alliance:user-join-to-alliance", {
                AllianceData: data
            });

        };
        /**
         * обертка над this.allianceAddNewUsersToAlliane  делает из олного эллемента масив
         * @param {object} newAllianceMember   see c# AllianceMember
         * @param {object} $$RootScope 
         * @returns {void} 
         */
        this.allianceAddNewUserToAlliane = function (newAllianceMember, $$RootScope) {
            $self.allianceAddNewUsersToAlliane([newAllianceMember], $$RootScope);
        };

        /**
         * срабатывает когда пользователь выходит из состава альянса
         * @param {int} leftUserId 
         * @param {int} leftAllianceId 
         * @param {object} $$RootScope 
         * @returns {void}   0
         */
        this.onAllianceUserLeftAlliance = function (leftUserId, leftAllianceId, $$RootScope) {
            console.log("aService.onAllianceUserLeftAlliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId,
            });
            profileService.removeOtherProfileByUserId(leftUserId);
            var data = $self.getMyAllianceData();
            if (data
                && data.Id === leftAllianceId
                && data.hasOwnProperty("AllianceMembers")
                && data.AllianceMembers.hasOwnProperty("Members")
                && data.AllianceMembers.Members) {
                var tryFindUser = _.find(data.AllianceMembers.Members, function (o) {
                    return o.UserId === leftUserId;
                });
                if (tryFindUser) {
                    console.log("aService.onAllianceUserLeftAlliance.tryFindUser", {
                        leftUserId: leftUserId,
                        leftAllianceId: leftAllianceId,
                        data: data,
                        "data.PvpPoint": data.PvpPoint,
                        "data.Pilots": data.Pilots,
                    });
                    //                    var newPvp = data.PvpPoint - tryFindUser.UserPvp;
                    //                    if (newPvp < 0) newPvp = 0;
                    //                    data.PvpPoint = newPvp;
                    data.Pilots--;
                    data.ComplexButtonView.Collection[1].Data.Pilots = data.Pilots;
                    //  data.ComplexButtonView.Collection[1].Data.PvpPoint = data.PvpPoint;

                    _.remove(data.AllianceMembers.Members, function (o) {
                        return o.UserId === leftUserId;
                    });
                }
            }

            console.log("aService.onAllianceUserLeftAlliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId,
                $$RootScope: $$RootScope
            });

            $$RootScope.$broadcast("alliance:user-left-from-alliance", {
                leftUserId: leftUserId,
                leftAllianceId: leftAllianceId
            });


        };


        //#endregion

        //#region ManageTab 
        this.getManageTabData = function () {
            var data = getBodyByIdx(2);
            if (data) return data.TemplateData;
            return null;
        };;
        //#endregion


        //#region DisbandAlliance
        var disbandInProgress = false;
        this.onAllianceDisbanded = function (disbandedAlianceId, currentConnectionUser, newPlanshetData) {
            removeAllianceNameFromLocal(disbandedAlianceId);
            if (currentConnectionUser) {
                _setNewPlanshet(newPlanshetData, true);
                //console.log("onAllianceDisbanded.isCurrentConnectionUser", {
                //    currentConnectionUser: currentConnectionUser,
                //    newPlanshetData: newPlanshetData,
                //    allianceId: allianceId
                //});
            }
            else {
                profileService.removeProfilesByAllianceId(disbandedAlianceId);
                //todo очистить косвенные данные с альянсом по ид реквесты поиски итп
            }
        };

        this.disbandAlliance = function (serverParams, element, attrs, $scope, $event) {
            if (disbandInProgress) return;
            // ReSharper disable once FunctionsUsedBeforeDeclared
            var userInfo = $self.$currentUserInfo;
            var allianceId = userInfo.allianceId;
            if (!allianceId) {
                console.log("alliance id not exist", $self.getMyAllianceData());
                return;
            }
            if (!$self.Role.roleNativeNames.equal($self.Role.roleNativeNames.CreatorId, userInfo.allianceRoleId)) return;


            allianceDialogHelper.openDialogDisbandAlliance(userInfo.allianceName, $event)
                .then(function () {
                    disbandInProgress = true;
                    var hub = $self.$hub;
                    hub.allianceDisbandAlliance()
                        .finally(function () {
                            disbandInProgress = false;
                        }).then(function (isOk) {
                            console.log("onAllianceDisbanded.isOk", isOk);
                        }, function (errorAnswer) {
                            console.log("disbandAlliance.errorAnswer", errorAnswer);
                        });
                }, function () {
                    //cancel
                });



        };

        //#endregion

        //#region CreateAlliance
        var _allianceCreateMessages = null;
        this.allianceCreateMessages = function () {
            if (_allianceCreateMessages) return _allianceCreateMessages;
            var allianceCreatePrice = 100;
            var endMsgPrice = " " + allianceCreatePrice + " CC";
            var cls = Utils.CreateLangSimple;
            _allianceCreateMessages = {
                allianceCreatePrice: allianceCreatePrice,
                trCreateAlliance: cls("EN Create alliance",
                    "ES Create alliance",
                    "RU Create alliance"),
                trAllianceTitlle: cls("EN Allaince name",
                    "ES Allaince name",
                    "RU Allaince name"),
                trCreate: cls("Create", "Crear", "Создать"),
                trErrorMsg: {
                    required: cls("en is required",
                        "es is required",
                        "ru is required"),
                    minlength: cls("en min minlength = 5",
                        "es min minlength = 5",
                        "ru min minlength = 5"),
                    maxlength: cls("en max maxlength = 12",
                        "es max maxlength = 12",
                        "ru max maxlength = 12"),
                    pattern: cls("en uppercase no spase first is letter end is letter or number",
                        "es uppercase no spase first is letter end is letter or number",
                        "ru uppercase no spase first is letter end is letter or number"),
                    notUnic: cls("EN Name not unic",
                        "ES Name not unic",
                        "RU Name not unic"),
                    notChecked: cls("EN not checked",
                        "ES not checked",
                        "RU not checked")

                },
                trMsgCanBuy: {
                    trCanBuy: cls("en Стоимость лицензии составляет :" + endMsgPrice,
                        "es Стоимость лицензии составляет :" + endMsgPrice,
                        "ru Стоимость лицензии составляет :" + endMsgPrice),
                    trError: cls("en На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice,
                        "es На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice,
                        "ru На вашем балансе недостаточно средств стоимость лицензии составляет :" + endMsgPrice)
                },
                trConfirm: {
                    trTitle: cls("EN Вы создаете альянс : ",
                        "ES Вы создаете альянс : ",
                        "RU Вы создаете альянс : "),
                    trConfirm: cls("Confirm",
                        "Confirmar",
                        "Подтвердить"),
                    trCancel: cls("Cancel",
                        "Cancelar",
                        "Отменить"),
                    trTextContent: cls("en C вашего счета будет списанно " + endMsgPrice,
                        "es C вашего счета будет списанно " + endMsgPrice,
                        "ru C вашего счета будет списанно " + endMsgPrice)
                },
                trConfirmGc: {
                    trTitle: cls("EN Congratulations!",
                        "ES Congratulations!",
                        "RU Congratulations!"),
                    trHtmlContent: function (allianceName) {
                        var tr = cls("EN Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.",
                            "ES Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.",
                            "RU Теперь вы лидер альянса  - " + setSpanText(allianceName, " unique-name ") + " для завершения настройки передйтите в раздел управления.");
                        return tr.getCurrent();

                    }
                },
                trCheck: cls("EN Check", "ES Check", "RU Check")
            };
            return _allianceCreateMessages;
        };

        this.checkNameIsUnic = function (checkName, onSucsess, onError, nameUppered) {
            if (!checkName) onSucsess(false);
            if (checkName.length < 5) onSucsess(false);
            if (!nameUppered) checkName = checkName.toUpperCase();
            if (allianceNameIsExist(checkName)) {
                onSucsess(false);
                return;
            }

            $self.$hub
                .allianceCheckAllianceNameIsUnic(checkName)
                .then(function (answer) {
                    if (typeof answer === "boolean") {
                        onSucsess(answer);
                        return;
                    }
                    else if (answer.hasOwnProperty("Id") && answer.hasOwnProperty("Name")) {
                        addAllianceNameToLocal(answer);
                        onSucsess(false);
                        return;
                    }
                    else if (!answer) onSucsess(false);

                }, function (errorAnswer) {
                    var errMsg = Errors.GetHubMessage(errorAnswer);
                    if (onError instanceof Function) onError(errMsg);

                });

        };
        this.canCreateAlliance = function canCreateAlliance() {
            var mdata = $self.getMyAllianceData();
            return isNpcAllianceName(mdata.Name);
        };
        this.createAlliance = function (checkedAllianceName, nameUppered, onSucsess, onError, resourceService) {
            if (!nameUppered) checkedAllianceName = checkedAllianceName.toUpperCase();
            var hub = $self.$hub;
            hub.allianceCreateAlliance(checkedAllianceName)
                .then(function (answer) {
                    var connUser = answer["ConnectionUser"];
                    hub._updateCurrentUser(connUser);
                    _setNewPlanshet(answer["NewAlliancePlanshet"], true);
                    addAllianceNameToLocal({
                        Id: connUser.AllianceId,
                        Name: connUser.AllianceName
                    });
                    resourceService.setCc(answer["NewBalanceCc"]);
                    if (onSucsess instanceof Function) onSucsess(connUser.AllianceName);

                    console.log("createAlliance answer", answer);
                }, function (errorAnswer) {
                    var errMsg = Errors.GetHubMessage(errorAnswer);
                    if (onError instanceof Function) onError(errMsg);
                });
        };


        //#endregion

        // #region Edit alliance


        this.setEditAllianceInfoModelToScope = function (allianceEditInfoCtrl, scope, skipParent) {

            var myAllianceData = $self.getMyAllianceData();
            var translate = $self._allianceTranslate;

            var cb = GameServices.paralaxButtonHelper.ComplexButtonView();
            cb.SimpleCentr(null, "Edit info");

            function _blockState(val) {
                planshetService.setInProgress(val);
                _updateMessageBlockedState(val);
            }

            var tax = statisticHelper.createStatItemModel(translate.tax, myAllianceData.TaxView + "");
            tax.hasOnclick = true;
            tax.onClick = function ($event) {
                if (getMessageBlockedState() || planshetService.getInProgress()) return;
                _blockState(true);
                EM.Audio.GameSounds.dialogOpen.play();
                allianceDialogHelper
                    .openDialogChengeTax(myAllianceData.Tax, $event)
                    .then(function (newTax) {
                        if (_.endsWith(newTax, "%")) newTax = newTax.substr(0, newTax.length - 1);
                        var _tax = _.toInteger(newTax);
                        if (_tax === myAllianceData.Tax) {
                            _blockState(false);
                            return;
                        }
                        if (_tax < 0) _tax = 0;
                        else if (_tax > 100) _tax = 100;
                        _blockState(false);
                        $self.$hub.allianceInfoUpdateTax(_tax);
                        EM.Audio.GameSounds.dialogClose.play();

                    }, function () {
                        EM.Audio.GameSounds.dialogClose.play();
                        _blockState(false);
                        //cancel
                    });

                console.log("on click by tax ", { $event: $event });
            }

            var stats = [tax];
            var bgImage = statisticHelper.createBgImage("", myAllianceData.Name);
            bgImage.url = myAllianceData.Label.Detail;
            bgImage.style = { backgroundImage: Utils.CssHelper.SetUrl(bgImage.url) };
            bgImage.setTemplate("alliance-change-label.tmpl");
            statisticHelper.resizePictire(bgImage.style, bgImage.url);

            var description = {
                text: myAllianceData.AllianceDescription,
                activateEdit: false,
                mediumBindOptions: {
                    toolbar: false,
                    disableEditing: true,
                    placeholder: false
                }
            };
            function broadCastMe(disableEditing) {
                description.mediumBindOptions.disableEditing = disableEditing;
                if (disableEditing) description.mediumBindOptions.toolbar = false;
                //else mediumBindOptions.toolbar = { buttons: ["removeFormat", "bold", "italic", "underline", "h1", "h2", "h3"] };
                else description.mediumBindOptions.toolbar = {
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
                scope.aeiCtrl.description = description;
                scope.$broadcast("mediumEditor:update-option", description.mediumBindOptions);
            }

            description.setActivate = function (avtivate) {
                mainHelper.applyTimeout(function () {
                    description.activateEdit = avtivate;
                    broadCastMe(!avtivate);
                });

            };

            description.resetDescription = function () {
                description.text = myAllianceData.AllianceDescription;
                description.setActivate(false);
                EM.Audio.GameSounds.defaultButtonClose.play();
            };
            description.sendDescription = function (params, element, attrs, $scope, $event) {
                if (GameServices.planshetService.getInProgress()) return;

                var hasChange = typeof description.text === "string" && myAllianceData.AllianceDescription !== description.text;
                if (hasChange) {

                    if (description.text.length <= maxLenghtConsts.AllianceDescription) {
                        _blockState(true);
                        $self.$hub.allianceInfoUpdateDescription(description.text)
                            .finally(function () {
                                _blockState(false);
                            })
                            .then(function (answer) {
                                myAllianceData.AllianceDescription = answer.Description;
                                description.text = answer.Description;
                                description.setActivate(false);
                                $self.onAllianceInfoUpdateDescription(answer.Description, answer.Id);
                                EM.Audio.GameSounds.defaultButtonClose.play();

                            }, function (errorAnswer) {
                                var msg = Errors.GetHubMessage(errorAnswer);
                                if (msg === ErrorMsg.OverMaxLength) {
                                    console.log("msg === ErrorMsg.OverMaxLength  (message lenght > 600)");
                                }
                                else if (msg === ErrorMsg.NotPermitted) {
                                    console.log("msg === ErrorMsg.NotPermitted  not has edit role in alliance");
                                }
                                description.resetDescription();
                                console.log("msg", { msg: msg, errorAnswer: errorAnswer });
                            });

                    }
                    else {
                        allianceDialogHelper.errorDescriptionOverMaxLength($event, description.text.length).finally(description.resetDescription);
                    }
                }
                else description.resetDescription();

            };

            var buttons = {
                edit: GameServices.paralaxButtonHelper.ButtonsView(),
                send: GameServices.paralaxButtonHelper.ButtonsView(),
                cancel: GameServices.paralaxButtonHelper.ButtonsView()
            };

            buttons.edit.ConstructorSizeBtn(1, true, $self._commonTranslate.edit, function () {
                console.log(" buttons.edit.ConstructorSizeBtn", {
                    getInProgress: GameServices.planshetService.getInProgress(),
                    buttons: buttons,
                    scope: scope
                });
                if (GameServices.planshetService.getInProgress()) return;
                EM.Audio.GameSounds.defaultButtonClick.play();
                description.setActivate(true);
            });
            buttons.send.ConstructorSizeBtn(2, true, $self._commonTranslate.send, description.sendDescription);
            buttons.cancel.ConstructorSizeBtn(2, true, "Cancel", description.resetDescription);


            allianceEditInfoCtrl.description = description;
            allianceEditInfoCtrl.Buttons = buttons;


            allianceEditInfoCtrl.complexButtonView = cb;
            allianceEditInfoCtrl.onClickCb = function ($event) {
                scope.dropElementonClickByDropable(skipParent);
              //  console.log("setEditAllianceInfoModelToScope.$event", { $event: $event, scope: scope });
            };
            allianceEditInfoCtrl.allianceStatsModel = statisticHelper.createStatisticModel(stats, bgImage);

            description.setActivate(false);

        }

        this._updateAllianceInfo = function (_oldAllianceData, newAllianceData) {
            if (!newAllianceData || !_oldAllianceData) return null;
            var a = newAllianceData;
            var cb0 = _oldAllianceData.ComplexButtonView.Collection[0];
            var cb1 = _oldAllianceData.ComplexButtonView.Collection[1];
            var cb2 = _oldAllianceData.ComplexButtonView.Collection[2];
            mainHelper.applyTimeout(function () {
                if (_oldAllianceData.Id !== a.Id) {
                    _oldAllianceData.Id = a.Id;
                }
                if (_oldAllianceData.LeaderName !== a.LeaderName) {
                    _oldAllianceData.LeaderName = a.LeaderName;
                }
                if (_oldAllianceData.Tax !== a.Tax) {
                    _oldAllianceData.Tax = a.Tax;
                    _oldAllianceData.TaxView = a.Tax + "%";
                }
                if (_oldAllianceData.AllianceDescription !== a.AllianceDescription) {
                    _oldAllianceData.AllianceDescription = a.AllianceDescription || "";
                }
                if (!_.isEqual(_oldAllianceData.Label, a.Label)) {
                    Utils.UpdateObjData(_oldAllianceData.Label, a.Label);
                }
                if (!_.isEqual(_oldAllianceData.LeaderImg, a.LeaderImg)) {
                    Utils.UpdateObjData(_oldAllianceData.LeaderImg, a.LeaderImg);
                }
                if (_oldAllianceData.Pilots !== cb1.Pilots !== cb1.Data.Pilots !== a.Pilots) {
                    _oldAllianceData.Pilots = cb1.Pilots = cb1.Data.Pilots = a.Pilots;
                }
                if (_oldAllianceData.PvpPoint !== cb1.PvpPoint !== cb1.Data.PvpPoint !== a.PvpPoint) {
                    _oldAllianceData.PvpPoint = cb1.PvpPoint = cb1.Data.PvpPoint = a.PvpPoint;
                }
                if (_oldAllianceData.Name !== cb0.Title !== cb0.Data.Title !== cb1.Name !== cb1.Data.Name !== cb2.Title !== a.Name) {
                    _oldAllianceData.Name = cb0.Title = cb0.Data.Title = cb1.Name = cb1.Data.Name = cb2.Title = a.Name;
                }

                if (_oldAllianceData.ControlledPlanet !== cb1.ControlledPlanet !== cb1.Data.ControlledPlanet !== a.ControlledPlanet) {
                    _oldAllianceData.ControlledPlanet = cb1.ControlledPlanet = cb1.Data.ControlledPlanet = a.ControlledPlanet;
                }
                if (cb0.ImagePathOrCss !== cb0.Data.ImagePathOrCss !== newAllianceData.Label.Icon) {
                    cb0.ImagePathOrCss = cb0.Data.ImagePathOrCss = newAllianceData.Label.Icon;
                }
                if (cb2.ImagePathOrCss !== cb2.Data.ImagePathOrCss !== newAllianceData.LeaderImg.Icon) {
                    cb2.ImagePathOrCss = cb2.Data.ImagePathOrCss = newAllianceData.LeaderImg.Icon;

                }


            });
            if ($self.isCurrentModel()) updatePlanshet();
            return _oldAllianceData;
        }



        /**
         * срабатывает когда пользователь обновил лейбл альянса   (на сервере данные уже обновленны)
         * @param {object} newUserImageModel  see    Utils.ModelFactory.IUserImageModel;
         * @param {int} allianceId 
         * @returns {void}
         */
        this.onAllianceInfoUpdateLabel = function (newUserImageModel, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.Label = newUserImageModel;
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);

        };
        /**
         * когда пользователь обновил описание альянса   (на сервере данные уже обновленны)
         * @param {string} newDescription 
         * @param {int} allianceId 
         * @returns {void} 
         */
        this.onAllianceInfoUpdateDescription = function (newDescription, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.AllianceDescription = newDescription;
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);
        };
        /**
         *  когда пользователь обновил налог альянса (на сервере данные уже обновленны)
         * @param {int} newTax 
         * @param {int} allianceId 
         * @returns {void} 
         */
        this.onAllianceInfoUpdateTax = function (newTax, allianceId) {
            var myAllianceData = $self.getMyAllianceData();
            if (!myAllianceData || myAllianceData.Id !== allianceId) return;
            myAllianceData.Tax = newTax;
            myAllianceData.TaxView = newTax + "%";
            $self._updateAllianceInfo(myAllianceData, myAllianceData);
            var ai = getAlianceItemInList(allianceId);
            $self._updateAllianceInfo(ai, myAllianceData);
            profileService.updateAllianceInfoInProfiles(myAllianceData);
        };



        // #endregion

        // #region Tech

        this.getAllianceTechModel = function () {
            var mad = $self.getMyAllianceData();
            if (!mad) return null;
            return mad.AllianceTechesOut;

        };

        var _updateTechRequestInProgress = false;



        this.$updateTechConditionIfTechUpdate = function (teches, newTech) {
            if (!newTech.Progress.Level) return;
            if (newTech.NativeName === "TechDamageControl" || newTech.NativeName === "TechWeaponUpgrade") {
                _.forEach(teches, function (techItem, key) {
                    if (!techItem.Disabled) return;
                    if (techItem.Conditions[newTech.NativeName] <= newTech.Progress.Level) {

                        var secondKey = newTech.NativeName === "TechWeaponUpgrade" ? "TechDamageControl" : "TechWeaponUpgrade";
                        var secondCondition = techItem.Conditions[secondKey] <= teches[secondKey].Progress.Level;
                        if (secondCondition) {
                            techItem.Disabled = false;
                        }
                    }

                });
            }



        };
        this.$prepareTechItem = function (myAllianceData, techItem) {
            if (!techItem.infoStatsModel) {
                var props = techItem.Progress.Advanced;
                var stats = [];
                _.forEach(props, function (val, key) {
                    var propVal = val.CurrentValue;
                    if (key !== "Level" && propVal) {
                        propVal = _.round(propVal, 2);
                        propVal += "%";
                    }
                    stats.push(statisticHelper.createStatItemModel(val.PropertyName, propVal));
                });
                var img = statisticHelper.createBgImage(techItem.SpriteImages.Detail, techItem.Text.Name);
                img.onClick = function ($event) {
                    GameServices.techTreeHelper.createTechTreeDialog($event, true);
                };
                techItem.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
            }
            if (!techItem.$getCanUpgrade) {
                techItem.$getCanUpgrade = function () {
                    return myAllianceData.AllianceTechesOut.CanUpgrade;
                };
            }
            if (myAllianceData.AllianceTechesOut.CanUpgrade && !techItem.Disabled && !techItem.$controls) {
                techItem.$controls = {
                    buyBtn: GameServices.paralaxButtonHelper.ButtonsView()
                        .ConstructorSizeBtn(1, true, "Upgrade (" + techItem.BasePrice.Cc + " Alliance CC)", function (params, element, attrs, $buttonScope, $event) {
                            if (_updateTechRequestInProgress) return;
                            if (techItem.BasePrice.Cc > myAllianceData.BalanceCc) return;
                            if (!myAllianceData.AllianceTechesOut.CanUpgrade) {
                                allianceDialogHelper.openDialogNotPermitted($event).then(function () {
                                    techItem.$controls = null;
                                    delete techItem.$controls;
                                });
                                return;
                            }

                            var nextLevelTech = techItem.Progress.Level + 1;
                            _updateTechRequestInProgress = true;
                            allianceDialogHelper.openDiaologConfirmTechUpgrade($event, techItem.Text.Name, nextLevelTech)
                                .then(function () {
                                    //confirmed

                                    var techName = techItem.Text.Name;
                                    $self.$hub.allianceUpdateAllianceTech(techItem.TechType).then(function (answer) {
                                        console.log("allianceUpdateAllianceTech answer");
                                        allianceDialogHelper.openDiaologTechUpgraded($event, techName, nextLevelTech);
                                        _updateTechRequestInProgress = false;
                                    }, function (errorAnswer) {
                                        var msg = Errors.GetHubMessage(errorAnswer);
                                        _updateTechRequestInProgress = false;
                                        if (msg === ErrorMsg.NotPermitted) {
                                            allianceDialogHelper.openDialogNotPermitted($event);
                                        }
                                        else if (msg === ErrorMsg.NotEnoughCc) {
                                            //open dialog NotEnoughCc alliance cc
                                            throw new Error("ErrorMsg.NotEnoughCc");
                                        }
                                        else {
                                            throw Errors.ClientNotImplementedException({
                                                errorAnswer: errorAnswer,
                                                msg: msg,
                                                techItem: techItem,
                                                myAllianceData: myAllianceData
                                            });
                                        }
                                    });

                                });

                            console.log("buyBtn", {
                                techModel: myAllianceData.AllianceTechesOut,
                                techItem: techItem
                            });
                        })
                };
            }
        };
        this.prepareTechList = function (myAllianceData) {
            //StatModel
            var list = [];
            _.forEach(myAllianceData.AllianceTechesOut.Teches, function (techItem) {
                $self.$prepareTechItem(myAllianceData, techItem);
                list.push(techItem);
            });

            return list;

        };
        this.onAllianceTechUpdated = function (updatedTechItem, newAllianceBalanceCc, $$RootScope) {
            //todo code heare
            var data = $self.getMyAllianceData();
            data.BalanceCc = newAllianceBalanceCc;
            $self.$updateTechConditionIfTechUpdate(data.AllianceTechesOut.Teches, updatedTechItem);
            _.forEach(data.AllianceTechesOut.Teches, function (oldItem, key) {
                if (oldItem.TechType === updatedTechItem.TechType) {
                    data.AllianceTechesOut.Teches[key] = updatedTechItem;
                    return false;
                }
            });
            $$RootScope.$broadcast("alliance:tech-updated", { newTech: updatedTechItem, myAllianceData: data });

        };

        // #endregion

        //#region Other


        this.getAllianceItemCompexBtnConfig = function (allianceId) {
            return _.find($self.getAllianceList(), { Id: allianceId }).ComplexButtonView;
        };
        this.setInitialAlliance = function (initialAllianceModel) {
            _setNewPlanshet(initialAllianceModel);
        };
        this.setAllianceNames = function (names) {
            allianceNames = [];
            _.forEach(names, function (val, idx) {
                allianceNames.push(Utils.ModelFactory.IAllianceNameSerchItem(val));
            });
            $self._allianceTotalCount = names.length;
        };
        this.initializeScroll = function (bodyElement) {

            var opts = $self._scrollerOptions;
            opts.HtmlElementToBind = bodyElement;
            opts.GetTotalServerCountPromise = getTotalAllianceServerItems;
            opts.GetItemsCollection = $self.getAllianceList;
            opts.GetMinIdOrCondition = getMinAlliancePoint;
            opts.GetPage = getAlliancePage;
            opts.SaveAndSetItem = saveNewAllianceItem;
            scrollerHelper.initializeScroll($self._scrollerOptions);
        };

        this.onOtherUserConnected = function (otherUserId, unkAllianceId, totalOnlineCount) {
            if (unkAllianceId === $self.getMyAllianceId()) $self.updateAllianceMemberStatusByUserId(unkAllianceId, otherUserId, true);
        };
        this.onUserLeftGame = function (disconnectedConnectionUser) {
            var u = disconnectedConnectionUser;
            if ($self.$hub.isValidUserData(u)) {
                $self.updateAllianceMemberStatusByUserId(u.AllianceId, u.UserId, false);
            }
        }


        this.onUserUpdateAvatar = function (newAvatar, userId, allianceId) {
            var data = $self.getMyAllianceData();
            if (data) {
                var member = _getAllianceMemberByUserId(allianceId, userId);
                if (member && member.UserName === data.LeaderName) {
                    data.LeaderImg = newAvatar;
                    data.ComplexButtonView.Collection[2].Data.ImagePathOrCss = newAvatar.Icon;
                    if ($self.isCurrentModel()) updatePlanshet();
                }
            }
        }
        this.onLocalUserUpdateAvatar = function (newAvatar) {
            var data = $self.$currentUserInfo;
            if (data) $self.onUserUpdateAvatar(newAvatar, data.userId, data.allianceId);
        }

        //#endregion


    }
]);
Utils.CoreApp.gameApp.service("bookmarkService", [
    "planshetService", "tabService", "mapInfoService", "mainHelper", "bookmarkDialogHelper","gameChestService",
function (planshetService, tabService, mapInfoService, mainHelper, $bdH,gameChestService) {
        // todo  передалать методы под хаб
        var $self = this;
        this.$bdH = $bdH;

        var bookmarkUniqueId;
        var bookmarksData;
        var baseBookmarkLimit = 100;
        var premiumBookmarkLimitMod;


        var bodyTabIdx = {
            planet: 0,
            system: 1,
            sector: 2
        };


        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });


        //#region Helpers
        function updatePlanshet(advancedAction) {
            planshetService.updatePlanshet(advancedAction);
        };

        function orderById(collection, directionAsk) {
            return _.orderBy(collection, ["BookmarkId"], directionAsk ? ["ask"] : ["desc"]);
        };

        function getBookmarkOutModel() {
            return Utils.ModelFactory.BookmarkOut();
        };

        function isCurrentModel() {
            return planshetService.isCurrentModel(bookmarkUniqueId);
        };


        //function bookmarkJump(type, galaxy, sector, system, id, textureTypeId) {
        function bookmarkJump(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, mapTypeName) {
            var guid = "bookmarkService.bookmarkJump" + "_" + (galaxyId || 0) + "_" + (sectorId || 0) + "_" + (systemId || 0) + "_" + (spaceObjectId || 0) + "_" + (textureTypeId || 0) + "_"+mapTypeName;
            if (!Utils.TimeDelay.IsTimeOver(guid)) return;
            Utils.TimeDelay.Start(guid);
            var types = EM.MapGeometry.MapTypes;
            if (!mapTypeName) return;
            if (!galaxyId) return;
            if (!sectorId) return;

            var lowType = mapTypeName.toLowerCase();
            function setLocation(typeName) {
                EM.EstateData.SaveCurrentSpaceLocation(galaxyId, sectorId, systemId, spaceObjectId, textureTypeId, typeName);
            }

            function setCameraMinZ() {
                EM.GameCamera.Camera.minZ = EM.GameCamera.System.minZ;
            }

            function planetoidClick(meshId) {
                EM.MapEvent.PlanetoidDubleClick(meshId, null, true);
            };

            function onMeshExist(meshId, typeName) {
                setLocation(typeName);
                planetoidClick(meshId);
            }

            function onMeshNotExist(meshId,typeName, onEnd) {
                EM.MapGeometry.System.Destroy();
                EM.SpaceState.SetNewCoord(sectorId, systemId);
                EM.MapBuilder.System.Callback = function () {
                    setLocation(typeName);
                    //todo  костыль на первое время  вызывает баги но перемещается
                    EM.StarLight.SetOther();
                    var sp = new EM.SpaceState.SpacePosition();
                    sp.setState(sp.getSystemSelectedState());
                    setCameraMinZ();
                    setTimeout(function () {
                        planetoidClick(meshId);
                        if (onEnd) {
                            onEnd();
                        }
                    }, 100);
                };
                EM.MapBuilder.System.Build();
            }

            function createOrClick(meshId, typeName, setLight) {
                var mesh = EM.GetMesh(meshId);
                if (mesh) {
                    onMeshExist(meshId, typeName);
                } else {
                    onMeshNotExist(meshId, typeName, setLight);
                }
            }
            // Sector
            if (lowType === types.Sector.toLowerCase()) {
                EM.MapEvent.SectorProgrammClick(sectorId);
            }
           // System
            else if (lowType === types.Star.toLowerCase()) {
                if (systemId === 0) return;
                var starMeshId = EM.MapGeometry.System.GetOrCreateStarMeshId(systemId, textureTypeId, true);
                createOrClick(starMeshId, types.Star, EM.StarLight.SetOther);
            }
                // Planet
            else if (lowType === types.Planet.toLowerCase()) {
                if (systemId === 0) return;
                if (spaceObjectId === 0) return;
                var planetMeshId = EM.MapGeometry.System.GetOrCreatePlanetMeshId(spaceObjectId, textureTypeId, true);
                createOrClick(planetMeshId, types.Planet, EM.StarLight.SetInSystem);
            }
        };


        //#region Collections
        function getBodyByIdx(idx) {
            return bookmarksData.Bodys[idx];
        }

        function getTabData(tabIdx) {
            return getBodyByIdx(tabIdx).TemplateData;
        }

        function getIdxByType(typeName) {
            var key = typeName.toLowerCase();
            if (key === "star") key = "system";
            if (bodyTabIdx.hasOwnProperty(key)) return bodyTabIdx[key];
            Utils.Console.Error("Не верный тип планетоида или ключа",
                {
                    typeName: typeName,
                    bodyIdx: bodyTabIdx
                });
            return false;
        }

        function getBodyByPlanetoidType(planetoidType) {
            var idx = getIdxByType(planetoidType);
            if (typeof idx === "number") return getBodyByIdx(idx);
            return false;
        }

        function getPlanetItems() {
            return getTabData(bodyTabIdx.planet);
        }

        function getSystemItems() {
            return getTabData(bodyTabIdx.system);
        }

        function getSectorItems() {
            return getTabData(bodyTabIdx.sector);
        }

        function findItem(bookmarkId, tabIdx) {
            var coll = getTabData(tabIdx);
            return _.findIndex(coll, function (o) {
                return o.BookmarkId === bookmarkId;
            });
        }

        function findItemByObjectId(objectId, tabIdx) {
            var coll = getTabData(tabIdx);
            return _.find(coll, function (o) {
                return o.Id === objectId;
            });
        }

        function findAndDeleteBookmark(bookmarkId, tabIdx) {
            var coll = getTabData(tabIdx);
            var item = _.findIndex(coll, function (o) {
                return o.BookmarkId === bookmarkId;
            });
            _.pullAt(coll, item);
            return;
        }

        function addNewItem(idx, item) {
            var body = getBodyByIdx(idx);
            if (!body) return;
            var col = body.TemplateData;
            if (!col) return;

            item.ComplexButtonView.IsNewItem = true;
            col.push(item);
            item.mapStatsModel = mapInfoService.getContent(item);
            body.TemplateData = orderById(col);
        }

        function setProperty() {
            function set(section) {
                _.forEach(section, function (item, key) {
                    item.mapStatsModel = mapInfoService.getContent(item);
                });

            }

            _.forEach(bookmarksData.Bodys, function (value, bodyIdx) {
                var td = getTabData(bodyIdx);
                if (td.length > 0) set(td);
            });

        }

        //#endregion


        //#region Calc
        function getLocalBookmarkCount() {
            var planets = getPlanetItems().length;
            var systems = getSystemItems().length;
            var sectors = getSectorItems().length;
            return planets + systems + sectors;
        }

        function getBookmarkLimit() {
            var hasPremium = gameChestService.$hasPremium();
            // todo   получаем премиум чест

            if (hasPremium) {
                console.log("outPremium", {                         
                    hasPremium: hasPremium,
                    GetPremiumMods: gameChestService.chestService.$getPremiumMods()
                });
                if (!premiumBookmarkLimitMod) premiumBookmarkLimitMod = gameChestService.chestService.$getPremiumMods().PremiumBookmarkMod;
                return Math.floor(baseBookmarkLimit * premiumBookmarkLimitMod);
            }
            return baseBookmarkLimit;

        }

        function localBookmarksIsFull() {
            var max = getBookmarkLimit();
            var current = getLocalBookmarkCount();
            return (max <= current);
        }

        //#endregion


        //#endregion    

        function setLocalModel(model) {
            bookmarksData = model;
            bookmarkUniqueId = bookmarksData.UniqueId;
            setProperty();
            planshetService.updatePlanshetItemData(bookmarksData, true, Utils.Time.TIME_CACHE_BOOKMARKS);
        };

        function setCssNewItem(id, idx, asObjectId, showOrHide) {
            var item;
            if (asObjectId) item = findItemByObjectId(id, idx);
            else item = findItem(id, idx);
            item.ComplexButtonView.IsNewItem = showOrHide;
        };

        function addBookmark(mapType, mapObjectId) {
            if (bookmarksData) {
                if (localBookmarksIsFull()) {
                    $self.ErrorHandler.BookMarkLimitDone();
                    return;
                };
                var item = findItemByObjectId(mapObjectId, getIdxByType(mapType));
                if (item) {
                    $self.ErrorHandler.BookmarkIsExist();
                    return;
                }
                $self.$requestAddBookmark(mapType, mapObjectId, false);
            }
            else $self.$requestAddBookmark(mapType, mapObjectId, true);
        };


        this.ErrorHandler = {
            BookMarkLimitDone: function (errorAnswer) {
                console.log("ErrorHandler.BookMarkLimitDone", {
                    errorAnswer: errorAnswer
                });
                $bdH.getTextOpenDialogBookMarkLimitDone();
            },
            BookmarkIsExist: function (errorAnswer) {
                console.log("ErrorHandler.BookmarkIsExist", {
                    errorAnswer: errorAnswer
                });
                $bdH.openDialogBookmarkIsExist();
            },
            HandleError: function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                if ($self.ErrorHandler.hasOwnProperty(msg)) {
                    $self.ErrorHandler[msg](errorAnswer);
                    return true;
                }
                return false;
            }
        };



        //#region Request 
        function loadBokmarksPlanshet() {
            if (bookmarkUniqueId && planshetService.isCurrentModel(bookmarkUniqueId)) {
                planshetService.toggle(bookmarkUniqueId);
                return;
            }
            var opts = planshetService.IHubRequestOptions($self.$hub.bookmarkGetPlanshet, bookmarkUniqueId);
            opts.OnSuccsess = function (answer) {
                setLocalModel(answer);
                planshetService.setCurrentModel(bookmarkUniqueId);
                updatePlanshet();
            };
            opts.OnError = function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "mapInfoService.getMapInfo");

            };
            opts.TryGetLocal = true;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.ChangePlanshetState = true;
            opts.CacheTime = Utils.Time.TIME_CACHE_BOOKMARKS;
            planshetService.planshetHubRequest(opts);
        };

        //todo  Не правильный метод    обращается к контроллеру  а не к хабу
        var _deleteBokmarkInProgress = false;
        function deleteBokmark(params, element, attrs) {
            if (_deleteBokmarkInProgress) return;
            _deleteBokmarkInProgress = true;

            $self.$hub.bookmarkDeleteItem(params.Data)
                .finally(function () {
                _deleteBokmarkInProgress = false;

            })
            .then(function (answer) {
                if (answer) {
                    mainHelper.applyTimeout(function () {
                        findAndDeleteBookmark(params.Id, params.TabIdx);
                    });
                }
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    errorAnswer: errorAnswer,
                    msg: msg,
                    params: params,
                    bookmarksData: bookmarksData,
                };
                throw Errors.ClientNotImplementedException(errorData, "bookmarkService.deleteBokmark.error");

            });


        };


        var _requestAddBookmarkIsProgress = false;
        $self.$requestAddBookmark = function (mapType, mapObjectId, isAllTabs) {
            if (_requestAddBookmarkIsProgress) return;
            _requestAddBookmarkIsProgress = true;
            var data = getBookmarkOutModel();
            data.TypeName = mapType;
            data.ObjectId = mapObjectId;
            data.IsFull = isAllTabs;
            var idx = getIdxByType(mapType);

            $self.$hub.bookmarkAddBookmark(data).finally(function () {
                _requestAddBookmarkIsProgress = false;
            }).then(function (answer) {
                if (isAllTabs) {
                    setLocalModel(answer);
                    setCssNewItem(mapObjectId, idx, true, true);
                } else addNewItem(idx, answer);
                var state = bookmarkUniqueId && isCurrentModel();
                if (!state) planshetService.setCurrentModel(bookmarkUniqueId);

                updatePlanshet(function () {
                    tabService.delayActivate(idx);
                    if (!planshetService.isOpened()) {
                        planshetService.toggle(bookmarkUniqueId);
                    }
                });

            }, function (errorAnswer) {
                if (!$self.ErrorHandler.HandleError(errorAnswer)) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    var errorData = {
                        errorAnswer: errorAnswer,
                        msg: msg,
                        data: data,
                        mapType: mapType,
                        mapObjectId: mapObjectId,
                        bookmarksData: bookmarksData,
                    };
                    throw Errors.ClientNotImplementedException(errorData, "bookmarkService.$requestAddBookmark.error");
                }

            });

        }; //#endregion

        this.getTabs = function () {
            return bookmarksData;
        };

        this.loadBokmarksPlanshet = loadBokmarksPlanshet;
        this.bookmarkJump = bookmarkJump;

        this.getPlanetItems = getPlanetItems;
        this.getSystemItems = getSystemItems;
        this.getSectorItems = getSectorItems;
        this.deleteBokmark = deleteBokmark;
        this.addBookmark = addBookmark;
    }
]);
Utils.CoreApp.gameApp.service("mapInfoService", ["planshetService", "translateService", "statisticHelper", "profileService", "$filter", "mapInfoHelper", "allianceService", "npcHelper",
    function (planshetService, translateService, statisticHelper, profileService, $filter, mapInfoHelper, allianceService, npcHelper) {
        var $self = this;
        var planetoid;
        //#region GetPlanetNames
        var serchPlanetType = {
            AllPlanets: 1,
            OtherUsers: 2,
            OnlyUserPlanet:3
        };
        var lastTimeSerchRequest;
        var lastPlanetNames = [];
        var lastOtherPlanetNames = [];
        var lastUserPlanetNames = [];

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }     
        });

        function addPlanetNames(newNames, serchType) {
            if (!lastPlanetNames) lastPlanetNames = _.union(lastPlanetNames, newNames);
            if (serchType === serchPlanetType.AllPlanets) return;
            else {
                lastTimeSerchRequest = Utils.Time.GetUtcNow();
                if (serchType === serchPlanetType.OtherUsers) {
                    lastOtherPlanetNames = _.union(lastOtherPlanetNames, newNames);
                    return;
                }
                if (serchType === serchPlanetType.OnlyUserPlanet) {
                    lastUserPlanetNames = _.union(lastUserPlanetNames, newNames);
                    return;
                }


            }
        }

        function namesNeedUpdate(lastTime) {
            if (!lastTime) return true;
            return lastTime + Utils.Time.ONE_MINUTE_SECOND * 5 < Utils.Time.GetUtcNow();
        }
        function getLocalPlanetNames(serchType) {
            if (serchType === serchPlanetType.AllPlanets) return lastPlanetNames;
            if (serchType === serchPlanetType.OtherUsers) return lastOtherPlanetNames;
            if (serchType === serchPlanetType.OnlyUserPlanet) {
                if (lastUserPlanetNames.length === 0 || namesNeedUpdate(lastTimeSerchRequest)) {
                    addPlanetNames(GameServices.estateService.getEstateNames(), serchType);
                    return lastUserPlanetNames;
                }
                return lastUserPlanetNames;
            };
            if (SHOW_DEBUG) {
                console.log("Error serchType не верен",
                {
                    serchType: serchType,
                    serchPlanetType
                });
            }

            return [];
        }


        function containPlanetName(serchType, name) {
            if (!name) return false;
            var col = getLocalPlanetNames(serchType);
            if (!col || col.length === 0) return false;
            //var names = _.find(col, function(o) { return o === name });
            var _name = name.toUpperCase();
            var names = _.filter(col, function (o) {
                return o === _name;
            });
            if (!names || names.length === 0) return false;
            if (names.length === 1) return true;
            if (names.length > 1) {
                if (SHOW_DEBUG) {
                    Utils.Console.Error("Multimle chooses data:",
                    {
                        inputName: name,
                        resultCollection: col
                    });
                }
                return false;
            }
            return false;
        }

        function getPlanetNames(request, response, serchType, ignoreFiltr) {
            var requestName = request;

            function filter(collectionPlanetNames, ignore) {
                if (!requestName || ignore) return collectionPlanetNames;
                var name = requestName.toUpperCase();
                return _.filter(collectionPlanetNames, function (o) {
                    return _.includes(o, name);
                });
            }
            function hasLocalName(collection) {
                var hasItems = filter(collection, false);
                return hasItems && hasItems.length > 0;
            }


            function needRequest() {
                if (!lastTimeSerchRequest) return true;
                var _hasLocalName = hasLocalName(lastPlanetNames);
                if (lastPlanetNames.length > 0 && (serchType === serchPlanetType.AllPlanets) && _hasLocalName) return false;
                function restCache(storage) {
                    if (namesNeedUpdate(lastTimeSerchRequest)) {
                        storage = [];
                        return true;
                    }
                    return false;
                }

                if (lastOtherPlanetNames.length > 0 && (serchType === serchPlanetType.OtherUsers)) {
                    if (restCache(lastOtherPlanetNames)) return true;
                    return !_hasLocalName;

                }
                return true;
            }

            if (!requestName) {
                response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));
            }
            else if (serchType === serchPlanetType.OnlyUserPlanet) {
                response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));
            }
            else if (needRequest()) {
                //console.log("collectionPlanetNames", {
                //    lastUserPlanetNames: lastUserPlanetNames,
                //    serchType: serchType,
                //    "getLocalPlanetNames(serchType)": getLocalPlanetNames(serchType),
                //    lastTimeSerchRequest: lastTimeSerchRequest
                //});
                $self.$hub.worldSerchPlanetNames(requestName, serchType)
                    .then(function (answer) {
                        if (answer && answer.length > 0) addPlanetNames(answer, serchType); 
                        if (response) response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));

                }, function (errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg, 
                        serchType: serchType,
                        request: request,
                        response: response,
                        ignoreFiltr: ignoreFiltr
                    });
                });
            }
            else response(filter(getLocalPlanetNames(serchType, ignoreFiltr)));

        }

        this.addPlanetNames = addPlanetNames;
        this.containPlanetName = containPlanetName;
        this.getPlanetNames = getPlanetNames;

        //#endregion


        function idConstructor(type, id) {
            return type.toLowerCase() + "_" + id;
        }

        function isCurrentModel(itemId) {
            return planshetService.isCurrentModel(itemId);
        }

        function hasItem(itemId) {
            return planshetService.hasItemById(itemId);
        }

        function updatePlanshetView(itemId, accept) {
            planshetService.setCurrentModel(itemId);
            planshetService.open();
            planshetService.updatePlanshet(accept, itemId);
        }

        //#region prepareInfoProperty
        var types = [
            "Galaxy",
            "Sector",
            "Star",
            "Planet",
            "Satellite",
            "Mother"
        ];
        var cssLowerText = " lower-text ";
        var cssLinkToTarget = " unique-name link-to-target ";
        var allianceTranslate;
        var commonTranslate;
        var moiTranslate;
        var moiCheked = false;

        var mapObject;

        function setNames() {
            allianceTranslate = translateService.getAlliance();
            moiTranslate = translateService.getMapInfo();
            commonTranslate = translateService.getCommon();
            moiCheked = true;
            //console.log("moi", moi);
        }

        function checkMoi() {
            if (moiCheked) return;
            if (!moiTranslate || !allianceTranslate || !commonTranslate) setNames();
        }

        function getUserProfileStat(mapObjectModel) {
            //console.log("getUserProfileStat.mapObjectModel", mapObjectModel);
            var linkToUser = statisticHelper.createStatItemModel(moiTranslate["owner"], mapObjectModel.Owner, null, null, cssLinkToTarget);
            if (!npcHelper.isNpc(mapObjectModel.Owner)) {
                profileService.setOnClickToUser(linkToUser, mapObjectModel.Owner);
            }
            return linkToUser;
        }

        function getAllianceStat(allianceKeyTranslatedName, mapObjectModel) {
            if (!mapObjectModel.AllianceName) return null;
            var stat = statisticHelper.createStatItemModel(allianceKeyTranslatedName, mapObjectModel.AllianceName, null, null, " unique-name ");
            if (!npcHelper.isNpc(mapObjectModel.AllianceName)) {
                stat.advancedCssVal += "link-to-target active ";
                stat.hasOnclick = true;
                stat.onClick = function () {
                    allianceService.filterAllianceSerchByName(mapObjectModel.AllianceName);
                };
            }

            return stat;
        }

        function checkAndSetMapStatOnClick(stat, isCurrent, onClick) {
            if (!isCurrent) {
                stat.advancedCssVal += " active ";
                stat.hasOnclick = true;
                stat.onClick = onClick;
            }
        }

        function getGalaxyStat(mapObjectModel, isGalaxyInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["galaxy"], mapObjectModel.GalaxyName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isGalaxyInfo, function () {
                mapInfoHelper.getGalaxyInfo(mapObjectModel.GalaxyId);
            });
            return stat;
        }

        function getSectorStat(mapObjectModel, isSectorInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["sector"], mapObjectModel.SectorName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isSectorInfo, function () {
                mapInfoHelper.getSectorInfo(mapObjectModel.SectorId);
            });
            return stat;
        }

        function getSystemStat(mapObjectModel, isSystemInfo) {
            var stat = statisticHelper.createStatItemModel(moiTranslate["system"], mapObjectModel.SystemName, null, null, cssLinkToTarget);
            checkAndSetMapStatOnClick(stat, isSystemInfo, function () {
                mapInfoHelper.getStarInfo(mapObjectModel.SystemId);
            });
            return stat;
        }

        function getPlanetStat(planetKeyTranslatedName, mapObjectModel, isPlanetInfo) {
            var stat = statisticHelper.createStatItemModel(planetKeyTranslatedName, mapObjectModel.NativeName, null, null, " unique-name ");
            checkAndSetMapStatOnClick(stat, isPlanetInfo, function () {
                mapInfoHelper.getPlanetInfo(mapObjectModel.Id);
            });
            return stat;
        }


        function galaxy(m) {
            checkMoi();
            var statItems = [
                getGalaxyStat(m, true),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.SubtypeNativeName),
                statisticHelper.createStatItemModel(moiTranslate["sectors"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.GalaxyName);

            return statisticHelper.createStatisticModel(statItems, img);
        }

        function sector(m) {
            checkMoi();

            var statItems = [
                getAllianceStat(allianceTranslate["dominantAlliance"], m),
                getSectorStat(m, true),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["systems"], m.ChildCount)

            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SectorName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function star(m) {
            checkMoi();
            var statItems = [
                statisticHelper.createStatItemModel("EnergyBonus_tr", m.Bonus, null, null, ((m.Bonus > 1) ? " bonus-positive " : " bonus-negative ")),
                getUserProfileStat(m),
                getAllianceStat(allianceTranslate["alliance"], m),
                getSystemStat(m, true),
                getSectorStat(m),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.SubtypeTranslateName),
                statisticHelper.createStatItemModel(moiTranslate["planets"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function planet(m) {
            checkMoi();
            var statItems = [
                getPlanetStat(commonTranslate["name"], m, true),
                getUserProfileStat(m),
                getAllianceStat(allianceTranslate["alliance"], m),
                statisticHelper.createStatItemModel(moiTranslate["lastActivity"], $filter("date")(new Date(m.LastActive), "dd.MM.yyyy"), null, null, cssLowerText),
                getSystemStat(m),
                getSectorStat(m),
                getGalaxyStat(m),
                statisticHelper.createStatItemModel(moiTranslate["type"], m.TypeTranslateName || m.TypeNativeName),
                statisticHelper.createStatItemModel(moiTranslate["subType"], m.SubtypeTranslateName),
                statisticHelper.createStatItemModel(moiTranslate["moons"], m.ChildCount)
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function satellite(m) {
            checkMoi();
        }

        function moon(m) {
            checkMoi();
            var statItems = [
                    statisticHelper.createStatItemModel(moiTranslate["moon"], m.NativeName, null, null, " unique-name ")
            ];
            var img = statisticHelper.createBgImage(m.SpriteImages.Detail, m.SystemName);
            return statisticHelper.createStatisticModel(statItems, img);
        }

        function getMapObject(modelName, model) {
            if (!mapObject) {
                mapObject = {};
                mapObject.galaxy = galaxy;
                mapObject.sector = sector;
                // mapObject.systemItem = systemItem;
                mapObject.star = star;
                mapObject.planet = planet;
                mapObject.moon = moon;
                mapObject.satellite = satellite;
            }
            var name = modelName.toLowerCase();
            if (mapObject.hasOwnProperty(name)) return mapObject[name](model);
            else {
                console.log("methodNotExist", {
                    modelName: modelName,
                    model: model
                });
                return;
            }
        };


        function getContent(infoModel) {
            // console.log("infoModel", infoModel);
            return getMapObject(infoModel.TypeNativeName, infoModel);
        }
        this.getContent = getContent;
        //#endregion

        // request
        function getMapInfo(type, id, hubAction, accept, update) {
            var uniqueId = idConstructor(type, id);
            if (!(hubAction instanceof Function)) {
                throw Errors.ClientNullReferenceException({
                    type: type,
                    id: id,
                    hubAction: hubAction,
                    update: update,
                    accept: accept
                }, "hubAction", "mapInfoService.getMapInfo");
            }
            //            console.log("getMapInfo", {
            //                type: type,
            //                uniqueId: uniqueId,
            //                id: id,
            //                url: url
            //            });
            function request() {

                var opts = planshetService.IHubRequestOptions(function () {
                    return hubAction(id);
                }, uniqueId);

                opts.OnSuccsess = function (answer) {
                    //console.log("else  callback", answer);
                    planetoid = answer;
                    planetoid.Bodys[0].TemplateData.mapStatsModel = getContent(planetoid.Bodys[0].TemplateData);
                    if (uniqueId !== planetoid.UniqueId) {
                        Utils.Console.Error("planetoidId не совпадает!!! data: ",
                        {
                            planetoid: planetoid,
                            answer: answer,
                            uniqueId: uniqueId,
                            type: type,
                            id: id,
                            url: hubAction,
                            update: update
                        });
                    }
                    planshetService.addOrUpdatePlanshetModel(planetoid);
                    updatePlanshetView(uniqueId, accept);
                };
                opts.OnError = function (errorAnswer) {
                    var msg =typeof errorAnswer === "string"?errorAnswer :Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg,
                        type: type,
                        id: id,
                        hubAction: hubAction,
                        accept: accept,
                        update: update,
                        opts: opts,
                    }, "mapInfoService.getMapInfo"); 


                };

                opts.TryGetLocal = false;
                opts.SetToCurrent = true;
                opts.UpdateCacheTime = true;
                opts.CacheTime = Utils.Time.TIME_CACHE_PROFILE;
                planshetService.planshetHubRequest(opts);

            }                                                    

            if (update) {
                request();
                return;
            }
            else if (planshetService.needUpdateCache(uniqueId)) {
                request();
                return;
            }
            else if (isCurrentModel(uniqueId)) {
                //  console.log("isCurrentModel");
                planshetService.toggle();
                return;
            }
            else if (hasItem(uniqueId)) {
                //  console.log("hasItem");
                planetoid = planshetService.getItemById(uniqueId);
                updatePlanshetView(uniqueId, accept);
                return;
            }
            else request();

        }

        function getPlanetoidData() {
            return planetoid.Bodys[0].TemplateData;
        }

        this.getMapInfo = getMapInfo;
        this.getPlanetoidInfo = getPlanetoidData;
        this.serchPlanetType = serchPlanetType;

    }
]);
Utils.CoreApp.gameApp.service("confederationService", [
    "planshetService",
    "confederationDialogHelper",
    "paralaxButtonHelper" ,
    "compileHelper",
    function (planshetService, $cdH, $btnHelper,compileHelper) {
        var $self = this;
        this.$planshetIndex = null;
        this.$cdH = $cdH;
        this.$btnHelper = $btnHelper; 
        this.$compileHelper = compileHelper;
        Object.defineProperty($self, "_confederationId", {
            value: "confederation-collection",
            writable: false,
            configurable: false
        });
        Object.defineProperty($self, "_confederationModel", {
            get: function () {
                if (!$self.$planshetIndex) throw Errors.ClientNullReferenceException({ $self: $self }, "$self.$planshetIndex", "confederationService", ErrorMsg.NoData);
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model.UniqueId !== $self._confederationId) throw Errors.ClientNotImplementedException({ $self: $self }, "is not  confederation model");
                return model;
            },
            set: function (value) {
                planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_CONFEDERATION);
                $self.$planshetIndex = planshetService.getModelIndex($self._confederationId);
            }
        });

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        this.bodyIdx = {
            Officers: 0,
            Rating: 1,
            Election: 2
        };

        Object.freeze(this.bodyIdx);

        this.ConfederationTabNames = {
            Officers: "Officers",
            Rating: "Rating",
            Election: "Election"
        };
        Object.freeze(this.ConfederationTabNames);

        function IConfederationRef(name, idx) {
            this.NativeName = name;
            this.PlanshetIdx = idx;
            return this;
        }
        this.ConfederationRefs = {
            Officers: new IConfederationRef($self.ConfederationTabNames.Officers, $self.bodyIdx.Officers),
            Rating: new IConfederationRef($self.ConfederationTabNames.Rating, $self.bodyIdx.Rating),
            Election: new IConfederationRef($self.ConfederationTabNames.Election, $self.bodyIdx.Election),
        };

        _.forEach(this.ConfederationRefs, function (val, key) {
            Object.freeze($self.ConfederationRefs[key]);
        });
        Object.freeze($self.ConfederationRefs);

        function _createRefToData(iChannelRefItem) {
            Object.defineProperty($self, iChannelRefItem.NativeName, {
                get: function () {
                    return $self._confederationModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData;
                },
                set: function (value) {
                    $self._confederationModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData = value;
                }
            });
        }
        _createRefToData($self.ConfederationRefs.Officers);   
        _createRefToData($self.ConfederationRefs.Rating);
        _createRefToData($self.ConfederationRefs.Election);

        this.OfficerTypes = {
            President: 1,
            Atacker: 2,
            Protector: 3,
            Supporter: 4
        };
        Object.freeze(this.OfficerTypes);

        Object.defineProperty($self, "$currentUserInfo", {
            get: function () {
                //UserId: crData.userId,
                //UserName: crData.userName,
                //UserIcon: crData.userAvatar.Icon,
                //AllianceId: crData.allianceId,
                //AllianceName: crData.allianceName,
                //AllianceRoleId: crData.allianceRoleId,
                return GameServices.allianceService.$currentUserInfo;

            }
        });


        this._updatePlanshet = function (advancedAction, setToCurrent) {
            planshetService.updatePlanshet(advancedAction, $self._confederationId, setToCurrent);
        };

        this._toggle = function () {
            planshetService.toggle($self._userChannelsUniqueId);
        };

        this.leftNavGetConfederation = function (params, element, attrs, $scope, $event) {
            // грузим планшет  из левого меню
            $self.loadConfederationPlanshet();
        };

        this.loadConfederationPlanshet = function (updateFromServer) {
            if (updateFromServer || !$self._confederationModel) $self.getServerPlanshetData($self._toggle);
            else if (planshetService.isCurrentModel($self._confederationId)) $self._toggle();
            else $self._updatePlanshet($self._toggle, true);
        };


        this._setNewPlanshetData = function (newPlanshet, onDone) {
            $self._confederationModel = newPlanshet;
            if (onDone instanceof Function) onDone($self._confederationModel);
        }
        this.getServerPlanshetData = function (onDone, onError) {
            return $self.$hub.confederationGetPlanshet()
                .then(function (answer) {
                    console.log("_______UPDATE_confederation_FROM SERVER______");
                    $self._setNewPlanshetData(answer, onDone);
                }, function (errorAnswer) {
                    if (onError instanceof Function) onError(errorAnswer);
                    else {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({ errorAnswer: errorAnswer, msg: msg }, "confederationService.getServerPlanshetData");
                    }
                });
        };


        Utils.CoreApp.gameAppExtensions.ConfederationOfficers(this);
        Utils.CoreApp.gameAppExtensions.ConfederationRating(this);
        Utils.CoreApp.gameAppExtensions.ConfederationElection(this);

        /**
        * 
        * @param {} initData 
        * @returns {} 
        */
        this.setInitialConfederationsModel = function (initData) {
            $self._confederationModel = _.cloneDeep(initData[$self._confederationId]);
            $self.$checkAndRunOrDestroyVoteView($self.getElectionData());
        };


    }
]);
Utils.CoreApp.gameApp.service("estateService", ["hangarService", "mapControlHelper",
    function (hangarService, mapControlHelper) {
        "use strict";
        var $self = this;
        //#region Declare   
        var rawData;
        var estateElement;
        var doChange = true;

        //#endregion

        //#region reqHelpers
 
 

        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }  
        });

        function isCorrectEstateId(id) {
            var ce = EM.EstateData.GetCurrentEstate();
            // console.log("estateService.isCorrectEstateId", ce);
            if (Number.isInteger(id) && (id === ce.EstateId)) return true;
            if (SHOW_DEBUG) {
                Utils.Console.Error("CurrentEstate is wrong", {
                    GetCurrentEstate: ce,
                    id: id
                });
            }
            return false;
        }

        //#endregion

        //#region Members

        //#region select
        function orderByOwnId() {
            rawData = _.orderBy(rawData, ["OwnId"], ["ask"]);
        }

        function applyChange() {
            var scope = angular.element(estateElement).scope();
            scope.$apply(function () {
                scope.estateList = rawData;
            });
        }


        function setEstateListData(data, isInit) {
            rawData = data;
            if (!isInit) applyChange();

        }

        function getEstateListData() {
            return rawData;
        }

        function getEstateItem(ownId) {
            return _.find(rawData, function (o) {
                return o.OwnId === +ownId;
            });
        }

        function deleteEstateItem(palnetId) {
            _.remove(rawData, function (o) { return o.OwnId === palnetId; });
            orderByOwnId();
            applyChange();
        }

        function addEstateItem(newItem) {
            rawData = _.unionBy(rawData, newItem, "OwnId");
            orderByOwnId();
            applyChange();
        }

        function setEstate(ownId, isInit) {

            doChange = false;
            estateElement.val(ownId).trigger("change", [ownId, isInit]);
        }

        function updateServerEstateList(setAsNewItem) {
            var promise = $self.$hub.estateGetEstateList();
            promise.then(function (answer) {
                setEstateListData(answer);
                if (setAsNewItem) {
                    //todo  не понятно что это все такое
                    var newItemCss = Utils.RepoKeys.HtmlKeys.CssNewItem;
                    var elem = angular.element("#own-list-container");
                    var count = 7;
                    var show = true;

                    function toggleCss() {
                        show ? elem.addClass(newItemCss) : elem.removeClass(newItemCss);
                    };

                    var hasClick;
                    toggleCss();
                    var t = setInterval(function () {
                        count--;
                        show = !show;
                        if (count <= 0 || hasClick) {
                            show = false;
                            toggleCss();
                            clearInterval(t);
                        }
                        toggleCss();

                    }, 1500);

                    elem.addClass(newItemCss);
                }
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.updateServerEstateList");
            });
            return promise;
        }

        function getServerEstateItem(planetId) {
            var promise = $self.$hub.estateGetEstateItemByPlanetId(planetId);
            promise.then(addEstateItem, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.getServerEstateItem");
            });
            return promise;
        }


        var _onRegistred;
        function init(data, onRegistred) {
            //   console.log("estateService.init");
            setEstateListData(data, true);
            EM.EstateData.SaveCurrentEstateByEsateType(false, 0);
            _onRegistred = onRegistred;
        }


        function registerEvents(element) {
            // console.log("registerEvents");
            //#region Declare
            estateElement = element;
            var ae = "aria-expanded";
            var selectParent = element.parent();
            function setAriaExp(param) {
                return selectParent.attr(ae, param);
            }
            //#endregion

            //#region Register
            element.change(function (event, ownId, isInit) {
                if (!doChange) {
                    doChange = true;
                    return;
                }

                ownId = ownId || estateElement.find(":selected")[0].value;

                element.scope().gameCtrl._$broadcastEstateId(ownId);
                var elemData = getEstateItem(ownId);
                if (elemData.Type) {
                    mapControlHelper.jumpToUserPlanet(elemData);

                } else {
                    //    console.log("estateService.registerEvents.element.change");
                    mapControlHelper.jumpToMother(elemData);

                }
                setAriaExp(false);
            });
            element.select2({
                templateResult: function (optItemData) {
                    var itemHtml = $("<div/>", {
                        text: optItemData.text,
                        "class": "select2-estate-item-container"
                    });
                    var data = function () {
                        var elemData = getEstateItem(optItemData.id);

                        if (elemData) {
                            //$(optItemData.element).data(kl.TextureTypeId);
                            var imgType = elemData.TextureTypeId;
                            if ($.isNumeric(imgType)) {

                                var css = EM.AssetRepository.GetIconSelectCss(imgType);
                                //   console.log("templateResult", css);
                                return css;

                            }
                            return null;
                        }


                    };
                    var imgContainer = $("<span/>", {
                        "class": "select2-sprite " + data()
                    });
                    return itemHtml.prepend(imgContainer);
                },
                dropdownCssClass: "select2-dropdown-container-estate-resource"
            });


            if (!Utils.Event.HasClick(selectParent)) {
                selectParent.bind("click", function () {
                    var state = Utils.ConvertToBool(selectParent.attr(ae));
                    if (!state) {
                        element.select2("open");
                        setAriaExp(true);

                    } else {
                        element.select2("close");
                        setAriaExp(false);
                    }

                });
            }
            //#endregion

            //#region Apply
            setAriaExp(false);
            //element.on("select2:select", function() {
            //    setAriaExp(false);
            //});
            // EM.EstateData.SaveMotherLocationFromData(getEstateItem(0));

            var self = this;
            if (_onRegistred instanceof Function) {
                _onRegistred();
                _onRegistred = null;
                delete self.registerEvents;
                registerEvents = null;
                init = null;
            }



            //#endregion
        };

        //#region select

        //#region EstateScene
        var updateSinchronizer = null;

        var hasFirstRequest = false;
        function getFullEstate(ownId, onFinally, isInit) {
            if (!(typeof ownId === "number")) {
                throw Errors.ClientNotImplementedException({
                    onFinally: onFinally,
                    ownId: ownId,
                    message: "НЕ установлен ид истоничка для обновления"
                }, "estateService.getFullEstate");
            }
            var isMother = ownId === 0;
            if (!isCorrectEstateId(isMother ? 0 : EM.EstateData.GetPlanetLocation().PlanetId)) return;

            if (!hasFirstRequest) {
                hasFirstRequest = true;
                updateSinchronizer(true);
                if (onFinally instanceof Function) onFinally();
                return;
            }

            var promise = $self.$hub.estateGetFullEstate(ownId);
            promise.then(function (answer) {
                GameServices.buildReqHelper.addBuildsToPlanshet(answer, isMother);
                updateSinchronizer(true);
                if (onFinally instanceof Function) onFinally();
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "estateService.getFullEstate");
            });
            return promise;


        };

        updateSinchronizer = function (replaseSinchronizer) {
            var eid;
            var sucsess;
            // console.log("estateService.updateSinchronizer");
            function condition() {
                var ce = EM.EstateData.GetCurrentEstate();
                eid = ce.EstateId;
                //console.log("estateService.updateSinchronizer", {
                //    ce: ce,
                //    EstateId: ce.EstateId,
                //    condition: typeof eid === "number",
                //    conditionTypeof: typeof eid
                //});
                return (typeof eid === "number");
            };

            function accept() {
                GameServices.timerHelper.addSinchronizer("estate", function () {
                    getFullEstate(eid);
                }, Utils.Time.DELAY_SYNCHRONIZE, !!replaseSinchronizer);
                sucsess = true;
            }
            if (condition()) accept();
            else {
                var repeat = 100;
                var delay = 100;
                GameServices.planshetService.conditionAwaiter(condition, accept, delay, repeat);
                if (SHOW_DEBUG) {
                    setTimeout(function () {
                        if (!sucsess) Utils.Console.Error("CurrentEstate is Wrong");
                    }, (repeat * delay) + 1);
                }



            }

        }; //#endregion


        //#endregion
                                                                                  
        function loadGame(scope, data) {
            var self = this;
            scope.gameCtrl.setServerTime(data.serverTime);
            scope.gameCtrl.setTranslate(data.TranslationKey);
            GameServices.gameChestService.$rebuildChestData(data[GameServices.gameChestService.CHEST_KEY]);  
            init(data.EstateListDataKey, function () {
                delete self.loadGame;
            });
            scope.gameCtrl.setResources(data.ResourcesViewKey);
            scope.gameCtrl.setEstateBuilds(data.EstateViewKey);
            scope.gameCtrl.setCtrlData(data.BaseBtnsKey);
            scope.gameCtrl.setInitialAlliance(data["alliance-collection"]);
            scope.gameCtrl.setPersonalData(data.AvatarViewKey);
            scope.gameCtrl.setAllianceNames(data.AllianceNamesKey);
            scope.gameCtrl.setInitialUserChannelsModel(data);
            scope.gameCtrl.setInitialConfederationsModel(data);
            GameServices.journalService.setInitializeJournal(data);
            scope.gameCtrl.skagryLoaded = true;
        }

        //#region Public
        this.getEstateNames = function () {
            var names = [];
            _.forEach(rawData, function (estateItem, key) {
                if (estateItem.Name === "MotherShip") return;
                names.push(estateItem.Name);
            });
            return names;
        };
        this.setEstateListData = setEstateListData;
        this.registerEvents = registerEvents;
        this.getEstateListData = getEstateListData;
        this.getEstateItem = getEstateItem;

        this.deleteEstateItem = deleteEstateItem;
        this.addEstateItem = addEstateItem;
        this.setEstate = setEstate;

        this.getServerEstateItem = getServerEstateItem;
        this.updateServerEstateList = updateServerEstateList;
        this.getFullEstate = getFullEstate;
        this.updateSinchronizer = updateSinchronizer;

        this.isCorrectEstateId = isCorrectEstateId;
        this.loadGame = loadGame;
        //#endregion
    }
]);
Utils.CoreApp.gameApp.factory("gameChestService", ["chestService", function (chestService) {

    chestService.$getActiveItemByItemType = function(chestData, typeId) {
        if (!chestData || chestData.ActivatedItemsView) return null;
        return _.find(chestData.ActivatedItemsView, function (o) {
            return o.ProductTypeId===typeId;
        });
    };
    chestService.$getPremiumItem = function() {
        return chestService.getActiveDataByTypeId( chestService.ProductTypes.Premium.Id);
    };
    chestService.$getPremiumModelByChestData = function(chestData) {
        var pm = chestService.$getActiveItemByItemType(chestData, chestService.ProductTypes.Premium.Id);
        if(!pm||!pm.Data||!pm.Data.Premium) {
            return null;
        }
        return pm.Data.Premium;
    };
 
    chestService.$hasPremium = function (premiumModel) {
        if (!premiumModel) {
            return false;
        }  
        var pmFinished = premiumModel.Finished;
        if (pmFinished) {
            return false;
        }  
        var currTime = Utils.Time.GetUtcNow();
        var et = chestService.$getPremiumEndTime();
        if (currTime > et) {
            premiumModel.Finished = true;
            //todo set upgrade premium data
        }
        return !premiumModel.Finished;
 
    };
    chestService.$getPremiumEndTime = function (premiumModel) {
        if (!premiumModel) {
            return 0;
        }
        return premiumModel.EndTime;
    };
    chestService.$getPremiumMods = function() {
        var pm = chestService.$getPremiumItem();
        if (!pm || !pm.ProductItemProperty || !pm.ProductItemProperty.Property) {
            return null;
        }                                             
        return pm.ProductItemProperty.Property;

    };

    return chestService;
}]);        
Utils.CoreApp.gameApp.service("resourceService", [
    function () {
        //#region Declare

        var nativeNames = ["e", "ir", "dm", "cc"];
        var refResNames = {
            e: nativeNames[0],
            ir: nativeNames[1],
            dm: nativeNames[2],
            cc: nativeNames[3]
        }
        var estateResources;//array
        var stopProduction = false;
        // model not for use
        var modelResItem = Utils.ModelFactory.ResourceItemModel();
        //modelresItem.Current;
        //modelresItem.Max;
        //modelresItem.NativeName;
        //modelresItem.Percent;
        //modelresItem.TranslateName;

        // ReSharper disable once JoinDeclarationAndInitializerJs
        //functions
        var serverStopProduction;

        function getStorageData() {
            return GameServices.industrialComplexService.getStorageData();
        }

        function upgradeLocalBuilStorageResources(storageResources) {
            getStorageData().StorageResources = storageResources;
        }




        function getProductionData() {
            return GameServices.industrialComplexService.getExtractionModuleData();
        }

        function getStorageResources() {
            return getStorageData().StorageResources;
        }

        //#endregion

        //#region Helpers
        function findViewResItem(resName) {
            return _.find(estateResources, function (o) { return o.NativeName === resName; });
        }
        function getMaterialResourceFromView(resType) {
            function get(resName) {
                var item = _.find(estateResources, function (o) { return o.NativeName === resName; });
                return resType ? item.Max : item.Current;
            }

            var materialResource = Utils.ModelFactory.MaterialResources();
            materialResource.E = get(refResNames.e);
            materialResource.Ir = get(refResNames.ir);
            materialResource.Dm = get(refResNames.dm);
            return materialResource;
        }
        function updatePrcents() {
            function calc(item) {
                item.Percent = GameServices.industrialComplexService.calcResPercent(item.Current, item.Max);
            }
            calc(findViewResItem(refResNames.e));
            calc(findViewResItem(refResNames.ir));
            calc(findViewResItem(refResNames.dm));
        }

        //#endregion


        //#region resource View
        function updateViewResourceMax(resName, newMax) {
            findViewResItem(resName).Max = newMax;
        }
        function updateViewResourceCount(resName, newCount) {
            var item = findViewResItem(resName);
            item.Current = newCount;
            var max = item.Max;
            if (newCount >= max) {
                item.Current = max;
                stopProduction = true;
            }
            if (stopProduction) {
                serverStopProduction();
            }

        }
        function addViewResourceCount(resName, newCount) {
            var resItem = findViewResItem(resName);
            resItem.Current += newCount;
            var max = resItem.Max;
            if (newCount >= max) {
                resItem.Current = max;
                stopProduction = true;
            }
            if (stopProduction) {
                serverStopProduction();
            }


        }


        function updateViewCountsByMaterialResource(materialResource, resType) {
            function setRes(resName, count) {
                if (resType) {
                    updateViewResourceMax(resName, count);
                }
                else {
                    updateViewResourceCount(resName, count);
                }

            }

            setRes(refResNames.e, materialResource.E);
            setRes(refResNames.ir, materialResource.Ir);
            setRes(refResNames.dm, materialResource.Dm);

        };
        function addViewCountsByMaterialResource(materialResource, upgradePersent) {
            function setRes(resName, count) {
                addViewResourceCount(resName, count);
            }
            setRes(refResNames.e, materialResource.E);
            setRes(refResNames.ir, materialResource.Ir);
            setRes(refResNames.dm, materialResource.Dm);
            if (upgradePersent) {
                updatePrcents();
            }

        };
        function updateViewDataResourceByStorageResource(newStorageResource, upgradePersent) {

            updateViewCountsByMaterialResource(newStorageResource.Max,true);
            updateViewCountsByMaterialResource(newStorageResource.Current);
            if (upgradePersent) {
                updatePrcents();
            }
        }
        function isEnoughResources(matRes) {
            var cur = getStorageResources().Current;
            if (cur.E < matRes.E) return false;
            if (cur.Ir < matRes.Ir) return false;
            if (cur.Dm < matRes.Dm) return false;
            return true;
        };
        //#endregion

        //#region Cc
        function getCcItem() {
            return findViewResItem(refResNames.cc);
        }
        function getCcCount() {
            return getCcItem().Current;
        }

        function setCc(newCc) {
            getCcItem().Current = newCc;
        }
        function addCc(adedCc, operator) {
            if (operator === "-") adedCc = -adedCc;
            getCcItem().Current += adedCc;

        }
        function isEnoughCc(cc) {
            return (getCcCount() >= cc);
        };


        //#endregion

        //#region Upgrade and sinchronize
        function isMaximum(storageResource) {
            var cur = storageResource.Current;
            var max = storageResource.Max;

            _.forEach(cur, function (value, resName) {
                var maxValue = max[resName];
                var currValue = cur[resName];
                if (currValue >= maxValue) {
                    stopProduction = true;
                    return false;
                };
            });
            return false;

        }

        function calculateProduction() {
            if (stopProduction) return;
            var sr = getStorageResources();
            if (isMaximum(sr)) return;

            var eph = getProductionData().ExtractionPerHour;
            var newResources = Utils.ModelFactory.MaterialResources();

            function addDelta(sourceVal,perHouer) {
                return sourceVal + ((perHouer / 3600));
            }

            newResources.E = addDelta(sr.Current.E, eph.E);
            newResources.Ir = addDelta(sr.Current.Ir, eph.Ir);
            newResources.Dm = addDelta(sr.Current.Dm, eph.Dm);

            var storableRes = _.cloneDeep(sr);
            storableRes.Current = newResources;
            upgradeLocalBuilStorageResources(storableRes);

            var toInt = Utils.ConvertToInt;
            var newViewRes;
            function cloneToInt() {
                newViewRes = _.cloneDeep(newResources);
                newViewRes.E = toInt(newViewRes.E);
                newViewRes.Ir = toInt(newViewRes.Ir);
                newViewRes.Dm = toInt(newViewRes.Dm);
            }
            cloneToInt();
            var newStorageRes = _.cloneDeep(sr);
            newStorageRes.Current = newViewRes;

            updateViewDataResourceByStorageResource(newStorageRes, true);
        }
        function startProduction() {
            GameServices.timerHelper.addViewSinchronizer("resources", calculateProduction);
        }


        function retstartView() {
            stopProduction = false;
          //  console.log("resourceService.retstartView updateSinchronizer");
            GameServices.estateService.updateSinchronizer(true);
            startProduction();
        }

        //#endregion


        //#region Request
        serverStopProduction = function () {
            // set stop timers
            // set server stop
        }
        //#endregion

        //#region Public
        this.init = function (data) {
         //   console.log("resourceService.init");
            estateResources = data;
            retstartView();
        };


        this.getEstateResources = function () {
            return estateResources;
        };

        this.isEnoughCc = isEnoughCc;
        this.addCc = addCc;

        /**
         * пытается извлеч новый баланс из ответа ошибки (см метод исключения и назначения даты текущего баланса в методе сервера: "StoreService.BalanceCalcResultCc(BalanceCcDataModel balanceModel, int value)" )
         * если данные не верны возвращает текущий баланс
         * @param {object} errorAnswer 
         * @param {string} msg 
         * @returns {int} 
         */
        this.setBalanceFromErrorAnswerNotEnoughCc = function (errorAnswer ,msg) {
            if (msg && msg === ErrorMsg.NotEnoughCc
                && errorAnswer.data
                && errorAnswer.data.InnerException
                && errorAnswer.data.InnerException.Message
                && $.isNumeric(errorAnswer.data.InnerException.Message)
                && _.isInteger(+errorAnswer.data.InnerException.Message)) {
                var newCc = +errorAnswer.data.InnerException.Message;
                setCc(newCc);
                return newCc;
            }
            return getCcCount();
        };

        this.isEnoughResources = isEnoughResources;
        this.updateViewCountsByMaterialResource = updateViewCountsByMaterialResource;
        this.addViewCountsByMaterialResource = addViewCountsByMaterialResource;
        this.retstartView = retstartView;
        this.getCcItem = getCcItem;
        this.getCcCount = getCcCount;
        this.getStorageResources = getStorageResources;
        this.updateViewDataResourceByStorageResource = updateViewDataResourceByStorageResource;
        this.setCc = setCc;
        //#endregion
    }
]);
Utils.CoreApp.gameApp.service("buildReqHelper", [
    "planshetService", "statisticHelper",
    function (planshetService, statisticHelper) {
        //#region reqHelpers

        var $self = this;
        var updatePlanshet = function (upgradeModel, afterSetPlanshet, uniqueId) {
            planshetService.setCurrentModel(uniqueId);
            upgradeModel();

            function afterSet() {
                if (afterSetPlanshet instanceof Function) {
                    afterSetPlanshet();
                }
            }

            planshetService.updatePlanshet(afterSet);
        };


        var buildHubActionNames = {
            GetMotherIndustrialComplex: "buildGetMotherIndustrialComplex",
            GetMotherLaboratory: "buildGetMotherLaboratory",
            GetMotherSpaceShipyard: "buildGetMotherSpaceShipyard",
            GetIndustrialComplex: "buildGetIndustrialComplex",
            GetCommandCenter: "buildGetCommandCenter",
            GetSpaceShipyard: "buildGetSpaceShipyard"
        };
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        function getBuildAction(buildActionName) {
            return $self.$hub[buildActionName];
        }

        function getBuildItems(planshetModel) {
            //console.log("getBuildItems", {
            //    planshetModel: planshetModel,
            //    "planshetModel.Bodys[0]": planshetModel.Bodys[0],
            //    "planshetModel.Bodys[0].TemplateData": planshetModel.Bodys[0].TemplateData
            //});
            return planshetModel.Bodys[0].TemplateData;
        }


        function setBuildItemInfoStatModel(item) {
            var stats;
          //  console.log("setBuildItemInfoStatModel", item);
            var data = item.Info.Data;
            if (data && data.IsTech) {
                item.$isTech = true;
                GameServices.laboratoryService.setTechViewData(statisticHelper, item);
                return;
            }
            else {
                if (item.Info.infoStatsModel) return;
                if (data && data.IsUnitDetail) {
                    if (!data.UnitStats) return;
                    var us = data.UnitStats;
                    item.$isUnit = true;
                    if (item.Info.infoStatsModel) return;
                    stats = [
                        statisticHelper.createStatItemModel(us.HpName, us.Hp),
                        statisticHelper.createStatItemModel(us.AttackName, us.Attack)
                    ];
                }

                else {
                    item.$isBuild = true;
                    stats = [statisticHelper.createStatItemModel("build propKey", "prop Val")];
                }
            }
            var img = statisticHelper.createBgImage(item.Info.DropImage, item.TranslateName);
            item.Info.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
        }



        function fixBuildItem(parentUniqueId, collection, isMother) {
            var unitTranslate = GameServices.translateService.getUnit();
            _.forEach(collection, function (item, key) {
                //var buildItemHtmlId = item.NativeName.toLowerCase();  
                if (!item.$guid) {
                    item.$guid = Utils.Guid.CreateGuid();
                    var buildItemHtmlId = item.$guid;
                    item.ComplexButtonView.Collection[1].buildItemId = buildItemHtmlId;
                    item.ComplexButtonView.Collection[2].buildItemId = buildItemHtmlId;
                }
                if (!item.unitTranslate) {
                    item.unitTranslate = unitTranslate;
                }
                item.$isMother = isMother;
                item.$compileItem = true;
                if (item.$isMother && item.NativeName) {
                    if (item.NativeName === "Battleship" || item.NativeName === "Drednout") {
                        item.$compileItem = false;
                    }
                }

                if (item.Info) setBuildItemInfoStatModel(item);
                if (item.Update) {
                    item.Update.Price.forCc = false;
                    item.Update.upgradeCount = 1;

                    if (item.Update.HasButtons && item.Update.Buttons.Submit) {
                        var updSubmit = item.Update.Buttons.Submit;
                        updSubmit.Method = GameServices.buildService.upgradeSubmit;
                        updSubmit.Params = item;
                        updSubmit.Params.parentUniqueId = parentUniqueId;
                    }

                }

                if (item.Action) {
                    item.Action.sendFormDisabled = true;
                    var btns = item.Action.Buttons;
                    if (btns.hasOwnProperty("Submit") && btns.Submit) {
                        if (!btns.Submit.Params || !(typeof btns.Submit.Params === "object")) btns.Submit.Params = {};
                        btns.Submit.Params.parentUniqueId = parentUniqueId;
                        btns.Submit.Params.NativeName = item.NativeName;

                        btns.Submit.Method = function (params, element, attrs, $scope) {
                            if (GameServices.buildService.hasOwnProperty("actionSubmit") && GameServices.buildService.actionSubmit instanceof Function) {
                                GameServices.buildService.actionSubmit(params, element, attrs, $scope);
                            }

                        };
                    }

                }

                if (item.$isUnit) {
                    GameServices.spaceShipyardService.registerUnitItem(item);
                }
            });

        }

        function buildCallback(answer, upgradeModel, afterSetPlanshet, uniqueId, isMother) {
            fixBuildItem(answer.UniqueId, getBuildItems(answer), isMother);
            planshetService.addOrUpdatePlanshetModel(answer);
            //console.log("planshetService.addOrUpdatePlanshetModel(answer)", planshetService.getItemById(uniqueId || answer.UniqueId));
            updatePlanshet(upgradeModel, afterSetPlanshet, uniqueId || answer.UniqueId);
        };


        function getBuild(hubActionName, setModel, afterSetPlanshet, uniqueId, isMother, ignore) {
            isMother = !!isMother;
            var pl = EM.EstateData.GetPlanetLocation();
            if (!GameServices.estateService.isCorrectEstateId(isMother ? 0 : pl.PlanetId)) return;


            if (!ignore && planshetService.needUpdateCache(uniqueId)) ignore = true;

            var opts = planshetService.IHubRequestOptions(function () {
                var _id = isMother ? null : pl.PlanetId;
                var action = getBuildAction(hubActionName);
                return action(_id);
            }, uniqueId);

            opts.OnSuccsess = function (answer) {
                buildCallback(answer, setModel, afterSetPlanshet, uniqueId, isMother);
            };
            opts.OnError = function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    hubActionName: hubActionName,
                    setModel: setModel,
                    afterSetPlanshet: afterSetPlanshet,
                    uniqueId: uniqueId,
                    isMother: isMother,
                    ignore: ignore,
                    msg: msg,
                    errorAnswer: errorAnswer
                }, "buildReqHelper.getBuild");
            };

            opts.TryGetLocal = !ignore;
            opts.SetToCurrent = true;
            opts.UpdateCacheTime = true;
            opts.CacheTime = Utils.Time.TIME_CACHE_BUILD;
            opts.ChangePlanshetState = true;
            planshetService.planshetHubRequest(opts);

        }

        /**
         * проверяет есть ли необходимость в новом запросе или нужно  толкьо закрыть планшет
         * @param {bool} ignore  проверенное и прощитанное значение
         * @param {string} uniqueId экземпляр планшета
         * @returns {bool} true-  не делать запрос, закрывает планшет. false -  необходим новых запрос
         */
        function isOnlyClose(ignore, uniqueId) {
            if (planshetService.isOpened() && !ignore && planshetService.isCurrentModel(uniqueId)) {
                planshetService.close();
                return true;
            }
            return false;
        };

        /**
         * 
         * @param {object} service angular build Sevice
         * @param {string} actionName serverControllserActionName
         * @param {bool} isMother source request is mother?
         * @param {Function} afterSetPlanshet advanced action after  apply build planshet
         * @returns {void} заполянет настройки конфига для запроса, иделает ряд проверок
         */
        function getBuildList(service, actionName, isMother, afterSetPlanshet) {
            var uniqueId = service.getUniqueId();    
            var ignore = (uniqueId && (isMother !== planshetService.getItemById(uniqueId).IsMother));

            //console.log("getBuildList", {
            //    uniqueId: uniqueId,
            //    ignore: ignore,
            //    IsMother: planshetService.getItemById(uniqueId).IsMother
            //});
            if (isOnlyClose(ignore, uniqueId)) return;
            if (!(afterSetPlanshet instanceof Function)) {
                afterSetPlanshet = angular.noop;
            }

            getBuild(actionName, service.upgradeModel, afterSetPlanshet, uniqueId, isMother, ignore);
        }

        //#endregion

        //#region reqConfig

        //#region Mother
        function getMotherIndustrialComplexList() {
            getBuildList(GameServices.industrialComplexService, buildHubActionNames.GetMotherIndustrialComplex, true);
        };

        function getMotherLaboratoryList() {
            getBuildList(GameServices.laboratoryService, buildHubActionNames.GetMotherLaboratory, true);
        };

        function getMotherSpaceShipyardList() {
            getBuildList(GameServices.spaceShipyardService, buildHubActionNames.GetMotherSpaceShipyard, true);
        };

        //#endregion


        //#region Planet
        function getIndustrialComplexList() {
            getBuildList(GameServices.industrialComplexService, buildHubActionNames.GetIndustrialComplex, false);
        };

        function getCommandCenterList() {
            getBuildList(GameServices.commandCenterService, buildHubActionNames.GetCommandCenter, false);
        };

        function getSpaceShipyardList() {
            getBuildList(GameServices.spaceShipyardService, buildHubActionNames.GetSpaceShipyard, false);
        };

        //#endregion
        //#endregion

        //#region UpdateEstate
        function addBuildsToPlanshet(estateBuilds, isMother) {
            _.forEach(estateBuilds, function (item, i) {
                if (estateBuilds.hasOwnProperty(i)) {
                    //console.log("estateBuilds", estateBuilds);
                    fixBuildItem(item.UniqueId, getBuildItems(item), isMother);     
                    planshetService.addOrUpdatePlanshetModel(item);
                }
            });
            //   console.log("buildReqHelper.addBuildsToPlanshet");
            GameServices.buildService.upgradeEstateBuilds(isMother);

        }
        //#endregion

        this.getMotherIndustrialComplexList = getMotherIndustrialComplexList;
        this.getMotherLaboratoryList = getMotherLaboratoryList;
        this.getMotherSpaceShipyardList = getMotherSpaceShipyardList;
        this.getIndustrialComplexList = getIndustrialComplexList;
        this.getCommandCenterList = getCommandCenterList;
        this.getSpaceShipyardList = getSpaceShipyardList;      
        this.addBuildsToPlanshet = addBuildsToPlanshet;
    }
]);
Utils.CoreApp.gameApp.service("buildService", [
    function () {
        var $self = this;
        //#region buildIds

        var buildIds = Utils.RepoKeys.DataKeys.BuildIds;
        var map = {
            IndustrialComplex: 0,
            CommandCenter: 1,
            SpaceShipyard: 2,
            laboratory: 3
        };
        map.IC = map.IndustrialComplex;
        map.CC = map.CommandCenter;
        map.SS = map.SpaceShipyard;
        map.Lab = map.laboratory;

        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });
        function _isCurrentEstate(oldOwnId) {
            var ce = EM.EstateData.GetCurrentEstate();
            return oldOwnId === ce.EstateId;
        }


        //#endregion

        //todo  из за смены на гуид не верно отображается
        function isUnit(buildId) {
            //console.log("buildService", buildId);
            var unitNames = Utils.RepoKeys.DataKeys.UnitListNames();
            var result = false;
            _.forEach(unitNames, function (unitName, key) {
                if (unitName.toLowerCase() === buildId.toLowerCase()) {
                    result = true;
                    return false;
                }
            });
            return result;
        }



        function getServiceByGroupId(groupName) {
            //console.log();
            if (groupName === buildIds.GetBuildIdByIdx(map.IC)) {
                return GameServices.industrialComplexService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.CC)) {
                return GameServices.commandCenterService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.SS)) {
                return GameServices.spaceShipyardService;
            } else if (groupName === buildIds.GetBuildIdByIdx(map.Lab)) {
                return GameServices.laboratoryService;
            }
            return null;
        }


        var _timerRequestInProgress; 
        function _updateTechTimer(timerScope, itemData) {
            console.log("_updateTechTimer");
            if (_timerRequestInProgress) return true;
            if (!itemData.Progress) return true;
            //if (!itemData.Progress || !itemData.Progress.IsProgress) return true;
            var stop = GameServices.timerHelper.updateStringTimer(timerScope);
            if (stop) {
                var ownId = 0;
                _timerRequestInProgress = true;
                $self.$hub.techItemUpgraded(itemData.NativeName)
                    .then(function (answer) { 
                        var progress = answer;
                        console.log("_updateTechTimer.answer", { answer: answer, progress: progress });
                        if (progress.IsProgress) {   
                            var service = getServiceByGroupId(itemData.parentUniqueId);
                            if (service.hasOwnProperty("updateBuildProgress")) service.updateBuildProgress(itemData.NativeName, progress);
                            GameServices.timerHelper.registerBuildTimer(timerScope, progress, ownId);
                            _timerRequestInProgress = false;
                            console.log("_updateTechTimer.progress.IsProgress : data", {
                                answer: answer,
                                itemData: itemData,
                                service: service
                            });

                        }
                        else {
                            GameServices.estateService.getFullEstate(ownId, function () {
                                console.log("_updateTechTimer.progress.getFullEstate : finalize", {
                                    answer: answer,
                                    itemData: itemData,
                                    labItem: GameServices.laboratoryService.getItem(itemData.NativeName)
                                });
                                _timerRequestInProgress = false;
                            });
                        }
                    }, function (errorAnswer) {
                        _timerRequestInProgress = false;
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({
                            errorAnswer: errorAnswer,
                            msg: msg
                        }, "buildService._updateTechTimer");
                    });
            }
            return stop;
            //  
        }



        /**
         * 
         * @param {object} timerScope  - timerProgress directive scope 
         * @param {object} itemData - buildItem
         * @returns {bool} true - stop timer, false - update timer
         */
        function updateBuildTimer(timerScope, itemData) {
            //   console.log("updateBuildTimer", { timerScope: timerScope, itemData: itemData });
            if (itemData && itemData.AdvancedData && itemData.AdvancedData.TechOut) {
                return _updateTechTimer(timerScope, itemData);
            }
            var currentEstate = EM.EstateData.GetCurrentEstate();
            var ownId = currentEstate.EstateId;
            if (_timerRequestInProgress || timerScope.timerData.$ownId !== ownId || timerScope.timerData.$isUnit) return true;
 
            if (!itemData.Progress || !itemData.Progress.IsProgress) return true;
            var stop = GameServices.timerHelper.updateStringTimer(timerScope);
            if (stop) {
                if (ownId === 0) return true;
                function onFinally() {
                    _timerRequestInProgress = false;
                }
                function updateEstate() {
                    if (_isCurrentEstate(ownId)) {
                        GameServices.estateService.getFullEstate(ownId, onFinally);
                    }
                    else {
                        Utils.Console.Bold("clickSubmitBuyUpgrade.own changed", { itemData: itemData });
                    }
                }


                _timerRequestInProgress = true;
                var promise = $self.$hub.buildItemUpgraded(ownId, itemData.NativeName);
                promise.then(function (answer) {
                    if (!_isCurrentEstate(ownId)) return;
                    var progress = answer;
                    if (progress.IsProgress) {
                        var service = getServiceByGroupId(itemData.parentUniqueId);
                        if (service.hasOwnProperty("updateBuildProgress")) service.updateBuildProgress(itemData.NativeName, progress);
                        GameServices.timerHelper.registerBuildTimer(timerScope, progress, ownId);
                        onFinally();

                    } else updateEstate();

                }, function (errorAnswer) {
                    onFinally();
                    var msg = Errors.GetHubMessage(errorAnswer);
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        msg: msg
                    }, "buildService.updateBuildTimer");
                });

            }
            return stop;
        }



        function validatePrice(price, count) {
            var resources = GameServices.resourceService.getStorageResources().Current;
            var valid = true;
            _.forEach(resources, function (current, key) {
                var priceItem = price[key];
                if (current < priceItem * count) {
                    valid = false;
                    return false;
                }
            });
            return valid;
        };

        function validateCcPrice(ccPrice, count) {
            var ccItem = GameServices.resourceService.getCcItem();
            if (!ccItem) return false;
            var curCc = ccItem.Current;
            if (!curCc || !(typeof curCc === "number")) return false;
            return (curCc >= ccPrice * count);
        }

        var _requestSubmitBuildInProgress = false;

        function clickSubmitBuyUpgrade(section) {
            if (_requestSubmitBuildInProgress) return;

            if (!section) return;
            var update = section.Update;
            if (!update || !update.Price || !section.Progress) return;
            var price = update.Price;
            var canBeUpgrade = true;
            var count = 1;
            if (section.Progress.$isUnit) count = update.upgradeCount;
            else {
                canBeUpgrade = !section.Progress.IsProgress;
            }

            if (!canBeUpgrade) return;


            var validate = price.forCc ? validateCcPrice(price.Cc, count) : validatePrice(price, count);
            if (!validate) return;

            var currentEstate = EM.EstateData.GetCurrentEstate();
            // console.log("buildService.clickSubmitBuyUpgrade", currentEstate);

            var data = Utils.ModelFactory.UnitTurnOut();
            data.OwnId = currentEstate.EstateId;
            data.Count = +count;
            data.ForCc = price.forCc;
            data.NativeName = section.NativeName;

            function onFinally() {
                _requestSubmitBuildInProgress = false;
            }

            function updateEstate() {
                if (_isCurrentEstate(data.OwnId)) {
                    GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                }
                else {
                    onFinally();
                    Utils.Console.Bold("clickSubmitBuyUpgrade.own changed", { data: data });
                }

            }

            var hub = $self.$hub;
            var action;
            if (section.IsBuildItem) {
                action = hub.buildItemUpgrade;
                console.log("clickSubmitBuyUpgrade.section. IsBuildItem", {
                    section: section,
                    data: data
                });
            }
            else if (section.Progress.$isUnit) {
                action = hub.buildSpaceShipyardSetUnitTurn;
                console.log("clickSubmitBuyUpgrade.section. isUnit", {
                    section: section,
                    data: data
                });
            }
            else if (section.AdvancedData && section.AdvancedData.TechOut && !section.AdvancedData.TechOut.Disabled) {
                console.log("clickSubmitBuyUpgrade.section. is tech upgrade", {
                    section: section,
                    data: data
                });
                action = hub.buildLaboratorySetTechTurn;

            }
            else {
                console.log("clickSubmitBuyUpgrade.section undefinded", {
                    section: section,
                    data: data
                });
                throw new Error("No imp");
            }



            _requestSubmitBuildInProgress = true;
            action(data, section.NativeName)
                .then(function (answer) {
                    if (price.forCc && typeof answer === "number") {
                        GameServices.resourceService.setCc(answer);
                        updateEstate();
                    }
                    else if (answer === true) updateEstate();
                    else {
                        onFinally();
                        throw Errors.ClientNotImplementedException({
                            answer: answer,
                            requestData: data
                        }, "buildService.clickSubmitBuyUpgrade.responcce not impl");
                    }

                }, function (errorAnswer) {
                    onFinally();
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if (ErrorMsg.TechInProgress) {
                        //todо  обработать ошибку
                    }
                    throw Errors.ClientNotImplementedException({
                        errorAnswer: errorAnswer,
                        requestData: data,
                        msg: msg
                    }, "buildService.clickSubmitBuyUpgrade");
                });





        }

        function upgradeSubmit(params) {
            clickSubmitBuyUpgrade(params);
        }

        function actionSubmit(params, element, attrs, $scope) {
            var service = getServiceByGroupId(params.parentUniqueId);
            if (service && service.hasOwnProperty("actionSubmit")) {
                service.actionSubmit(params, element, attrs, $scope);
            }
            //console.log("buildService Hi actionSubmit", {
            //    params: params,
            //    element: element,
            //    attrs: attrs,
            //    $scope: $scope
            //});
        }

        //#region Update modules end scopes
        function upgradeMotherEnv() {
            GameServices.laboratoryService.upgradeModel();
        }

        function upgradePlanetEnv() {
            GameServices.commandCenterService.upgradeModel();
        }

        function upgradeCommonEnv() {
            //  console.log("buildService.upgradeCommonEnv");
            GameServices.industrialComplexService.upgradeModel();
            GameServices.spaceShipyardService.upgradeModel();
        }

        function upgradeEstateBuilds(isMotherState) {
            // console.log("buildService.upgradeEstateBuilds");
            upgradeCommonEnv();
            isMotherState ? upgradeMotherEnv() : upgradePlanetEnv();
        }

        //#endregion


        this.isUnit = isUnit;
        this.updateBuildTimer = updateBuildTimer;
        this.upgradeSubmit = upgradeSubmit;
        this.actionSubmit = actionSubmit;
        this.upgradeEstateBuilds = upgradeEstateBuilds;


    }
]);
Utils.CoreApp.gameApp.service("commandCenterService", [
    "mainHelper","planshetService",
    function (mainHelper, planshetService) {
        var commandCenter = {};
        var commandCenterUniqueId = Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(1);
  
        //#region Members
        //#endregion

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(commandCenterUniqueId);
        }
        function upgradeModel() {
            commandCenter = getPlanshetModel();
            if (planshetService.isCurrentModel(commandCenterUniqueId)) {
                planshetService.updatePlanshet(null, commandCenterUniqueId);
            }
        }

        this.getUniqueId = function () {
            return commandCenterUniqueId;
        };
        this.upgradeModel = upgradeModel;
        //#endregion

    }
]);
Utils.CoreApp.gameApp.service("industrialComplexService", [
    "mainHelper", "planshetService", "translateService",
    function (mainHelper, planshetService, translateService) {
        var $self = this;
        var hk = Utils.RepoKeys.HtmlKeys;
        var dk = Utils.RepoKeys.DataKeys;
        var icIds = {
            energyConverter: dk.EnergyConverter,
            extractionModule: dk.ExtractionModule,
            storage: dk.Storage
        };
        var industrialComplex = {}; 

        var industrialComplexUniqueId = dk.BuildIds.GetBuildIdByIdx(0);
        // declare common functions
        var getStorageData = null;
        var getStorageAction = null;
        var buildNames =   {
            ExtractionModule: dk.ExtractionModule,
            EnergyConverter: dk.EnergyConverter,
            Storage: dk.Storage
        }

        // local models
        function resourceItem(name) {
            return {
                current: 0,
                max: 0,
                persent: 0,
                showMax: false,
                title: "",
                htmlName: name,
                showItem: true
            };
        }

        function baseResourceItem(name, translateName) {
            return {
                NativeName: _.upperFirst(name),
                TranslateName: translateName,
                htmlName: _.lowerFirst(name)
            };
        }

        var toInt = Utils.ConvertToInt;


        var getExtractionModuleData = null;
        var getExtractionModule = null;

        var getEnergyConverterData = null;

        var resourceTranslateKeys = {
            Cc: "cc",
            E: "enegry",
            Ir: "iridium",
            Dm: "darkMatter"
        };


        //#region server ctrls
        var ctrls = {
            Storage: "Storage",
            SpaceShipyard: "SpaceShipyard",
            ExtractionModule: "ExtractionModule",
            EnergyConverter: "EnergyConverter"
        };
        var commonMethods = {
            Upgrade: "Upgrade",
            Upgraded: "Upgraded"
        };

        //#endregion

        //#region Helpers
        // $self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

 

        function reqParams() {
            return planshetService.reqParams();
        }

        /**
        * 
        * @param {string} url server url
        * @param {function} callback onSuccess
        * @param {object} data reqParams
        * @returns {void} 
        */
        function request(uniqueId, url, callback, data, method, ignore, onError) {
            if (ignore === undefined) ignore = true;
            var params = reqParams();
            params.data = data;
            params.url = url;
            params.onSuccess = callback;
            if (method) {
                params.method = method;
            }

            if ((onError instanceof Function)) {
                params.onError = onError;
            }
            planshetService.requestHelper(params, uniqueId, ignore, true);
        }

        /**
         * 
         * @param {string} ctrl  имя серверного контролера
         * @param {string} actionName имя серверного действия
         * @returns {string} url
         */
        function urlConstructor(ctrl, actionName) {
            return "/api/" + ctrl + "/" + actionName + "/";
        }

        /**
         * 
         * @param {number} cur  количество текущего ресурса
         * @param {number} max Максимальное значение для текущего ресурса
         * @returns {float} Percent Процент заполненности  текущего ресурса (без знака %)
         */
        function calcResPercent(cur, max) {
            if (cur && max) return (cur / max) * 100;
            return 0;
        }

        function getTranslate() {
            return translateService.getUnit();
        }

        function getIcCtrlScope() {
            var elem = angular.element("#buildContainer");
            if (elem && elem.length > 0) {
                if (elem.scope().hasOwnProperty("buildCtrl")) {
                    return elem.scope();
                }

            }
            return false;
        }

        /**
         * 
         * @param {int} animate milisecond
         * @returns {object} default slider config
         */
        function createEmptySlider(animate) {
            return {
                range: "min",
                max: 0,
                value: 0,
                step: 1,
                animate: animate || 300,
                slide: null,
                stop: null
            };
        }

        var baseResourceProportion = Utils.ModelFactory.MaterialResources(1, 2, 5);

        function calcBaseResourceProportionByNativeName(srcName, targetName, convertLoses) {
            return (baseResourceProportion[srcName] / baseResourceProportion[targetName]) * convertLoses;
        }

        function setNewStorageResources(newStorageresources) {
            getStorageData().StorageResources = newStorageresources;
            console.log("industrialComplexService.setNewStorageResources.retstartView");
            GameServices.resourceService.retstartView();

        }

        this.calcResPercent = calcResPercent;
        //#endregion

        //#region Members
        //#region Strorage Action View
        var storableItemPrefix = "storage-storable-item_";
        var showStorageTargetList = false;
        var storageStorableContainer;
        var resetStorage;
        var _submitStorageActionInProgress = false;

        /**
         * возвращает статус видимости обектов удаленного хранилища на основе которого строятся эллементы упраления, разрушения и создания дочерних эллементов Storage.Action
         * @returns {bool} show or hide target dom elements
         */
        function getStorageTargetShowStatus() {
            return showStorageTargetList;
        }
        function btnStorageSendAllResources() {
            if (!showStorageTargetList || !storageStorableContainer || _submitStorageActionInProgress) return;
            var sliderItemPrefix = "storage-transfer-slider-";
            var currentItems = 0;
            var storableItems = storageStorableContainer.storableItems;
            mainHelper.applyTimeout(function () {
                _.forEach(storableItems, function (storableItem, key) {
                    var sliderElement = angular.element("#" + sliderItemPrefix + storableItem.htmlName);
                    //sliderElement.slider("instance").options.slide(null, "100");
                    sliderElement.slider("value", storableItem.source.current);
                    console.log("sliderElement", storableItem);
                });
            });

            // console.log("storageStorableContainer", storageStorableContainer);
        }

        /**
        * Создает новую модель  из текущуей модели ресурсов для новой модели и готовит ее к дополнительным данным от других директив
        * @returns {array} StorableItems
        */
        function createStorageStorableContainer() {
            storageStorableContainer = {};

            function getBaseItem(name, translateName) {
                var obj = baseResourceItem(name, translateName);
                obj.showTarget = getStorageTargetShowStatus;
                obj.toTransfer = 0;
                obj.source = resourceItem(obj.htmlName);
                obj.target = resourceItem(obj.htmlName);
                return obj;
            }

            function beforeSetUpgradeResource() {
                var resource = _.cloneDeep(getStorageData().StorageResources);
                if (resource) {
                    _.forEach(resource.Current, function (value, key) {
                        resource.Current[key] = toInt(resource.Current[key]);
                    });
                    //console.log("beforeSetUpgradeResource", resource);
                    GameServices.resourceService.updateViewDataResourceByStorageResource(resource, true);
                }
            }

            beforeSetUpgradeResource();


            var storableResources = GameServices.resourceService.getEstateResources();

            var storableItems = [];


            _.forEach(storableResources, function (item, key) {
                if (item.NativeName !== "cc") {
                    var storableItem = getBaseItem(item.NativeName, item.TranslateName);
                    storableItem.source.current = item.Current;
                    storableItem.source.max = item.Max;
                    storableItem.source.persent = item.Percent;
                    storableItems.push(storableItem);
                }
            });

            var ce = EM.EstateData.GetCurrentEstate();
            //  console.log("industrialComplexService.createStorageStorableContainer", ce);

            storageStorableContainer.storableItems = storableItems;
            storageStorableContainer.SourceId = ce.EstateId;
            storageStorableContainer.SourceType = ce.EstateType;
            storageStorableContainer.TargetId = null;
            return storageStorableContainer;
        }

        var getStorageTransferLoses = function () {
            return getStorageData().Losses;
        };

        function setStorageTargetResources(answer, targetOwndId, advancedAction) {
            var targetRes = answer;
            var cur = targetRes.Current;

            _.forEach(cur, function (value, prop) {
                var targetIdx = _.findIndex(storageStorableContainer.storableItems, function (o) { return (o.NativeName === prop); });
                var item = storageStorableContainer.storableItems[targetIdx];
                item.target.current = toInt(cur[prop]);
                item.target.max = targetRes.Max[prop];
                item.target.persent = calcResPercent(item.target.current, item.target.max);
            });

            mainHelper.applyTimeout(function () {
                advancedAction();
                storageStorableContainer.TargetId = targetOwndId;
            });


        }

        //request

        /**
         * see hubService.buildStorageGetStorageResources
         * @param {int} targetOwndId 
         * @param {function} advancedAction 
         * @returns {void} 
         */
        function requestTargetStorableItems(targetOwndId, advancedAction) {
            var timerName = storableItemPrefix + targetOwndId;
            if (storageStorableContainer && storageStorableContainer.TargetId === targetOwndId && !GameServices.timerHelper.timeDelay.IsTimeOver(timerName)) {
                advancedAction();
                return;
            }
            resetStorage();
            var promise = $self.$hub.buildStorageGetStorageResources(targetOwndId);
            promise.then(function (answer) {
                setStorageTargetResources(answer, targetOwndId, advancedAction);
                GameServices.timerHelper.timeDelay.UpdateTimer(timerName, Utils.Time.ONE_MINUTE);
            }, function (errorAnswer) {
                var msg = Errors.GetHubMessage(errorAnswer);
                throw Errors.ClientNotImplementedException({
                    errorAnswer: errorAnswer,
                    msg: msg
                }, "industrialComplexService.requestTargetStorableItems");
            }); 
 
        }

        /**
         * Надстройка над модулем select2  и настройка параметров и событий для  всплвающего меню селекта для выбора планеты цели куда в дальнейшем необходимо передать ресурсы
         * @param {object} transferScope  скоуп в котором находится директива селекта
         * @param {object} element jQuery DOM element
         * @returns {void} 
         */
        function registerStorageTransferListEvents(transferScope, element) {
            var targetList = [
                {
                    OwnId: null,
                    Name: "Выбрать цель",
                    TextureTypeId: null
                }
            ];
            var curList = GameServices.estateService.getEstateListData();
            _.forEach(curList, function (listItem, key) {
                var ce = EM.EstateData.GetCurrentEstate();
                // console.log("industrialComplexService.registerStorageTransferListEvents", ce);
                if (listItem.OwnId !== ce.EstateId) {    
                    targetList.push({
                        OwnId: listItem.OwnId,
                        Name: listItem.Name,
                        TextureTypeId: listItem.TextureTypeId
                    });
                }
            });
            transferScope.targetTransferList = targetList;

            element.change(function (event) {
                var ownId = element.find(":selected")[0].value;
                if (ownId === "") showStorageTargetList = false;
                else {
                    ownId = +ownId;
                    requestTargetStorableItems(ownId, function () {
                        showStorageTargetList = true;
                    });

                }
            });

            //http://vanzzo.net/html-css/select2-jquery.html
            // containerCssClass  — добавит класс к контейнеру на который вы будете нажимать чтобы вызвать список.
            // dropdownCssClass — добавит класс к контейнеру который будет выпадать.
            // containerCss и dropdownCss  стили на прямую
            element.select2({
                //placeholder: 'Select an option',
                templateResult: function (optItemData) {
                    var itemHtml = $("<div/>", {
                        text: optItemData.text
                    });
                    var data = function () {
                        var elemData = _.find(targetList, function (o) {
                            return o.Name = optItemData.text;
                        });
                        //console.log("optItemData", optItemData);
                        if (elemData) {
                            //$(optItemData.element).data(kl.TextureTypeId);
                            var imgType = elemData.TextureTypeId;
                            if ($.isNumeric(imgType)) {
                                //return RepoTexturesAndImgList.GetIconSelectCss(imgType);
                                return "sprite_control_icons m map-object jumptomother";
                            }
                            return null;
                        }


                    };

                    var imgContainer = $("<span/>", {
                        "class": "main_directior_css_class " + data()
                    });
                    return itemHtml.prepend(imgContainer);
                },
                minimumInputLength: 0,
                //allowClear: true,
                containerCssClass: "select2-container-transfer",
                dropdownCssClass: "select2-dropdown-container-transfer"
            });
            //console.log("transferListScope", {
            //    element: element,
            //    scope: transferScope,
            //    "element.select2": element.select2
            //});
            return targetList;
        }

        /**
         * надстрйока над модулем  jQuery  slider  для создания элементов  range control и взаимодействия с ангуляр скоупом
         * @param {object} element jQuery DOM element
         * @param {object} scope Angular $scope  директивы biuldSlider в данноми экземплярe StorableItem 
         * @returns {void} 
         */
        function registerStorageSlider(element, scope) {
            var losses = getStorageTransferLoses();
            var data = scope.sliderData;
            var cloneData = _.cloneDeep(data);

            var slider = createEmptySlider();
            var value;
            var sourceKey = "source";
            var targetKey = "target";

            function calc(item, val, isTarget) {
                if (isTarget) {
                    var source = cloneData.source.current;
                    if (source - val < 0) val = source;
                    var t = cloneData[targetKey].current + (val * losses);

                    if (t > item.max) {
                        var delta = t - item.max;
                        item.current = item.max;
                        if (delta === 0) return val;
                        var fixedVal = val - toInt(delta / losses);
                        item.persent = calcResPercent(t, item.max);
                        return fixedVal;
                    }
                    item.current = toInt(t);
                    item.persent = calcResPercent(t, item.max);
                    return val;
                } else {
                    item.current = cloneData[sourceKey].current - val;
                    item.persent = calcResPercent(item.current, item.max);
                }


            }

            function slide(event, ui) {
                console.log("stopSlide");
                value = null;
                value = +ui.value;
                mainHelper.applyTimeout(function () {
                    var fixedVal = calc(data.target, value, true);
                    calc(data.source, fixedVal, false);
                    data.toTransfer = fixedVal;
                });

            }

            function stopSlide(event, ui) {
                console.log("stopSlide");
                value = null;
                value = +ui.value;
                var fixedVal = calc(data.target, value, true);

                if (fixedVal !== value) {
                    calc(data.source, fixedVal, false);
                    data.toTransfer = fixedVal;
                    element.slider("value", fixedVal);
                }
                data.toTransfer = fixedVal;
                //console.log("registerStorageSlider element", {
                //    storageStorableContainer: storageStorableContainer
                //});
            }

            slider.slide = slide;
            slider.stop = stopSlide;
            slider.max = cloneData.source.current;
            slider.change = function (e, ui) {
                slide(e, ui);
            };
            element.slider(slider);

        }

        resetStorage = function () {
            showStorageTargetList = false;
            createStorageStorableContainer();
            var scope = getIcCtrlScope();
            if (scope) scope.buildCtrl.storageStorableContainer = storageStorableContainer;
        };

        //#region Sibmit


        function submitStorageAction() {
            if (_submitStorageActionInProgress) return;
            //console.log("submitStorageAction", storageStorableContainer);
            var resources = Utils.ModelFactory.MaterialResources();

            var storableItems = storageStorableContainer.storableItems;

            var sumaryRes = 0;
            _.forEach(storableItems, function (storableItem, key) {
                var toTransfer = storableItem.toTransfer;
                resources[storableItem.NativeName] = toTransfer;
                sumaryRes += toTransfer;
            });

            if (sumaryRes < 3) {
                sumaryRes = 0;
                return;
            }

            function getType(id) {
                return (id === 0) ? false : true;
            }

            var data = {
                Resources: resources,
                SourceId: storageStorableContainer.SourceId,
                SourceType: storageStorableContainer.SourceType,
                TargetId: storageStorableContainer.TargetId,
                TargetType: getType(storageStorableContainer.TargetId)
            };
            // console.log("submitStorageAction", data);

            function onFinally() {
                _submitStorageActionInProgress = false;
            }


            var errorData = {
                retquestData: data
            }

            function onError(errorAnswer, isLocl) {
                onFinally();
                if (!isLocl) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    errorData.msg = msg;
                    errorData.errorAnswer = errorAnswer;
                    errorData.isLocl = isLocl;
                }
                resetStorage();
                throw Errors.ClientNotImplementedException(errorData, "submitStorageAction.DoTransfer");
            }

            _submitStorageActionInProgress = true;
 


              var promise = $self.$hub.buildStorageDoTransfer(data);
            promise.then(function (answerOk) {
                if (answerOk) {
                    var ce = EM.EstateData.GetCurrentEstate();
                    if (data.SourceId === ce.EstateId) {
                        GameServices.estateService.getFullEstate(data.SourceId, onFinally);
                    }
                    else {
                        errorData.CurrentEstate = ce;
                        throw onError("submitStorageAction own is changed", true);
                    }
                }
                else throw onError("Not transfered", true);

            }, onError);


        }

        //#endregion

        this.getStorageTargetShowStatus = getStorageTargetShowStatus;
        this.requestTargetStorableItems = requestTargetStorableItems;
        this.createStorageStorableContainer = createStorageStorableContainer;
        this.registerStorageTransferListEvents = registerStorageTransferListEvents;
        this.registerStorageSlider = registerStorageSlider;


        //#endregion

        //#region Extraction Action View


        function getExtractionPower() {
            return getExtractionModuleData().Power;
        }

        function getExtractionPowerData() {
            return getTranslate().productionPower + " : " + getExtractionPower();
        }

        var extractionContainer;
        var submitExtractionActionInProgress = false;

        function getExtractionContainer() {
            extractionContainer = {};

            var translate = getTranslate();
            var epd = getExtractionModuleData();
            var resourcesPerHour = epd.ExtractionPerHour;
            var persents = epd.Percent;

            var productionItems = [];

            function resProductionItem(name, curPercent, eph) {
                var translateName = translate[resourceTranslateKeys[name]];
                var obj = baseResourceItem(name, translateName);
                obj.currentPercent = curPercent || 0;
                obj.targetPersent = 0;
                obj.extractionPerHour = eph || 0;
                obj.freePercent = 0;
                obj.power = epd.Power;
                return obj;
            }

            _.forEach(persents, function (curPercentVal, prop) {
                var curEph = toInt(resourcesPerHour[prop]);
                var item = resProductionItem(prop, curPercentVal, curEph);
                productionItems.push(item);
            });

            var ce = EM.EstateData.GetCurrentEstate();
            //  console.log("industrialComplexService.getExtractionContainer", ce);
            extractionContainer.productionItems = productionItems;
            extractionContainer.OwnId = ce.EstateId;

            return extractionContainer;

        }

        var undoExtractionContainer;

        function registerExtractionSlider(element, scope) {
            var data = scope.sliderData;
            undoExtractionContainer = _.cloneDeep(extractionContainer);
            var reources = extractionContainer.productionItems;


            var resName = data.NativeName;
            var baseResProportion = baseResourceProportion[resName];
            var power = data.power;

            function getFreePercent() {
                var p = 100;
                _.forEach(reources, function (resource, key) {
                    p -= resource.currentPercent;
                });
                //console.log("getFreePercent", p);
                return p;
            }

            function convertPercentToResValue(percent) {
                var part = percent / 100;
                return part * (power / baseResProportion);
            }

            var slider = createEmptySlider();

            function setFreePercent(freePercent) {
                _.forEach(reources, function (value, key) {
                    reources[key].freePercent = freePercent;
                });
            }

            function setSlider(val) {
                data.currentPercent = val;
                data.extractionPerHour = toInt(convertPercentToResValue(val));
                setFreePercent(getFreePercent());
            }

            var multiple = 100;

            function slide(event, ui) {
                //console.log("slide");
                var result = true;
                var value = +ui.value;
                var scale = value / multiple;
                mainHelper.applyTimeout(function () {
                    if (data.freePercent > 0) {
                        if (data.currentPercent + data.freePercent >= scale) {
                            setSlider(scale);
                        } else {
                            setSlider(data.currentPercent + data.freePercent);
                        }
                        return result;
                    } else if (data.currentPercent > scale) {
                        setSlider(scale);
                    } else {
                        result = false;
                    }


                });
                return result;


            }

            function stopSlide(event, ui) {
                if (data.freePercent <= 0) {
                    element.slider(
                    {
                        value: data.currentPercent * multiple
                    });
                }
            }

            slider.slide = slide;
            slider.stop = stopSlide;
            slider.max = 100 * multiple;
            slider.value = data.currentPercent * multiple;
            element.slider(slider);
        }

        function resetExtraction(fromBtn) {
            if (fromBtn) {
                var scope = getIcCtrlScope();
                if (scope) {
                }
            }
            getExtractionContainer();
            //var sliderPrefix = "extraction-slider-";

        }

        //#region Sibmit
        function submitExtractionAction() {
            if (submitExtractionActionInProgress) return;
            submitExtractionActionInProgress = true;

            var proportion = Utils.ModelFactory.MaterialResources();

            var productionItems = extractionContainer.productionItems;

            _.forEach(productionItems, function (productionItem, key) {
                proportion[productionItem.NativeName] = productionItem.currentPercent;
            });

            var fullPersent = 100;
            var sum = proportion.E + proportion.Ir + proportion.Dm;
            var k = sum / fullPersent;
            proportion.E = proportion.E / k;
            proportion.Ir = proportion.Ir / k;
            proportion.Dm = proportion.Dm / k;

            var data = {
                OwnId: extractionContainer.OwnId,
                Proportion: proportion
            }

            var errorData = {
                retquestData: data
            }

            function onFinally() {
                submitExtractionActionInProgress = false;
            }

            function onError(errorAnswer, isLocl) {
                onFinally();
                if (!isLocl) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    errorData.msg = msg;
                    errorData.errorAnswer = errorAnswer;
                    errorData.isLocl = isLocl;
                }
                resetExtraction();
                throw Errors.ClientNotImplementedException(errorData, "submitExtractionAction");
            }

            var promise = $self.$hub.buildExtractionModuleChangeProportion(data);
            promise.then(function (answerOk) {
                if (answerOk) {
                    var ce = EM.EstateData.GetCurrentEstate();
                    if (data.OwnId === ce.EstateId) {
                        GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                    }
                    else {
                        errorData.CurrentEstate = ce;
                        throw onError("submitExtractionAction own is changed", true);
                    }

                }
                else throw onError("Proportion not changed", true);

            }, onError);

        }

        //#endregion

        this.getExtractionPowerData = getExtractionPowerData;
        this.getExtractionContainer = getExtractionContainer;
        this.registerExtractionSlider = registerExtractionSlider;


        //#endregion

        //#region EnergyConverter Action View

        //#region Data Acces
        function getExchangeCource() {
            return getEnergyConverterData().ConvertLoses;
        }

        function getExchangeCourceData() {
            return getTranslate().exchangeCourse + " : " + getExchangeCource();
        }

        function upgradeEcStorageFromPlanshet() {
            getEnergyConverterData().StorageResources = _.cloneDeep(getStorageData().StorageResources);
        }

        this.getExchangeCourceData = getExchangeCourceData;
        //#endregion

        //#region animate view update

        //base;
        var convertableKeyResults = {
            notChanged: 1,
            isSource: 2,
            isTarget: 4
        };

        function ecSliderData() {
            return {
                maximum: 0,
                rate: null,
                sourceHtmlName: "",
                targetHtmlName: "",
                toTransfer: {}
            };
        }

        var resetEnergyConverter;
        var energyConverterContainer;
        var upgradeResourceConnection;
        var updateExchangeInputModel;
        var resetEnergyConverterSlider;
        var _submitEcActionInProgress = false;

        function getEnergyConverterContainer() {
            energyConverterContainer = {};

            var translate = getTranslate();

            function getBaseItem(name) {
                var translateName = translate[resourceTranslateKeys[name]];
                var obj = baseResourceItem(name, translateName);
                obj.source = resourceItem(obj.htmlName);
                obj.target = resourceItem(obj.htmlName);
                return obj;
            }

            var storageResource = getEnergyConverterData().StorageResources;
            var cur = storageResource.Current;
            var max = storageResource.Max;

            function setItem(item, nativeName) {
                item.current = toInt(cur[nativeName]);
                item.max = max[nativeName];
                item.persent = calcResPercent(cur[nativeName], item.max);

            }

            var convertableItems = [];

            _.forEach(cur, function (value, resName) {
                var convertableItem = getBaseItem(resName);
                setItem(convertableItem.source, resName);
                setItem(convertableItem.target, resName);
                convertableItem.upgradeConnecton = upgradeResourceConnection;
                convertableItems.push(convertableItem);
            });


            energyConverterContainer.activeConnectionData = ecSliderData();
            energyConverterContainer.convertableItems = convertableItems;
            energyConverterContainer.findItemByName = function (name) {
                name = name.toLowerCase();
                return _.find(energyConverterContainer.convertableItems, function (o) {
                    return o.htmlName === name;
                });
            };
            energyConverterContainer.getItemByType = function (name, isTarget) {
                var key = isTarget ? "target" : "source";
                return energyConverterContainer.findItemByName(name)[key];
            }
            energyConverterContainer.getStorageResources = function () {
                return _.cloneDeep(getEnergyConverterData().StorageResources);
            }
            energyConverterContainer.upgradeConvertableItems = function () {
                function updateData(item) {
                    var name = item.NativeName;
                    var sr = energyConverterContainer.getStorageResources();
                    var current = sr.Current[name];
                    var itemMax = sr.Max[name];
                    item.source.current = toInt(current);
                    item.source.max = itemMax;
                    item.source.persent = calcResPercent(item.source.current, item.source.max);

                    item.target.current = toInt(current);
                    item.target.max = itemMax;
                    item.target.persent = calcResPercent(item.target.current, item.target.max);
                }

                var items = energyConverterContainer.convertableItems;
                _.forEach(items, function (item, key) {
                    updateData(item);
                });

            }
            energyConverterContainer.getRate = function () {
                return energyConverterContainer.activeConnectionData.rate;
            };
            energyConverterContainer.updateRate = function (srcName, targetName) {
                energyConverterContainer.activeConnectionData.rate = calcBaseResourceProportionByNativeName(srcName, targetName, getExchangeCource());
            };
            return energyConverterContainer;
        }

        var eConverterSliderRegistred = false;

        function registerEnergyConverterSlider(element) {
            eConverterSliderRegistred = true;
            var slider = createEmptySlider();
            slider.slide = function (event, ui) {
                var value = +ui.value;
                updateExchangeInputModel(true, value);
            };
            slider.max = 0;
            element.slider(slider);
            //console.log("registerEnergyConverterSlider", element);
        }


        resetEnergyConverterSlider = function () {
            registerEnergyConverterSlider($("#energy-converter-slider"));
        }

        function updateEnergyConverterSlider(max, value) {
            var element = $("#energy-converter-slider");
            element.slider("option", "max", max);
            element.slider("option", "value", value);
        }

        function updateValueEnergyConverterSlider(newValue) {
            $("#energy-converter-slider").slider("option", "value", newValue);
        }

        updateExchangeInputModel = function (notUpdateSlider, value) {
            var scope = getIcCtrlScope().buildCtrl;
            if (typeof scope.exchangeInputModel !== "number") scope.exchangeInputModel = 0;
            var inputModel = scope.exchangeInputModel;
            var activeConnectionData = energyConverterContainer.activeConnectionData;
            var maximum = activeConnectionData.maximum;
            if (typeof value === "number") inputModel = value;


            function findItem(resName) {
                return _.find(energyConverterContainer.convertableItems, function (o) { return (o.htmlName === resName) });
            }

            var resources = _.cloneDeep(getStorageData().StorageResources);

            function upgradeItem(item, isTarget, rate, newCount) {
                var operator = isTarget ? 1 : -1;
                var key = isTarget ? "target" : "source";
                var nativeName = item.NativeName;
                var count = resources.Current[nativeName] + (newCount * operator * rate);
                var intCount = toInt(count);
                item[key].current = intCount;
                item[key].persent = calcResPercent(count, resources.Max[nativeName]);
            }

            var sourceConvertable = findItem(activeConnectionData.sourceHtmlName);
            var targetConvertable = findItem(activeConnectionData.targetHtmlName);
            if (!targetConvertable) {
                scope.exchangeInputModel = 0;
                return;
            }
            mainHelper.applyTimeout(function () {
                scope.exchangeInputModel = (inputModel > maximum) ? maximum || 0 : inputModel;
                upgradeItem(sourceConvertable, false, 1, scope.exchangeInputModel);
                upgradeItem(targetConvertable, true, activeConnectionData.rate, scope.exchangeInputModel);

                activeConnectionData.toTransfer = inputModel;
                if (!notUpdateSlider) updateValueEnergyConverterSlider(inputModel);
            });


        }


        function svgAnimation(convertableItem, isSource, delay) {
            var resNativeName = convertableItem.NativeName;
            var resHtmlName = convertableItem.htmlName;
            var sourceKey = isSource ? "source" : "target";
            var pathId = sourceKey + "-path-res";
            var gradientId = sourceKey + "-connection-gradient";

            var linearGradientElement = $("#" + gradientId);
            var pathElement = $("#" + pathId);

            var centrItemElement = $("#exchange-connection-value-conteiner");

            var parentSelectorContainer = ".exchange-connection-container";
            var selectiorConnectionItem = "exchange-connection-item";
            var activeElement = pathElement.parents("." + selectiorConnectionItem);

            var resColors = Utils.ModelFactory.MaterialResources();
            resColors.E = "#30c4c8";
            resColors.Ir = "#98cfd6";
            resColors.Dm = "#9365c4";


            function gradientColor(startColor, endColor) {
                return {
                    startColor: startColor,
                    endColor: endColor
                };
            }

            function getGradientColor() {
                if (isSource) {
                    return gradientColor(resColors[resNativeName], resColors.E);
                }
                return gradientColor(resColors.E, resColors[resNativeName]);
            }

            function setGradientColor() {
                var colors = getGradientColor();
                var stopsColor = linearGradientElement.find("stop");
                var startGradient = $(stopsColor[0]);
                var end = $(stopsColor[2]);
                startGradient.attr("stop-color", colors.startColor);
                end.attr("stop-color", colors.endColor);
            }


            var pathPoints;

            function getResPath() {
                if (!pathPoints) {
                    var createPath = function (source) {
                        var model = Utils.ModelFactory.MaterialResources();
                        if (source) {
                            model.E = "M0,17 C96,17 0,96 93,96";
                            model.Ir = "m0,96 96,1";
                            model.Dm = "M0,174 C93,174 0,96 93,96";
                            return model;
                        }
                        model.E = "M0,96 C93,96 0,17 93,17";
                        model.Ir = "m0,96 93,1";
                        model.Dm = "M0,96 C93,96 0,174 93,174";
                        return model;
                    };

                    pathPoints = {};
                    pathPoints.source = createPath(true);
                    pathPoints.target = createPath(false);
                }
                return isSource ? pathPoints.source : pathPoints.target;
            }

            function setPath() {
                var resPath = getResPath()[resNativeName];
                pathElement.attr("class", "connection-item " + resHtmlName);
                pathElement.attr("d", resPath);
            }


            function setConfig() {
                activeElement.attr("class", selectiorConnectionItem + " active " + resHtmlName);
                setGradientColor();
                setPath();
            }

            function activateConnection(hide) {
                var container = $(parentSelectorContainer);
                var active = hk.CssActive;
                var items = container.find("." + active);
                var hasActive = items && items.length > 0;
                var input = centrItemElement.find("input");

                function updateInput(activate) {
                    if (activate) {
                        input.removeAttr("readonly");
                    } else {
                        input.attr("readonly", "readonly");
                    }
                }

                function activateCentr(activate) {
                    activate ? centrItemElement.addClass(active) : centrItemElement.removeClass(active);
                }


                function clean(jqObj) {
                    jqObj.attr("class", selectiorConnectionItem);
                }

                function hideAll() {
                    items.each(function (idx) {
                        clean($(this));
                    });
                }

                if (hide) {
                    hideAll();
                    activateCentr(false);
                    return null;
                }

                if (!hasActive) {
                    activateCentr(true);
                    setConfig();
                    return convertableKeyResults.isSource;
                }
                if (activeElement.hasClass(resHtmlName)) return convertableKeyResults.notChanged;


                if (isSource) {
                    activateCentr(false);
                    updateInput(false);
                    hideAll();
                    setTimeout(function () {
                        activateCentr(true);
                        setConfig();
                    }, delay);
                    //console.log("isSource");
                    return convertableKeyResults.isSource;
                } else if ($(items[0]).hasClass(resHtmlName)) return convertableKeyResults.notChanged;
                else {
                    clean(activeElement);
                    setTimeout(function () {
                        updateInput(true);
                        setConfig();
                    }, delay);
                    return convertableKeyResults.isTarget;
                }


            }

            return activateConnection;

        }

        upgradeResourceConnection = function (convertableItem, isSource, hide) {
            _submitEcActionInProgress = true;
            var delay = 300;

            var animConfig = svgAnimation(convertableItem, isSource, delay);
            var upgradeType = animConfig(hide);
            if (hide) return;

            var activeData = energyConverterContainer.activeConnectionData;

            if (upgradeType === convertableKeyResults.notChanged) return;
            else if (upgradeType === convertableKeyResults.isSource) {
                energyConverterContainer.upgradeConvertableItems();

                activeData.sourceHtmlName = convertableItem.htmlName;
                activeData.maximum = 0;
                updateEnergyConverterSlider(0, 0);
                updateExchangeInputModel(true, 0);
                return;
            } else if (upgradeType === convertableKeyResults.isTarget) {
                if (convertableItem.htmlName === activeData.sourceHtmlName) {
                    if (SHOW_DEBUG) {
                        Utils.Console.Error("последовательность не верна", {
                            convertableItem: convertableItem,
                            isSource: isSource,
                            upgradeType: upgradeType,
                            convertableKeyResults: convertableKeyResults,
                            energyConverterContainer: energyConverterContainer,
                            activeData: activeData
                        });
                    }
                    return;
                }
                var sr = energyConverterContainer.getStorageResources();

                activeData.targetHtmlName = convertableItem.htmlName;
                var sourceItem = energyConverterContainer.findItemByName(activeData.sourceHtmlName);
                energyConverterContainer.updateRate(sourceItem.NativeName, convertableItem.NativeName);
                var sourceCount = sr.Current[sourceItem.NativeName];
                var targetCount = sr.Current[convertableItem.NativeName];

                convertableItem.target.max = sr.Max[convertableItem.NativeName];
                convertableItem.target.current = toInt(targetCount);
                var freeTarget = convertableItem.target.max - convertableItem.target.current;
                var maximum = freeTarget / energyConverterContainer.getRate();
                if (sourceCount <= maximum) {
                    maximum = sourceCount;
                }
                activeData.maximum = toInt(maximum);
                updateEnergyConverterSlider(activeData.maximum, 0);
                _submitEcActionInProgress = false;
            }
        }

        resetEnergyConverter = function () {
            _submitEcActionInProgress = false;
            upgradeEcStorageFromPlanshet();
            energyConverterContainer = {};
            getEnergyConverterContainer();
            if (eConverterSliderRegistred) {
                //resetEnergyConverterSlider();
                upgradeResourceConnection(energyConverterContainer.findItemByName("e"), true, true);
            }

        }
        this.getEnergyConverterContainer = getEnergyConverterContainer;
        this.updateExchangeInputModel = updateExchangeInputModel;
        this.registerEnergyConverterSlider = registerEnergyConverterSlider;

        //#endregion


        //#region Sibmit

        function submitEcAction(btnParams, element, attrs, $scope) {
            if (!energyConverterContainer) return;
            var actionData = energyConverterContainer.activeConnectionData;
            if (actionData && actionData.toTransfer > 0 && !_submitEcActionInProgress) {
                var sr = energyConverterContainer.getStorageResources();
                var targetItem = energyConverterContainer.findItemByName(actionData.targetHtmlName);
                if (targetItem.target.current - sr.Current[targetItem.NativeName] < 1) return;

                var sourceItem = energyConverterContainer.findItemByName(actionData.sourceHtmlName);
                if (sourceItem.source.current < 0) return;
                _submitEcActionInProgress = true;
                var ce = EM.EstateData.GetCurrentEstate();
                //   console.log("industrialComplexService.submitEcAction", ce);
                var data = {
                    OwnId: ce.EstateId,
                    From: sourceItem.NativeName,
                    To: targetItem.NativeName,
                    ToConvert: actionData.toTransfer
                }

                var errorData = {
                    btnParams: btnParams,
                    $scope: $scope,
                    sr: sr,
                    targetItem: targetItem,
                    data: data
                };
                function onFinally() {
                    _submitEcActionInProgress = true;
                }
                function onError(errorAnswer, isLocl) {
                    if (!isLocl) {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        errorData.msg = msg;
                        errorData.errorAnswer = errorAnswer;
                        errorData.isLocl = isLocl;
                    }

                    onFinally();
                    throw Errors.ClientNotImplementedException(errorData, "submitEcAction");
                }

                var promise = $self.$hub.buildEnergyConverterExchangeResource(data);

                promise.then(function (answerOk) {
                    if (answerOk) {
                        var ce = EM.EstateData.GetCurrentEstate();
                        if (data.OwnId === ce.EstateId) {
                            GameServices.estateService.getFullEstate(data.OwnId, onFinally);
                        }
                        else {
                            errorData.CurrentEstate = ce;
                            throw onError("submitEcAction own is changed", true);
                        }
                    }
                    else throw onError("submitEcAction.not updated", true);
                }, onError);
            }


        }

        //#endregion

        //#endregion


        //#endregion

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(industrialComplexUniqueId);
        }

        function upgradeModel() {
            //console.log("upgradeModel");
            industrialComplex = getPlanshetModel();
            //console.log("upgradeModel", getStorageData().StorageResources.Current.E);
            resetStorage();
            resetExtraction();
            resetEnergyConverter();
            var scope = getIcCtrlScope();
            if (scope) {
                //scope.buildCtrl.storageStorableContainer = createStorageStorableContainer();
                scope.buildCtrl.extractionContainer = extractionContainer;
                scope.buildCtrl.energyConverterContainer = energyConverterContainer;
            }
            if (planshetService.isCurrentModel(industrialComplexUniqueId)) {
                planshetService.updatePlanshet(null, industrialComplexUniqueId);
            }


        }

        function actionSubmit(params, element, attrs, $scope) {
            if (params.NativeName === buildNames.Storage) {
                submitStorageAction(params, element, attrs, $scope);
            }
            else if (params.NativeName === buildNames.ExtractionModule) {
                submitExtractionAction(params, element, attrs, $scope);
            }
            else if (params.NativeName === buildNames.EnergyConverter) {
                submitEcAction(params, element, attrs, $scope);
            }
        }

        function getBuildCollection() {
            return industrialComplex.Bodys[0].TemplateData;
        }

        function getBuildByName(name) {
            return _.find(getBuildCollection(), function (o) {
                return (o.NativeName === name);
            });
        }

        function getStorage() {
            return getBuildByName(icIds.storage);
        }
        getStorageAction = function () {
            return getStorage().Action;
        }

        getStorageData = function () {
            return getStorageAction().Data;
        };

        getExtractionModule = function () {
            return getBuildByName(icIds.extractionModule);
        };

        getExtractionModuleData = function () {
            return getExtractionModule().Action.Data;
        };

        function getEnergyConverter() {
            return getBuildByName(icIds.energyConverter);

        }

        getEnergyConverterData = function () {
            return getEnergyConverter().Action.Data;

        };

        function updateBuildProgress(nativeName, newProgress) {
            if (nativeName === buildNames.Storage) {
                getStorage().Progress = newProgress;
            }
            else if (nativeName === buildNames.ExtractionModule) {
                getExtractionModule().Progress = newProgress;
            }
            else if (nativeName === buildNames.EnergyConverter) {
                getEnergyConverter().Progress = newProgress;
            }
        }


        this.getUniqueId = function () {
            return industrialComplexUniqueId;
        };
        this.upgradeModel = upgradeModel;
        this.getStorage = getStorage;
        this.getStorageData = getStorageData;
        this.getExtractionModuleData = getExtractionModuleData;
        this.actionSubmit = actionSubmit;
        this.updateBuildProgress = updateBuildProgress;
        this.btnStorageSendAllResources = btnStorageSendAllResources;
        //#endregion
    }
]);



Utils.CoreApp.gameApp.service("laboratoryService", ["planshetService", "techTreeHelper",
    function (planshetService, techTreeHelper) {
        var $self = this;

        //#region Members
        //#endregion 

        //#region Require   
        this.getUniqueId = function () {
            return $self._laboratoryUniqueId;
        };
        this.upgradeModel = function () {
            if (planshetService.isCurrentModel($self._laboratoryUniqueId)) {
                planshetService.updatePlanshet(null, $self._laboratoryUniqueId);
            }
        };

        var lockTechItem = false;
        function unlockDialogTech() {
            lockTechItem = false;
        };

        this.setTechViewData = function (statisticHelper, techItem) {
            //StatModel
            if (!techItem.Info.infoStatsModel) {
                var data = techItem.Info.Data;
                var props = data.Properties;
                var stats = [];
               // console.log("setTechViewData", data);
                _.forEach(props, function (val, key) {
       
                    var propVal = val.CurrentValue;
                    if (!propVal) {
                        propVal = val.BaseValue;
                    }
                    if (key !== "Level" && propVal) {
                        propVal = _.round(propVal, 2);
                        propVal += "%";
                        propVal = "+" + propVal;
                    }
     
                    stats.push(statisticHelper.createStatItemModel(val.PropertyName, propVal));
                });
                var img = statisticHelper.createBgImage(techItem.Info.DropImage, techItem.TranslateName);
                img.onClick = function ($event) {
                   
                    //GameServices.techTreeHelper.createTechTreeDialog($event);
                };
                techItem.Info.infoStatsModel = statisticHelper.createStatisticModel(stats, img);
            }

            //clicks
            var col = techItem.ComplexButtonView.Collection;
            var info = col[0];
            var detail = col[1];
            var update = col[2];
            info.$onClick   = function ($event) {
                if (lockTechItem) return;
                lockTechItem = true;
                GameServices.unitDialogService.CreateTechDetailDialog($event, unlockDialogTech, techItem.NativeName);

            };
            detail.$onClick = function ($event) {
                GameServices.techTreeHelper.createTechTreeDialog($event);
            };
            update.$onClick = function ($event) {     
                if (lockTechItem) return;
                lockTechItem = true;
                GameServices.unitDialogService.CreateBuyTechDialog($event, unlockDialogTech, techItem.NativeName);
            };

            
            // css
            //techItem.$mainContainerItemCss  
            if (techItem.AdvancedData.TechOut.Disabled && !techItem.$mainContainerItemCss) {
                Object.defineProperty(techItem, "$mainContainerItemCss", {
                    get: function () {
                        return techItem.AdvancedData.TechOut.Disabled ? " grayScale " : "";
                    }
                });
            }
        };

        this.$planshetIndex = null;
        Object.defineProperty(this, "_laboratoryUniqueId", {
            value: Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(3),
            writable: false,
            configurable: false
        });

        Object.defineProperty(this, "$laboratoryModel", {
            get: function () {
                if (!$self.$planshetIndex) {
                    $self.$planshetIndex = planshetService.getModelIndex($self._laboratoryUniqueId);
                    if (!$self.$planshetIndex) {
                        return null;
                    }
                }
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model && model.UniqueId === $self._laboratoryUniqueId) {
                    return model;
                }
                if (!model || model.UniqueId !== $self._laboratoryUniqueId) {
                    $self.$planshetIndex = planshetService.getModelIndex($self._laboratoryUniqueId);
                    model = planshetService.$planshetModels[$self.$planshetIndex];
                    if (!model) {
                        $self.$planshetIndex = null;
                        return null;
                    }
                    return model;
                }
                return null;
            }
        });
        this.getCollection = function () {
            var m = $self.$laboratoryModel;
            if (!m) return null;
            return m.Bodys[0].TemplateData;
        };

        this.getItem = function (techNativeName, invariant) {
            var col = $self.getCollection();
            if (!col) return null;
            if (invariant) {
                var name = techNativeName.toLowerCase();
                return _.find(col, function (o) {
                    return o.NativeName.toLowerCase() === name;
                });
            }
            return _.find(col, function (o) {
                return o.NativeName === techNativeName;
            });
        }

        this.updateBuildProgress = function (techNativeName, newProgress) {
            var item = $self.getItem(techNativeName);
            if (!item) {
                console.log("updateBuildProgress.tech item not exist", {
                    techNativeName: techNativeName,
                    newProgress: newProgress,
                    $self: $self,
                });
            }
            Utils.UpdateObjFromOther(item.Progress, newProgress);
            Utils.UpdateObjFromOther(item.AdvancedData.TechOut.Progress, newProgress);


        };
        //#endregion
    }
]);
Utils.CoreApp.gameApp.service("spaceShipyardService", [
    "mainHelper", "planshetService",
    function (mainHelper, planshetService) {
        var spaceShipyard = {};
        var spaceShipyardUniqueId = Utils.RepoKeys.DataKeys.BuildIds.GetBuildIdByIdx(2);
        
        //#region Members
        var _unitRequestInProgress = false;

        /**
         * 
         * @param {object} timerScope  - timerProgress directive scope 
         * @param {object} itemData - buildItem
         * @returns {bool} true - stop timer, false - update timer
         */
        function requestUpdateCurrentEstate(ownId) {
            var finaly = function () {
                _unitRequestInProgress = false;
            };
            _unitRequestInProgress = true;
            var getInProgress = planshetService.getInProgress;
            if (getInProgress()) {
                var t = setInterval(function () {
                    var ce = EM.EstateData.GetCurrentEstate();
                    //  console.log("spaceShipyardService.requestUpdateCurrentEstate", ce);
                    if (ce.EstateId !== ownId) {
                        clearInterval(t);
                        finaly();
                        return;
                    } else if (!getInProgress()) {
                        GameServices.estateService.getFullEstate(ownId, finaly, false);
                        clearInterval(t);
                        return;
                    }
                }, 100);


            } else GameServices.estateService.getFullEstate(ownId, finaly, false);

        }

        function getBuildCollection() {
            return spaceShipyard.Bodys[0].TemplateData;
        }

        function isActiveModel() {
            return planshetService.isCurrentModel(spaceShipyardUniqueId);
        }


        function upgradeShipyardUnits() {
            var units = getBuildCollection();
            var shipyardIsActive = isActiveModel();
            var timerService = GameServices.timerHelper;
            var needServerUpdate = false;

            _.forEach(units, function (unit, key) {
                var name = unit.NativeName;
                var progress = unit.Progress;

                if (name === Utils.RepoKeys.DataKeys.SpaceShipyard || !progress.IsProgress) return;
                if (typeof progress._duration === "number" && progress._duration <= 0) {
                    needServerUpdate = true;
                    return;
                }
 

                var startTime = progress.StartTime;

                var turnedUnit = progress.Advanced;
                var startTurnTime = turnedUnit.DateCreate;
                var totalCount = turnedUnit.TotalCount;
                var readyUnits = turnedUnit.ReadyUnits;

                if (!progress._ups) {
                    progress._ups = progress.RemainToComplete / progress.Duration;
                    progress._duration = _.clone(progress.Duration);
                    progress._remainToСomplete = _.clone(progress.RemainToComplete);
                    progress.__remainToComplete = totalCount - readyUnits;
                    turnedUnit.UnitToSave = turnedUnit.ReadyUnits - Math.floor(turnedUnit.ReadyUnits);
                };
                var ups = progress._ups;


                turnedUnit.UnitToSave += ups;
                progress.__remainToComplete -= ups;
                progress._remainToComplete = Math.ceil(progress.__remainToComplete);
                var intUnitToSave = Math.floor(turnedUnit.UnitToSave);
                if (turnedUnit.UnitToSave >= 1) {
                    turnedUnit.UnitToSave -= intUnitToSave;
                    progress.Level += intUnitToSave;
                }
                var unitProgress = turnedUnit.UnitToSave * 100;
                if (unitProgress > 100) unitProgress = 0;
                if (!progress.verticalIndicator) {
                    progress.verticalIndicator = timerService.getIndicator(true, unitProgress);
                }
                else {
                    Utils.UpdateObjFromOther(progress.verticalIndicator, timerService.getIndicator(true, unitProgress));
                }
             
                progress._duration--;


                if (shipyardIsActive) {
                   //var htmlName = _.lowerFirst(name);
       
                    var cbElement = angular.element("#" + unit.$guid);
                    if (cbElement.length) {
                        var cssClassTimeContiol = "time-contiol";
                        var stringTimerScope = cbElement.find(".center ." + cssClassTimeContiol).scope();
                        var countTimerScope = cbElement.find(".ms ." + cssClassTimeContiol).scope();   
                        var timerData = stringTimerScope.$parent.timerData;



                        var endTime = startTime + progress.Duration;
                        var totalTime = endTime - startTurnTime;
                        var timeToLeft = endTime - Utils.Time.GetUtcNow();
                        var turnProgress = Math.floor(Math.abs(((timeToLeft / totalTime) * 100) - 100));


                        timerData.$orientation = timerService.horizontalCss;
                        timerData.$hasTimer = true;
                        timerData.$timerHtmlData = Utils.Time.Seconds2Time(Math.ceil(timeToLeft));
                        if (!timerData.$indicator) {
                            timerData.$indicator = timerService.getIndicator(false, turnProgress);
                        }
                        else {
                            Utils.UpdateObjFromOther(timerData.$indicator, timerService.getIndicator(false, turnProgress));
                        }
                  

                        
                        if (!timerData.$noTimer) {
                            timerService.registerNoTimerRight(countTimerScope.timerData);
                        }
                        var $noTimer = timerData.$noTimer;  
                        $noTimer.$orientation = timerService.verticalCss;
                        $noTimer.$hasTimer = true;  
                        $noTimer.$timerHtmlData = progress._remainToComplete;
                        Utils.UpdateObjFromOther($noTimer.$indicator, progress.verticalIndicator); 


                    }
                    else {
                        console.log("spaceShipyardService.upgradeShipyardUnits.shipyardIsActive: unit not exist");
                    }



                }
            });


            if (needServerUpdate) {
                var ce = EM.EstateData.GetCurrentEstate();
                //  console.log("spaceShipyardService.upgradeShipyardUnits.needServerUpdate", ce);
                requestUpdateCurrentEstate(ce.EstateId);
            }
        }


        function getUnitByName(nativeName) {
            return _.find(getBuildCollection(), function (o) {
                return o.NativeName === nativeName;
            });
        }

        function setUnitProgress(nativeName, newProgress) {
            getUnitByName(nativeName).Progress = newProgress;
        }

        function updateUnitInputModel(item) {
            var resourceService = GameServices.resourceService;
            //Update.upgradeCount
            var price = item.Update.Price;
            var iUnitcount = item.Update.upgradeCount;
            if (iUnitcount < 1) return;
            if (price.forCc) {
                var curCc = resourceService.getCcCount();
                var ccPrice = price.Cc;
                if (ccPrice > curCc) {
                    item.Update.upgradeCount = 0;
                    return;
                }
                var sumCc = iUnitcount * ccPrice;
                if (sumCc <= curCc) return;
                var limCc = Math.floor(curCc / ccPrice);
                item.Update.upgradeCount = limCc;
                return;
            } else {
                var resource = resourceService.getStorageResources().Current;

                if (resource.E < price.E && resource.Ir < price.Ir && resource.Dm < price.Dm) item.Update.upgradeCount = 0;
                var limits = [];
                _.forEach(resource, function (curRes, resName) {
                    if (price[resName] === 0) return;
                    limits.push(curRes / price[resName]);
                });
                if (limits.length < 1) return;
                var limit = Math.floor(Math.min.apply(Math, limits));
                if (iUnitcount > limit) item.Update.upgradeCount = limit;
            }
            //forCc

        }

        //#endregion
        

        //#region Require
        function getPlanshetModel() {
            return planshetService.getItemById(spaceShipyardUniqueId);
        }

        function upgradeModel() {  
            _unitRequestInProgress = false;
            spaceShipyard = getPlanshetModel();

            if (planshetService.isCurrentModel(spaceShipyardUniqueId)) {
                planshetService.updatePlanshet(upgradeShipyardUnits, spaceShipyardUniqueId);
            }
            //console.log("spaceShipyardService.upgradeModel.retstartView");
            GameServices.hangarService.retstartView();
        }

        //#region registerUnitItem
        var lockDialogUnit = false;
 

        function unlockDialogUnit() {
            lockDialogUnit = false;
        };
 

        function registerUnitItem(item) {
            var col = item.ComplexButtonView.Collection;
            var info = col[0];
            var detail = col[1];
            var update = col[2];
            info.$onClick = detail.$onClick = function ($event) {
                if (lockDialogUnit) return;
                lockDialogUnit = true;
                GameServices.unitDialogService.CreateUnitDetailDialog($event, unlockDialogUnit, item.NativeName);

            };
            update.$onClick = function ($event) {
                if (lockDialogUnit) return;
                lockDialogUnit = true;
                GameServices.unitDialogService.CreateBuyUnitDialog($event, unlockDialogUnit, item);
            };

        }
        //#endregion
 


        this.getUniqueId = function () {
            return spaceShipyardUniqueId;
        };
        this.upgradeModel = upgradeModel;
        this.getBuildCollection = getBuildCollection;
        this.upgradeShipyardUnits = upgradeShipyardUnits;
        this.setUnitProgress = setUnitProgress;
        this.updateUnitInputModel = updateUnitInputModel;
        this.registerUnitItem = registerUnitItem;
        //#endregion
    }
]);
Utils.CoreApp.gameApp.service("userChannelsService", [
    "planshetService", "paralaxButtonHelper", "$q", "userChannelsDialogHelper", function (planshetService, $btnHelper, $q, $ucdH) {
        var $self = this;
        this.$planshetService = planshetService;
        Object.freeze(this.$planshetService);
        this.$btnHelper = $btnHelper;
        Object.freeze(this.$paralaxButtonHelper);


        Object.defineProperty($self, "_userChannelsUniqueId", {
            value: "user-channels-collection",
            writable: false,
            configurable: false
        });

        this.$planshetIndex = null;

        /**
        * 
        * @description Основной контейнер для Tabs message  экземпляр planshetModel        */

        Object.defineProperty($self, "_userChannelsModel", {
            get: function () {
                if (!$self.$planshetIndex) throw Errors.ClientNullReferenceException({ $self: $self }, "$self.$planshetIndex", "userChannelsService", ErrorMsg.NoData);
                var model = planshetService.$planshetModels[$self.$planshetIndex];
                if (model.UniqueId !== $self._userChannelsUniqueId) throw Errors.ClientNotImplementedException({ $self: $self }, "is not  message model");
                return model;
            },
            set: function (value) {
                planshetService.updatePlanshetItemData(value, true, Utils.Time.TIME_CACHE_USER_CHANNELS);
                $self.$planshetIndex = planshetService.getModelIndex($self._userChannelsUniqueId);
            }
        });

        this.$ucdH = $ucdH;
        this.$q = $q;
        this.ChannelTypes = {
            Private: 1,
            Group: 2,
            Alliance: 3
        };
        Object.freeze(this.ChannelTypes);
        this.ChannelSerchTypes = {
            All: 1,
            OnlyPublic: 2,
            OnlyPrivate: 3
        };
        Object.freeze(this.ChannelSerchTypes);
  
        this.cbIds = {
            Setting: 2,
            Messages: 1,
            Delete: 2
        };
        Object.freeze(this.cbIds);
        this.bodyIdx = {
            Private: $self.ChannelTypes.Private - 1,
            Group: $self.ChannelTypes.Group - 1,
            Alliance: $self.ChannelTypes.Alliance - 1
        };
        Object.freeze(this.bodyIdx);

        this.ChannelTypeNames = {
            Private: "Private",
            Group: "Group",
            Alliance: "Alliance"
        };
        Object.freeze(this.ChannelTypeNames);

        function IChannelRef(name, idx, typeId) {
            this.NativeName = name;
            this.PlanshetIdx = idx;
            this.ChannelType = typeId;
            return this;
        }

        this.ChannelRefs = {
            Private: new IChannelRef($self.ChannelTypeNames.Private, $self.bodyIdx.Private, $self.ChannelTypes.Private),
            Group: new IChannelRef($self.ChannelTypeNames.Group, $self.bodyIdx.Group, $self.ChannelTypes.Group),
            Alliance: new IChannelRef($self.ChannelTypeNames.Alliance, $self.bodyIdx.Alliance, $self.ChannelTypes.Alliance)
        };
        _.forEach(this.ChannelRefs, function (val, key) {
            Object.freeze($self.ChannelRefs[key]);
        });
        Object.freeze($self.ChannelRefs);


        /**
         * 
         * @param {} advancedAction 
         * @param {} setToCurrent 
         * @returns {} 
         */
        this._updatePlanshet = function (advancedAction, setToCurrent) {
            planshetService.updatePlanshet(advancedAction, $self._userChannelsUniqueId, setToCurrent);
        };

        this.leftNavGetUserChannels = function (params, element, attrs, $scope, $event) {
            // грузим планшет  из левого меню
            $self.loadUserChannelsPlanshet();
        };
 
        //$self.$hub
        Object.defineProperty($self, "$hub", {
            get: function () {
                return GameServices.mainGameHubService;
            }
        });

        /**
         * 
         * @param {} onDone 
         * @param {} onError 
         * @returns {} 
         */
        this.getServerPlanshetData = function (onDone, onError) {
            return $self.$hub.userChannelsGetPlanshet()
                .then(function (answer) {
                    console.log("_______UPDATE_userChannelsService_FROM SERVER______");
                    $self._setNewPlanshetData(answer, onDone);
                }, function (errorAnswer) {
                    if (onError instanceof Function) onError(errorAnswer);
                    else {
                        var msg = Errors.GetHubMessage(errorAnswer);
                        throw Errors.ClientNotImplementedException({ errorAnswer: errorAnswer, msg: msg }, "userChannelsService.getServerPlanshetData");
                    }
                });
        };
        this._toggle = function () {
            planshetService.toggle($self._userChannelsUniqueId);
        };
        /**
         * 
         * @param {} updateFromServer 
         * @returns {} 
         */
        this.loadUserChannelsPlanshet = function (updateFromServer) {
            if (updateFromServer || !$self._userChannelsModel) $self.getServerPlanshetData($self._toggle);
            else if (planshetService.isCurrentModel($self._userChannelsUniqueId)) $self._toggle();
            else $self._updatePlanshet($self._toggle, true);
        };

        this._getCollectionByIdx = function (idx) {
            return $self._userChannelsModel.Bodys[idx].TemplateData.Collection;
        };

        function _createRefToData(iChannelRefItem) {
            Object.defineProperty($self, iChannelRefItem.NativeName, {
                get: function () {
                    return $self._userChannelsModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData;
                },
                set: function (value) {
                    $self._userChannelsModel.Bodys[iChannelRefItem.PlanshetIdx].TemplateData = value;
                }
            });
        }
        _createRefToData($self.ChannelRefs.Private);
        _createRefToData($self.ChannelRefs.Group);
        _createRefToData($self.ChannelRefs.Alliance);

 

        /**
         * 
         * @param {} initData 
         * @returns {} 
         */
        this.setInitialUserChannelsModel = function (initData) {
            $self._userChannelsModel = _.cloneDeep(initData[$self._userChannelsUniqueId]);
        };
        /**
         * 
         * @param {} newPlanshet 
         * @param {} onDone 
         * @returns {} 
         */
        this._setNewPlanshetData = function (newPlanshet, onDone) {
            $self._userChannelsModel = newPlanshet;
            if (onDone instanceof Function) onDone($self._userChannelsModel);
        }
        /**
         * 
         * @param {} idx 
         * @param {} channelItem 
         * @returns {} 
         */
        this.getCbButtonByIdx = function (idx, channelItem) {
            if (!channelItem || !channelItem.ComplexButtonView) return null;
            return channelItem.ComplexButtonView.Collection[idx];
        };
        /**
         * 
         * @param {} channelItem 
         * @returns {} 
         */
        this.createBtnIds = function (channelItem) {
            if (!channelItem._btnIds) {
                function IBtnIds() {
                    this.SettingId = null;
                    this.MessagesId = null;
                    this.DeleteId = null;
                    var messagesBtn = $self.getCbButtonByIdx($self.cbIds.Messages, channelItem);
                    var rightBtn = $self.getCbButtonByIdx($self.cbIds.Setting, channelItem);
                    if (rightBtn) {
                        if (rightBtn.ItemId === "setting") {
                            this.SettingId = rightBtn.ItemId;
                        }
                        else if (rightBtn.ItemId === "delete") {
                            this.DeleteId = rightBtn.ItemId;
                        }
                    }
                    if (messagesBtn) this.MessagesId = messagesBtn.ItemId;

                    return this;
                }
                channelItem._btnIds = new IBtnIds();
            }
            return channelItem._btnIds;
        };
        /**
         * 
         * @param {} bodyIdx 
         * @returns {} 
         */
        this.getTabTranslateNameByChannelType = function (bodyIdx) {
            return $self._userChannelsModel.Buttons[bodyIdx].TranslateName;
 
        }

        Utils.CoreApp.gameAppExtensions.UserChannelsPrivate($self);
        Utils.CoreApp.gameAppExtensions.UserChannelsGroup($self);
        Utils.CoreApp.gameAppExtensions.UserChannelsAlliance($self);



        Object.defineProperty($self, "$currentUserInfo", {
            get: function () {
                //UserId: crData.userId,
                //UserName: crData.userName,
                //UserIcon: crData.userAvatar.Icon,
                //AllianceId: crData.AllianceId,
                //AllianceName: crData.allianceName,
                //AllianceRoleId: crData.allianceRoleId,
                return GameServices.allianceService.$currentUserInfo;

            }
        });
        /**
         * 
         * @param {} intChannelType 
         * @returns {} 
         */
        this.getTabDataByChannelType = function (intChannelType) {
            var channelNativeName = "";
            if (intChannelType === $self.ChannelTypes.Private) {
                channelNativeName = $self.ChannelTypeNames.Private;
            }
            else if (intChannelType === $self.ChannelTypes.Group) {
                channelNativeName = $self.ChannelTypeNames.Group;
            }
            else if (intChannelType === $self.ChannelTypes.Alliance) {
                channelNativeName = $self.ChannelTypeNames.Alliance;
            }
            else throw Errors.ClientNotImplementedException({ intChannelType: intChannelType }, "userChannelsService.getTabDataByChannelType ChannelTypeNotExist");
            return $self[channelNativeName];
        };
        /**
         * 
         * @param {} intChannelType 
         * @returns {} 
         */
        this.getCollectionByChannelType = function(intChannelType) {
            var data = $self.getTabDataByChannelType(intChannelType);
            if(data&&data.Collection) {
                return data.Collection;
            }
            return null;
        };
        /**
         * 
         * @param {} intChannelType 
         * @param {} channelId 
         * @returns {} 
         */
        this.getChannelByChannelType = function (intChannelType, channelId) {
            var collection = $self.getCollectionByChannelType(intChannelType);
            if (!collection) throw Errors.ClientNotImplementedException({ collection: collection }, "userChannelsService.getChannelByChannelType channelCollection not exist");
            return collection[channelId];

        };
        /**
          * 
          * @param {} newChannelOutDataModel 
          * @returns {} 
          */
        this.addOrReplaceLocalChannelItem = function(newChannelOutDataModel) {
            var channelId = newChannelOutDataModel.ChannelId;
            var channelType = newChannelOutDataModel.ChannelType;
            var collection = $self.getCollectionByChannelType(channelType);
            if(collection) {
                collection[channelId] = newChannelOutDataModel;
            }
        };
        /**
         * 
         * @param {} intChannelType 
         * @param {} channelId 
         * @returns {} 
         */
        this.deleteLocalChannelItem = function(intChannelType, channelId) {
            var collection = $self.getCollectionByChannelType(intChannelType);
            if(collection&&collection[channelId]) {
                delete collection[channelId];
            }
        };
        /**
          * 
          * @param {} newMessage 
          * @param {} intChannelType 
          * @returns {} 
          */
        this.addMessageToLocal = function(newMessage, intChannelType) {
            var channel = $self.getChannelByChannelType(intChannelType, newMessage.ChannelId);
            if(channel) channel.Messages[newMessage.Id] = newMessage;
            else {
                console.log("GroupAddMessageToLocal channel not exist need create channel", {newMessage:newMessage, intChannelType:intChannelType, $self:$self});
            };
            return channel;

        };
        /**
         * 
         * @param {} params 
         * @param {} $event 
         * @returns {} 
         */
        this.sendMessage = function(params, $event) {
            var crData = $self.$currentUserInfo;
            var data = Utils.ModelFactory.IChannelMessageTransfer();
            data.Message = params.text;
            data.UserIcon = crData.userAvatar.Icon;
            data.ChannelId = params.ChannelId;
            data.ChannelType = params.ChannelType;

            var deferred = $q.defer();
            deferred.promise
                .finally(function() {
                    if(params.onFinally instanceof Function) params.onFinally();
                }).then(function(answer) {
                    if(params.onSuccess instanceof Function) params.onSuccess(answer);
                }, function(errorAnswer) {
                    var msg = Errors.GetHubMessage(errorAnswer);
                    if(params.onError instanceof Function) params.onError(msg);
                    throw Errors.ClientNotImplementedException({params:params, errorAnswer:errorAnswer, msg:msg}, "userChannelsService.sendMessage");
                });
            var hubPromise = $self.$hub.userChannelsSendMessage(data);
            hubPromise.then(function(answer) {
                return deferred.resolve(answer);

            }, function(errorAnswer) {
                return deferred.reject(errorAnswer);
            });
        };

        /**
         * 
         * @param {} iMessageTransferDataModel 
         * @param {} $$RootScope 
         * @returns {} 
         */
        this.onMessageSended = function (iMessageTransferDataModel, $$RootScope) {
            console.log("userChannelsService.onMessageSended.before", {
                iMessageTransferDataModel: iMessageTransferDataModel,
                $self: $self
            });
            try {
                var channel = $self.addMessageToLocal(iMessageTransferDataModel, iMessageTransferDataModel.ChannelType);
                if (!channel) {
                    throw Errors.ClientNullReferenceException({ iMessageTransferDataModel: iMessageTransferDataModel }, "channel", "userChannelsService.onMessageSended", ErrorMsg.NoData);
                }
                $$RootScope.$broadcast("channelItem:add-message", { newChannel: channel, newMessageData: iMessageTransferDataModel });

            }
            catch (e) {
                throw Errors.ClientNotImplementedException({ iMessageTransferDataModel: iMessageTransferDataModel }, "userChannelsService.onMessageSended", e);
            }

        };
        /**
         * 
         * @param {} channelId 
         * @param {} intChannelType 
         * @param {} onDone 
         * @param {} onError 
         * @returns {} 
         */
        this.getNextMessagesPage = function (channelId, intChannelType, onDone, onError) {
            function _onError(errorAnswer, data) {
                var msg = Errors.GetHubMessage(errorAnswer);
                var errorData = {
                    _data: data,
                    channelId: channelId,
                    intChannelType: intChannelType,
                    msg: msg,
                    errorAnswer: errorAnswer,
                    onDone: onDone
                };
                onError(errorAnswer, msg, errorData);
                throw Errors.ClientNotImplementedException(errorData, "userChannelsService.getNextMessagesPage");
            }
            var channel = $self.getChannelByChannelType(intChannelType, channelId);
            if (!channel || !channel.Messages) {
                onError(ErrorMsg.ChannelNotExist, { $self: $self, channel: channel });
                return;
            }

            var skip = _.size(channel.Messages);
            $self.$hub.userChannelsGetNextMessagesPage(channelId, intChannelType, skip)
                 .then(function (answer) {    
                     _.extend(channel.Messages, answer);   
                     onDone(answer, channel);
                 }, _onError);
        };

        //#endregion
    }
]);
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
Utils.CoreApp.gameApp.directive("timerProgress", [
    "timerHelper",
    function (timerHelper) {  
        function link($scope, $element) {   
            var timerType = timerHelper.refTimerTypes;
            if (timerType.simpleTimer === $scope.timerType) {
                console.log("timerType.simpleTimer === $scope.timerType", { $scope: $scope });
                //todo   for mother jump
                if ($scope.border && $scope.border.dataOnload && $scope.border.dataOnload instanceof Function) {
                    var advancedParam = $scope.border.dataOnload();
                    if (advancedParam && advancedParam.hasOwnProperty("cbItemData")
                     && advancedParam.hasOwnProperty("activateUpdate") && advancedParam.hasOwnProperty("timerName")) {
                        $scope.timerAdvancedParam = advancedParam;
                    }
                }
                timerHelper.registerSimpleTimer($scope);

            }
            else if (timerType.buildTimer === $scope.timerType) {
                var cbScope = timerHelper.getComplexBtnScope($scope);
                if (!cbScope) {
                    throw new Error("timerProgress: !cbScope");
                }
                if (cbScope.item.hasOwnProperty("Progress")) {
                    $scope.timerData = cbScope.item.Progress || Utils.ModelFactory.ItemProgress();
                }
               
                //console.log("timerType.buildTimer === $scope.timerType", { $scope: $scope, cbScope: cbScope });
 

                //    setTimerDataParams($scope, $scope.$parent.timerData);
                var data = $scope.border.Data;
                if (data && data.NativeName && data.NativeName.substr(0, 4) === "Tech") {
                    timerHelper.registerBuildTimer($scope, null, 0, cbScope);
                }
                else {
                    var ce = EM.EstateData.GetCurrentEstate();
                    var ownId = ce.EstateId;
                    timerHelper.registerBuildTimer($scope, null, ownId, cbScope);
                }  
                //console.log("timerProgress complexButton", $scope);
            }

            else if (timerType.noTimerRight === $scope.timerType) {
                //console.log("timerType.noTimerRight === $scope.timerType", { $scope: $scope });
                if (!$scope.timerData) {
                    throw new Error("timerProgress: !$scope.timerData");
                }
                timerHelper.registerNoTimerRight($scope.timerData);
 
 
   
            } else if (timerType.hangarUnitTimer === $scope.timerType) {
                //  console.log("timerType.hangarUnitTimer", $scope.timerType);
                //console.log("hangarUnitTimer $scope", $scope);
                //todo метод удален и не существует
                // timerHelper.registerUnitTimer($scope, null, ownId);
            }


        }

        return {
            restrict: "EA",
            templateUrl: "timer-progress.tmpl",
            replace: true,
            scope: {
                timerType:"@", 
                border: "=?",
                timerData:"=?"
            },
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("paralaxButton", [
    function() {
        // почитать https://docs.angularjs.org/error/$compile
        return {
            replace: true,
            restrict: "EA",
            scope: {
                button: "="
            },
            templateUrl: "parralax-button.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                var button = $scope.button;  
                if (button && button.Method && !Utils.Event.HasClick(element) ) {
                    element.bind("click", function ($event) {
                        //console.log("paralaxButton", {
                        //    $scopeargs: arguments[0]
                        //});
                        if (button.Method instanceof Function) {
                            button.Method(button.Params, element, attrs, $scope, $event);
                        } else if (typeof button.Method == "string" && !attrs.ignore) {
                            var method = Utils.StrToRef(button.Method);
                            method(button.Params, element, attrs, $scope, $event);
 
                        }
                    });
                    
         
                }
                if (button) {
                    GameServices.paralaxButtonHelper.setHoverVoiceToButton(button);
                    $(element).hover(function (event) {
                        EM.Audio.GameSounds.defaultHover.play();
                    }, angular.noop);
                }


            }
        }
    }
]);

//scope: {
//    TranslateName: "@",
//    Controller: "@",
//    Action: "@",
//    Callbacks: "@",
//    Atributes: "@",
//    Onclick: "@",
//    IsAjax: "@",
//    CssClass: "@",
//    DataAttrs: "@",
//    ShowName: "@",
//    HasDataAttr: "@",
//    ConteinPartial: "@",
//    PartialView: "@"
//},
Utils.CoreApp.gameApp.directive("complexButton", [
    function() {
        return {
            restrict: "E",
            templateUrl: "complexButton.tmpl",
            replace: true,
            scope: {
                complexButton: "=",
                advancedCbParams:"=?"
            }
        };
    }
]);
Utils.CoreApp.gameApp.directive("estateList", ["estateService", function (estateService) {
 
        var template = '<select class="estates-list"><option ng-repeat="estate in estateList" ng-attr-value="{{estate.OwnId}}">{{estate.Name}}</option></select>';
        function link($scope, element, attrs, ctrl) {
            //console.log("estateList $scope", $scope);
            $scope.estateList = estateService.getEstateListData();
            estateService.registerEvents(element);
        }

        return {
            restrict: "A",
            //templateUrl: template,
            template: template,
            replace: true,
            //scope: true,
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("estateResource", ["resourceService",
    function (resourceService) {
        function link($scope, element, attrs, ctrl) {
            $scope.estateResource = resourceService.getEstateResources();
        }

        return {
            restrict: "A",
            templateUrl: "estate-resource.tmpl",
            replace: true,
            //scope: true,
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("borderAnimationItem", [
    function () {
        // почитать про нг иф https://docs.angularjs.org/error/$compile
        // если потребуется посмотреть пакет https://github.com/zachsnow/ng-elif  
        function isSimple(obj) {
            var simple = 
                obj.hasOwnProperty("Data")
                && obj.Data
                && obj.Data.hasOwnProperty("Head")
                && typeof obj.Data.Head === "string";
            obj.IsSimpleCentr = simple;
        }

        return {
            //compile: function compile(templateElement, templateAttrs) {
            //    templateElement.html("<div>{{" + templateAttrs.habraHabrWork + "}}" + templateAttrs.habra + "</div>");
            //},
            scope: {
                border: "="
            },
            replace: true,
            restrict: "EA",
            templateUrl: "border-animation.tmpl",
            link: function ($scope, element, attrs, ctrl) {
               //console.log("borderAnimationItem $scope", $scope);
                var border = $scope.border;
                var _cbScope;
                isSimple(border);
                function _getCbScope(scope) {
                    if (_cbScope) {
                        return _cbScope;
                    }
                    else {
                        return _cbScope = Utils.A.getParentScopeWithProp(scope, "dropElement");
                    }
                }
                if (!border.$onClick) {
                    if (border.Size === "center") {
                        var cbScope = Utils.A.getParentScopeWithPropAndDepth($scope, "advancedCbParams", 3);
                        if (cbScope && cbScope.advancedCbParams.needBroadCast && cbScope.advancedCbParams.activateUpdate.length > 0) {
                            var hasData = false;
                            if (cbScope.advancedCbParams.activateUpdate === "updateJumpMotherTimer") {
                                cbScope.advancedCbParams.cbItemData = GameServices.journalService.getLocalMotherJump();
                                if (cbScope.advancedCbParams.cbItemData) {
                                    hasData = true;
                                    cbScope.advancedCbParams.activateUpdate = GameServices.journalService.updateJumpMotherTimer;
                                }

                            }
                            if (hasData) {
                                cbScope.advancedCbParams.borderScope = $scope;
                                border.dataOnload = function () {
                                    return cbScope.advancedCbParams;
                                }
                            }
                        }
                    }
                    if (!Utils.Event.HasClick(element)) {
                        if (border.IsComplexPart) {
                            element.click(function ($event) {
                                var parent = _getCbScope($scope);
                                if (!parent) {
                                   console.log("borderAnimationItem.click parentScope not exist");
                                    return;
                                }
                                parent.dropElementonClickByDropable(null, true, border.ItemId);
                            });
                        }
                        else {
                            element.click(function ($event) {
                              //  console.log("border.custom click", { $scope: $scope, border: border });
                                if (border.JsFunction instanceof Function) border.JsFunction($event);
                                else if (typeof border.JsFunction === "string") eval(border.JsFunction);
                            });
                        }
                    }
                }
                else if (!Utils.Event.HasClick(element)) {
                    element.click(function ($event) {
                        $event.$$border = border;
                        border.$onClick($event);
                    });
                }
            }
        }
    }
]);
Utils.CoreApp.gameApp.directive("userAvatar", ["profileService", "planshetService",
    function (profileService, planshetService) {
 
        var template = '<section><div class="" ng-click="avatar.Onclick()" id="user-avatar">' +
                                    '<img ng-src="{{avatar.Avatar.Icon}}" ng-attr-alt="{{avatar.Name}}" ng-attr-title="{{avatar.Name}}" class="user-ava" />' +
                                 '</div>' +
                       '</section>';


        function setAvatar(scope) {
            var userInfo;
            function set(data) {
                //console.log("scope data", data);
                scope.avatar = {
                    Avatar: data.Avatar,
                    Name: data.Name,
                    Onclick: function () {
                        //  console.log("Onclick");
         
                        profileService.setCurrentUserProfile();
                    }
                }

            }
            var max = 1000;
            planshetService.conditionAwaiter(function () {
                userInfo = profileService.getCurrentUserInfo();
                return !!userInfo;
            }, function () {
                set(userInfo);
            }, 40, max);
        }
        
        function link($scope, element, attrs, ctrl) {
            setAvatar($scope);
            $scope.$on("user:avatar-updated", function (event, args) {
                $scope.avatar.Avatar = args.data;
            });
        }

        return {
            restrict: "A",
            //templateUrl: template,
            template: template,
            replace: true,
            scope: {},
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("translateAutocomplete", ["$q",
function ($q) {

    var tr = Utils.Yandex.Translate;
    var flags = {};
    var _langs;
    Object.defineProperty(flags, "items", {
        get: function () {
            if (!_langs) {
                _langs = _.concat([tr.createFlagItem("None", "none")], tr.flagItems);
            }
            return _langs;
        }
    });
    return {
        restrict: "E",
        templateUrl: "translate-autocomplete.tmpl",
        replace: false,
        scope: {
            nativeText: "=",
            setText: "=",
            label: "@?",
            menuCss: "@?"
        },
        controller: ["$scope", function ($scope) {
 
            this.label = $scope.label ? $scope.label : false;  
            this.menuCss = $scope.menuCss ? $scope.menuCss : "custom-autocomplete-drop-1";
            var $translates = {
                none: { 
                    text: [$scope.nativeText]
                }
            };
            this.selectedLang = null;
            this.searchText = "None";
            this.querySearch = function (query) {

                if (!query || !query.length || query ==="None") {
                    return flags.items;
                }
                query = query.trim().toLowerCase();
                var items = _.filter(flags.items, function (o) {
                    return o.Name.toLowerCase().indexOf(query) !== -1 || o.LangCode.indexOf(query) !== -1;
                });
                return items;
            };
            this.onTextChange = function (text) {
                if (!text || text.length === 0 || !this.selectedLang || !this.selectedLang.LangCode || text === this.selectedLang.Name || text === this.selectedLang.LangCode) return;
                var lowerText = text.toLowerCase(); 
                if (lowerText === this.selectedLang.Name) {
                    this.searchText = this.selectedLang.Name;
                }
                else if (lowerText === this.selectedLang.LangCode) {
                    this.searchText = this.selectedLang.Name;
                }
            };
            this.getTextFromItem = function (langItem) {
                return langItem.Name;
            };
            this.onSelect = function (selectedItem) {
                if (!selectedItem) return;
                console.log("onSelect", {
                    flags: flags.items,
                    selectedItem: selectedItem,
                    $scope: $scope
                });
                var deferred = $q.defer();
                if ($translates[selectedItem.LangCode]) {  
                    deferred.resolve($translates[selectedItem.LangCode]);
                }
                else {
                    var model = tr.models.translate($scope.nativeText, selectedItem.LangCode);
                    tr.translate(model).then(function (trItem) { 
                        $translates[selectedItem.LangCode] = trItem;
                        deferred.resolve($translates[selectedItem.LangCode]);
                    }, deferred.reject);
                }
                deferred.promise.then(function (translateItem) {
 
                    if (translateItem.text[0]) {
                        $scope.setText(translateItem.text[0]);
                    }

                    console.log("translate", { translateItem: translateItem });

                }, function (errorAnswer) {
                    console.log("errorAnswer", errorAnswer);

                });


            };
            this.notFoundedMsg = "not found msg";
            this.inProgress = false;
            this.reset = function () { 
                 $scope.setText($scope.nativeText);
            };   

        }],
        controllerAs: "taCtrl"
    }
}
]);
Utils.CoreApp.gameApp.directive("scroller", [
    function() {
        function link($scope, element, attrs, ctrl) {
            $scope.$emit(attrs.emitName, element, attrs.id);
        }

        return {
            restrict: "A",
            //scope: {},
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("statistic", [
    function () {
        function link($scope, element, attrs, ctrl) {
           //  console.log("statistic $scope", $scope);
        }

        return {

            restrict: "E",
            templateUrl: "statistic.tmpl",
            scope: {
                statisticModel:"="
            },
            replace: true,
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("dropElement", ["$timeout", "$rootScope",
    function ($timeout, $rootScope) {
        var activeCss = "active";
        var dropable = ".dropable";
        var dropContainerSelectior = ".drop-container";
        var dropItemSelectior = ".drop-item";
        var timeDelay = Utils.Time.DROP_ELEMENT_ANIMATION; //ms

        var lastTarget;
        var $idLast;

        function dropToggle(currentScope, skipParent, dataTargetElem) {
            if (!lastTarget) lastTarget = dataTargetElem;
            var element = currentScope.dropElement;
            var parentId = "#" + Utils.GetParentValue(element, 0, null, skipParent, null, 0);

            var parentDom = element.parents(parentId);

            function getScope(elem) {
                return angular.element(elem).scope();
            }

            function collectionAction(action) {
                parentDom.find(dropable).find(dropContainerSelectior).each(action);
            }

            function closeAll() {
                collectionAction(function (idx, elem) {
                    var targetScope = getScope(elem);
                    targetScope.dropElementClose();
                });
            }

            function isOneOpened() {
                var result = false;
                collectionAction(function () {
                    if (getScope(this).dropElementShow) {
                        result = true;
                        return false;
                    }
                    return true;
                });
                return result;
            }

            function open(setTimeOut) {
                if (setTimeOut) {
                    $timeout(function () {
                        currentScope.dropElementOpen();
                        lastTarget = dataTargetElem;
                    }, timeDelay, false);
                }
                else {
                    currentScope.dropElementOpen();
                    lastTarget = dataTargetElem;
                }
            }

            if (currentScope.dropElementShow) {
                currentScope.dropElementClose();
                if (currentScope.dropElementIsGroup && dataTargetElem) {
                    if (lastTarget !== dataTargetElem) {
                        open(true);

                        return;
                    }

                }
            } else {
                if (isOneOpened()) {
                    closeAll();
                    open(true);
                } else open();
            }
        }

        
 
        function link($scope, element, attrs, ctrl) {
            $scope.dropElementShow = false;
            $scope.dropElement = element;
            $scope.dropElementTargetContainer = $scope.dropElement.find(dropContainerSelectior);
            $scope.dropElementTargetItemSelector = dropItemSelectior;
            $scope.dropElementIsGroup = Utils.ConvertToBool(attrs.isGroup);
            $scope.dropElementFreeze = Utils.ConvertToBool(attrs.dropElementFreeze);
            $scope.dropElementTargetItem = function () {
                return $scope.dropElementTargetContainer.find($scope.dropElementTargetItemSelector);
            };
            $scope.$$dropElementToggle = function (skipParent, dataTargetDropable) {
                dropToggle($scope, skipParent, dataTargetDropable);
            };

            var $skipParent = attrs.skipParent ? +attrs.skipParent : 0;



            var _dropElementTargetItems;
            Object.defineProperty($scope, "_dropElementTargetItems", {
                get: function () {
                    if (_dropElementTargetItems && _dropElementTargetItems.length && $idLast === $scope.$id) return _dropElementTargetItems;
                    _dropElementTargetItems = $scope.dropElementTargetContainer.find(dropItemSelectior);
                    $idLast = $scope.$id;
                    return _dropElementTargetItems;
                }
            });


            $scope.dropElementSetHeight = function (setVisible) {
                $scope.dropElementShow = !!setVisible;
                var targetElem = $scope.dropElementTargetItem();
                if (setVisible) {
                    var targetHeight = targetElem.height();
                    if (targetHeight>50) {
                        EM.Audio.GameSounds.dropableOpen.play();
                    }
                   // console.log("targetHeight", targetHeight);
                    targetElem.addClass(activeCss);
                    $scope.dropElementTargetContainer.css("height", targetHeight);
                    $scope.dropElementTargetContainer.addClass(activeCss);
                } else {
                    if ($scope.dropElementIsGroup) {
                        $scope._dropElementTargetItems.each(function (idx, elem) {
                            $(elem).removeClass(activeCss);
                        });
                    } else targetElem.removeClass(activeCss);
                    $scope.dropElementTargetContainer.removeClass(activeCss);
                    $scope.dropElementTargetContainer.removeAttr("style");
                }
                return false;
            }
            $scope.dropElementClose = function () {
                $scope.dropElementSetHeight();
            };
            $scope.dropElementOpen = function () {
                $scope.dropElementSetHeight(true);
            };

            $scope.dropElementonClickByDropable = function (skipParent, isComplex, dataTargetDropable) {
                if (!GameServices.timerHelper.timeDelay.IsTimeOver("dropElementToggle")) return;
                GameServices.timerHelper.timeDelay.Start("dropElementToggle", timeDelay);
                if ($scope.dropElementShow && $scope.dropElementFreeze) return;
                if ($scope.dropElementFreeze) {
                    $rootScope.$broadcast("dropElement:dropElementonClickByDropable", {
                        dropElementScope: $scope,
                        skipParent: skipParent || $scope.dropElementIsGroup ? 2 : 1,
                        isComplex: isComplex,
                        dataTargetDropable: dataTargetDropable
                    });
                    return;
                }

                if (!isComplex) {
                    $scope.$$dropElementToggle(skipParent || $skipParent || 1);
                }
                else {
                    if (!$scope.dropElementIsGroup) $scope.dropElementIsGroup = true;
                    $scope.dropElementTargetItemSelector = dropItemSelectior + Utils.GenAttrDataName([Utils.RepoKeys.DataKeys.Target], dataTargetDropable);
                    $scope.$$dropElementToggle(skipParent || $skipParent || 2, dataTargetDropable);
                    //console.log("$scope.dropElementonClickByDropable", { $scope: $scope, attrs: attrs });

                }

            };
            if ($scope.dropElementFreeze) {
                $scope.dropElementShow = true;
            }
            else {
                $scope.dropElementClose();
            }

            $scope.$on("dropElementContainer:changeHeight", function (e, options) {
                if (e.defaultPrevented) return;
                if (e.stopPropagation) e.stopPropagation();
                else e.preventDefault();
                console.log("dropElementContainer:changeHeight.e", { e: e });
                $scope.dropElementSetHeight(true);
                if (options && options.hasOwnProperty("resolve") && options.resolve instanceof Function) options.resolve();

            });
            $scope.$on("dropElementContainer:changeComplexHeight", function (e, options) {
                if (e.defaultPrevented) return;
                if (e.stopPropagation) e.stopPropagation();
                else e.preventDefault();
                if ($scope.dropElementShow) {
                    if (options && options.dropItemSelectior) {
                        $scope.dropElementTargetItemSelector = dropItemSelectior + Utils.GenAttrDataName([Utils.RepoKeys.DataKeys.Target], options.dropItemSelectior);
                    }
                    var promise = $timeout(function () {
                        $scope.dropElementSetHeight(true);
                    }, 100);
                    console.log("dropElementContainer:changeComplexHeight", {
                        e: e, options: options, $scope: $scope
                    });
                }

            });

        }
        return {
            restrict: "A",
            link: link
        }
    }
]);
                                                                    
Utils.CoreApp.gameApp.directive("dropItem", function () {
    var delay = Utils.Time.DROP_ELEMENT_ANIMATION;
    var fps = 40;
    var inProgressAnimation = false;
    var maxIteration = 1000;
    var mainScrollerSelector = ".content_scroller";
    function pg(titleElem, mainParentSelector) {
        function DropableItem() {
            var self = this;
            var _mainParentDom = null;
            var _containerDom = null;
            var _itemHeight = null;
            var _itemDom = null;
            var _offsetStep = null;
            var id = _.uniqueId();

            var _mainScrollerSelector = mainParentSelector || mainScrollerSelector;
            this._guid = "dropable_item_" + id;
            var dropContainerId = "drop_container_" + id;
            var dropItemId = "drop_item_" + id;

            var dropContainerSelector = "#" + dropContainerId;
            var dropItemSelector = "#" + dropItemId;

            this._updateParams = function () {
                _mainParentDom = self._getDom(_mainScrollerSelector);
                _containerDom = self._getDom(dropContainerSelector);
                _itemDom = self._getDom(dropItemSelector);
                _itemHeight = _itemDom.height();
                _offsetStep = _.ceil(_itemHeight / delay * fps, 2);
            }


            this._mainscrollerSelector = _mainScrollerSelector;
            this.conteinerId = dropContainerId;
            this.dropItemId = dropItemId;



            this._getDom = function (selector) {
                return angular.element(selector);
            };
            this._getItemDom = function () {
                if (!_itemDom) _itemDom = self._getDom(dropItemSelector);
                return _itemDom;

            };


            this._closed = true;
            this._getItemHeight = function () {
                if (!_itemHeight) _itemHeight = self._getItemDom().height();
                return _itemHeight;
            };
            this._getContainerDom = function () {
                if (!_containerDom) _containerDom = self._getDom(dropContainerSelector);
                return _containerDom;

            };
            this._getMainParentDom = function () {
                if (!_mainParentDom) _mainParentDom = self._getDom(_mainScrollerSelector);
                return _mainParentDom;
            };
            this._getOffsetStep = function () {
                if (!_offsetStep) _offsetStep = _.ceil(self._getItemHeight() / delay * fps, 2);
                return _offsetStep;
            };

            var topAnimation = false;
            this._runTopAnimation = function (onDone) {
                if (topAnimation) return;
                topAnimation = true;
                var mpd = self._getMainParentDom();
                var item = titleElem;
                var i = 0;

                //var allContainer = mpd[0].scrollHeight;
                var sctTop = mpd.offset().top;
                var scrScrollTop = mpd.scrollTop();
                var itemTop = item.offset().top;
                var resultTop = scrScrollTop + (itemTop - sctTop);

                var maxHeight = mpd[0].scrollHeight - mpd.height();
                if (resultTop > maxHeight) resultTop = maxHeight;


                var delta = resultTop - scrScrollTop;

                var partHeight = delta * fps / delay;

                var h = mpd.scrollTop() + partHeight;
                mpd.scrollTop(h);
                if (h >= resultTop) {
                    if (h > resultTop) mpd.scrollTop(_.floor(h));
                    topAnimation = false;
                    if (onDone instanceof Function) onDone();
                    return;
                }

                var t = setInterval(function () {
                    h = mpd.scrollTop() + partHeight;
                    mpd.scrollTop(h);
                    if (h >= resultTop) {
                        clearInterval(t);
                        if (h > resultTop) mpd.scrollTop(_.floor(resultTop));
                        topAnimation = false;
                        if (onDone instanceof Function) onDone();
                    }
                    if (i > maxIteration) {
                        clearInterval(t);
                        topAnimation = false;
                        inProgressAnimation = false;
                        if (onDone instanceof Function) onDone();
                        throw new Error("_runTopAnimation in loop");
                    }
                    i++;
                }, fps);

            }

            this.close = function (onClosed) {
                if (self._closed) {
                    if (onClosed instanceof Function) onClosed();
                    return;
                };
                if (!pg.lastItem || self._guid === pg.lastItem._guid && !pg.lastItem._closed) {
                    self._updateParams();
                    inProgressAnimation = true;
                    var offset = self._getOffsetStep();
                    var i = 0;
                    var t = setInterval(function () {
                        var cd = self._getContainerDom();
                        var pH = cd.height();
                        pH -= offset;
                        cd.height(pH);
                        if (pH <= 0) {
                            clearInterval(t);
                            if (pH < 0) cd.height(0);
                            inProgressAnimation = false;
                            self._closed = true;
                            if (onClosed instanceof Function) onClosed();
                        }

                        if (i > maxIteration) {
                            clearInterval(t);
                            inProgressAnimation = false;
                            if (onClosed instanceof Function) onClosed();
                            throw new Error("close in loop");
                        }
                        i++;
                    }, fps);
                }
                else if (pg.lastItem) {
                    var lastItemDom = self._getDom(pg.lastItem.dropItemId);
                    if (!lastItemDom) {
                        pg.lastItem = self;
                        self.close(onClosed);
                        return;
                    }
                    else {
                        pg.lastItem.close(function () {
                            self.close(onClosed);
                        });
                    }
                }
                else {
                    pg.lastItem = self;
                    self.close(onClosed);
                }

            }
            this.open = function (onOpened) {
                if (inProgressAnimation) return;
                if (!self._closed) {
                    if (onOpened instanceof Function) onOpened();
                    return;
                };
                if (!pg.lastItem || pg.lastItem._guid === self._guid && pg.lastItem._closed) {
                    self._updateParams();
                    inProgressAnimation = true;
                    self._runTopAnimation(function () {
                        var i = 0;
                        var itemH = self._getItemHeight();
                        var offset = self._getOffsetStep();
                        var t = setInterval(function () {
                            var cd = self._getContainerDom();
                            var pH = cd.height();
                            pH += offset;
                            cd.height(pH);
                            if (pH >= itemH) {
                                clearInterval(t);
                                if (pH > itemH) cd.height(itemH);


                                self._closed = false;
                                inProgressAnimation = false;
                                pg.lastItem = self;
                                if (onOpened instanceof Function) onOpened();
                            }
                            if (i > maxIteration) {
                                clearInterval(t);
                                inProgressAnimation = false;
                                if (onOpened instanceof Function) onOpened();
                                throw new Error("open in loop");
                            }
                            i++;
                        }, fps);
                    });
                }
                else if (pg.lastItem) {
                    var lastItemDom = self._getDom(pg.lastItem.dropItemId);
                    if (!lastItemDom) {
                        pg.lastItem = self;
                        self.open(onOpened);
                        return;
                    }
                    else if (!pg.lastItem._closed) {
                        pg.lastItem.close(function () {
                            self.open(onOpened);
                        });
                        return;
                    }

                }
                else {
                    pg.lastItem = self;
                    self.open(onOpened);
                }


            }
            this.toggle = function (onDone) {
                self._closed ? self.open(onDone) : self.close(onDone);
            }
            this.updateHeihgt = function (onDone) {
                if (!self._closed) {
                    self._updateParams();
                    _containerDom.height(_itemHeight);
                }
                if (onDone instanceof Function) onDone();
            }
        }
        if (!titleElem.hasOwnProperty("DropableItem") || !titleElem.DropableItem) titleElem.DropableItem = new DropableItem();
        return titleElem.DropableItem;
    }
    pg.lastItem = null;

    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            var e = $scope._element = $(element);
            if (!$scope.contData) $scope.contData = {};
            $scope.contData.dropable = pg(e, $scope.mainParentSelector);
            $scope.$on("$destroy", function () {
                e = $scope._element = null;
                $scope.contData.dropable = null;
                pg.lastItem = null;
                delete $scope._element;
                delete $scope.contData.dropable;

            });
        },
        scope: {
            mainParentSelector: "@",
            contData: "="
        }
    };

});


Utils.CoreApp.gameApp.directive("allianceRatingCentr", [function () {
        function link($scope, element, attrs) {
            $scope.allianceHead = $scope.border.Data;
        }
        return {
            restrict: "A",
            replace: true,
            scope: true,
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("allianceItem", ["allianceService", function (allianceService) {
    function _setData($scope, attrs) {
        $scope.item = $scope.$parent.item;
        var skipParent = 1;
        if (attrs.hasOwnProperty("skipParent")) skipParent = +attrs.skipParent;
        $scope.item.skipParent = skipParent;
        allianceService.setAllianceStatsModelInScope($scope, $scope.item);
        $scope.alianceButtons = allianceService.getAllianceItemBtns($scope.item);
        $scope.description = allianceService.getAllianceItemDescription($scope.item.AllianceDescription);
    }

    function link($scope, element, attrs, ctrl) {
        _setData($scope, attrs);
        $scope.$on("planshet:update", function (e, data) {
            _setData($scope, attrs);
        });
        $scope.$on("alliance:user-join-to-alliance", function (e, data) {
            var ma = data.AllianceData;
            if ($scope.item.Id === ma.Id) {
                console.log("allianceItem.$on(alliance:user-join-to-alliance", {
                    ma: ma,
                    $scope: $scope
                });   
                _setData($scope, attrs);
            }
            _setData($scope, attrs);
        });
        $scope.$on("alliance:user-left-from-alliance", function (e, data) {
            var leftUserId = data.leftUserId;
            var leftAllianceId = data.leftAllianceId;
            if ($scope.item.Id === leftAllianceId) {
                _setData($scope, attrs);
            }

        });

    }

    return {
        restrict: "E",
        templateUrl: "alliance-item.tmpl",
        replace: true,
        link: link,
        scope: {}
    }
}
]);
Utils.CoreApp.gameApp.directive("allianceItemSearch", [
    "allianceService", function(allianceService) {
        function link($scope, element, attrs, ctrl) {
            element.autocomplete({
                delay: 250,
                minLength: 0,
                source: function(request, response) {
                    allianceService.getAllianceNames(request, response);
                },
                select: function(event, ui) {
                    var allianceId = ui.item.id;
                    var allianceName = ui.item.value;
                    function apply() {
                        $scope.$apply(function() {
                            $scope.allianceName = allianceName;
                        });
                    }

                    allianceService.getAllianceItem(allianceId, apply);
                }
            });
        }

        return {
            restrict: "A",
            controller: "allianceCtrl as allianceCtrl",
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("allianceRequestMessage", ["$filter", function ($filter) {
    function link($scope, element, attrs) {
      //  console.log("allianceRequestMessage.$scope", { $scope: $scope });  
        //$scope.dateCreate = $filter("date")(new Date($scope.message.DateCreate * 1000), "dd.MM.yyyy HH:mm");
        $scope.dateCreate = $filter("date")($filter("date")(Utils.Time.GetUtcDateTimeFromSecondUtc($scope.message.DateCreate), "dd.MM.yyyy HH:mm"));
        var isCurrent = $scope.currentUserName === $scope.message.FromName;
        $scope.positionAvatarCss = isCurrent ? 'message-avatar_left' : 'message-avatar_right';
    }

    return {
        restrict: "A",
        templateUrl: "alliance-request-message.tmpl",
        replace: false,
        link: link,
        scope: {
            message: "=",
            currentUserName: "=",
            getUserProfile: "&?"
            
        }
    }
}
]);
Utils.CoreApp.gameApp.directive("allianceChangeLabel", [
    function () {
        var template = "<div class='alliance-change-label'  ng-click='replaceImage($event)'>" +
            "<i class='fa fa-plus-circle fa-3x'></i>" +
            "</div>";

        return {
            restrict: "E",
            template: template,
            replace: true,
            scope: {},
            controller: "allianceLabelDialogCtrl"
        };
    }
]);

Utils.CoreApp.gameApp.controller("allianceLabelDialogCtrl", ["$scope", "$rootScope", "$mdDialog", "mainGameHubService",
    function ($scope, $rootScope, $mdDialog, mainGameHubService) {
        $scope.customFullscreen = false;
        $scope.replaceImage = function ($event) {
            EM.Audio.GameSounds.dialogOpen.play();
            $mdDialog.show({
                parent: angular.element(document.body),
                _locals: {
                    _request: mainGameHubService.allianceInfoUpdateLabel,
                    _onError: function (errorAnswer) {
                        if (errorAnswer === ErrorMsg.UploadedImageNotSetInInstance) {
                            $mdDialog.cancel();
                        }
                        console.log("allianceLabelDialogCtrl._onError", errorAnswer);
                    }
                },
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                controller: "uploadImageCtrl",
                bindToController: true,
                templateUrl: "dialog-upload-user-image.tmpl",
                controllerAs: "uploadImageCtrl"
            })
            .then(function (ok) {
                EM.Audio.GameSounds.dialogClose.play();
                $rootScope.$broadcast("alliance:label-updated");

                }, function () {
                    EM.Audio.GameSounds.dialogClose.play();
                //close
            });
        };

    }
]);
Utils.CoreApp.gameApp.directive("controlPanel", ["hangarService", "paralaxButtonHelper", "controlPanelSwicherHelper",
    function (hangarService, paralaxButtonHelper, controlPanelSwicherHelper) { 
        function link($scope, element, attrs) {
 
            controlPanelSwicherHelper.setHangar();
            $scope.cpToggleBtn = paralaxButtonHelper.getToggle(function () {
                controlPanelSwicherHelper.updateState();
            });
            $scope.cpHangarEstateItems = hangarService.getHangarPanel();
            $scope.cpMapControlBtns = paralaxButtonHelper.getMapCtrlBtns();

        }

        return {
            restrict: "A",
            templateUrl:"control-panel.tmpl",
            replace: true,
            scope: true, 
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("buildProgress", [
    function () {
        function link($scope, element, attrs, ctrl) {
            var parentId = $scope.border.buildItemId;
            var parentElem = element.parents("#" + parentId);
            var parentScopeItem = parentElem.scope().item;
            $scope.ParentScope = parentScopeItem;
            $scope.timerData = parentScopeItem.Progress || {};  
            $scope.timerData.$isUnit = GameServices.buildService.isUnit(parentScopeItem.NativeName);
            $scope.Icon = parentScopeItem.ComplexButtonView.Collection[2].Data.Icon;  
        }

        return {
            restrict: "A",
            replace: true,                           
            scope: true,
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("planshetUnitItem", [function() {
    return { 
        scope: {
            item: "="
        },
        replace: true,
        restrict: "EA",
        templateUrl: "planshet-unit-item.tmpl",
        link: function ($scope, element, attrs, ctrl) {

        },
        controller: ["$scope", function ($scope) {
            $scope.dropElement = {};
            console.log("unit.controller", $scope);

 
            //dropElement
        }]
    } 
}]);
Utils.CoreApp.gameApp.directive("resourceItem", [
    function () {
 
        function link($scope, element, attrs, ctrl) {
            
        }
         
        return {
            restrict: "A",
            replace: true,
            scope: {
                resourceData:"="
            },
            link: link,
            templateUrl: "build-av-resource-item.tmpl"
        };
    }
]);
Utils.CoreApp.gameApp.directive("resourceTransferList", ["industrialComplexService",
    function (industrialComplexService) {
        function link($scope, element, attrs, ctrl) {
            industrialComplexService.registerStorageTransferListEvents($scope, element);

        }       
        return {
            restrict: "A",
            scope: true,
            link: link
        }; 
    }
]);
Utils.CoreApp.gameApp.directive("biuldSlider", [
    function () {
        function link($scope, element, attrs, ctrl) {
            var register = $scope.registerSlider();
            if (element.hasOwnProperty("slider")) {
                element.slider("destroy");
            }

            register(element, $scope);
        }

        return {
            restrict: "A",
            scope: {
                registerSlider: "&",
                sliderData: "="
            },
            link: link
        };
    }
]);
Utils.CoreApp.gameApp.directive("floatVote", [function () {
    return {
        restrict: "E",
        templateUrl: "float-vote.tmpl",
        replace: true,
        scope: {},
        controller: ["$scope", "$rootScope", "confederationService", "$element", "profileService", function ($scope, $rootScope, $cs, $element, profileService) {
            var $self = this;

            this.model = $cs.getElectionData();
            this.title = "Voting";

            $element.css(this.model.$params.position);


            //setInterval(function () {
            //    $self.params.voiceSendedInWeek = !$self.params.voiceSendedInWeek;
            //},10000);


            var delayAnimation = 400;
            var lockShowing = false;
            this.toggleShow = function () {
                if (lockShowing) return;
                lockShowing = true;
                $self.model.$params.show = !$self.model.$params.show;
                $cs.$saveToLsVoteParams($self.model.$params);
                setTimeout(function () {
                    lockShowing = false;
                }, delayAnimation);

            };

            function _createFakeCandidates() {
                $self.candidates = [{
                    UserName: "Arun",
                    UserId: 1000,
                    Voices: 123,
                    TotalVoices: 10000,
                    Id: 0
                }];
                for (var i = 0; i < 9; i++) {
                    $self.candidates.push({
                        UserName: "name " + i,
                        UserId: i,
                        Voices: i * 1000,
                        TotalVoices: 10000,
                        Id: 0
                    });
                }
            }
            //  _createFakeCandidates();
            this.getUserInfo = function (candidat) {
                if (candidat && candidat.UserId) {
                    profileService.setProfile(candidat.UserId);
                }

            };

            this.lockedAddVoice = false;

            this.addVoice = function ($event, candidat) {
                if ($self.lockedAddVoice) return;
                $self.lockedAddVoice = true;
                $cs.addVoiceToOfficer($event, candidat, $self.model.$params, function () {
                    $self.lockedAddVoice = false;
                }, function () {
                    $self.lockedAddVoice = false;
                }, $rootScope);

            };

            $element.draggable({
                containment: "#estateCanvas",
                scroll: false,
                cancel: "#float-vote-content",
                stop: function (event, $params) {
                    console.log("draggable.stop", {
                        event: event, $params: $params
                    });
                    $self.model.$params.position = $params.position;
                    $cs.$saveToLsVoteParams($self.model.$params);
                }
            });


            $scope.$on("election:finished", function () {
                $scope.$destroy();
                $element.remove();
                console.log("floatVote.election:finished");
            });

            $scope.$on("election:update-candidates", function ($event, data) {
                if (data.updateVotes) {
                    if (_.isEqual($self.model.Candidates, data.Candidates)) {
                        //todo  всегда одинаковые при регистрации - оповещении пользователя(проверенно)
                        //todo  всегда олинаковые при полном обновлении кандидатов пользователя(не проверенно)
                        console.log("isEqual.floatVote.election:update-candidates", {
                            $event: $event,
                            data: data,
                        });
                    }
                    else {
                        $self.model.Candidates = data.Candidates;
                    }

                }
                console.log("floatVote.election:update-candidates", {
                    $event: $event,
                    data: data,
                });
            });
            $scope.$on("election:cr-user-voice-added", function ($event, data) {
                if (_.isEqual(data.params, $self.model.$params)) {
                    console.log("isEqual.floatVote.election:election:cr-user-voice-added", {
                        $event: $event,
                        data: data,
                        $self: $self,
                    });
                }
                else {
                    $self.model.$params = data.params;

                }
                console.log("floatVote.election:election:voice-added", {
                    $event: $event,
                    data: data,
                });
            });



        }],
        controllerAs: "voteCtrl"
    }
}
]);
Utils.CoreApp.gameApp.directive("userElectionItem", [
    function () {
        return {
            restrict: "E",
            templateUrl: "confederation-user-election-item.tmpl",
            replace: true,
            scope: {
                user: "=",
                getUserInfo: "&",
                isRegistredPeriod: "=",
                canSendVoice: "=",
                sendVoice:"="

            },

        };
    }
]);
Utils.CoreApp.gameApp.directive("userRatingItem", [
    function () {
        return {
            restrict: "E",
            templateUrl: "confederation-user-rating-item.tmpl",
            replace: true,
            scope: {
                user: "=",
                getUserInfo: "&"

            },

        };
    }
]);
Utils.CoreApp.gameApp.directive("taskUnit", ["journalHelper",
    function (journalHelper) {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                unit: "="
            },
            templateUrl: "journal-task-unit.tmpl",
            link: function ($scope, element, attrs) {
                $scope.target = (attrs.target === "target");
                journalHelper.rgisterTaskUnit($scope, attrs.target);    

            }
        }
    }
]);

Utils.CoreApp.gameApp.directive("reportUnit", [
    function () {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                unit: "="
            },
            templateUrl: "journal-report-unit.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                var source = element.parent().parent().data("hangar");    
 
                if ($scope.unit.StartUnitCount === 0) {
                    $scope.unit.StartUnitCount = null;
                    $scope.unit.cssSepia = "grayScale";
                }
        

                if ($scope.unit.LostUnitCount === 0) {
                    $scope.unit.LostUnitCount = null;
                }
                if ($scope.unit.LostUnitCount !== null && $scope.unit.LostUnitCount >0) {
                    $scope.unit.LostUnitCount = -$scope.unit.LostUnitCount;
                }
                return;
                //else {
                //    $scope.unit.LostUnitCount = -$scope.unit.LostUnitCount;
                //}
            }
        }
    }
]);

Utils.CoreApp.gameApp.directive("reportInfo", ["journalService", "translateService",
    function (journalService, translateService) {  
        return {
            replace: true,
            restrict: "E",
            scope: {
                info: "=",
                infoButtons: "=?",
                commonTranslate:"=?"
            },
            templateUrl: "journal-report-info.tmpl",
            link: function ($scope, element, attrs, ctrl) {
                //console.log("reportInfo", $scope);
                var isReport = $scope.info.IsReport;
 
                if (isReport) {
                    $scope.infoButtons = journalService.getReportInfoButtons($scope.info);
                } else {
                    //console.log("IsReport", $scope.info);
                    $scope.infoButtons = journalService.getSpyInfoButtons($scope.info);
                }

                $scope.commonTranslate = translateService.getCommon();

            }
        }
    }
]);

Utils.CoreApp.gameApp.directive("leftNav", ["mainHelper",
    "paralaxButtonHelper",
    function (mainHelper,paralaxButtonHelper) {
        return {
            //replace: false,
            restrict: "A",
            //scope: true,
            link: function ($scope, element, attrs, ctrl) {
                $scope.leftNavButtons = paralaxButtonHelper.getLeftNavButtons();
            }
        }
    }
]);
Utils.CoreApp.gameApp.directive("mapControlNavigator", ["controlDiskHelper",
    function (controlDiskHelper) {
        return {
            templateUrl: "map-control-navigator.tmpl",
            restrict: "E",
            replace: true,
            scope: { controlDisk :"@"},
            link: function ($scope, element, attrs) {
                $scope.controlDisk = controlDiskHelper.createCdModel(element, $scope);
            }
        }
    }
]);
Utils.CoreApp.gameApp.directive("mapInfo", [
    function() {   
        function link($scope, element, attrs) {
            $scope.$on("mapinfo:planshet:update", function (event, args) {
                var pm = args.planshetEvent.targetScope.planshetModel.Bodys[$scope.$index].TemplateData;
                $scope.infoModel = pm;
//                console.log("planshet:update", {
//                    event: event, $scope: $scope,
//                    planshetEvent: args.planshetEvent
//                });
            });
        }
        return {
            restrict: "E",
            templateUrl: "map-info.tmpl",
            replace: true,
            link: link
        }
    }
]);
(function (app) {
    app.directive("channelItem", [
"$rootScope", "userChannelsService", function ($rootScope, $ucs) {
    function _updateBtnIds(channel, ctrl) {
        if (!channel._btnIds) ctrl.btnIds = $ucs.createBtnIds(channel);
        if (!ctrl.btnIds) {
            ctrl.btnIds = channel._btnIds;
        }

    }

    return {
        restrict: "E",
        templateUrl: "channel-item.tmpl",
        replace: true,
        scope: {
            channel: "="
        },
        controller: [
            "$scope", function ($scope) {
                var $self = this;
                _updateBtnIds($scope.channel, $self);
                $ucs.checkPrivateHead($scope.channel);
                var maxMessagesInChannel = $scope.channel.PerPage;
                this.scrollEventName = "channelItem:get-next-page:filtered-" + $scope.channel.ChannelId;



                var isInit = true;
                this.scrollDataInProgress = false;
                this.loadNextPage = function (e) {
                    if (this.scrollDataInProgress) return;
                    if (isInit) {
                        this.messages = _.take(_.orderBy(_.toArray($scope.channel.Messages), ["Id"], ["desc"]), maxMessagesInChannel);
                        var size = _.size($scope.channel.Messages);
                        if (size < maxMessagesInChannel) {
                            $scope.channel.$totalMessagesCount = size;
                        }
                        isInit = false;
                        return;
                    }
                    if ($scope.channel.$totalMessagesCount && this.messages.length === $scope.channel.$totalMessagesCount) return;

                    this.scrollDataInProgress = true;
                    var arr = _.orderBy(_.toArray($scope.channel.Messages), ["Id"], ["desc"]);
                    var startCount = this.messages.length;
                    if (!startCount) {
                        this.scrollDataInProgress = false;
                        return;
                    }
                    if (!arr[startCount]) {
                        //server request
                        //console.log("server request");
                        $ucs.getNextMessagesPage($scope.channel.ChannelId, $scope.channel.ChannelType, function (newMessages, updatedChannel) {
                            var newSize = _.size(newMessages);
                            if (newSize === 0) {
                                $scope.channel.$totalMessagesCount = _.size($scope.channel.Messages);
                            }
                            else {

                                var arrMessages = _.orderBy(_.toArray(newMessages), ["Id"], ["desc"]);
                                //console.log("$scope.getNextPage", {
                                //    newMessages: _.cloneDeep(newMessages),
                                //    updatedChannel: _.cloneDeep(updatedChannel),
                                //    "$scope.messages": _.cloneDeep($scope.messages),
                                //    arrMessages: _.cloneDeep(arrMessages)
                                //});


                                _.forEach(arrMessages, function (val, key) {
                                    $self.messages.push(val);
                                });
                                if (arrMessages.length < maxMessagesInChannel) {
                                    $scope.channel.$totalMessagesCount = _.size($scope.channel.Messages);
                                }

                            }
                            $self.scrollDataInProgress = false;


                        }, function () {
                            $self.scrollDataInProgress = false;
                        });

                        return;
                    }
                    else {
                        //update from local   
                        var end = startCount + maxMessagesInChannel - 1;
                        if (end > arr.length - 1) end = arr.length - 1;
                        for (var i = startCount; i <= end; i++) {
                            $self.messages.push(arr[i]);
                        }
                        $self.scrollDataInProgress = false;
                        return;
                    }


                };
                this.channelTypes = $ucs.ChannelTypes;
                $scope.$on("channelItem:add-message", function (e, data) {
                    if (e.defaultPrevented) return;
                    if (data.newChannel.ChannelId === $scope.channel.ChannelId) {
                        if (e.stopPropagation) e.stopPropagation();
                        else e.preventDefault();
                        _updateBtnIds($scope.channel, $self);
                        var newMessage = data.newMessageData;
                        $self.messages.unshift(newMessage);

                        //  $scope.$broadcast($scope.scrollEventName);
                        $scope.$broadcast("dropElementContainer:changeComplexHeight", {
                            dropItemSelectior: $self.btnIds.MessagesId
                        });

                    }
                });

                $scope.$on("channelItem:update-permition", function (e, data) {
                    if (e.defaultPrevented) return;
                    if (data.channel.ChannelId === $scope.channel.ChannelId) {
                        if (e.stopPropagation) e.stopPropagation();
                        else e.preventDefault();
                        $scope.$broadcast("dropElementContainer:changeComplexHeight", {
                            dropItemSelectior: $self.btnIds.MessagesId
                        });


                    }
                });

            }
        ],
        controllerAs: "channelCtrl"
    };
}
    ]);
    app.directive("channelControlMenu", [function () {
        return {
            restrict: "E",
            templateUrl: "channel-control-menu.tmpl",
            replace: true,
            scope: {
                channelControls: "="
            }
        };
    }
    ]);

    app.directive("channelMessageForm", [
        "userChannelsService", "allianceService", function ($ucs, $as) {
            return {
                restrict: "E",
                templateUrl: "channel-message-form.tmpl",
                replace: true,
                scope: {
                    btnSendMessage: "="
                },
                controller: ["$scope", function ($scope) {
                    var $self = this;
                    this.mesageModel = {
                        maxLength: $scope.btnSendMessage.Params.MessageMaxLength
                    };
                    this.mesageModel.text = "";

                    this._inProgress = false;
                    this.onChange = function (model) {
                        if (model.text && model.text.length > model.maxLength) model.text = model.text.substring(0, model.maxLength);

                    }
                    this.sendMessage = function (params, $element, $attrs, sourceScope, $event) {
                        if ($self._inProgress) return;
                        $self.mesageModel.text = $self.mesageModel.text.trim();
                        if ($self.mesageModel.text.length === 0) return;
                        params.text = $self.mesageModel.text;
                        params.onFinally = function () {
                            $self._inProgress = false;
                        };
                        params.onError = function (errorMessage) {
                            console.log("userChannelsService.errorMessage", {
                                errorMessage: errorMessage,
                                $event: $event
                            });
                        };
                        params.onSuccess = function () {
                            $self.mesageModel.text = "";
                        };
                        $ucs.sendMessage(params, $event);
                        return;
                    };

                    $scope.btnSendMessage.Method = this.sendMessage;

                }],
                controllerAs: "mFormCtrl"
            };
        }
    ]);

    app.directive("channelPrivateCreateForm", [
        "userChannelsService", function ($ucs) {
            return {
                restrict: "E",
                templateUrl: "channel-private-create-form.tmpl",
                replace: true,
                controller: ["$scope", function ($scope) {
                    $scope.buttons = $ucs.createPrivateChannelControls();
                }]
            };
        }
    ]);

    app.directive("channelMessageItem", ["$filter", "$q", function ($filter, $q) {
        return {
            restrict: "E",
            templateUrl: "channel-message-item.tmpl",
            replace: true,
            scope: {
                message: "="
            },
            controller: ["$scope", function ($scope) {
                var $self = this;
                //console.log("channelMessageItem.$scope", { $scope: $scope });
                if (!$scope.message.$dateCreate) {
                    var date = Utils.Time.GetUtcDateTimeFromSecondUtc($scope.message.DateCreate);
                    $scope.message.$dateCreate = $filter("date")(date, "dd.MM.yyyy HH:mm") + " (server time)";
                    //   console.log("channelMessageItem", { date: date, "$scope.message": $scope.message, $scope });
                }


                if ($scope.message.$isCurrentUser === undefined) {
                    var crUserId = GameServices.profileService.getCurrentUserId();
                    $scope.message.$isCurrentUser = crUserId === $scope.message.UserId;
                    $scope.message.$avatarCss = $scope.message.$isCurrentUser ? "message-avatar_left" : "message-avatar_right";
                }


                this.messageText = $scope.message.Message;
                this.setTranslate = function (translatedText) {
                    $self.messageText = translatedText;
                }

                this.setting = {
                    show: false,
                    btnCloseCss: "fa-times-circle-o",
                    btnOpenCss: "fa-bars",
                    toggle: function (show) {
                        this.show = !show;
                        this.btnCss = this.show ? this.btnCloseCss : this.btnOpenCss;
                        if (!this.show) {
                            $self.setTranslate($scope.message.Message);
                        }
                    },
                    btnCss: ""
                };
                this.setting.btnCss = this.setting.btnOpenCss;
                this.getUserInfo = function () {
                    GameServices.profileService.setProfile($scope.message.UserId);
                };


            }],
            controllerAs: "chmiCtrl"
        }
    }
    ]);

    app.directive("channelGroupSetting", ["userChannelsService", function ($ucs) {
        var $btnHelper = $ucs.$btnHelper;
        var lock = false;
        return {
            restrict: "E",
            replace: true,
            templateUrl: "channel-group-setting.tmpl",
            scope: {
                channel: "="
            },
            controller: ["$scope", "minLenghtConsts", function ($scope, $minLenght) {
                if ($ucs.$currentUserInfo.userId !== $scope.channel.CreatorId) {
                    $scope.$destroy();
                }
                var $self = this;
                var _scrollDataInProgress = false;
                var _scrollDataUpdateInProgress = false;
                var $sorrceUsers = _.orderBy(_.map($scope.channel.Users, function (o) {
                    return o;
                }), ["Name"], ["asc"]);
                this.users = [];
                var delaydActions = [];
                function _update() {
                    if (!_scrollDataInProgress) _scrollDataInProgress = true;
                    if (_scrollDataUpdateInProgress) return;
                    _scrollDataUpdateInProgress = true;
                    $sorrceUsers = _.orderBy(_.map($scope.channel.Users, function (o) {
                        return o;
                    }), ["Name"], ["asc"]);
                    $self.$max = $sorrceUsers.length;
                    $self.hasUsers = $sorrceUsers.length > 0;
                    var existCount = $self.users.length;
                    $self.users = _.take($sorrceUsers, existCount);
                    _scrollDataInProgress = false;
                    _scrollDataUpdateInProgress = false;
                    if (delaydActions.length) {
                        while (delaydActions.length) {
                            delaydActions.shift()();
                        }
                    }
                }

                this.Buttons = {
                    updatePassword: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "updatePassword", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.$mdDialog.show({
                            templateUrl: "dialog-channels-group-update-password.tmpl",
                            parent: angular.element(document.body),
                            targetEvent: $event,
                            clickOutsideToClose: false,
                            fullscreen: false,
                            _locals: {
                                channel: $scope.channel
                            },
                            bindToController: true,
                            controller: "dialogChannelsGroupUpdatePasswordCtrl",
                            controllerAs: "pCtrl"
                        }).then(function (ctrlScope) {
                            //confirm       
                            ctrlScope.$destroy();
                            _update();
                            lock = false;
                        }, function (ctrlScope) {
                            //cancel
                            ctrlScope.$destroy();
                            //console.log("updatePassword.cancel", {
                            //    $scope: $scope,
                            //    btnScope: btnScope
                            //});
                            lock = false;
                        });
                    }),
                    updateIcon: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "updateIcon", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.$mdDialog.show({
                            parent: angular.element(document.body),
                            _locals: {
                                _request: function (newBase64SourceImageModel) {
                                    return $ucs.$hub.userChannelsGroupUploadIcon(newBase64SourceImageModel, $scope.channel.ChannelId);
                                },
                                _onError: function (errorAnswer) {
                                    var msg = Errors.GetHubMessage(errorAnswer);
                                    if (msg === ErrorMsg.NotPermitted) {
                                        $ucs.$ucdH.openDialogNotPermitted($event).finally(function () {
                                            lock = false;
                                        });
                                    }
                                    else {
                                        lock = false;
                                        throw Errors.ClientNotEqualException({
                                            errorAnswer: errorAnswer,
                                            msg: msg
                                        });
                                    }


                                },
                                _imageSize: 90,
                                _cssDialogContainer: "delete_after_test_cssDialogContainer"
                            },
                            targetEvent: $event,
                            clickOutsideToClose: true,
                            fullscreen: false,
                            controller: "uploadImageCtrl",
                            bindToController: true,
                            templateUrl: "dialog-upload-user-image.tmpl",
                            controllerAs: "uploadImageCtrl"
                        })
                         .then(function (ok) {
                             //console.log("ok", { ok: ok });
                             //confirm
                             lock = false;

                         }, function () {
                             //cancel

                             lock = false;
                         });
                    }),

                    deleteChannel: $btnHelper.ButtonsView().ConstructorSizeBtn(3, true, "deleteChannel", function (params, $element, $attrs, btnScope, $event) {
                        if (lock) return;
                        lock = true;
                        $ucs.$ucdH.openDialogConfirmDeleteGroupChannel($event, $scope.channel.ChannelName)
                            .then(function () {
                                //confirm
                                $ucs.$deleteGroupChannelByOwner($scope.channel.ChannelId, $event, function () {
                                    lock = false;
                                });
                            }, function () {
                                //cancel          
                                lock = false;
                            });
                    })
                };



                this.hasUsers = $sorrceUsers.length > 0;
                this.$max = $sorrceUsers.length;
                var perPage = 3;




                this.css = {
                    read: "fa-eye",
                    notRead: "fa-eye-slash",
                    write: "fa-pencil-square-o",
                    password: "fa-key"
                };


                this.loadNextPage = function () {

                    if (_scrollDataInProgress) return;
                    if (_scrollDataUpdateInProgress) return;
                    if (!this.hasUsers || _scrollDataInProgress || this.users.length === this.$max) return;
                    _scrollDataInProgress = true;
                    var startIdx = this.users.length;
                    var endIdx = startIdx + perPage;
                    if (endIdx > $sorrceUsers.length - 1) endIdx = $sorrceUsers.length - 1;
                    for (var i = startIdx; i <= endIdx; i++) {
                        if (_scrollDataUpdateInProgress) return;
                        if ($sorrceUsers[i]) {
                            this.users.push($sorrceUsers[i]);
                        }
                    }
                    _scrollDataInProgress = false;

                    return;

                };




                $scope.$on("user-channels-group-:user-unsubscribe", function ($event, data) {
                    //todo  upadte users
                    if ($scope.channel.ChannelId === data.channel.ChannelId) {
                        var unsubscibedConUser = data.ChannelConnectionUserOut;
                        //console.log("channelGroupSetting.user-channels-group-:user-unsubscribe", {
                        //    $scope: $scope,
                        //    data: data,
                        //    unsubscibedConUser: unsubscibedConUser,
                        //});
                        _update();

                    }



                });
                $scope.$on("user-channels-group-:user-subscribe", function ($event, data) {
                    //todo  upadte users
                    // is not userId    is ChannelConnection.Id     
                    if ($scope.channel.ChannelId === data.channel.ChannelId) {
                        var subscibedConUserId = data.ChannelConnectionUserOutId;
                        var newUser = data.channel.Users[subscibedConUserId];
                        //console.log("channelGroupSetting.user-channels-group-:user-subscribe", {
                        //    $scope: $scope,
                        //    data: data,
                        //    newUser: newUser,
                        //});
                        _update();

                    }



                });



                //form region

                var updateInprogress = false;
                this.updateUser = function (user, $index, $event) {
                    if (updateInprogress) return;
                    if (_scrollDataUpdateInProgress) return;

                    function destroy(ctrlScope) {
                        ctrlScope.$destroy();
                        lock = false;
                    }


                    $ucs.$ucdH.$mdDialog.show({
                        templateUrl: "dialog-channels-group-update-user.tmpl",
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        clickOutsideToClose: false,
                        fullscreen: false,
                        _locals: {
                            $updateUser: user,
                            $onUserUpdated: function (updatedUser) {
                                function update() {
                                    if ($self.users[$index] && $self.users[$index].Id === updatedUser.Id) {
                                        $self.users[$index] = updatedUser;
                                    }
                                    else {
                                        var idx = _.findIndex($self.users, function (o) {
                                            return o.Id === updatedUser.Id;
                                        });
                                        if (_.isInteger(idx)) {
                                            $self.users[$index] = updatedUser;
                                        }
                                    }
                                }

                                if (_scrollDataUpdateInProgress) {
                                    delaydActions.push(update);
                                }
                                else {
                                    update();
                                }

                            },
                            $css: $self.css,
                            $channelAdminUserId: $scope.channel.CreatorConnection.UserId
                        },
                        bindToController: true,
                        controller: "dialogChannelsGroupUpdateUser",
                        controllerAs: "suCtrl"
                    }).then(destroy, destroy);

                };
            }],
            controllerAs: "settingCtrl"
        };
    }]);
})(Utils.CoreApp.gameApp);
Utils.CoreApp.gameApp.directive("planshet", [
    "planshetService", function (planshetService) {
        var planshetToggle = {
            cssActive: "",
            onclick: planshetService.toggle,
            opened: false
        };

        function link($scope, element, attrs, ctrl) {
            $scope.planshetToggle = planshetToggle;

            var pagination = {};
            pagination.hasPrev = planshetService.hasPrevPlanshetElem;
            pagination.hasNext = planshetService.hasNextPlanshetElem;

            pagination.OnPrev = function () {
                planshetService.updateByHistory(-1);

            }
            pagination.OnNext = function () {
                planshetService.updateByHistory(1);
            }
            $scope.pagination = pagination;
          //  console.log("planshet", $scope);
        }

        return {
            restrict: "E",
            templateUrl: "planshet.tmpl",
            replace:true,
            link: link
        }
    }
]);
Utils.CoreApp.gameApp.directive("planshetBodyTabs", ["tabService", function (tabService) {
        function link($scope, element, attrs, ctrl) {
            tabService.initializeTabs($scope.planshetModel);
        }   
        return {
            restrict: "E",
            templateUrl: "planshet-tabs.tmpl",
            replace: true,
            link: link
        }
    }
]);
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


Utils.CoreApp.gameApp.directive("profileChangeAvatar", [function () {
    var template = "<div class='profile-change-avatar'  ng-click='replaceImage($event)'>" +
                        "<i class='fa fa-plus-circle fa-3x'></i>" +
                   "</div>";

    return {
        restrict: "E",
        template: template,
        replace: true,
        scope: {},
        controller: "userAvatarDialogCtrl"
    };
}]).controller("userAvatarDialogCtrl", ["$scope", "$rootScope", "$mdDialog", "mainGameHubService", "profileService", "allianceService",
    function ($scope, $rootScope, $mdDialog, mainGameHubService, profileService, allianceService) {
   
        $scope.customFullscreen = false;
        $scope.replaceImage = function ($event) {
            EM.Audio.GameSounds.dialogOpen.play();
            var dialog = $mdDialog.show({
                parent: angular.element(document.body),
                _locals: {
                    _request: mainGameHubService.personalInfoUpdateAvatar,
                    _onError: function (errorAnswer) {
                        if (errorAnswer === ErrorMsg.UploadedImageNotSetInInstance) {
                            $mdDialog.cancel();
                        }
                    }
                },
                targetEvent: $event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                controller: "uploadImageCtrl",
                bindToController: true,
                templateUrl: "dialog-upload-user-image.tmpl",
                controllerAs: "uploadImageCtrl"
            });
            dialog.then(function (newAvatar) {
                EM.Audio.GameSounds.dialogClose.play();
                profileService.updateLocalUserAvatar(newAvatar);
                allianceService.onLocalUserUpdateAvatar(newAvatar);
                $rootScope.$broadcast("user:avatar-updated", { data: newAvatar });
                console.log("newAvatar", newAvatar);
                }, function () {
                EM.Audio.GameSounds.dialogClose.play();
                //close

            });
        };
    }]);
Utils.CoreApp.gameApp.directive("verifyTo", function () {
    return {
        require: "ngModel",
        scope: {
            verifyTo: "="
        },
        link: function ($scope, $element, $attr, $ngModel) { 
            $ngModel.$validators.verifyTo = function (modelValue, viewValue) {
                return modelValue === $scope.verifyTo;
            };

            $scope.$watch("verifyTo", function () {
                $ngModel.$validate();
            });
        }
    };
});                                             
//custom validation
//https://www.algotech.solutions/blog/javascript/how-to-create-custom-validator-directives-with-angularjs/ 
Utils.CoreApp.gameApp.directive("isAvailableNameHub", [
        "$q", "mainGameHubService", function ($q, $hub) {   

            return {
                restrict: "A",
                require: "ngModel",
                link: function ($scope, $element, $attr, $ngModel) {

                    if (!$attr.isAvailableNameHub || !($hub[$attr.isAvailableNameHub] instanceof Function)) {
                        throw new Error("$hub method not  exist");
                    }
                    var method = $hub[$attr.isAvailableNameHub];

                    $ngModel.$asyncValidators.isAvailableName = function (modelValue, viewValue) {
                        console.log("$ngModel.$asyncValidators.isAvailableName");
                        var deferred = $q.defer();
                        method(viewValue).then(function (isAvailable) {
                            if (isAvailable) {
                                if ($attr.onNameValidate) {
                                    var onNameValidate = Utils.StrToRef($attr.onNameValidate, $scope);
                                    if (onNameValidate instanceof Function) onNameValidate();
                                }
                                deferred.resolve();

                            }

                            else {
                                if ($attr.onNameInvalidate) {
                                    var onNameInvalidate = Utils.StrToRef($attr.onNameInvalidate, $scope);
                                    if (onNameInvalidate instanceof Function) onNameInvalidate();
                                }
                                deferred.reject();

                            }
                        }, function () {
                            deferred.reject();

                        });
                        return deferred.promise;
                    }
                }
            }
        }
]);

Utils.CoreApp.gameApp.directive("skagry", [function () {
    return {
        link: function(scope) {
           // console.log('skagry',{ scope: scope});
        },
        restrict: "A",
        templateUrl: "skagry.tmpl",
        replace: false
    }
}
]);
_test = {hover: function() { console.log('hover'); } };
Utils.CoreApp.gameApp.directive("userCounter", [function () {
    return {
        restrict: "A",
        templateUrl: "user-counter.tmpl",
        replace: true,
        scope: {},
        link: function ($scope, element, attrs, ctrl) {
            var counter = {
                count: 0,
                cssLoading: "",
                low: {
                    max: 1,
                    cssClass: ""
                },
                medium: {
                    max: 2,
                    cssClass: "medium"
                },
                hard: {
                    max: 99999,
                    cssClass: "hard"
                }
            };
            counter.cssLoading = counter.low.cssClass;

            function updateCss() {
                var val = counter.cssLoading;
                var count = counter.count;
                if (count < counter.low.max && val !== counter.low.cssClass) {
                    counter.cssLoading = counter.low.cssClass;
                }
                else if (count < counter.medium.max && val !== counter.medium.cssClass) {
                    counter.cssLoading = counter.medium.cssClass;
                }
                else if (val !== counter.hard.cssClass) {
                    counter.cssLoading = counter.hard.cssClass;
                }
            }
            //window._t = function (val) {
            //    $scope.$apply(function () {
            //        counter.count = val;
            //        updateCss();
            //    }); 
            //}
            $scope.counter = counter;
            $scope.$on("user:join-to-game", function (event, data) {
                $scope.$apply(function () {
                    counter.count = data.OnlineTotalCount;
                    updateCss();
                });
            });
            $scope.$on("user:left-game", function (event, disconnectedConnectionUser) {
                $scope.$apply(function () {
                    counter.count--;
                    updateCss();
                });


            });

        }

    }
}
]);
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