using Server.Core.Interfaces;
using Server.Core.Map;

namespace Server.Core.Images
{
    public interface ISpriteImages
    {
        SpriteImages UnitImages(string name);
        SpriteImages BuildImages(string name);
        SpriteImages TechImages(string name);
        SpriteImages AllianceTechImages(string name);
        SpriteImages MapControlIcons(string name);
        SpriteImages InterfaseBaseControlIcons(string name);
        SpriteImages GalaxyImages(int textureId);
        SpriteImages SectorImages(int textureId);
        SpriteImages StarImages(string subtypeName, int textureId);
        SpriteImages PlanetImages(string subtypeName, int textureId);
        SpriteImages MoonImages(int textureId);

        SpriteImages GetMeed(int meedId);
    }

    public class SpriteImages : UserImageModel, ISpriteImages, ICreateNew<SpriteImages>
    {
        private const string AtlasSelector = "sprite_atlas ";
        private const string MapPrefix = "map_";
        private const string SpritePrefix = "sprite_";
        private const string SpriteControlSelector = "sprite_control_icons ";

        private const string D = "unit ";
        private const string B = "build ";
        private const string T = "user-tech ";
        private const string At = "alliance-tech ";
        private const string Mo = "map-object ";
        private const string Iic = "interface-icon-control ";

        private const string ExtraSmallSize = "sx ";
        private const string SmallSize = "s ";
        public const string BigSmallSmallSize = "xs ";
        private const string MediumSize = "m ";
        private const string IconSize = "ms ";
        private const string DetailSize = "xl ";

        public string Medium { get; set; }



        public SpriteImages()
        {
        }

        private SpriteImages(SpriteImages sprite)
        {
 
            Medium = sprite.Medium;
            Icon = sprite.Icon;
            Detail = sprite.Detail;
            Source = sprite.Source;
        }


        public SpriteImages UnitImages(string name)
        {
            name = name.ToLower();
            Medium = AtlasSelector + MediumSize + D + name;
            Icon = AtlasSelector + IconSize + D + name;
            Detail = AtlasSelector + DetailSize + D + name;
            return new SpriteImages(this);
        }

        public SpriteImages BuildImages(string name)
        {
            name = name.ToLower();
            Medium = AtlasSelector + MediumSize + B + name;
            Icon = AtlasSelector + IconSize + B + name;
            Detail = AtlasSelector + DetailSize + B + name;
            return new SpriteImages(this);
        }

        public SpriteImages TechImages(string name)
        {
            name = name.ToLower();
            Medium = AtlasSelector + MediumSize + T + name;
            Icon = AtlasSelector + IconSize + T + name;
            Detail = AtlasSelector + DetailSize + T + name;
            return new SpriteImages(this);
        }

        public SpriteImages AllianceTechImages(string name)
        {
            name = name.ToLower();
            Medium = AtlasSelector + MediumSize + At + name;
            Icon = AtlasSelector + IconSize + At + name;
            Detail = AtlasSelector + DetailSize + At + name;
            return new SpriteImages(this);
        }


        public SpriteImages GalaxyImages(int textureId)
        {
            var baseName = MapTypes.Galaxy.ToString();
            return MapObjectImages(baseName, CreateMapName(baseName, textureId, baseName));
        }

        public SpriteImages SectorImages(int textureId)
        {
            var baseName = MapTypes.Sector.ToString();
            return MapObjectImages(baseName, CreateMapName(baseName, textureId, baseName));
        }

        public SpriteImages StarImages(string subtypeName, int textureId)
        {
            var baseName = MapTypes.Star.ToString();
            return MapObjectImages(baseName, CreateMapName(baseName, textureId, baseName + "_" + subtypeName));
        }

        public SpriteImages PlanetImages(string subtypeName, int textureId)
        {
            var baseName = MapTypes.Planet + "_" + subtypeName;
            return MapObjectImages(baseName, CreateMapName("", textureId, baseName));
        }

        public SpriteImages MoonImages(int textureId)
        {
            var baseName = PlanetoidSubTypes.Moon.ToString();
            return MapObjectImages(baseName, CreateMapName(baseName, textureId, baseName));
        }

        public SpriteImages GetMeed(int meedId)
        {
            var gName = "meed";
            var baseName = " " + gName + " ";
            var name = gName + "_" + meedId;
            var meedSprite = "sprite_meed ";
            Medium = meedSprite + MediumSize + baseName + name;
            Icon = meedSprite + IconSize + baseName + name;
            Detail = meedSprite + DetailSize + baseName + name;
            return new SpriteImages(this);
        }


        public SpriteImages MapControlIcons(string name)
        {
            name = name.ToLower();
            Medium = SpriteControlSelector + MediumSize + Mo + name;

            Icon = SpriteControlSelector + IconSize + Mo + name;
            Detail = SpriteControlSelector + DetailSize + Mo + name;
            return new SpriteImages(this);
        }



        public SpriteImages InterfaseBaseControlIcons(string name)
        {
            name = name.ToLower();
            Medium = SpriteControlSelector + IconSize + Iic + name;
            Icon = SpriteControlSelector + SmallSize + Iic + name;
            Detail = SpriteControlSelector + DetailSize + Iic + name;
            return new SpriteImages(this);
        }


        private SpriteImages MapObjectImages(string baseName, string name)
        {
            name = name.ToLower();
            var sprite = SpritePrefix + MapPrefix + baseName.ToLower() + " ";
            Medium = sprite + MediumSize + name;
            Icon = sprite + SmallSize + name;
            Detail = sprite + DetailSize + name;
            return new SpriteImages(this);
        }

        private static string CreateMapName(string baseName, int textureId, string subName)
        {
            baseName += " texture_" + textureId + " " + subName + " ";
            return baseName;
        }

        public SpriteImages CreateNew(SpriteImages other)
        {
        return new SpriteImages(other);
        }

        public SpriteImages CreateNewFromThis()
        {
            return new SpriteImages(this);
        }

 
    }
}