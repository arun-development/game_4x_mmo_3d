using Server.Core.СompexPrimitive;

namespace Server.Core.Map.Structure
{
    public class SystemsView : MapItemGeometry
    {
        public Vector3 Coords;

        public override string MapType()
        {
            return MapTypes.Star.ToString();
        }
    }
}