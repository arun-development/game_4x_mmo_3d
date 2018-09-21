using Server.Core.СompexPrimitive;
using Server.Modules.Localize;

namespace Server.Core.Map.Structure
{
    public class Sector : MapItemGeometry
    {

        public string TranslateName;
        public L10N Translate;
        public Vector3 Position;

        public override string MapType()
        {
            return MapTypes.Sector.ToString();
        }
    }
}