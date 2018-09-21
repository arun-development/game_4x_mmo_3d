using Server.Core.Interfaces;
using Server.Core.Map;
using Server.DataLayer;
using Server.Modules.Localize;

namespace Server.Infrastructure
{

    public class AdminSpaceModel:IUniqueIdElement, INativeName, ITranslateL10NProperty
    {
        public int Id { get; set; }

        public string NativeName { get; set; }

        public L10N Translate { get; set; }
        public MapTypes MapType { get; set; }
        public string MapTypeName => MapType.ToString();
        public byte MapTypeId => (byte) MapType;

        public AdminSpaceModel()
        {
        }

        public AdminSpaceModel(GGalaxyDataModel galaxy, MapTypes mapType)
        {
            Id = galaxy.Id;
            NativeName = galaxy.NativeName;
            Translate = galaxy.Translate;
            MapType = mapType;
        }

        public AdminSpaceModel(GSectorsDataModel sector, MapTypes mapType)
        {
            Id = sector.Id;
            NativeName = sector.NativeName;
            Translate = sector.Translate;
            MapType = mapType;
        }

        public AdminSpaceModel(GDetailSystemDataModel star, MapTypes mapType)
        {
            Id = star.Id;
            NativeName = star.Name;
            Translate = star.Description;
            MapType = mapType;
        }
 
        public AdminSpaceModel(GDetailPlanetDataModel planet, MapTypes mapType)
        {
            Id = planet.Id;
            NativeName = planet.Name;
            Translate = planet.Description;
            MapType = mapType;
        }

        public AdminSpaceModel(GDetailMoonDataModel moon, MapTypes mapType)
        {
            Id = moon.Id;
            NativeName = moon.Name;
            Translate = moon.Description;
            MapType = mapType;
        }

    }

 
}