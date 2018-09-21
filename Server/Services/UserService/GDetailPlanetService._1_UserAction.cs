using Server.Core.СompexPrimitive;
using Server.DataLayer;

namespace Server.Services.UserService
{
    public partial class GDetailPlanetService
    {
        public GDetailPlanetDataModel ResetProgress(ref GDetailPlanetDataModel planet)
        {
            var storage = planet.BuildStorage;
            var buildEnergyConverter = planet.BuildEnergyConverter;
            var buildExtractionModule = planet.BuildExtractionModule;
            var buildSpaceShipyard = planet.BuildSpaceShipyard;
            var turels = planet.Turels;
            turels.Level = 0;

            ItemProgress.ResetProgress(ref storage);
            ItemProgress.ResetProgress(ref buildEnergyConverter);
            ItemProgress.ResetProgress(ref buildEnergyConverter);
            ItemProgress.ResetProgress(ref buildExtractionModule);
            ItemProgress.ResetProgress(ref buildSpaceShipyard);
            ItemProgress.ResetProgress(ref turels);

            planet.BuildStorage = storage;
            planet.BuildEnergyConverter = buildEnergyConverter;
            planet.BuildExtractionModule = buildExtractionModule;
            planet.BuildSpaceShipyard = buildSpaceShipyard;
            planet.Turels = turels;
            return planet;
        }
    }
}