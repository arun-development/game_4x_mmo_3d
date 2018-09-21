namespace Server.Core.Infrastructure.ComplexButton
{
    public class AllianceSerchCentrDataView
    {
        public AllianceSerchCentrDataView(string name, int pvpPoint = 0, int pilots = 1, int controlledPlanet = 0)
        {
            Name = name;
            PvpPoint = pvpPoint;
            Pilots = pilots;
            ControlledPlanet = controlledPlanet;
        }

        public string Name { get; set; }
        public int PvpPoint { get; set; }

        public int Pilots { get; set; }
        public int ControlledPlanet { get; set; }
    }
}