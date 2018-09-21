Utils.CoreApp.gameApp.controller("bookmarkCtrl", ["$scope", "bookmarkService",
    function ($scope, bookmarkService) {
        this.planetItems = bookmarkService.getPlanetItems;
        this.systemItems = bookmarkService.getSystemItems;
        this.sectorItems = bookmarkService.getSectorItems;

    }
]);