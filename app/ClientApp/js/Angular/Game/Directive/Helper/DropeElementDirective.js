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

