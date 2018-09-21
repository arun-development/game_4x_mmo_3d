using Server.DataLayer;

namespace Server.Utils.Map.Texture
{
    public class TextureItemOut : IUniqueIdElement
    {
        public int GameTypeId;
        public string TextureTypeName;
        public int TextureTypeId;
        public string FileName;
        public string BaseName;
        public string LocalUrl;
        public string CdnUrl;
        public int Id { get; set; }
    }
}