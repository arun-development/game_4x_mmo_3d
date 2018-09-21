(function (module) {
    "use strict";
    module.config(["$mdThemingProvider", function ($mdThemingProvider) {
        //отключает генерацию стилей
        //$mdThemingProvider.generateThemesOnDemand(true);

        //указывает что тема является темой по умолчанию и искать плеты в ней
        var t = $mdThemingProvider.theme('default');
        // создает темную тему  для основных ээллементов например для беграунда большого поля
        t.dark();
        // цвет вспомогательных элелментов  хедеров кнопок
        t.primaryPalette('blue-grey');
        // пока понял что влияет на check поля
        //t.accentPalette('green');
        t.accentPalette('blue-grey');
    }]);


})(Utils.CoreApp.adminApp = angular.module("adminApp", [
    "ngMaterial",
    "svgAssetsCache",
    "ngSanitize",
    "ngMessages",
    "angularAppCommon",
    "lfNgMdFileInput"
]));