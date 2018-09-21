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