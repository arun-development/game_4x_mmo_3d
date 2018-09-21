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