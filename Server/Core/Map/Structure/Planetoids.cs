using System.Collections.Generic;

namespace Server.Core.Map.Structure
{
    public class Planetoids
    {
        public const string ViewKey = "SystemGeometry";
        public Planetoids()
        {
            Stars = new Dictionary<int, StarGeometry>();
            Planets = new Dictionary<int, PlanetGeometry>();
            Moons = new Dictionary<int, MoonGeometry>();
        }

        public Dictionary<int, StarGeometry> Stars;
        public Dictionary<int, PlanetGeometry> Planets;
        public Dictionary<int, MoonGeometry> Moons;
    }
}