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