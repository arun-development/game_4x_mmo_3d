EM.MapBuilder = {};
//base 
(function (MapBuilder) {

    function IMapBuilder(subscriberName) {
        this.SubscribeName = subscriberName;
        this.Observer = Utils.PatternFactory.Observer(subscriberName);
        this.Build = null;
        this.Update = null;
    }  

    MapBuilder._createMapBuildItem = function (subscriberName) {
        return new IMapBuilder(subscriberName);
    };
})(EM.MapBuilder);
//Sectors 
(function (MapBuilder) {
    var sectors = MapBuilder._createMapBuildItem("MapBuilder.Sectors");
    sectors.Build = function (initData) {
      // console.log("sectors.Build", { initData: initData });
        EM.MapData.GetSectors.Observer.Subscribe(MapBuilder.Sectors);
        if (initData != null) EM.MapData.GetSectors.InitSectorData(initData);
        else EM.MapData.GetSectors.GetData();

    };
    sectors.Update = function (subscriberName) {
     //   console.log("sectors.Update", subscriberName);
        //console.log("sectors.Update");
        if (EM.MapData.GetSectors.SubscribeName === subscriberName) {
            EM.MapData.GetSectors.Observer.Unsubscribe(MapBuilder.Sectors);
            EM.MapGeometry.Galaxies.Generate();
            MapBuilder.Sectors.Observer.NotifyAll();
         //    console.log("sectors.NotifyAll");
        }
    };
    MapBuilder.Sectors = sectors;
})(EM.MapBuilder);

// Systems 
(function (MapBuilder) {
    var systems = MapBuilder._createMapBuildItem("MapBuilder.Systems");  
    var _buildInProgress = false;
    var _onlyVisible = false;

    systems.Build = function () {
        //console.log("MapBuilder.Systems.Build");
        if (_buildInProgress) return;
        _buildInProgress = true;
        if (EM.MapGeometry.Systems.NeedNewSystems()) {
            EM.MapGeometry.Systems.Destroy();
            _onlyVisible = false;
        }
        else {
            EM.MapGeometry.Systems.SetVisible(false);
            _onlyVisible = true;
        };

        EM.MapData.GetSystems.Observer.Subscribe(systems);
        EM.MapData.GetSystems.GetData(EM.SpaceState.CurrentActiveSector);
 
    };
    systems.Update = function (subscriberName) {  
        if (EM.MapData.GetSystems.SubscribeName === subscriberName) {
            EM.MapData.GetSystems.Observer.Unsubscribe(systems);    
            function onGenerate(advancedAction) {
                if (advancedAction instanceof Function) {
                    advancedAction();
                }
                systems.Observer.NotifyAll();
                _buildInProgress = false;
            }
            if (_onlyVisible) {
                _onlyVisible = false;
                onGenerate(function () {
                    EM.MapGeometry.Systems.SetVisible(true);
                });
                return;
            } else EM.MapGeometry.Systems.Generate(onGenerate);
        };

 
    };
    MapBuilder.Systems = systems;
})(EM.MapBuilder);
 
// System
(function (MapBuilder) {
    var system = MapBuilder._createMapBuildItem("MapBuilder.System");
    system.Callback = null;
    system.Build = function (initSystemGeometryData) {
    //    console.log("System.Build");
        var systemId = 0;
        if (initSystemGeometryData != null) systemId = EM.MapData.GetSectors.InitSectorData(initSystemGeometryData);
        else systemId = EM.MapGeometry.GetSystemIdFromAny(EM.SpaceState.CurrentActiveSystem);
        // console.log("system.Build", SpaceState.CurrentActiveSystem); 
        if (systemId === 0) {
            console.log("Error system is incorrect");
            return;
        }
        EM.MapData.GetSystem.Observer.Subscribe(system);
        EM.MapData.GetSystem.GetData(systemId);

    };
    system.Update = function (subscriberName) {
        if (EM.MapData.GetSystem.SubscribeName === subscriberName) {
         //   console.log(" system.Update");
            EM.MapData.GetSystem.Observer.Unsubscribe(system);
            EM.MapGeometry.System.Generate();
            if (null !== system.Callback) {
                system.Callback();
                system.Callback = null;
            }
        }

    };
    MapBuilder.System = system;
})(EM.MapBuilder);
