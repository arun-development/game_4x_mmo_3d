using Server.DataLayer;

namespace Server.Core.Map.Structure
{
    public class PlanetDetail: IUniqueIdElement
    {
        public int Id { get; set; }
        public byte MoonCount;
    }
}