namespace Server.Core.Map.Structure
{
    public class MoonGeometry : Satelit
    {
        public override string MapType()
        {
            return PlanetoidSubTypes.Moon.ToString();
        }
    }
}