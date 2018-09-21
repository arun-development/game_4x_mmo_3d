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