using Server.Core.СompexPrimitive;

namespace Server.Core.Map.Structure

{
    public class StarGeometry : PlanetoidGeometry
    {
        public Vector3 Coords { get; set; }

        public override string MapType()
        {
            return MapTypes.Star.ToString();
        }
    }
}