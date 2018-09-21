using System.Collections.Generic;

namespace Server.Core.Map.Structure
{
    public abstract class PlanetoidGeometry : MapItemGeometry
    {
        public virtual double Radius { get; set; }

        public virtual int Parent { get; set; }

        public IList<PlanetoidGeometry> Children { get; set; }
    }
}