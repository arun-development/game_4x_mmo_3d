namespace Server.Core.Map.Structure
{
    public class SystemGeometry : Planetoids
    {

        public SystemGeometry AddStar(StarGeometry star)
        {
            Stars.Add(star.Id, star);
            return this;
        }

        public SystemGeometry AddPlanet(PlanetGeometry planet)
        {
            Planets.Add(planet.Id, planet);
            return this;
        }

        public SystemGeometry AddMoon(MoonGeometry moon)
        {
            Moons.Add(moon.Id, moon);
            return this;
        }
    }
}