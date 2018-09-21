using System.Collections.Generic;
using System.Collections.ObjectModel;
using Server.Modules.Localize.Game.Alliance;
namespace Server.Modules.Localize
{
    public class TranslateCollections
    {
        public IReadOnlyDictionary<string, string> AllianceTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            {"alliance", Resource.Alliance},
            {"dominantAlliance", Resource.DominantAlliance},
            {"controlledPlanet", Resource.ControlledPlanet},
            {"edit", Game.Common.Resource.Edit},
            {"leader", Resource.Leader},
            {"leaveAlliance", Resource.LeaveAlliance},
            {"losses", Resource.Losses},
            {"manageAlliance", Resource.ManageAlliance},
            {"myAlliance", Resource.MyAlliance},
            {"population", Resource.Population},
            {"pvpPoint", Resource.PvpPoint},
            {"serch", Resource.Serch},
            {"wins", Resource.Wins},
            {"tax", Resource.Tax},
            {"name", Game.Common.Resource.Name}
        });
 

        public IReadOnlyDictionary<string, string> MapTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            {"bookmarks", Game.Map.Resource.Bookmarks},
            {"galaxy", Game.Map.Resource.Galaxy},
            {"galaxyInfo", Game.Map.Resource.GalaxyInfo},
            {"lastActivity", Game.Map.Resource.LastActivity},
            {"moon", Game.Map.Resource.Moon},
            {"moons", Game.Map.Resource.Moons},
            {"owner", Game.Map.Resource.Owner},
            {"planet", Game.Map.Resource.Planet},
            {"planetInfo", Game.Map.Resource.PlanetInfo},
            {"planets", Game.Map.Resource.Planets},
            {"sector", Game.Map.Resource.Sector},
            {"sectorInfo", Game.Map.Resource.SectorInfo},
            {"sectors", Game.Map.Resource.Sectors},
            {"star", Game.Map.Resource.Star},
            {"starInfo", Game.Map.Resource.StarInfo},
            {"subType", Game.Map.Resource.SubType},
            {"system", Game.Map.Resource.System},
            {"systems", Game.Map.Resource.Systems},
            {"toGalaxy", Game.Map.Resource.ToGalaxy},
            {"toMother", Game.Map.Resource.ToMother},
            {"toPlanetoid", Game.Map.Resource.ToPlanetoid},
            {"toSector", Game.Map.Resource.ToSector},
            {"toUserPlanet", Game.Map.Resource.ToUserPlanet},
            {"type", Game.Common.Resource.Type},
            {"universeMap", Game.Map.Resource.UniverseMap}
        });
 

        public IReadOnlyDictionary<string, string> ConfederationTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            {"confederation", Game.Confederation.Resource.Confederation},
            {"officers", Game.Confederation.Resource.Officers},
            {"rating", Game.Confederation.Resource.Rating},
            {"voting", Game.Confederation.Resource.Voting},
            {"election", Game.Confederation.Resource.Election}
        });

        public IReadOnlyDictionary<string, string> JournalTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            {"attack", Game.Journal.Resource.Attack},
            {"delete", Game.Common.Resource.Delete},
            {"journal", Game.Journal.Resource.Journal},
            {"jump", Game.Journal.Resource.Jump},
            {"loadAll", Game.Journal.Resource.LoadAll},
            {"lose", Game.Journal.Resource.Lose},
            {"newAtack", Game.Journal.Resource.NewAttack},
            {"newTransfer", Game.Journal.Resource.NewTransfer},
            {"report", Game.Journal.Resource.Report},
            {"reset", Game.Journal.Resource.Reset},
            {"returnFleet", Game.Journal.Resource.ReturnFleet},
            {"spy", Game.Journal.Resource.Spy},
            {"task", Game.Journal.Resource.Task},
            {"win", Game.Journal.Resource.Win}
        });

        public IReadOnlyDictionary<string, string> CommonTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            //from unit
            {"iridium", Game.Units.Resource.Iridium},
            {"darkMatter", Game.Units.Resource.DarkMatter},
            {"enegry", Game.Units.Resource.Enegry},
            {"cc", Game.Units.Resource.Cc},
            {"timeProduction", Game.Units.Resource.TimeProduction},

            //from alliance
            {"losses", Resource.Losses},
            {"wins", Resource.Wins},

            //from common
            {"cancel", Game.Common.Resource.Cancel},
            {"delete", Game.Common.Resource.Delete},
            {"edit", Game.Common.Resource.Edit},
            {"name", Game.Common.Resource.Name},
            {"send", Game.Common.Resource.Send},
            {"submit", Game.Common.Resource.Submit},
            {"topPosition", Game.Common.Resource.TopPosition},
            {"type", Game.Common.Resource.Type},
            {"serch", Game.Common.Resource.Serch},
            {"level", Game.Common.Resource.Level}
        });

        public IReadOnlyDictionary<string, string> UnitTranslates => new ReadOnlyDictionary<string, string>(new Dictionary<string, string>
        {
            {"attackName", Game.Units.Resource.AttackName},
            {"battleCruiserDescription", Game.Units.Resource.BattleCruiserDescription},
            {"battleCruiserName", Game.Units.Resource.BattleCruiserName},
            {"battleShipDescription", Game.Units.Resource.BattleShipDescription},
            {"battleShipName", Game.Units.Resource.BattleShipName},
            {"cc", Game.Units.Resource.Cc},
            {"commandCenter", Game.Units.Resource.CommandCenter},
            {"currentValue", Game.Units.Resource.CurrentValue},
            {"darkMatter", Game.Units.Resource.DarkMatter},
            {"drednoutDescription", Game.Units.Resource.DrednoutDescription},
            {"drednoutName", Game.Units.Resource.DrednoutName},
            {"droneDescription", Game.Units.Resource.DroneDescription},
            {"droneName", Game.Units.Resource.DroneName},
            {"enegry", Game.Units.Resource.Enegry},
            {"energyConverter", Game.Units.Resource.EnergyConverter},
            {"energyConverterDescripton", Game.Units.Resource.EnergyConverterDescripton},
            {"exchangeCourse", Game.Units.Resource.ExchangeCourse},
            {"extractionModule", Game.Units.Resource.ExtractionModule},
            {"extractionModuleDescription", Game.Units.Resource.ExtractionModuleDescription},
            {"frigateDescription", Game.Units.Resource.FrigateDescription},
            {"frigateName", Game.Units.Resource.FrigateName},
            {"hangarToggle", Game.Units.Resource.HangarToggle},
            {"hpName", Game.Units.Resource.HpName},
            {"industrialComplex", Game.Units.Resource.IndustrialComplex},
            {"iridium", Game.Units.Resource.Iridium},
            {"maxStorableDarkMatter", Game.Units.Resource.MaxStorableDarkMatter},
            {"maxStorableEnegy", Game.Units.Resource.MaxStorableEnegy},
            {"maxStorableIridium", Game.Units.Resource.MaxStorableIridium},
            {"motherEnergyConverter", Game.Units.Resource.MotherEnergyConverter},
            {"motherEnergyConverterDescription", Game.Units.Resource.MotherEnergyConverterDescription},
            {"motherExtractionModule", Game.Units.Resource.MotherExtractionModule},
            {"motherExtractionModuleDescription", Game.Units.Resource.MotherExtractionModuleDescription},
            {"motherIndustrialComplex", Game.Units.Resource.MotherIndustrialComplex},
            {"motherSpaceShipyard", Game.Units.Resource.MotherSpaceShipyard},
            {"motherSpaceShipyardDescription", Game.Units.Resource.MotherSpaceShipyardDescription},
            {"motherStorage", Game.Units.Resource.MotherStorage},
            {"motherStorageDescription", Game.Units.Resource.MotherStorageDescription},
            {"nextValue", Game.Units.Resource.NextValue},
            {"productionPower", Game.Units.Resource.ProductionPower},
            {"selectTarget", Game.Units.Resource.SelectTarget},
            {"sendAll", Game.Units.Resource.SendAll},
            {"spaceShipyard", Game.Units.Resource.SpaceShipyard},
            {"spaceShipyardDescription", Game.Units.Resource.SpaceShipyardDescription},
            {"storage", Game.Units.Resource.Storage},
            {"storageDescription", Game.Units.Resource.StorageDescription},
            {"submit", Game.Common.Resource.Submit},
            {"timeProduction", Game.Units.Resource.TimeProduction},
            {"transferLosses", Game.Units.Resource.TransferLosses},
            {"turel", Game.Units.Resource.Turel},
            {"turelDescription", Game.Units.Resource.TurelDescription}
        });
    }

    // ReSharper disable InconsistentNaming
    public enum GameTranslateType : byte
    {
        alliance = 1,
        mapInfo = 2,
        confederation = 3,
        journal = 5,
        common = 6,
        unit = 7,
    }

    public enum SiteTranslateType : byte
    {
        community = 1,
        home = 2,
        store = 3,
    }
 
}