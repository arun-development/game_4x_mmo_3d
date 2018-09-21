using Server.Core.СompexPrimitive;

namespace Server.Core.Map.Structure
{
    public abstract class Satelit : PlanetoidGeometry
    {
        public int SystemId { get; set; }

        /// <summary>
        ///     -1 < AxisAngle < 1
        /// </summary>
        public virtual Vector3 AxisAngle { get; set; }


        public virtual Vector3 OrbitAngle { get; set; }

        public virtual double Orbit { get; set; }
        public virtual byte OrbitPosition { get; set; }
        public virtual Color3 Color { get; set; }
    }
}