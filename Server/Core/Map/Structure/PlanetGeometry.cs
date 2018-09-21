namespace Server.Core.Map.Structure
{
    public class PlanetGeometry : Satelit
    {
        public virtual int? Rings { get; set; }
        public virtual bool Atmosphere { get; set; }
        public virtual byte SystemPosition { get; set; }

        public override string MapType()
        {
            return MapTypes.Planet.ToString();
        }
    }
}